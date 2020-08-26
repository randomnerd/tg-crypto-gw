module.exports = {
  db: {
    name: 'default',
    type: process.env.TYPEORM_CONNECTION || 'postgres',
    host: process.env.TYPEORM_HOST || 'localhost',
    port: process.env.TYPEORM_PORT || '',
    username: process.env.TYPEORM_USERNAME || 'postgres',
    password: process.env.TYPEORM_PASSWORD || '',
    database: process.env.TYPEORM_DATABASE || 'bitcoin-tg-gw',
    synchronize: process.env.TYPEORM_SYNCHRONIZE || true,
    ssl: process.env.TYPEORM_SSL || false,
    logging: process.env.TYPEORM_LOGGING
      ? process.env.TYPEORM_LOGGING.split(',')
      : ['error', 'query']
  },
  telegram: {
    token: process.env.TELEGRAM_TOKEN,
    launchOptions: {
      polling: { timeout: 1 }
    }
  }
}
