import axios from 'axios';
import AxiosIntegration from '../../src/adapters/AxiosIntegration';

jest.mock('axios');

describe('AxiosIntegration', () => {
    const baseURL = 'http://localhost:3000';
    it('Should perform a POST request and handle the response', async () => {
        const endpoint = '/test';
        const body = { key: 'value' };
        const headers = { Authorization: 'Bearer token' };
        const mockResponse = { data: { success: true }, status: 200 };

        (axios.create as jest.Mock).mockReturnValue({
            post: jest.fn().mockResolvedValue(mockResponse),
        });
        const sut = new AxiosIntegration(baseURL)
        const result = await sut.post(endpoint, body, headers);

        expect(result).toEqual(mockResponse.data);
        expect(axios.create).toHaveBeenCalledWith({ baseURL });
    });

    it('Should handle an error during POST request', async () => {
        const endpoint = '/test';
        const body = { key: 'value' };
        const headers = { Authorization: 'Bearer token' };
        const mockResponse = { data: { error: true }, status: 500 };
        (axios.create as jest.Mock).mockReturnValue({
            post: jest.fn().mockResolvedValue(mockResponse),
        });
        const sut = new AxiosIntegration(baseURL)
        await expect(sut.post(endpoint, body, headers)).rejects.toThrow(
            `Integration error. Status: ${mockResponse.status}. Data: ${JSON.stringify(mockResponse.data)}`
        );
    });

    it('Should perform a GET request and handle the response', async () => {
        const endpoint = '/test';
        const headers = { Authorization: 'Bearer token' };
        const mockResponse = { data: { success: true }, status: 200 };

        (axios.create as jest.Mock).mockReturnValue({
            get: jest.fn().mockResolvedValue(mockResponse),
        });
        const sut = new AxiosIntegration(baseURL)
        const result = await sut.get(endpoint, headers);

        expect(result).toEqual(mockResponse.data);
    });

    it('Should perform a PUT request and handle the response', async () => {
        const endpoint = '/test';
        const body = { key: 'value' };
        const headers = { Authorization: 'Bearer token' };
        const mockResponse = { data: { success: true }, status: 200 };

        (axios.create as jest.Mock).mockReturnValue({
            put: jest.fn().mockResolvedValue(mockResponse),
        });
        const sut = new AxiosIntegration(baseURL)
        const result = await sut.put(endpoint, body, headers);

        expect(result).toEqual(mockResponse.data);
    });
});
