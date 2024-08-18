const express = require('express')
const router = express.Router()
const fetchMetadataRouter = require('./fetchMetaData')


router.post('/fetch-metadata', fetchMetadataRouter)

module.exports = router
