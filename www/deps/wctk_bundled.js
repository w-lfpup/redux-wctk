class Events {
    #connected = false;
    #listeners = [];
    #target;
    constructor(params) {
        const { target, listeners, connected } = params;
        this.#target = target;
        this.#listeners = Object.entries(listeners);
        if (connected)
            this.connect();
    }
    connect() {
        if (this.#connected)
            return;
        this.#connected = true;
        for (let [name, listener] of this.#listeners) {
            this.#target.addEventListener(name, listener);
        }
    }
    disconnect() {
        if (!this.#connected)
            return;
        this.#connected = false;
        for (let [name, listener] of this.#listeners) {
            this.#target.removeEventListener(name, listener);
        }
    }
}

class Microtask {
    #queued = false;
    #callback;
    constructor(callback) {
        this.#callback = callback;
    }
    queue = this.#queue.bind(this);
    #queue() {
        if (this.#queued)
            return;
        this.#queued = true;
        window.queueMicrotask(this.#microtask);
    }
    #microtask = this.#unboundMicrotask.bind(this);
    #unboundMicrotask() {
        this.#queued = false;
        this.#callback();
    }
}

class QuerySelector {
    #queries = new Map();
    #queryAlls = new Map();
    #parentNode;
    constructor(parentNode) {
        this.#parentNode = parentNode;
    }
    querySelector(selector) {
        if (this.#queries.has(selector))
            return this.#queries.get(selector);
        let query = this.#parentNode.querySelector(selector) ?? undefined;
        this.#queries.set(selector, query);
        return query;
    }
    querySelectorAll(selector) {
        let results = this.#queryAlls.get(selector);
        if (results)
            return results;
        let query = Array.from(this.#parentNode.querySelectorAll(selector));
        this.#queryAlls.set(selector, query);
        return query;
    }
    deleteAll() {
        this.#queries = new Map();
        this.#queryAlls = new Map();
    }
}

const shadowRootInitFallback = {
    mode: "closed",
};
class Wc {
    #declarative = false;
    #internals;
    #shadowRoot;
    constructor(params) {
        let { adoptedStyleSheets, host, formState, formValue, shadowRootInit } = params;
        this.#internals = host.attachInternals();
        if (this.#internals.shadowRoot) {
            this.#declarative = true;
            this.#shadowRoot = this.#internals.shadowRoot;
        }
        else {
            this.#shadowRoot = host.attachShadow(shadowRootInit ?? shadowRootInitFallback);
        }
        this.adoptedStyleSheets = adoptedStyleSheets ?? [];
        if (formValue)
            this.setFormValue(formValue, formState);
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

export { Events, Microtask, QuerySelector, Wc };
