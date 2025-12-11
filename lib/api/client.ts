export class FetchError extends Error {
    constructor(public status: number, public statusText: string) {
        super(`Fetch failed: ${status} ${statusText}`);
        this.name = 'FetchError';
    }
}

export async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs = 8000
): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}
