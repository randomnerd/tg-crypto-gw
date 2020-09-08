// import { Context as TelegrafContext } from 'telegraf'
import { Context } from 'telegraf'
import moleculer from 'moleculer'
import TelegramService from 'services/telegram.service'
import { User } from 'entity/user'
import SceneContext from 'telegraf/typings/scenes/context'
import WizardContext from 'telegraf/typings/scenes/wizard/context'
import { TelegramConfig } from './typings'

// export interface WizardContext<TContext extends WizardContextMessageUpdate> {
//     ctx: TContext
//     step: number
//     cursor: number
//     steps: any
//     selectStep: (index: number) => this
//     next: () => this
//     back: () => this
//     state: { [key: string]: any }
// }
//
// export interface WizardContextMessageUpdate extends Context {
//     wizard: WizardContext<this>
// }

export class ExtendedContext extends Context {
    dbUser?: User
    config: TelegramConfig
    service: TelegramService
    broker: moleculer.ServiceBroker
    logger: moleculer.LoggerInstance
    wizard: WizardContext<this>
    scene: SceneContext<this>
    session: { [key: string]: any }
}
