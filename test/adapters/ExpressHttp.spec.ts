import ExpressHttp from '../../src/adapters/ExpressHttp';
import request from 'supertest';

describe('ExpressHttp', () => {
    it('Should register a GET route and handle a successful request', async () => {
        const callback = jest.fn(async () => ({ statusCode: 200, payload: { message: 'success' } }));
        const sut = new ExpressHttp()
        await sut.route('get', 'test', callback);
        const response = await request(sut.app).get('/api/v1/test');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'success' });
        expect(callback).toHaveBeenCalled();
    });

    it('Should handle a route throwing a bad request error', async () => {
        const error = new Error('Test error');
        const callback = jest.fn(async () => {
            throw error;
        });
        const sut = new ExpressHttp()
        await sut.route('get', 'test', callback);
        const response = await request(sut.app).get('/api/v1/test');
        expect(response.status).toBe(400);
    });

    it('Should handle a route throwing a non-Error object', async () => {
        const error = 'string error';
        const callback = jest.fn(async () => {
            throw error;
        });
        const sut = new ExpressHttp()
        await sut.route('get', 'test', callback);
        const response = await request(sut.app).get('/api/v1/test');
        expect(response.status).toBe(500);
    });

    it('Should serve swagger documentation', async () => {
        const mockDoc = { openapi: '3.0.0', info: { title: 'Test API', version: '1.0.0' } };
        const sut = new ExpressHttp()
        await sut.doc('/swagger', mockDoc);
        const response = await request(sut.app).get('/swagger');
        expect(response.status).toBe(301);
        expect(response.text).toContain('Redirecting to /swagger/');
    });
});
