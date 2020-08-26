import { ExtendedContext } from '../context'
import { Composer } from 'telegraf'
import TelegramService from 'services/telegram.service'

export default (_service: TelegramService) => {
    const bot = new Composer<ExtendedContext>()
    bot.use(async (ctx, next) => {
        console.dir(ctx.update)
        await ctx.broker.broadcast('telegram-log.update', ctx)
        return await next()
    })
    return bot
}
