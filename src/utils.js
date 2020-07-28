// GET data from endpoint
export async function fetchData(url, options = null) {
    let response = null;
    let responseJSON = null;

    if (options) {
        for (const [key, value] of Object.entries(options)) {
           url += value;
        }
    }

    try {
        response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
    } catch (e) {
        console.info('Error fetching data', e);
        return;
    }

    if (response) {
        responseJSON = await response.json()
    }

    return responseJSON;
}

export function debounce() {
    let timer;

    return (callback, ms) => {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
}
