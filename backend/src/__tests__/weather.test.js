const request = require('supertest');
const app = require('../index');

describe('Weather API Endpoint', () => {
  it('should return weather data', async () => {
    const response = await request(app).get('/api/weather');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('temp');
    expect(response.body).toHaveProperty('humidity');
    expect(response.body).toHaveProperty('wind');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('city');
  });

  it('should return weather data within expected ranges', async () => {
    const response = await request(app).get('/api/weather');
    
    expect(response.body.temp).toBeGreaterThanOrEqual(10);
    expect(response.body.temp).toBeLessThanOrEqual(40);
    expect(response.body.humidity).toBeGreaterThanOrEqual(30);
    expect(response.body.humidity).toBeLessThanOrEqual(80);
    expect(response.body.wind).toBeGreaterThanOrEqual(5);
    expect(response.body.wind).toBeLessThanOrEqual(25);
  });
});