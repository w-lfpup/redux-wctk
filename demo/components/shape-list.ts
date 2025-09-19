import { Wc, Microtask, Subscription } from "wctk";
import { getState, subscribe, unsubscribe } from "../datastore.js";

export class ShapeList extends HTMLElement {
    #wc = new Wc({ host: this });

    #mc = new Microtask({ host: this, callback: this.#render });

    #sc = new Subscription({
        host: this,
        callbacks: [this.#mc.queue],
        connected: true,
        subscribe,
        unsubscribe
    });

    #render() {
        let state = getState();

        let length = Math.min(state.shapeList.length, this.children.length);
        let children = Array.from(this.children);

        // remove nodes
        while (state.shapeList.length < children.length) {
            let child = children.pop();
            if (child) this.removeChild(child);
        }

        // update nodes
        for (let index = length; index < state.shapeList.length; index++) {
            let shape = state.shapeList[index];
            let listEl = document.createElement("li");
            listEl.setAttribute("shape", shape);
            this.appendChild(listEl);
        }

        // add nodes
        for (let index = length - 1; 0 < index; index--) {
            const shape = state.shapeList[index];
            const child = children[index];
            const shapeAttr = child.getAttribute("shape");

            if (shape !== shapeAttr) child.setAttribute("shape", shape);
        }
    }
}
