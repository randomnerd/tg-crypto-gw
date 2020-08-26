import { ExtendedContext } from '../context'
import { Composer } from 'telegraf'

export default service => {
    const bot = new Composer<ExtendedContext>()
    bot.use(async (ctx, next) => {
        ctx.service = service
        ctx.broker = service.broker
        ctx.logger = service.logger
        return await next()
    })
    return bot
}
