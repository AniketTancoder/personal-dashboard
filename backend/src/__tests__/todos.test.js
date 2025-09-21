const request = require('supertest');
const app = require('../index');

describe('Todos API Endpoint', () => {
  let testTodoId;

  it('should return empty array initially', async () => {
    const response = await request(app).get('/api/todos');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new todo', async () => {
    const newTodo = { text: 'Test todo from Jest', completed: false };
    const response = await request(app)
      .post('/api/todos')
      .send(newTodo);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('text', newTodo.text);
    expect(response.body).toHaveProperty('completed', false);
    expect(response.body).toHaveProperty('createdAt');
    
    testTodoId = response.body.id;
  });

  it('should retrieve the created todo', async () => {
    const response = await request(app).get('/api/todos');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(testTodoId);
  });

  it('should update a todo', async () => {
    const updates = { completed: true };
    const response = await request(app)
      .put(`/api/todos/${testTodoId}`)
      .send(updates);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('completed', true);
  });

  it('should delete a todo', async () => {
    const response = await request(app).delete(`/api/todos/${testTodoId}`);
    
    expect(response.status).toBe(204);
  });

  it('should verify todo was deleted', async () => {
    const response = await request(app).get('/api/todos');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});