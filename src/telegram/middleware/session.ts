import TelegramService from 'services/telegram.service'
import { session, Composer } from 'telegraf'
import { ExtendedContext } from '../context'

export default (service: TelegramService) => {
    const bot = new Composer<ExtendedContext>()
    bot.use(session())
    return bot
}
