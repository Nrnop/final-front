const BASE_URL = 'http://localhost:3001';

export async function get(path) {
    const requestOptions = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BASE_URL}${path}`, requestOptions);
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('error', error);
    }
}
export async function del(path) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BASE_URL}${path}`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('error', error);
    }
}

export async function post(path, body) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(body);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(`${BASE_URL}${path}`, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error))
}

export async function put(path, body) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(body);

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BASE_URL}${path}`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('error', error);
    }
}
