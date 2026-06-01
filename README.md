# Redux-wctk

A working [demo](https://w-lfpup.github.io/redux-wctk/www/) of a server-side-rendered
webapp using declarative shadow dom and centralized-state.

## Abstract

State management is implemented with [redux](https://redux.js.org)
and webcomponents are built using [wctk-js](https://github.com/w-lfpup/wctk-js/).

An initial response is delivered with:

- Web components via declarative shadow dom
- SSR / SSG styles and structure
- No flash of unstyled content
- No layout shifts

Afterwards:

- Lazy-load webcomponent interactivity
- Lazy-load state-management
- Subscribe components to centralized state

## License

Redux-wctk is released under the BSD-3 Clause License.
