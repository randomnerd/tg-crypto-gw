import { Composer } from 'telegraf'
import { ExtendedContext } from '../context'
import session from './session'
import menu from './menu'
import log from './log'
import user from './user'
import stage from './stage'

export const bot = new Composer<ExtendedContext>()
bot.use(user)
bot.use(session)
bot.use(log)
bot.use(stage)
bot.use(menu)
export default bot
