const DEBUG_URL = '25.55.44.201:8000'
const DEBUG_FILES_URL = '25.55.14.100:8080';
const SCHEMA = 'http'
const VERSION = 'v1'

function prepareURL(host, url, setEnd) {
    if (url && url[0] === '/')
        url = url.substr(1, url.length);
    if( url && url[url.length - 1] !== '/' && setEnd)
        url += '/';

    return `${SCHEMA}://${host}/api/${VERSION}/${url}`
}

export function makeUrl(url, setEnd = true) {
    return prepareURL(DEBUG_URL, url, setEnd);
}


export function makeUrlFile(url, setEnd = true) {
    return prepareURL(DEBUG_FILES_URL, url, setEnd);
}
