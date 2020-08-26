import { ExtendedContext } from '../context'
import { Composer } from 'telegraf'

const bot = new Composer<ExtendedContext>()
bot.use(async (ctx, next) => {
    await ctx.broker.broadcast('telegram-log.update', ctx)
    return await next()
})
export default bot
