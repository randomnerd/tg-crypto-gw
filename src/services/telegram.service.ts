import moleculer from 'moleculer'
import { Service, Action, Event } from 'moleculer-decorators'
import { bot, tg, launchBot, stopBot } from '../telegram'

@Service({ name: 'telegram', dependencies: ['user', 'telegram-log'] })
export default class TelegramService extends moleculer.Service {
    bot = bot
    tg = tg

    async started() {
        this.logger.info('Telegram starting...')
        await launchBot(this)
    }

    async stopped() {
        this.logger.info('Telegram stopping...')
        await stopBot()
    }

    @Action({
        params: { msg: 'string', chat: 'number' },
    })
    async sendMessage({ params: { msg, chat } }) {
        return await this.tg.sendMessage(chat, msg, { parse_mode: 'Markdown' })
    }
}
