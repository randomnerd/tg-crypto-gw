import moleculer from 'moleculer'
import { Service, Action, Event, Method } from 'moleculer-decorators'
import { providers, Wallet, utils } from 'ethers'
import config from 'config'
import { getConnection } from '../lib/db'
import { Connection, Repository } from 'typeorm'
import { Block, ViewBlock } from '../entity/block'
import { Transaction } from '../entity/transaction'

export interface EthereumConfig {
    infuraKey: string
    basePath: string
}

export interface CryptoConfig {
    rootMnemonic: string
    baseAccount: number
}

@Service({ name: 'ethereum', dependencies: ['user'] })
export default class EthereumService extends moleculer.Service {
    private db: Connection
    private blocks: Repository<Block>
    private vBlocks: Repository<ViewBlock>
    private txs: Repository<Transaction>
    private readonly config = config.get<EthereumConfig>('ethereum')
    private readonly provider = new providers.InfuraProvider('mainnet', this.config.infuraKey)
    private readonly cryptoConfig = config.get<CryptoConfig>('crypto')
    public height: number

    async started() {
        this.logger.info('Ethereum starting...')
        this.db = await getConnection()
        this.blocks = this.db.getRepository(Block)
        this.vBlocks = this.db.getRepository(ViewBlock)
        this.txs = this.db.getRepository(Transaction)
        this.provider.on('block', h => void this.broker.emit('ethereum.newHeight', h))
    }

    async stopped() {
        this.logger.info('Ethereum stopping...')
        this.provider.removeAllListeners()
    }

    @Event()
    async 'ethereum.newHeight'(height: number) {
        await this.onHeight(height)
    }

    @Event()
    async 'ethereum.newBlock'(height: number) {
        await this.onBlock(height)
    }

    @Event()
    async 'ethereum.newTxHash'(hash: string) {
        await this.onTxHash(hash)
    }

    @Event()
    async 'ethereum.newTx'({ block, tx }: { block: Block; tx: providers.TransactionResponse }) {
        await this.onTransaction(block, tx)
    }

    @Method
    createWallet(id: number, change = false, account?: number) {
        const wallet = Wallet.fromMnemonic(
            this.cryptoConfig.rootMnemonic,
            this.getPath(id, change, account)
        ).connect(this.provider)
        this.logger.info(wallet)
        return wallet
    }

    @Method
    getPath(id: number, change = false, account = this.cryptoConfig.baseAccount) {
        return `${this.config.basePath}/${account}'/${change ? 1 : 0}/${id}`
    }

    @Method
    async onBlock(height: number) {
        const newBlock = await this.provider.getBlockWithTransactions(height)
        const txs = newBlock.transactions.filter(t => t.to && t.value.gt(0))
        const block = await this.blocks.save({
            currency: 'ETH',
            hash: newBlock.hash,
            height: newBlock.number,
            prevhash: newBlock.parentHash,
            tx_count: txs.length,
            created_at: new Date(newBlock.timestamp * 1000),
        })
        await Promise.all(txs.map(tx => this.broker.emit('ethereum.newTx', { block, tx })))
        this.logger.info(`New ETH Block #${height}: ${txs.length} TXs parsed`)
        // await Promise.all(txs.map(tx => this.onTransaction(tx, rawBlock)))
    }

    @Method
    onTransaction(block: Block, tx: providers.TransactionResponse) {
        return this.txs.save({
            block_id: block.id,
            hash: tx.hash,
            value: tx.value,
            to: tx.to,
        })
        // .catch(this.logger.error)
    }

    @Method
    async onHeight(height: number) {
        if (!this.height || this.height < height) this.height = height
        if (await this.isParsed(height)) return
        await this.broker.emit('ethereum.newBlock', height)
    }

    @Method
    async isParsed(height: number) {
        const parsed = await this.vBlocks.findOne(
            { currency: 'ETH', height, parsed: true },
            { select: ['id'] }
        )
        return !!parsed
    }
}
