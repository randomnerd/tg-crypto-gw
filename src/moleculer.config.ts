import { BrokerOptions, Errors } from 'moleculer'

const brokerConfig: BrokerOptions = {
    // Namespace of nodes to segment your nodes on the same network.
    namespace: 'bitcoin-tg-gw',
    // Unique node identifier. Must be unique in a namespace.
    // nodeID: null,

    // Enable/disable logging or use custom logger. More info: https://moleculer.services/docs/0.13/logging.html
    logger: {
        type: 'Console',
        options: {
            // Logging level
            // level: 'debug',
            // Using colors on the output
            colors: true,
            // Print module names with different colors (like docker-compose for containers)
            moduleColors: true,
            // Line formatter. It can be "json", "short", "simple", "full", a `Function`
            // or a template string like "{timestamp} {level} {nodeID}/{mod}: {msg}"
            formatter: 'short',
            // Custom object printer. If not defined, it uses the `util.inspect` method.
            objectPrinter: null,
            // Auto-padding the module name in order to messages begin at the same column.
            autoPadding: true,
        },
    },
    // cacher: {
    //     type: 'Redis',
    //     options: {
    //         monitor: true,
    //         redis: {
    //             host: process.env.REDIS_HOST || '192.168.2.1',
    //             port: Number(process.env.REDIS_PORT || 6379),
    //             password: process.env.REDIS_PASSWORD,
    //             db: Number(process.env.REDIS_DB || 0),
    //         },
    //     },
    // },
    transporter: 'nats://localhost:4222',
    serializer: 'JSON',
    requestTimeout: 90 * 1000,
    retryPolicy: {
        // Enable feature
        enabled: true,
        // Count of retries
        retries: 5,
        // First delay in milliseconds.
        delay: 100,
        // Maximum delay in milliseconds.
        maxDelay: 1000,
        // Backoff factor for delay. 2 means exponential backoff.
        factor: 2,
        // A function to check failed requests.
        check: (err: Errors.MoleculerRetryableError) => err && !!err.retryable,
    },

    // Limit of calling level. If it reaches the limit, broker will throw an MaxCallLevelError error.
    // (Infinite loop protection)
    maxCallLevel: 100,

    // Number of seconds to send heartbeat packet to other nodes.
    heartbeatInterval: 5,
    // Number of seconds to wait before setting node to unavailable status.
    heartbeatTimeout: 15,
    tracing: {
        enabled: false,
        actions: true,
        exporter: {
            type: 'Console',
            options: {
                // Custom logger
                logger: null,
                // Using colors
                colors: true,
                // Width of row
                width: 60,
                // Gauge width in the row
                gaugeWidth: 20,
            },
        },
        events: true,
        stackTrace: true,
    },

    // Tracking requests and waiting for running requests before shutdowning.
    // More info: https://moleculer.services/docs/0.13/fault-tolerance.html
    tracking: {
        enabled: true,
        shutdownTimeout: 5000,
    },

    // Disable built-in request & emit balancer. (Transporter must support it, as well.)
    disableBalancer: false,

    // Settings of Service Registry. More info: https://moleculer.services/docs/0.13/registry.html
    registry: {
        // Available values: "RoundRobin", "Random", "CpuUsage", "Latency"
        strategy: 'RoundRobin',
        preferLocal: true,
    },

    // Settings of Circuit Breaker. More info: https://moleculer.services/docs/0.13/fault-tolerance.html#Circuit-Breaker
    circuitBreaker: {
        // Enable feature
        enabled: true,
        // Threshold value. 0.5 means that 50% should be failed for tripping.
        threshold: 0.5,
        // Minimum request count. Below it, CB does not trip.
        minRequestCount: 20,
        // Number of seconds for time window.
        windowTime: 60,
        // Number of milliseconds to switch from open to half-open state
        halfOpenTime: 10 * 1000,
        // A function to check failed requests.
        check: (err: Errors.MoleculerRetryableError) => err && err.code >= 500,
    },

    // Settings of bulkhead feature. More info: https://moleculer.services/docs/0.13/fault-tolerance.html#Bulkhead
    bulkhead: {
        // Enable feature.
        enabled: true,
        // Maximum concurrent executions.
        concurrency: 10,
        // Maximum size of queue
        maxQueueSize: 100,
    },

    // Enable parameters validation. More info: https://moleculer.services/docs/0.13/validating.html
    // validation: true,
    // Custom Validator class for validation.
    validator: true,

    // Enable metrics function. More info: https://moleculer.services/docs/0.13/metrics.html
    metrics: false,
    // Rate of metrics calls. 1 means to measure every request, 0 means to measure nothing.
    // metricsRate: 1,

    // Register internal services ("$node").
    // More info: https://moleculer.services/docs/0.13/services.html#Internal-services
    internalServices: true,
    // Register internal middlewares.
    // More info: https://moleculer.services/docs/0.13/middlewares.html#Internal-middlewares
    internalMiddlewares: true,

    // Watch the loaded services and hot reload if they changed.
    // You can also enable it in Moleculer Runner with `--hot` argument
    hotReload: true,

    // Register custom middlewares
    middlewares: [],

    // Register custom REPL commands.
    // replCommands: null,
}

export = brokerConfig
