import { ConfigService } from '@nestjs/config';
import { AuthService, JWTClaims, SaveAuthUserProps } from './auth.service';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { EnvironmentConfig } from '../config/environment.config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

// TODO: 토큰 블랙리스트를 Redis에 저장하는 로직 추가
@Injectable()
export class RedisAuthService
  implements AuthService, OnModuleInit, OnModuleDestroy
{
  private readonly redisClient: Redis;
  private redisConfig: EnvironmentConfig['redis'];
  private jwtConfig: EnvironmentConfig['jwt'];

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    const redisConfigOrUndefined =
      this.configService.get<EnvironmentConfig['redis']>('redis');
    const jwtConfigOrUndefined =
      this.configService.get<EnvironmentConfig['jwt']>('jwt');

    if (!redisConfigOrUndefined) {
      throw new Error('Redis 설정이 누락되었습니다.');
    }

    if (!jwtConfigOrUndefined) {
      throw new Error('JWT 설정이 누락되었습니다.');
    }

    this.redisConfig = redisConfigOrUndefined;
    this.jwtConfig = jwtConfigOrUndefined;

    this.redisClient = new Redis({
      host: this.redisConfig.host,
      port: this.redisConfig.port,
      retryStrategy: (times) => {
        return times > 3 ? null : 1000;
      },
    });
  }

  onModuleInit() {
    this.redisClient.on('error', (err) => {
      console.error('Redis 연결 오류:', err);
    });
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }

  signJWT(userInfo: { userId: string }): string {
    return this.jwtService.sign(userInfo);
  }

  createRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  async saveAuthenticatedUser(props: SaveAuthUserProps): Promise<void> {
    const expirySeconds = this.parseTimeToSeconds(
      this.jwtConfig.refreshTokenExpiresIn,
    );

    const tokenKey = `refresh-${props.refreshToken}.${props.username}`;
    // 트랜잭션으로 여러 명령 실행
    const multi = this.redisClient.multi();
    // 토큰 값 저장
    multi.setex(tokenKey, expirySeconds, props.accessToken);
    // 사용자별 토큰 키 추적을 위한 세트에 추가
    multi.sadd(`user-tokens:${props.username}`, tokenKey);
    // 세트에도 만료 시간 설정
    multi.expire(`user-tokens:${props.username}`, expirySeconds);

    await multi.exec();
  }

  decodeJWT(token: string): Promise<JWTClaims | undefined> {
    return this.jwtService.verifyAsync<JWTClaims>(token);
  }

  async getTokens(username: string): Promise<string[]> {
    try {
      // 1. Set에서 사용자의 모든 토큰 키 조회
      const tokenKeys = await this.redisClient.smembers(
        `user-tokens:${username}`,
      );

      if (!tokenKeys || tokenKeys.length === 0) {
        return [];
      }

      // 2. 모든 토큰 키의 값을 한 번에 조회 (mget 사용)
      const accessTokens = await this.redisClient.mget(...tokenKeys);

      // 3. null이나 undefined가 아닌 값만 필터링하여 반환
      return accessTokens.filter(
        (token): token is string => token !== null && token !== undefined,
      );
    } catch (error) {
      console.error('토큰 조회 오류:', error);
      return [];
    }
  }

  private parseTimeToSeconds = (timeString: string): number => {
    const unit = timeString.slice(-1);
    const value = parseInt(timeString.slice(0, -1));

    if (isNaN(value)) {
      throw new Error(`Invalid time format: ${timeString}`);
    }

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      case 'w':
        return value * 7 * 24 * 60 * 60;
      case 'M':
        return value * 30 * 24 * 60 * 60; // 근사값으로 30일
      case 'y':
        return value * 365 * 24 * 60 * 60; // 근사값으로 365일
      default:
        // 단위가 없으면 숫자 자체를 초로 간주
        if (/^\d+$/.test(timeString)) {
          return parseInt(timeString);
        }
        throw new Error(`Unknown time unit: ${unit}`);
    }
  };
}
