import { Service, Action } from 'moleculer-decorators'
import Product from '../entity/product'
import { DbService } from '../lib/dbmixin'

@Service({ name: 'product' })
export default class ProductService extends DbService<Product> {
    @Action({
        params: {
            title: 'string',
            description: 'string',
        },
    })
    async create({ params: { title, description } }) {
        const product = await this.repo.create({ title, description })
        return product
    }
}
