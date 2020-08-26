import { ExtendedContext } from '../context'
import { Composer } from 'telegraf'
import { User as TelegramUser } from 'telegraf/typings/telegram-types'
import { User } from 'entity/user'

const bot = new Composer<ExtendedContext>()
bot.use(async (ctx, next) => {
    if (ctx.from?.id) {
        const user = await ctx.broker.call<User, TelegramUser>('user.save', ctx.from)
        ctx.dbUser = user
    }
    return await next()
})
export default bot
