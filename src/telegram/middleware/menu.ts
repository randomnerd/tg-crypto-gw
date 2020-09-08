import { MenuTemplate, MenuMiddleware } from 'telegraf-inline-menu'
import { ExtendedContext } from '../context'
import { Composer } from 'telegraf'

const menu = new MenuTemplate<ExtendedContext>(ctx => {
    if (!ctx.dbUser) return 'Hey, anon!'
    return `Hey, ${ctx.dbUser.username ?? ctx.dbUser.first_name}`
})

let mainMenuToggle = false
menu.toggle('Toggle menu', 'toggle me', {
    set: (_, newState) => {
        mainMenuToggle = newState
        // Update the menu afterwards
        return true
    },
    isSet: () => mainMenuToggle,
})
menu.interact('Make payment', 'createPayment', {
    hide: () => mainMenuToggle,
    do: ctx => {
        void ctx.scene.enter('createPayment', {})
        return true
    },
})
const menuMiddleware = new MenuMiddleware<ExtendedContext>('/', menu)
const bot = new Composer<ExtendedContext>()
bot.use(menuMiddleware as any)
bot.start(async (ctx, next) => {
    await menuMiddleware.replyToContext(ctx)
    return await next()
})
export default bot
