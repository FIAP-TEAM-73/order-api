export interface IIntegration {
    post: (endpoint: string, body: unknown, headers: Record<string, unknown>) => Promise<unknown>;
    put: (endpoint: string, body: unknown, headers: Record<string, unknown>) => Promise<unknown>;
    get: (endpoint: string, headers: Record<string, unknown>) => Promise<unknown>;
}