import { apiFetch, APIException } from '@/lib/api';

// Mock global fetch
global.fetch = jest.fn();

describe('API Utility', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should successfully parse a valid backend response', async () => {
    const mockData = { id: '1', name: 'Hotel' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockData }),
    });

    const result = await apiFetch('/test');
    expect(result).toEqual(mockData);
  });

  it('should correctly parse standard backend error format', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        error: { code: 'INVALID_QUERY', message: 'Bad request' }
      }),
    });

    await expect(apiFetch('/test')).rejects.toThrow(APIException);
    await expect(apiFetch('/test')).rejects.toMatchObject({
      code: 'INVALID_QUERY',
      message: 'Bad request'
    });
  });

  it('should handle network failures gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network offline'));

    await expect(apiFetch('/test')).rejects.toThrow(APIException);
    await expect(apiFetch('/test')).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      message: 'Network offline'
    });
  });
});
