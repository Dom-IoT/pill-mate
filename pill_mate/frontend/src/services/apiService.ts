const API_URL = 'api';

type Request = {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    route: string,
    body?: object,
};

export const apiService = async <T>({ method, route, body }: Request): Promise<T> => {
    const response = await fetch(`${API_URL}${route}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body && JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
};
