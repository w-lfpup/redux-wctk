# Redux-wctk

An SSR webapp [demo](https://w-lfpup.github.io/redux-wctk/www/) using declarative shadow dom
and centralized-state.

## Abstract

State management is implemented with [redux](https://redux.js.org)
and webcomponents are built using [wctk-js](https://github.com/w-lfpup/wctk-js/).

An initial response is delivered with:

- Web components via declarative shadow dom
- SSR / SSG styles and structure
- No flash of unstyled content
- No layout shifts

Afterwards:

- Webcomponent interactivity is lazy-loaded
- State-management is lazy-loaded
- Components subscribe to state updates

## License

Redux-wctk is released under the BSD-3 Clause License.
