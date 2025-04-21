export interface SaveAuthUserProps {
  username: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserInfo {
  userId: string;
}

export interface JWTClaims {
  userId: string;
}

export abstract class AuthService {
  abstract signJWT(userInfo: UserInfo): string;
  abstract createRefreshToken(): string;
  abstract saveAuthenticatedUser(props: SaveAuthUserProps): Promise<void>;
  abstract decodeJWT(token: string): Promise<JWTClaims | undefined>;
  abstract getTokens(username: string): Promise<string[]>;
}
