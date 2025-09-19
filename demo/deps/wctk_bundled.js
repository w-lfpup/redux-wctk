class Bind {
    constructor(params) {
        let { host, callbacks } = params;
        for (let callback of callbacks) {
            // do not bind and replace already bound functions
            if (callback instanceof Function &&
                !callback.hasOwnProperty("prototype")) {
                let { name } = callback;
                if (!name.startsWith("#"))
                    host[name] = callback.bind(host);
            }
        }
    }
}

class Events {
    #connected = false;
    #callbacks = [];
    #target;
    constructor(params) {
        const { host, target, callbacks, connected } = params;
        this.#target = target ?? host;
        this.#callbacks = getBoundCallbacks(host, callbacks);
        if (connected)
            this.connect();
    }
    connect() {
        if (this.#connected)
            return;
        this.#connected = true;
        for (let [name, callback] of this.#callbacks) {
            this.#target.addEventListener(name, callback);
        }
    }
    disconnect() {
        if (!this.#connected)
            return;
        this.#connected = false;
        for (let [name, callback] of this.#callbacks) {
            this.#target.removeEventListener(name, callback);
        }
    }
}
function getBoundCallbacks(host, callbacks) {
    let boundCallbacks = [];
    for (let [name, callback] of callbacks) {
        if (callback instanceof Function && !callback.hasOwnProperty("prototype")) {
            callback = callback.bind(host);
        }
        boundCallbacks.push([name, callback]);
    }
    return boundCallbacks;
}

class Microtask {
    #queued = false;
    #callback;
    constructor(params) {
        let { host, callback } = params;
        this.queue = this.queue.bind(this);
        this.#callback = callback;
        if (callback instanceof Function && !callback.hasOwnProperty("prototype")) {
            this.#callback = callback.bind(host);
        }
    }
    queue() {
        if (this.#queued)
            return;
        this.#queued = true;
        // could this be a bound function? less function creation
        queueMicrotask(() => {
            this.#queued = false;
            this.#callback();
        });
    }
}

class Subscription {
    #callback;
    #affect;
    #subscribe;
    #unsubscribe;
    constructor(params) {
        let { host, callback, connected, subscribe, unsubscribe } = params;
        this.#subscribe = subscribe;
        this.#unsubscribe = unsubscribe;
        this.#callback = callback;
        if (callback instanceof Function && !callback.hasOwnProperty("prototype")) {
            this.#callback = callback.bind(host);
        }
        if (connected)
            this.connect();
    }
    connect() {
        if (!this.#affect)
            this.#affect = this.#subscribe(this.#callback);
    }
    disconnect() {
        if (this.#affect)
            this.#unsubscribe(this.#affect);
    }
}

class QuerySelector {
    #queries = new Map();
    #params;
    constructor(params) {
        this.#params = params;
    }
    querySelector(selector) {
        return getQuery(this.#params, this.#queries, selector)[0];
    }
    querySelectorAll(selector) {
        return getQuery(this.#params, this.#queries, selector);
    }
    deleteAll() {
        this.#queries = new Map();
    }
}
function getQuery(params, queries, selector) {
    const { parent } = params;
    let results = queries.get(selector);
    if (!results) {
        results = Array.from(parent.querySelectorAll(selector));
        queries.set(selector, results);
    }
    return results;
}

const shadowRootInitFallback = {
    mode: "closed",
};
class Wc {
    #declarative = true;
    #internals;
    #shadowRoot;
    constructor(params) {
        let { host, shadowRootInit, adoptedStyleSheets, formValue, formState } = params;
        this.#internals = host.attachInternals();
        let { shadowRoot } = this.#internals;
        if (!shadowRoot) {
            this.#declarative = false;
            shadowRoot = host.attachShadow(shadowRootInit ?? shadowRootInitFallback);
        }
        this.#shadowRoot = shadowRoot;
        if (formValue)
            this.setFormValue(formValue, formState);
        if (adoptedStyleSheets)
            this.adoptedStyleSheets = adoptedStyleSheets;
    }
    get declarative() {
        return this.#declarative;
    }
    get shadowRoot() {
        return this.#shadowRoot;
    }
    get adoptedStyleSheets() {
        return this.#shadowRoot.adoptedStyleSheets ?? [];
    }
    set adoptedStyleSheets(stylesheets) {
        this.#shadowRoot.adoptedStyleSheets = stylesheets;
    }
    checkValidity() {
        return this.#internals.checkValidity();
    }
    reportValidity() {
        return this.#internals.reportValidity();
    }
    setFormValue(value, state) {
        this.#internals.setFormValue(value, state);
    }
    setValidity(flags, message, anchor) {
        this.#internals.setValidity(flags, message, anchor);
    }
}

export { Bind, Events, Microtask, QuerySelector, Subscription, Wc };
