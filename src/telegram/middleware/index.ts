import { Composer } from 'telegraf'
import { ExtendedContext } from '../context'
import session from './session'
import broker from './broker'
import menu from './menu'
import log from './log'
import user from './user'
import stage from './stage'

export default service => {
    const bot = new Composer<ExtendedContext>(
        broker(service),
        user(service),
        log(service),
        session(service),
        stage(service),
        menu(service)
    )
    return bot
}
