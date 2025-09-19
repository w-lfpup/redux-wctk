import { Wc, Events, Microtask, Subscription, QuerySelector } from "wctk";
import { dispatch, getState, subscribe, unsubscribe } from "../datastore.js";

export class ShapeControls extends HTMLElement {
    #wc = new Wc({ host: this });

    #mc = new Microtask({ host: this, callback: this.#render });

    #ec = new Events({
        host: this,
        connected: true,
        target: this.#wc.shadowRoot,
        callbacks: [
            ["click", this.#clickHandler]
        ]
    });

    #sc = new Subscription({
        host: this,
        callbacks: [this.#mc.queue],
        connected: true,
        subscribe,
        unsubscribe
    });

    #qc = new QuerySelector({ parent: this.#wc.shadowRoot });

    #render() {
        let state = getState();

        let { circles, squares } = state;

        let circleButton = this.#qc.querySelector("[action='shapes/decrement_circles']");
        circles
            ? circleButton?.removeAttribute('disabled')
            : circleButton?.setAttribute('disabled', "");

        let squaresButton = this.#qc.querySelector("[action='shapes/decrement_squares']");
        squares
            ? squaresButton?.removeAttribute('disabled')
            : squaresButton?.setAttribute('disabled', "");

        let resetButton = this.#qc.querySelector("[type=reset]");
        (circles + squares)
            ? resetButton?.removeAttribute('disabled')
            : resetButton?.setAttribute('disabled', "");
    }

    #clickHandler(e: Event) {
        let { target } = e;
        if (target instanceof HTMLElement) {
            let type = target.getAttribute("action");
            if (type) dispatch({ type });
        }
    }
}
