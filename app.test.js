const request = require('supertest');
const app = require('./app');
const ExpressError = require('./expressError');
const db = require('./db'); 

afterAll(() => {
  // Close database connection
  db.end();
});

describe('Test routes and error handling', () => {
  test('GET /nonexistent-route should return 404 error', async () => {
    const response = await request(app).get('/nonexistent-route');
    expect(response.status).toBe(404);
    expect(response.body.error).toBeInstanceOf(ExpressError);
    expect(response.body.error.message).toBe('Not Found');
  });

  test('Error handler should return correct status and message', async () => {
    const response = await request(app).get('/nonexistent-route');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Not Found');
  });
});


  