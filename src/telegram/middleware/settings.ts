import { ExtendedContext } from '../context'
import { Composer } from 'telegraf'
import TelegramService from 'services/telegram.service'

export default (_service: TelegramService) => {
    const bot = new Composer<ExtendedContext>()
    bot.command('settings', async (ctx, next) => {
        // @ts-expect-error
        await ctx.setMyCommands([
            { command: '/start', description: 'Start' },
            { command: 'createProduct', description: 'create a product' },
        ])
        await ctx.reply('OK')
        return await next()
    })
    return bot
}
