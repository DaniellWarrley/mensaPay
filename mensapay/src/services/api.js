const URL_BASE = 'http://localhost:3000/api/'

export async function apiFetch(endPoint, {method = 'GET', body, headers = {}, token} = {}){
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ... (token && {'Authorization': `Bearer ${token}`}),
            ... headers,
        },
        ...(body && { body: JSON.stringify(body) }),
    }

    const response = await fetch(`${URL_BASE}${endPoint}`, config)

    if (!response.ok) {
        const error = new Error("Request failed")
        error.status = response.status
        error.body = await response.json().catch(() => null)
        throw error
    }


    try{
        return await response.json()
    } catch {
        return null
    }
}