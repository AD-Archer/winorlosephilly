const PLAUSIBLE_SCRIPT_ID = 'plausible-analytics-script';
const PLAUSIBLE_SRC = 'https://plausible.adarcher.app/js/script.js';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

function hasBrowserContext() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function isProductionHost() {
    if (!hasBrowserContext()) {
        return false;
    }

    const { hostname, protocol } = window.location;
    return protocol !== 'file:' && !LOCAL_HOSTS.has(hostname) && !hostname.endsWith('.local');
}

function ensurePlausibleQueue() {
    if (!hasBrowserContext()) {
        return;
    }

    if (!window.plausible) {
        window.plausible = function queuePlausibleEvent(...args) {
            window.plausible.q = window.plausible.q || [];
            window.plausible.q.push(args);
        };
    }
}

export function initAnalytics(domain = hasBrowserContext() ? window.location.hostname : '') {
    if (!isProductionHost() || !domain) {
        return false;
    }

    ensurePlausibleQueue();

    if (document.getElementById(PLAUSIBLE_SCRIPT_ID)) {
        return true;
    }

    const script = document.createElement('script');
    script.id = PLAUSIBLE_SCRIPT_ID;
    script.defer = true;
    script.dataset.domain = domain;
    script.src = PLAUSIBLE_SRC;
    document.head.appendChild(script);

    return true;
}

export function trackEvent(eventName, props = {}) {
    if (!isProductionHost() || !eventName) {
        return;
    }

    ensurePlausibleQueue();

    if (Object.keys(props).length > 0) {
        window.plausible?.(eventName, { props });
        return;
    }

    window.plausible?.(eventName);
}
