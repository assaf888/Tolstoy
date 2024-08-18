const fetchMetadataForUrls = require('../services/metadataService')
const logger = require('../../utils/logger')

module.exports = async (req, res) => {
  const { urls } = req.body

  logger.info('Got URLs', { urls })

  try {
    const results = await fetchMetadataForUrls(urls)
    logger.info('Sending results: ', results)
    res.status(200).json(results)
  } catch (error) {
    logger.error(`Error processing request: ${error.message}`)
    res.status(400).json({ error: error.message })
  }
}
