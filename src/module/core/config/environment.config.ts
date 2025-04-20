export type EnvironmentConfig = {
  database: {
    url: string;
  };
  jwt: {
    secret: string;
  };
};

function validateEnvVariables(config: EnvironmentConfig) {
  const missingVariables: string[] = [];

  if (!config.database.url) missingVariables.push('DATABASE_URL');
  if (!config.jwt.secret) missingVariables.push('JWT_SECRET');

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
    },
  };

  validateEnvVariables(config);
  return config;
};
