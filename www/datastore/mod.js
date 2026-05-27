/*
  store.ts

  This module creates and exports a redux store. It uses
  one reducer to tally a list of circles and squares.

  This is a vanilla redux store. Redux does NOT need any
  modifications to work with web components or the WCTK.
*/
import { configureStore, createSlice } from "@reduxjs/toolkit";
// !!! EASY TO MISS !!! Load initial state!
import initialState from "../state.json" with { type: "json" };
function removeShape(shapeList, shape) {
    const index = shapeList.lastIndexOf(shape);
    if (index > -1) {
        shapeList.splice(index, 1);
    }
}
const shapeSlice = createSlice({
    name: "shapes",
    initialState: initialState,
    reducers: {
        reset: (state) => {
            console.log("resetting!");
            state.circles = 0;
            state.squares = 0;
            state.shapeList = [];
        },
        increment_squares: (state) => {
            console.log("incrementing!");
            state.squares += 1;
            state.shapeList.push("square");
        },
        decrement_squares: (state) => {
            console.log("decrementing squares!");
            state.squares = Math.max(0, state.squares - 1);
            removeShape(state.shapeList, "square");
        },
        increment_circles: (state) => {
            console.log("incrementing circles!");
            state.circles += 1;
            state.shapeList.push("circle");
        },
        decrement_circles: (state) => {
            console.log("decrementing circles!");
            state.circles = Math.max(0, state.circles - 1);
            removeShape(state.shapeList, "circle");
        },
    },
});
export const datastore = configureStore({
    reducer: shapeSlice.reducer,
});
// An event can dispatch state and is accessible via the document
// instead of a module. This is a good thing.
// declare global {
// 	interface GlobalEventHandlersEventMap {
// 		["#state"]: ReduxEvent<ShapeState>;
// 	}
// }
// let state = datastore.getState();
// // let prevState = datastore.getState();
// export class ReduxEvent<S = unknown> extends Event {
// 	// prevState: S;
// 	state: S;
// 	constructor(name: string, state: S, eventInitDict?: EventInit) {
// 		super(name, eventInitDict);
// 		this.state = state;
// 	}
// 	// constructor(name: string, prevState: S, state: S, eventInitDict?: EventInit) {
// 	// 	super(name, eventInitDict);
// 	// 	this.prevState = prevState;
// 	// 	this.state = state;
// 	// }
// }
// function dispatchState() {
// 	// prevState = state;
// 	state = datastore.getState();
// 	// document.dispatchEvent(new ReduxEvent<ShapeState>("#state", prevState, state));
// 	document.dispatchEvent(new ReduxEvent<ShapeState>("#redux", state));
// }
// datastore.subscribe(dispatchState);
// export { datastore }
