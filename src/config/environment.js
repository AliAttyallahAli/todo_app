import Constants from 'expo-constants';

const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api',
    LOG_LEVEL: 'debug',
    ENABLE_DEBUG_MENU: true,
  },
  staging: {
    API_BASE_URL: 'https://staging-api.zoudousouk.td/api',
    LOG_LEVEL: 'info',
    ENABLE_DEBUG_MENU: false,
  },
  production: {
    API_BASE_URL: 'https://api.zoudousouk.td/api',
    LOG_LEVEL: 'warn',
    ENABLE_DEBUG_MENU: false,
  },
};

const getEnvVars = (env = Constants.manifest?.releaseChannel) => {
  if (__DEV__) {
    return ENV.development;
  } else if (env === 'staging') {
    return ENV.staging;
  } else {
    return ENV.production;
  }
};

export default getEnvVars;