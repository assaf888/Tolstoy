const request = require('supertest')
const app = require('../index')

describe('POST /api/fetch-metadata', () => {

  describe('Testing requests validation', () => {

    test('should return metadata for exactly 3 valid URLs', async () => {
      const urls = ['https://www.walla.co.il', 'https://www.wikipedia.com', 'https://www.ynet.co.il']
      const response = await request(app)
        .post('/api/fetch-metadata')
        .send({ urls })
        .expect(200)
    
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBe(3)
      response.body.forEach(item => {
        expect(item).toHaveProperty('title')
        expect(item).toHaveProperty('description')
        expect(item).toHaveProperty('image')
      })
    })

    test('should handle more than 3 URLs', async () => {

      const urls = ['https://www.mako.co.il', 'https://www.wikipedia.com', 'https://www.ynet.co.il', 'https://www.ynet.co.il']
      const response = await request(app)
        .post('/api/fetch-metadata')
        .send({ urls })
        .expect(200)


        expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBe(4)
      response.body.forEach(item => {
        expect(item).toHaveProperty('title')
        expect(item).toHaveProperty('description')
        expect(item).toHaveProperty('image')
      })
    })

    test('should return metadata for 3 valid URLs and handle 1 invalid URL', async () => {
      const urls = [
        'https://www.walla.co.il', 
        'https://www.wikipedia.com', 
        'https://www.ynet.co.il', 
        'invalid-url'
      ];
      const response = await request(app)
        .post('/api/fetch-metadata')
        .send({ urls })
        .expect(200);
    
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(urls.length);
    
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('image');
      expect(response.body[1]).toHaveProperty('title');
      expect(response.body[1]).toHaveProperty('description');
      expect(response.body[1]).toHaveProperty('image');
      expect(response.body[2]).toHaveProperty('title');
      expect(response.body[2]).toHaveProperty('description');
      expect(response.body[2]).toHaveProperty('image');
    
      expect(response.body[3].error).toBe('Invalid URL format');
    });
  })

  describe('Testing Invalid URL Format', () => {

    test('should return "Invalid URL format" for invalid URLs', async () => {
      const invalidUrls = ['invalid-url', 'another-invalid-url', 'yet-another-invalid-url']
      const response = await request(app)
        .post('/api/fetch-metadata')
        .send({ urls: invalidUrls })
        .expect(200)
    
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBe(invalidUrls.length)
    
      response.body.forEach(item => {
        expect(item.error).toBe('Invalid URL format')
      })
    })
  })

  describe('Testing URL count validation for less than 3 urls', () => {

    test('should return 400 for fewer than 3 URLs', async () => {
      const urls = ['https://www.mako.co.il', 'https://www.example.org'] 
      const response = await request(app)
        .post('/api/fetch-metadata')
        .send({ urls })
        .expect(400)

      expect(response.body.error).toBe('Please provide at least 3 valid URLs.')
    })
  })

  describe('POST /api/fetch-metadata', () => {
    describe('Rate Limiting - testing more than 5 requests per second', () => {
      beforeEach(async () => {
        await new Promise(resolve => setTimeout(resolve, 3000))
      })

      test('should limit the number of requests to 5 per second', async () => {
    
        const urls = [
          'https://www.mako.co.il',
          'https://www.ynet.co.il',
          'https://www.wikipedia.com',
          'https://www.n12.co.il',
          'https://www.walla.co.il',
          'https://www.13tv.co.il',
        ]
    
        const sendRequest = url => request(app)
          .post('/api/fetch-metadata')
          .send({ urls: [url, url, url] })
          .expect(200)
    
        const responses = await Promise.allSettled(urls.map(sendRequest))
        
        const successfulResponses = responses.filter(response => response.status === 'fulfilled')
        const rateLimitedResponses = responses.filter(response => response.status === 'rejected')

        expect(successfulResponses.length).toBeLessThanOrEqual(5)
        expect(rateLimitedResponses.length).toBeGreaterThanOrEqual(1)
      }, 10000)
    })
  })

})
