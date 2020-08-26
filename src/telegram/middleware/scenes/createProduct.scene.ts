import WizardScene from 'telegraf/lib/scenes/wizard'

export const CreateProductScene = new WizardScene(
    'createProduct',
    async ctx => {
        ctx.wizard.state.data = { title: '', description: '' }
        ctx.reply('Enter product title:')
        return ctx.wizard.next()
    },
    async ctx => {
        ctx.wizard.state.title = ctx.message?.text
        ctx.reply('Enter product description:')
        return ctx.wizard.next()
    },
    async ctx => {
        ctx.wizard.state.data.description = ctx.message.text
        ctx.reply(`You entered ${JSON.stringify(ctx.wizard.state.data)}`)
        return ctx.scene.leave()
    }
)
