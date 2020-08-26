import brokerConfig from './moleculer.config'
import path from 'path'
import { ServiceBroker } from 'moleculer'

export const broker = new ServiceBroker(brokerConfig)
export const terminate = (signal: NodeJS.Signals) => {
    broker.logger.info(`Shutdown initiated${signal ? ` by signal ${signal}` : ''}`)
    broker
        .stop()
        .then(() => {
            broker.logger.info(`Terminating main process`)
            process.exit()
        })
        .catch(broker.logger.error)
}

process.on('SIGHUP', terminate)
process.on('SIGINT', terminate)
process.on('SIGTERM', terminate)

export async function bootstrap() {
    broker.loadService(path.join(__dirname, 'services', 'user.service'))
    // broker.loadService(path.join(__dirname, 'services', 'api.service'))
    broker.loadService(path.join(__dirname, 'services', 'payment.service'))
    broker.loadService(path.join(__dirname, 'services', 'telegram.service'))
    broker.loadService(path.join(__dirname, 'services', 'telegram-log.service'))
    await broker.start().catch(broker.logger.error)
    broker.repl()
}
export default broker
