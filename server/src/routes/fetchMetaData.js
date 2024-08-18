const axios = require('axios')
const { JSDOM } = require('jsdom')
const validUrl = require('valid-url')
const logger = require('../../utils/logger')

module.exports = async (req, res) => {

  const { urls } = req.body

  logger.info('Got URLs', { urls })

  if (!Array.isArray(urls) || urls.length < 3) {
    logger.error('Error with urls array, either below 3 urls were sent or no urls array sent at all.')
    return res.status(400).json({ error: 'Please provide at least 3 valid URLs.' })
  }

  // Filter invalid URLs based on RFC 3986
  const results = await Promise.all(urls.map(async (url) => {
    if (!validUrl.isUri(url)) {
      logger.info(`The URL ${url} is invalid.`)
      return { url, error: 'Invalid URL format' }
    }

    try {
      logger.info(`Fetching metadata for ${url} `)
      const response = await axios.get(url)
      const dom = new JSDOM(response.data)
      const title = dom.window.document.querySelector('title')?.textContent || 'No title found'
      const description = dom.window.document.querySelector('meta[name="description"]')?.getAttribute('content') || 'No description found'
      const image = dom.window.document.querySelector('meta[property="og:image"]')?.getAttribute('content') || 'No image found'

      return { url, title, description, image }
    } catch (error) {
      logger.error(`Error fetching metadata for URL ${url}: ${error.message}`)
      return { url, error: 'Failed to fetch metadata' }
    }
  }))

  logger.info('Sending results: ', results)
  res.status(200).json(results)
}
