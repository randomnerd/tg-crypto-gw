import { MenuTemplate, MenuMiddleware } from 'telegraf-inline-menu'
import { ExtendedContext } from '../context'
import { Composer } from 'telegraf'

export default service => {
    const menu = new MenuTemplate<ExtendedContext>(() => 'Main menu')

    let mainMenuToggle = false
    menu.toggle('toggle me', 'toggle me', {
        set: (_, newState) => {
            mainMenuToggle = newState
            // Update the menu afterwards
            return true
        },
        isSet: () => mainMenuToggle,
    })
    menu.interact('update after action', 'update afterwards', {
        joinLastRow: true,
        hide: () => mainMenuToggle,
        do: async ctx => {
            await ctx.answerCbQuery('I will update the menu now…')

            return true

            // You can return true to update the same menu or use a relative path
            // For example '.' for the same menu or '..' for the parent menu
            // return '.'
        },
    })
    menu.interact('Create product', 'create-product', {
        hide: () => mainMenuToggle,
        do: async ctx => {
            await ctx.scene.enter('createProduct', {})
            console.dir(ctx.wizard, { depth: 2 })
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
    return bot
}
