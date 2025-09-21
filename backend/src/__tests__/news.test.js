const request = require('supertest');
const app = require('../index');

describe('News API Endpoint', () => {
  it('should return news data', async () => {
    const response = await request(app).get('/api/news');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('articles');
    expect(Array.isArray(response.body.articles)).toBe(true);
  });

  it('should return articles with expected properties', async () => {
    const response = await request(app).get('/api/news');
    
    if (response.body.articles.length > 0) {
      const article = response.body.articles[0];
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('description');
      expect(article).toHaveProperty('url');
    }
  });
});