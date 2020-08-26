import { session, Composer } from 'telegraf'
import { ExtendedContext } from '../context'

const bot = new Composer<ExtendedContext>()
bot.use(session())
export default bot
