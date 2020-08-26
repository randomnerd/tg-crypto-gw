// import { Context as TelegrafContext } from 'telegraf'
import { Context as TelegrafContext } from 'telegraf'
import moleculer from 'moleculer'
import TelegramService from 'services/telegram.service'
import { SceneContext } from 'telegraf/typings/stage'
import { User } from 'entity/user'
import { TelegramConfig } from './typings'

export interface WizardContext<TContext extends WizardContextMessageUpdate> {
    ctx: TContext
    step: number
    cursor: number
    steps: any
    selectStep: (index: number) => this
    next: () => this
    back: () => this
    state: { [key: string]: any }
}

export interface WizardContextMessageUpdate extends TelegrafContext {
    wizard: WizardContext<this>
}

export class ExtendedContext extends TelegrafContext {
    dbUser?: User
    config: TelegramConfig
    service: TelegramService
    broker: moleculer.ServiceBroker
    logger: moleculer.LoggerInstance
    wizard: WizardContext<this>
    scene: SceneContext<this>
    session: { [key: string]: any }
}
