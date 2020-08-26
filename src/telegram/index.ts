import { Telegraf } from 'telegraf'
import { ExtendedContext } from './context'
import composedMiddleware from './middleware'
import config from 'config'
import { TelegramConfig } from './typings'
import commands from './commands'
import TelegramService from '../services/telegram.service'

export const tgConfig = config.get<TelegramConfig>('telegram')
export const bot = new Telegraf<ExtendedContext>(tgConfig.token, tgConfig.options)
bot.context.config = tgConfig
export const tg = bot.telegram

export const launchBot = async (service: TelegramService) => {
    bot.context.service = service
    bot.context.logger = service.logger
    bot.context.broker = service.broker
    bot.use(composedMiddleware)
    bot.catch(bot.context.logger.error)
    await bot.telegram.setMyCommands(commands).catch(bot.context.logger.error)
    bot.help(async ctx => {
        const commands = await tg.getMyCommands()
        const info = commands.reduce((acc, val) => `${acc}/${val.command} - ${val.description}\n`, '')
        return ctx.reply(info)
    })
    await bot.launch(tgConfig.launchOptions).catch(bot.context.logger.error)
    return bot
}

export const stopBot = async () => {
    await bot.stop().catch(bot.context.logger.error)
    return bot
}
