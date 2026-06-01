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
            state.circles = 0;
            state.squares = 0;
            state.shapeList = [];
        },
        increment_squares: (state) => {
            state.squares += 1;
            state.shapeList.push("square");
        },
        decrement_squares: (state) => {
            state.squares = Math.max(0, state.squares - 1);
            removeShape(state.shapeList, "square");
        },
        increment_circles: (state) => {
            state.circles += 1;
            state.shapeList.push("circle");
        },
        decrement_circles: (state) => {
            state.circles = Math.max(0, state.circles - 1);
            removeShape(state.shapeList, "circle");
        },
    },
});
export const datastore = configureStore({
    reducer: shapeSlice.reducer,
});
export const actions = shapeSlice.actions;
