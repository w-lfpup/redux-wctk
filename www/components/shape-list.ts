import { Wc, Microtask } from "@w-lfpup/wctk";
import { datastore } from "../datastore/mod.js";

export class ShapeList extends HTMLElement {
	#wc = new Wc({ host: this });

	#mc = new Microtask(this.#render.bind(this));

	#sub = datastore.subscribe(this.#mc.queue);

	#render() {
		let state = datastore.getState();

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
