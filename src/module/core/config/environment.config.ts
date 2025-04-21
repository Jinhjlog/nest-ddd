export type EnvironmentConfig = {
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    accessTokenExpiresIn: string;
    refreshTokenExpiresIn: string;
  };
  redis: {
    host: string;
    port: number;
  };
};

function validateEnvVariables(config: EnvironmentConfig) {
  const missingVariables: string[] = [];

  if (!config.database.url) missingVariables.push('DATABASE_URL');
  if (!config.jwt.secret) missingVariables.push('JWT_SECRET');
  if (!config.redis.host) missingVariables.push('REDIS_HOST');
  if (!config.redis.port) missingVariables.push('REDIS_PORT');

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing environment variables: ${missingVariables.join(', ')}`,
    );
  }
}

const getEnvVariable = (name: string, env: string): string => {
  return process.env[`${env.toUpperCase()}_${name}`] || process.env[name] || '';
};

export default (): EnvironmentConfig => {
  const env = process.env.NODE_ENV || 'development';

  const config: EnvironmentConfig = {
    database: {
      url: getEnvVariable('DATABASE_URL', env),
    },
    jwt: {
      secret: getEnvVariable('JWT_SECRET', env),
      accessTokenExpiresIn:
        getEnvVariable('JWT_ACCESS_EXPIRES_IN', env) || '1d',
      refreshTokenExpiresIn:
        getEnvVariable('JWT_REFRESH_EXPIRES_IN', env) || '7d',
    },
    redis: {
      host: getEnvVariable('REDIS_HOST', env),
      port: Number(getEnvVariable('REDIS_PORT', env)) || 6379,
    },
  };

  validateEnvVariables(config);
  return config;
};
