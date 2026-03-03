const redis = require('redis')

const redisClient = redis.createClient({
    url: 'redis://redis:6379'
})

redisClient.on('error', (err) => console.log('Redis Error ', err))
redisClient.on('connect', () => console.log('Redis connect successfully'));

(
    async () => { await redisClient.connect()}
)()

module.exports = redisClient