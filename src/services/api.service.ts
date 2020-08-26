import moleculer from 'moleculer'
import ApiGateway from 'moleculer-web'
import { Service } from 'moleculer-decorators'

@Service({
    name: 'api',
    mixins: [ApiGateway],
    settings: {
        routes: [
            {
                path: '/api',
                whitelist: ['**'],
            },
        ],
        assets: { folder: 'public' },
        port: Number(process.env.PORT ?? 3000),
    },
    dependencies: [],
})
export default class ApiService extends moleculer.Service {}
