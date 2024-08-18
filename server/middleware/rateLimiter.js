const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 1000,
  limit: 5,
  message: 'Too many requests, try again later'
})

module.exports = limiter
