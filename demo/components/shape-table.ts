import { Wc, Microtask } from "@w-lfpup/wctk";
import { getState, subscribe, unsubscribe } from "../datastore.js";

export class ShapeTable extends HTMLElement {
	#wc = new Wc({ host: this });

	#mc = new Microtask(this.#render.bind(this));

	// #sc = new Subscription({
	// 	host: this,
	// 	callback: this.#mc.queue,
	// 	connected: true,
	// 	subscribe,
	// 	unsubscribe,
	// });

	#render() {
		let state = getState();

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
