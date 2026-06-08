import { Wc, Events, Microtask, QuerySelector } from "@w-lfpup/wctk";
import { datastore } from "../datastore/mod.js";
export class ShapeControls extends HTMLElement {
    #wc = new Wc({ host: this });
    #qc = new QuerySelector(this.#wc.shadowRoot);
    #mc = new Microtask(this.#render.bind(this));
    #ec = new Events({
        connected: true,
        target: this.#wc.shadowRoot,
        listeners: { click: this.#clickHandler.bind(this) },
    });
    #sub = datastore.subscribe(this.#mc.queue);
    #render() {
        let state = datastore.getState();
        let { circles, squares } = state;
        let circleButton = this.#qc.querySelector("[action='shapes/decrement_circles']");
        let squaresButton = this.#qc.querySelector("[action='shapes/decrement_squares']");
        let resetButton = this.#qc.querySelector("[type=reset]");
        circles
            ? circleButton?.removeAttribute("disabled")
            : circleButton?.setAttribute("disabled", "");
        squares
            ? squaresButton?.removeAttribute("disabled")
            : squaresButton?.setAttribute("disabled", "");
        circles + squares
            ? resetButton?.removeAttribute("disabled")
            : resetButton?.setAttribute("disabled", "");
    }
    #clickHandler(e) {
        let { target } = e;
        if (!(target instanceof HTMLElement))
            return;
        let type = target.getAttribute("action");
        if (type)
            datastore.dispatch({ type });
    }
}
