import { Wc, Events, Microtask, QuerySelector } from "@w-lfpup/wctk";
import { datastore, actions } from "../datastore/mod.js";
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
        let circleButton = this.#qc.querySelector("[action='decrement_circles']");
        circles
            ? circleButton?.removeAttribute("disabled")
            : circleButton?.setAttribute("disabled", "");
        let squaresButton = this.#qc.querySelector("[action='decrement_squares']");
        squares
            ? squaresButton?.removeAttribute("disabled")
            : squaresButton?.setAttribute("disabled", "");
        let resetButton = this.#qc.querySelector("[type=reset]");
        circles + squares
            ? resetButton?.removeAttribute("disabled")
            : resetButton?.setAttribute("disabled", "");
    }
    #clickHandler(e) {
        let { target } = e;
        if (target instanceof HTMLElement) {
            let type = target.getAttribute("action");
            if ("increment_squares" === type)
                actions.increment_squares();
            // if (type) {
            // 	console.log("about to dispatch:", target, type);
            // 	datastore.dispatch({ type });
            // }
        }
    }
}
