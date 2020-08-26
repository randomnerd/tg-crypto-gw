import { TelegrafOptions, LaunchPollingOptions, LaunchWebhookOptions } from 'telegraf/typings/telegraf'

export interface TelegramConfig {
    token: string
    options?: TelegrafOptions
    launchOptions?: {
        polling?: LaunchPollingOptions
        webhook?: LaunchWebhookOptions
    }
}
