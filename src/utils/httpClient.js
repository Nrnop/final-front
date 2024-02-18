const BASE_URL = 'http://localhost:3000';

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
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error', error);
    }
}
