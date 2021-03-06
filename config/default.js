const { SnakeNamingStrategy } = require('typeorm-naming-strategies')
const namingStrategy = new SnakeNamingStrategy()

module.exports = {
  db: {
    namingStrategy,
    name: 'default',
    type: process.env.TYPEORM_CONNECTION || 'postgres',
    host: process.env.TYPEORM_HOST || 'localhost',
    port: process.env.TYPEORM_PORT || '',
    username: process.env.TYPEORM_USERNAME || 'postgres',
    password: process.env.TYPEORM_PASSWORD || '',
    database: process.env.TYPEORM_DATABASE || 'bitcoin-tg-gw',
    synchronize: process.env.TYPEORM_SYNCHRONIZE || true,
    ssl: process.env.TYPEORM_SSL || false,
    pool: { min: 1, max: 10 },
    logging: process.env.TYPEORM_LOGGING
      ? process.env.TYPEORM_LOGGING.split(',')
      : ['error']
  },
  telegram: {
    token: process.env.TELEGRAM_TOKEN,
    launchOptions: {
      polling: { timeout: 1 }
    }
  },
  capusta: {
    email: process.env.CAPUSTA_EMAIL,
    token: process.env.CAPUSTA_TOKEN,
    projectCode: process.env.CAPUSTA_PROJECT_ID
  },
  ethereum: {
    infuraKey: process.env.INFURA_KEY,
    // eslint-disable-next-line quotes
    basePath: `m/44'/60'`
  },
  crypto: {
    baseAccount: 1,
    rootMnemonic: process.env.ROOT_MNEMONIC
  }
}
