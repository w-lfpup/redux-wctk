import { Wc, Microtask } from "@w-lfpup/wctk";
import { datastore } from "../datastore/mod.js";

export class ShapeTable extends HTMLElement {
	#wc = new Wc({ host: this });

	#mc = new Microtask(this.#render.bind(this));

	#sub = datastore.subscribe(this.#mc.queue);

	#render() {
		let state = datastore.getState();

		for (let index = 0; index < this.children.length; index++) {
			let child = this.children[index];

			let slot = child.getAttribute("slot");
			if ("circle_count" === slot) child.textContent = state.circles.toString();
			if ("square_count" === slot) child.textContent = state.squares.toString();
			if ("total" === slot)
				child.textContent = state.shapeList.length.toString();
		}
	}
}
