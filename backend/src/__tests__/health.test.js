const request = require('supertest');
const app = require('../index'); // This imports your Express app

describe('Health API Endpoint', () => {
  it('should return healthy status', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('service', 'Personal Dashboard API');
  });
});