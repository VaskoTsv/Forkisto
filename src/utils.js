import {diff} from 'deep-object-diff';

// GET data from endpoint
export async function fetchData(urlString, queryOptions = {}) {
    let response;
    let responseJSON;

    const url = new URL(urlString);
    url.search = new URLSearchParams(queryOptions);

    response = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })

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
