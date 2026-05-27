import { Wc, Events, Microtask, QuerySelector } from "@w-lfpup/wctk";
import { dispatch, getState, subscribe, unsubscribe } from "../datastore.js";

export class ShapeControls extends HTMLElement {
	#wc = new Wc({ host: this });

	#qc = new QuerySelector(this.#wc.shadowRoot);

	#mc = new Microtask(this.#render.bind(this));

	#ec = new Events({
		connected: true,
		target: this.#wc.shadowRoot,
		listeners: { click: this.#clickHandler.bind(this) },
	});

	// #sc = new Subscription({
	// 	host: this,
	// 	callback: this.#mc.queue,
	// 	connected: true,
	// 	subscribe,
	// 	unsubscribe,
	// });

	#render() {
		let state = getState();

		let { circles, squares } = state;

		let circleButton = this.#qc.querySelector(
			"[action='shapes/decrement_circles']",
		);
		circles
			? circleButton?.removeAttribute("disabled")
			: circleButton?.setAttribute("disabled", "");

		let squaresButton = this.#qc.querySelector(
			"[action='shapes/decrement_squares']",
		);
		squares
			? squaresButton?.removeAttribute("disabled")
			: squaresButton?.setAttribute("disabled", "");

		let resetButton = this.#qc.querySelector("[type=reset]");
		circles + squares
			? resetButton?.removeAttribute("disabled")
			: resetButton?.setAttribute("disabled", "");
	}

	#clickHandler(e: PointerEvent) {
		let { target } = e;
		if (target instanceof HTMLElement) {
			let type = target.getAttribute("action");
			if (type) dispatch({ type });
		}
	}
}
