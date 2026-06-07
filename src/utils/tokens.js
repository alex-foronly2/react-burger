const baseUrl = import.meta.env.VITE_API_KEY;

export async function fetchWithRefresh(endpoint, options) {
  const response = await fetch(endpoint, options);
  if (response.ok) return response;

  if (response.status === 403 && localStorage.getItem('refreshToken')) {
    const refreshResponse = await fetch(baseUrl + 'api/auth/token', {
      method: 'POST',
      body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!refreshResponse || !refreshResponse.ok) {
      return response;
    }

    const refreshData = await refreshResponse.json();
    if (!refreshData || !refreshData.success) {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      return response;
    }

    localStorage.setItem('refreshToken', refreshData.refreshToken);
    localStorage.setItem('accessToken', refreshData.accessToken);

    return fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        authorization: refreshData.accessToken,
      },
    });
  }

  return response;
}
