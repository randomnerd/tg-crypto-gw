import { ExtendedContext } from '../context'
import { Composer } from 'telegraf'
import { User as TelegramUser } from 'telegraf/typings/telegram-types'
import TelegramService from 'services/telegram.service'
import { User } from 'entity/user'

export default (_service: TelegramService) => {
    const bot = new Composer<ExtendedContext>()
    bot.use(async (ctx, next) => {
        if (ctx.from?.id) {
            const user = await ctx.broker.call<User, TelegramUser>('user.save', ctx.from)
            await ctx.broker.broadcast('user.seen', ctx.from)
            ctx.dbUser = user
        }
        return await next()
    })
    return bot
}
