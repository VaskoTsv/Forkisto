import { diff } from 'deep-object-diff';
import Cookies from 'js-cookie';
import { STRAPI_BASE_PROD, STRAPI_TOKEN_KEY } from './constants.js';

// Extend and modify the default Error class
export class APIError extends Error {
    constructor(response, url) {
        super(`Server responded with ${response.error}: ${response.statusCode} on URL: ${url}`);
        this.response = response;
        this.responseJSON = JSON.stringify(response.responseJSON);
    }

    get responseErrorMessage() {
        if (!this.response || !this.response.error || !this.response.message) {
            return false;
        }

        return {
            ...this.response.message[0],
            error: this.response.error,
            statusCode: this.response.statusCode,
        }
    }
}

function getHeaderOptions(url) {
    let headersOptions = {
        'Content-Type': 'application/json'
    }

    // In case we are making a call to the Strapi api - set the auth token(if there is any)
    // in the request header
    if (url.includes(STRAPI_BASE_PROD) && Cookies.get(STRAPI_TOKEN_KEY)) {
        headersOptions = {
            ...headersOptions,
            'Authorization': `Bearer ${Cookies.get(STRAPI_TOKEN_KEY)}`
        }
    }

    return headersOptions;
}

// GET data from endpoint
export async function fetchData(urlString, queryOptions = {}) {
    let response;
    let responseJSON;

    const url = new URL(urlString);
    url.search = new URLSearchParams(queryOptions);

    response = await fetch(url, {
        method: 'GET',
        headers: getHeaderOptions(urlString),
    })

    if (response) {
        responseJSON = await response.json()
    }

    return responseJSON;
}

export async function postData(urlString, params, queryOptions = {}) {
    let response;
    let responseJSON;

    const url = new URL(urlString);
    url.search = new URLSearchParams(queryOptions);

    response = await fetch(url, {
        method: 'POST',
        headers: getHeaderOptions(urlString),
        body: JSON.stringify(params),
    });

    if (response) {
        responseJSON = await response.json()
    }

    if (responseJSON.error) {
        throw new APIError(responseJSON, urlString);
    }

    return responseJSON;
}

export async function putData(urlString, params, queryOptions = {}) {
    let response;
    let responseJSON;

    const url = new URL(urlString);
    url.search = new URLSearchParams(queryOptions);

    response = await fetch(url, {
        method: 'PUT',
        headers: getHeaderOptions(urlString),
        body: JSON.stringify(params),
    });

    if (response) {
        responseJSON = await response.json()
    }

    return responseJSON;
}

export async function deleteData(urlString) {
    let response;
    let responseJSON;

    response = await fetch(urlString, {
        method: 'DELETE',
        headers: getHeaderOptions(urlString),
    });

    if (response) {
        responseJSON = await response.json()
    }

    return responseJSON;
}

export function handleFetchError(response) {
    if (response.code === 402) {
        alert(response.message);
    }
}

export function debounce() {
    let timer;

    return (callback, ms) => {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
}

export function removeHtmlFromText(originalText) {
    return originalText.replace(/<\/?[^>]+(>|$)/g, "");
}

// Shortens the passed text and appends '...' on the end.
export function shortenText(text, numOfSymbols) {
    if (text.length <= numOfSymbols) {
        return text;
    }

    return text.slice(0, numOfSymbols) + '...';
}

export function isEmptyObject(object) {
    return Boolean(Object.keys(object).length === 0);
}

export function objectsHasDifferences(object1, object2) {
    return !isEmptyObject(diff(object1, object2));
}

export function generateRandomId() {
    return parseInt(Math.random() * 1000000000000);
}

// Automatically starts to add/remove class to element classes on specified time interval.
export function handleAnimation(isActive, element, animationClass, msInterval = 1200) {
    let active = isActive;

    function toggleClass(activeFlag, element, animationClass) {
        if (active) {
            element.classList.remove(animationClass);
        } else {
            element.classList.add(animationClass);
        }
    }

    return setInterval(() => {
        active = !active;
        toggleClass(!active, element, animationClass);
    }, msInterval);
}

export function toggleBodyScroll(isEnable) {
    const docElement = document.documentElement;

    if (!docElement) {
        // In case there is no root document element(this nothingnever happen) - do nothitg
        return;
    }

    if (!isEnable) {
        docElement.style.overflow = 'hidden';
        return;
    }

    docElement.style.overflow = 'initial';
}
