// src/utils/formatProdErrorMessage.ts
function formatProdErrorMessage(code) {
  return `Minified Redux error #${code}; visit https://redux.js.org/Errors?code=${code} for the full message or use the non-minified dev environment for full errors. `;
}

// src/utils/symbol-observable.ts
var $$observable = /* @__PURE__ */ (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();
var symbol_observable_default = $$observable;

// src/utils/actionTypes.ts
var randomString = () => Math.random().toString(36).substring(7).split("").join(".");
var ActionTypes = {
  INIT: `@@redux/INIT${/* @__PURE__ */ randomString()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ randomString()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
};
var actionTypes_default = ActionTypes;

// src/utils/isPlainObject.ts
function isPlainObject$1(obj) {
  if (typeof obj !== "object" || obj === null)
    return false;
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto || Object.getPrototypeOf(obj) === null;
}

// src/utils/kindOf.ts
function miniKindOf(val) {
  if (val === void 0)
    return "undefined";
  if (val === null)
    return "null";
  const type = typeof val;
  switch (type) {
    case "boolean":
    case "string":
    case "number":
    case "symbol":
    case "function": {
      return type;
    }
  }
  if (Array.isArray(val))
    return "array";
  if (isDate(val))
    return "date";
  if (isError(val))
    return "error";
  const constructorName = ctorName(val);
  switch (constructorName) {
    case "Symbol":
    case "Promise":
    case "WeakMap":
    case "WeakSet":
    case "Map":
    case "Set":
      return constructorName;
  }
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase().replace(/\s/g, "");
}
function ctorName(val) {
  return typeof val.constructor === "function" ? val.constructor.name : null;
}
function isError(val) {
  return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
}
function isDate(val) {
  if (val instanceof Date)
    return true;
  return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
}
function kindOf(val) {
  let typeOfVal = typeof val;
  if (process.env.NODE_ENV !== "production") {
    typeOfVal = miniKindOf(val);
  }
  return typeOfVal;
}

// src/createStore.ts
function createStore(reducer, preloadedState, enhancer) {
  if (typeof reducer !== "function") {
    throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(2) : `Expected the root reducer to be a function. Instead, received: '${kindOf(reducer)}'`);
  }
  if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(0) : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
  }
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(1) : `Expected the enhancer to be a function. Instead, received: '${kindOf(enhancer)}'`);
    }
    return enhancer(createStore)(reducer, preloadedState);
  }
  let currentReducer = reducer;
  let currentState = preloadedState;
  let currentListeners = /* @__PURE__ */ new Map();
  let nextListeners = currentListeners;
  let listenerIdCounter = 0;
  let isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = /* @__PURE__ */ new Map();
      currentListeners.forEach((listener, key) => {
        nextListeners.set(key, listener);
      });
    }
  }
  function getState() {
    if (isDispatching) {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(3) : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
    }
    return currentState;
  }
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(4) : `Expected the listener to be a function. Instead, received: '${kindOf(listener)}'`);
    }
    if (isDispatching) {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(5) : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
    }
    let isSubscribed = true;
    ensureCanMutateNextListeners();
    const listenerId = listenerIdCounter++;
    nextListeners.set(listenerId, listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(6) : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      nextListeners.delete(listenerId);
      currentListeners = null;
    };
  }
  function dispatch(action) {
    if (!isPlainObject$1(action)) {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(7) : `Actions must be plain objects. Instead, the actual type was: '${kindOf(action)}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`);
    }
    if (typeof action.type === "undefined") {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
    }
    if (typeof action.type !== "string") {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(17) : `Action "type" property must be a string. Instead, the actual type was: '${kindOf(action.type)}'. Value was: '${action.type}' (stringified)`);
    }
    if (isDispatching) {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(9) : "Reducers may not dispatch actions.");
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    const listeners = currentListeners = nextListeners;
    listeners.forEach((listener) => {
      listener();
    });
    return action;
  }
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(10) : `Expected the nextReducer to be a function. Instead, received: '${kindOf(nextReducer)}`);
    }
    currentReducer = nextReducer;
    dispatch({
      type: actionTypes_default.REPLACE
    });
  }
  function observable() {
    const outerSubscribe = subscribe;
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(11) : `Expected the observer to be an object. Instead, received: '${kindOf(observer)}'`);
        }
        function observeState() {
          const observerAsObserver = observer;
          if (observerAsObserver.next) {
            observerAsObserver.next(getState());
          }
        }
        observeState();
        const unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe
        };
      },
      [symbol_observable_default]() {
        return this;
      }
    };
  }
  dispatch({
    type: actionTypes_default.INIT
  });
  const store = {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [symbol_observable_default]: observable
  };
  return store;
}
function legacy_createStore(reducer, preloadedState, enhancer) {
  return createStore(reducer, preloadedState, enhancer);
}

// src/utils/warning.ts
function warning(message) {
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error(message);
  }
  try {
    throw new Error(message);
  } catch (e) {
  }
}

// src/combineReducers.ts
function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  const reducerKeys = Object.keys(reducers);
  const argumentName = action && action.type === actionTypes_default.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
  if (reducerKeys.length === 0) {
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  }
  if (!isPlainObject$1(inputState)) {
    return `The ${argumentName} has unexpected type of "${kindOf(inputState)}". Expected argument to be an object with the following keys: "${reducerKeys.join('", "')}"`;
  }
  const unexpectedKeys = Object.keys(inputState).filter((key) => !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key]);
  unexpectedKeys.forEach((key) => {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === actionTypes_default.REPLACE)
    return;
  if (unexpectedKeys.length > 0) {
    return `Unexpected ${unexpectedKeys.length > 1 ? "keys" : "key"} "${unexpectedKeys.join('", "')}" found in ${argumentName}. Expected to find one of the known reducer keys instead: "${reducerKeys.join('", "')}". Unexpected keys will be ignored.`;
  }
}
function assertReducerShape(reducers) {
  Object.keys(reducers).forEach((key) => {
    const reducer = reducers[key];
    const initialState = reducer(void 0, {
      type: actionTypes_default.INIT
    });
    if (typeof initialState === "undefined") {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(12) : `The slice reducer for key "${key}" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`);
    }
    if (typeof reducer(void 0, {
      type: actionTypes_default.PROBE_UNKNOWN_ACTION()
    }) === "undefined") {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(13) : `The slice reducer for key "${key}" returned undefined when probed with a random type. Don't try to handle '${actionTypes_default.INIT}' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.`);
    }
  });
}
function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (process.env.NODE_ENV !== "production") {
      if (typeof reducers[key] === "undefined") {
        warning(`No reducer provided for key "${key}"`);
      }
    }
    if (typeof reducers[key] === "function") {
      finalReducers[key] = reducers[key];
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);
  let unexpectedKeyCache;
  if (process.env.NODE_ENV !== "production") {
    unexpectedKeyCache = {};
  }
  let shapeAssertionError;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }
  return function combination(state = {}, action) {
    if (shapeAssertionError) {
      throw shapeAssertionError;
    }
    if (process.env.NODE_ENV !== "production") {
      const warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        warning(warningMessage);
      }
    }
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === "undefined") {
        const actionType = action && action.type;
        throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(14) : `When called with an action of type ${actionType ? `"${String(actionType)}"` : "(unknown type)"}, the slice reducer for key "${key}" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.`);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}

// src/bindActionCreators.ts
function bindActionCreator(actionCreator, dispatch) {
  return function(...args) {
    return dispatch(actionCreator.apply(this, args));
  };
}
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch);
  }
  if (typeof actionCreators !== "object" || actionCreators === null) {
    throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(16) : `bindActionCreators expected an object or a function, but instead received: '${kindOf(actionCreators)}'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`);
  }
  const boundActionCreators = {};
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

// src/compose.ts
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

// src/applyMiddleware.ts
function applyMiddleware(...middlewares) {
  return (createStore2) => (reducer, preloadedState) => {
    const store = createStore2(reducer, preloadedState);
    let dispatch = () => {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(15) : "Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.");
    };
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    };
    const chain = middlewares.map((middleware) => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);
    return {
      ...store,
      dispatch
    };
  };
}

// src/utils/isAction.ts
function isAction(action) {
  return isPlainObject$1(action) && "type" in action && typeof action.type === "string";
}

// src/utils/env.ts
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");

// src/utils/errors.ts
var errors = process.env.NODE_ENV !== "production" ? [
  // All error codes, starting by 0:
  function(plugin) {
    return `The plugin for '${plugin}' has not been loaded into Immer. To enable the plugin, import and call \`enable${plugin}()\` when initializing your application.`;
  },
  function(thing) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${thing}'`;
  },
  "This object has been frozen and should not be mutated",
  function(data) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + data;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(thing) {
    return `'current' expects a draft, got: ${thing}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(thing) {
    return `'original' expects a draft, got: ${thing}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function die(error, ...args) {
  if (process.env.NODE_ENV !== "production") {
    const e = errors[error];
    const msg = isFunction(e) ? e.apply(null, args) : e;
    throw new Error(`[Immer] ${msg}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
  );
}

// src/utils/common.ts
var O$1 = Object;
var getPrototypeOf = O$1.getPrototypeOf;
var CONSTRUCTOR = "constructor";
var PROTOTYPE = "prototype";
var CONFIGURABLE = "configurable";
var ENUMERABLE = "enumerable";
var WRITABLE = "writable";
var VALUE = "value";
var isDraft = (value) => !!value && !!value[DRAFT_STATE];
function isDraftable(value) {
  if (!value)
    return false;
  return isPlainObject(value) || isArray(value) || !!value[DRAFTABLE] || !!value[CONSTRUCTOR]?.[DRAFTABLE] || isMap(value) || isSet(value);
}
var objectCtorString = O$1[PROTOTYPE][CONSTRUCTOR].toString();
var cachedCtorStrings = /* @__PURE__ */ new WeakMap();
function isPlainObject(value) {
  if (!value || !isObjectish(value))
    return false;
  const proto = getPrototypeOf(value);
  if (proto === null || proto === O$1[PROTOTYPE])
    return true;
  const Ctor = O$1.hasOwnProperty.call(proto, CONSTRUCTOR) && proto[CONSTRUCTOR];
  if (Ctor === Object)
    return true;
  if (!isFunction(Ctor))
    return false;
  let ctorString = cachedCtorStrings.get(Ctor);
  if (ctorString === void 0) {
    ctorString = Function.toString.call(Ctor);
    cachedCtorStrings.set(Ctor, ctorString);
  }
  return ctorString === objectCtorString;
}
function original(value) {
  if (!isDraft(value))
    die(15, value);
  return value[DRAFT_STATE].base_;
}
function each(obj, iter, strict = true) {
  if (getArchtype(obj) === 0 /* Object */) {
    const keys = strict ? Reflect.ownKeys(obj) : O$1.keys(obj);
    keys.forEach((key) => {
      iter(key, obj[key], obj);
    });
  } else {
    obj.forEach((entry, index) => iter(index, entry, obj));
  }
}
function getArchtype(thing) {
  const state = thing[DRAFT_STATE];
  return state ? state.type_ : isArray(thing) ? 1 /* Array */ : isMap(thing) ? 2 /* Map */ : isSet(thing) ? 3 /* Set */ : 0 /* Object */;
}
var has = (thing, prop, type = getArchtype(thing)) => type === 2 /* Map */ ? thing.has(prop) : O$1[PROTOTYPE].hasOwnProperty.call(thing, prop);
var get = (thing, prop, type = getArchtype(thing)) => (
  // @ts-ignore
  type === 2 /* Map */ ? thing.get(prop) : thing[prop]
);
var set = (thing, propOrOldValue, value, type = getArchtype(thing)) => {
  if (type === 2 /* Map */)
    thing.set(propOrOldValue, value);
  else if (type === 3 /* Set */) {
    thing.add(value);
  } else
    thing[propOrOldValue] = value;
};
function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
var isArray = Array.isArray;
var isMap = (target) => target instanceof Map;
var isSet = (target) => target instanceof Set;
var isObjectish = (target) => typeof target === "object";
var isFunction = (target) => typeof target === "function";
var isBoolean = (target) => typeof target === "boolean";
function isArrayIndex(value) {
  const n = +value;
  return Number.isInteger(n) && String(n) === value;
}
var latest = (state) => state.copy_ || state.base_;
var getFinalValue = (state) => state.modified_ ? state.copy_ : state.base_;
function shallowCopy(base, strict) {
  if (isMap(base)) {
    return new Map(base);
  }
  if (isSet(base)) {
    return new Set(base);
  }
  if (isArray(base))
    return Array[PROTOTYPE].slice.call(base);
  const isPlain = isPlainObject(base);
  if (strict === true || strict === "class_only" && !isPlain) {
    const descriptors = O$1.getOwnPropertyDescriptors(base);
    delete descriptors[DRAFT_STATE];
    let keys = Reflect.ownKeys(descriptors);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const desc = descriptors[key];
      if (desc[WRITABLE] === false) {
        desc[WRITABLE] = true;
        desc[CONFIGURABLE] = true;
      }
      if (desc.get || desc.set)
        descriptors[key] = {
          [CONFIGURABLE]: true,
          [WRITABLE]: true,
          // could live with !!desc.set as well here...
          [ENUMERABLE]: desc[ENUMERABLE],
          [VALUE]: base[key]
        };
    }
    return O$1.create(getPrototypeOf(base), descriptors);
  } else {
    const proto = getPrototypeOf(base);
    if (proto !== null && isPlain) {
      return { ...base };
    }
    const obj = O$1.create(proto);
    return O$1.assign(obj, base);
  }
}
function freeze(obj, deep = false) {
  if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
    return obj;
  if (getArchtype(obj) > 1) {
    O$1.defineProperties(obj, {
      set: dontMutateMethodOverride,
      add: dontMutateMethodOverride,
      clear: dontMutateMethodOverride,
      delete: dontMutateMethodOverride
    });
  }
  O$1.freeze(obj);
  if (deep)
    each(
      obj,
      (_key, value) => {
        freeze(value, true);
      },
      false
    );
  return obj;
}
function dontMutateFrozenCollections() {
  die(2);
}
var dontMutateMethodOverride = {
  [VALUE]: dontMutateFrozenCollections
};
function isFrozen(obj) {
  if (obj === null || !isObjectish(obj))
    return true;
  return O$1.isFrozen(obj);
}

// src/utils/plugins.ts
var PluginMapSet = "MapSet";
var PluginPatches = "Patches";
var PluginArrayMethods = "ArrayMethods";
var plugins = {};
function getPlugin(pluginKey) {
  const plugin = plugins[pluginKey];
  if (!plugin) {
    die(0, pluginKey);
  }
  return plugin;
}
var isPluginLoaded = (pluginKey) => !!plugins[pluginKey];

// src/core/scope.ts
var currentScope;
var getCurrentScope = () => currentScope;
var createScope = (parent_, immer_) => ({
  drafts_: [],
  parent_,
  immer_,
  // Whenever the modified draft contains a draft from another scope, we
  // need to prevent auto-freezing so the unowned draft can be finalized.
  canAutoFreeze_: true,
  unfinalizedDrafts_: 0,
  handledSet_: /* @__PURE__ */ new Set(),
  processedForPatches_: /* @__PURE__ */ new Set(),
  mapSetPlugin_: isPluginLoaded(PluginMapSet) ? getPlugin(PluginMapSet) : void 0,
  arrayMethodsPlugin_: isPluginLoaded(PluginArrayMethods) ? getPlugin(PluginArrayMethods) : void 0
});
function usePatchesInScope(scope, patchListener) {
  if (patchListener) {
    scope.patchPlugin_ = getPlugin(PluginPatches);
    scope.patches_ = [];
    scope.inversePatches_ = [];
    scope.patchListener_ = patchListener;
  }
}
function revokeScope(scope) {
  leaveScope(scope);
  scope.drafts_.forEach(revokeDraft);
  scope.drafts_ = null;
}
function leaveScope(scope) {
  if (scope === currentScope) {
    currentScope = scope.parent_;
  }
}
var enterScope = (immer2) => currentScope = createScope(currentScope, immer2);
function revokeDraft(draft) {
  const state = draft[DRAFT_STATE];
  if (state.type_ === 0 /* Object */ || state.type_ === 1 /* Array */)
    state.revoke_();
  else
    state.revoked_ = true;
}

// src/core/finalize.ts
function processResult(result, scope) {
  scope.unfinalizedDrafts_ = scope.drafts_.length;
  const baseDraft = scope.drafts_[0];
  const isReplaced = result !== void 0 && result !== baseDraft;
  if (isReplaced) {
    if (baseDraft[DRAFT_STATE].modified_) {
      revokeScope(scope);
      die(4);
    }
    if (isDraftable(result)) {
      result = finalize(scope, result);
    }
    const { patchPlugin_ } = scope;
    if (patchPlugin_) {
      patchPlugin_.generateReplacementPatches_(
        baseDraft[DRAFT_STATE].base_,
        result,
        scope
      );
    }
  } else {
    result = finalize(scope, baseDraft);
  }
  maybeFreeze(scope, result, true);
  revokeScope(scope);
  if (scope.patches_) {
    scope.patchListener_(scope.patches_, scope.inversePatches_);
  }
  return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value) {
  if (isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  if (!state) {
    const finalValue = handleValue(value, rootScope.handledSet_, rootScope);
    return finalValue;
  }
  if (!isSameScope(state, rootScope)) {
    return value;
  }
  if (!state.modified_) {
    return state.base_;
  }
  if (!state.finalized_) {
    const { callbacks_ } = state;
    if (callbacks_) {
      while (callbacks_.length > 0) {
        const callback = callbacks_.pop();
        callback(rootScope);
      }
    }
    generatePatchesAndFinalize(state, rootScope);
  }
  return state.copy_;
}
function maybeFreeze(scope, value, deep = false) {
  if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
    freeze(value, deep);
  }
}
function markStateFinalized(state) {
  state.finalized_ = true;
  state.scope_.unfinalizedDrafts_--;
}
var isSameScope = (state, rootScope) => state.scope_ === rootScope;
var EMPTY_LOCATIONS_RESULT = [];
function updateDraftInParent(parent, draftValue, finalizedValue, originalKey) {
  const parentCopy = latest(parent);
  const parentType = parent.type_;
  if (originalKey !== void 0) {
    const currentValue = get(parentCopy, originalKey, parentType);
    if (currentValue === draftValue) {
      set(parentCopy, originalKey, finalizedValue, parentType);
      return;
    }
  }
  if (!parent.draftLocations_) {
    const draftLocations = parent.draftLocations_ = /* @__PURE__ */ new Map();
    each(parentCopy, (key, value) => {
      if (isDraft(value)) {
        const keys = draftLocations.get(value) || [];
        keys.push(key);
        draftLocations.set(value, keys);
      }
    });
  }
  const locations = parent.draftLocations_.get(draftValue) ?? EMPTY_LOCATIONS_RESULT;
  for (const location of locations) {
    set(parentCopy, location, finalizedValue, parentType);
  }
}
function registerChildFinalizationCallback(parent, child, key) {
  parent.callbacks_.push(function childCleanup(rootScope) {
    const state = child;
    if (!state || !isSameScope(state, rootScope)) {
      return;
    }
    rootScope.mapSetPlugin_?.fixSetContents(state);
    const finalizedValue = getFinalValue(state);
    updateDraftInParent(parent, state.draft_ ?? state, finalizedValue, key);
    generatePatchesAndFinalize(state, rootScope);
  });
}
function generatePatchesAndFinalize(state, rootScope) {
  const shouldFinalize = state.modified_ && !state.finalized_ && (state.type_ === 3 /* Set */ || state.type_ === 1 /* Array */ && state.allIndicesReassigned_ || (state.assigned_?.size ?? 0) > 0);
  if (shouldFinalize) {
    const { patchPlugin_ } = rootScope;
    if (patchPlugin_) {
      const basePath = patchPlugin_.getPath(state);
      if (basePath) {
        patchPlugin_.generatePatches_(state, basePath, rootScope);
      }
    }
    markStateFinalized(state);
  }
}
function handleCrossReference(target, key, value) {
  const { scope_ } = target;
  if (isDraft(value)) {
    const state = value[DRAFT_STATE];
    if (isSameScope(state, scope_)) {
      state.callbacks_.push(function crossReferenceCleanup() {
        prepareCopy(target);
        const finalizedValue = getFinalValue(state);
        updateDraftInParent(target, value, finalizedValue, key);
      });
    }
  } else if (isDraftable(value)) {
    target.callbacks_.push(function nestedDraftCleanup() {
      const targetCopy = latest(target);
      if (target.type_ === 3 /* Set */) {
        if (targetCopy.has(value)) {
          handleValue(value, scope_.handledSet_, scope_);
        }
      } else {
        if (get(targetCopy, key, target.type_) === value) {
          if (scope_.drafts_.length > 1 && (target.assigned_.get(key) ?? false) === true && target.copy_) {
            handleValue(
              get(target.copy_, key, target.type_),
              scope_.handledSet_,
              scope_
            );
          }
        }
      }
    });
  }
}
function handleValue(target, handledSet, rootScope) {
  if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
    return target;
  }
  if (isDraft(target) || handledSet.has(target) || !isDraftable(target) || isFrozen(target)) {
    return target;
  }
  handledSet.add(target);
  each(target, (key, value) => {
    if (isDraft(value)) {
      const state = value[DRAFT_STATE];
      if (isSameScope(state, rootScope)) {
        const updatedValue = getFinalValue(state);
        set(target, key, updatedValue, target.type_);
        markStateFinalized(state);
      }
    } else if (isDraftable(value)) {
      handleValue(value, handledSet, rootScope);
    }
  });
  return target;
}

// src/core/proxy.ts
function createProxyProxy(base, parent) {
  const baseIsArray = isArray(base);
  const state = {
    type_: baseIsArray ? 1 /* Array */ : 0 /* Object */,
    // Track which produce call this is associated with.
    scope_: parent ? parent.scope_ : getCurrentScope(),
    // True for both shallow and deep changes.
    modified_: false,
    // Used during finalization.
    finalized_: false,
    // Track which properties have been assigned (true) or deleted (false).
    // actually instantiated in `prepareCopy()`
    assigned_: void 0,
    // The parent draft state.
    parent_: parent,
    // The base state.
    base_: base,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: false,
    // `callbacks` actually gets assigned in `createProxy`
    callbacks_: void 0
  };
  let target = state;
  let traps = objectTraps;
  if (baseIsArray) {
    target = [state];
    traps = arrayTraps;
  }
  const { revoke, proxy } = Proxy.revocable(target, traps);
  state.draft_ = proxy;
  state.revoke_ = revoke;
  return [proxy, state];
}
var objectTraps = {
  get(state, prop) {
    if (prop === DRAFT_STATE)
      return state;
    let arrayPlugin = state.scope_.arrayMethodsPlugin_;
    const isArrayWithStringProp = state.type_ === 1 /* Array */ && typeof prop === "string";
    if (isArrayWithStringProp) {
      if (arrayPlugin?.isArrayOperationMethod(prop)) {
        return arrayPlugin.createMethodInterceptor(state, prop);
      }
    }
    const source = latest(state);
    if (!has(source, prop, state.type_)) {
      return readPropFromProto(state, source, prop);
    }
    const value = source[prop];
    if (state.finalized_ || !isDraftable(value)) {
      return value;
    }
    if (isArrayWithStringProp && state.operationMethod && arrayPlugin?.isMutatingArrayMethod(
      state.operationMethod
    ) && isArrayIndex(prop)) {
      return value;
    }
    if (value === peek(state.base_, prop)) {
      prepareCopy(state);
      const childKey = state.type_ === 1 /* Array */ ? +prop : prop;
      const childDraft = createProxy(state.scope_, value, state, childKey);
      return state.copy_[childKey] = childDraft;
    }
    return value;
  },
  has(state, prop) {
    return prop in latest(state);
  },
  ownKeys(state) {
    return Reflect.ownKeys(latest(state));
  },
  set(state, prop, value) {
    const desc = getDescriptorFromProto(latest(state), prop);
    if (desc?.set) {
      desc.set.call(state.draft_, value);
      return true;
    }
    if (!state.modified_) {
      const current2 = peek(latest(state), prop);
      const currentState = current2?.[DRAFT_STATE];
      if (currentState && currentState.base_ === value) {
        state.copy_[prop] = value;
        state.assigned_.set(prop, false);
        return true;
      }
      if (is(value, current2) && (value !== void 0 || has(state.base_, prop, state.type_)))
        return true;
      prepareCopy(state);
      markChanged(state);
    }
    if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
    (value !== void 0 || prop in state.copy_) || // special case: NaN
    Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
      return true;
    state.copy_[prop] = value;
    state.assigned_.set(prop, true);
    handleCrossReference(state, prop, value);
    return true;
  },
  deleteProperty(state, prop) {
    prepareCopy(state);
    if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
      state.assigned_.set(prop, false);
      markChanged(state);
    } else {
      state.assigned_.delete(prop);
    }
    if (state.copy_) {
      delete state.copy_[prop];
    }
    return true;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(state, prop) {
    const owner = latest(state);
    const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (!desc)
      return desc;
    return {
      [WRITABLE]: true,
      [CONFIGURABLE]: state.type_ !== 1 /* Array */ || prop !== "length",
      [ENUMERABLE]: desc[ENUMERABLE],
      [VALUE]: owner[prop]
    };
  },
  defineProperty() {
    die(11);
  },
  getPrototypeOf(state) {
    return getPrototypeOf(state.base_);
  },
  setPrototypeOf() {
    die(12);
  }
};
var arrayTraps = {};
for (let key in objectTraps) {
  let fn = objectTraps[key];
  arrayTraps[key] = function() {
    const args = arguments;
    args[0] = args[0][0];
    return fn.apply(this, args);
  };
}
arrayTraps.deleteProperty = function(state, prop) {
  if (process.env.NODE_ENV !== "production" && isNaN(parseInt(prop)))
    die(13);
  return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
  if (process.env.NODE_ENV !== "production" && prop !== "length" && isNaN(parseInt(prop)))
    die(14);
  return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop];
}
function readPropFromProto(state, source, prop) {
  const desc = getDescriptorFromProto(source, prop);
  return desc ? VALUE in desc ? desc[VALUE] : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    desc.get?.call(state.draft_)
  ) : void 0;
}
function getDescriptorFromProto(source, prop) {
  if (!(prop in source))
    return void 0;
  let proto = getPrototypeOf(source);
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc)
      return desc;
    proto = getPrototypeOf(proto);
  }
  return void 0;
}
function markChanged(state) {
  if (!state.modified_) {
    state.modified_ = true;
    if (state.parent_) {
      markChanged(state.parent_);
    }
  }
}
function prepareCopy(state) {
  if (!state.copy_) {
    state.assigned_ = /* @__PURE__ */ new Map();
    state.copy_ = shallowCopy(
      state.base_,
      state.scope_.immer_.useStrictShallowCopy_
    );
  }
}

// src/core/immerClass.ts
var Immer2 = class {
  constructor(config) {
    this.autoFreeze_ = true;
    this.useStrictShallowCopy_ = false;
    this.useStrictIteration_ = false;
    /**
     * The `produce` function takes a value and a "recipe function" (whose
     * return value often depends on the base state). The recipe function is
     * free to mutate its first argument however it wants. All mutations are
     * only ever applied to a __copy__ of the base state.
     *
     * Pass only a function to create a "curried producer" which relieves you
     * from passing the recipe function every time.
     *
     * Only plain objects and arrays are made mutable. All other objects are
     * considered uncopyable.
     *
     * Note: This function is __bound__ to its `Immer` instance.
     *
     * @param {any} base - the initial state
     * @param {Function} recipe - function that receives a proxy of the base state as first argument and which can be freely modified
     * @param {Function} patchListener - optional function that will be called with all the patches produced here
     * @returns {any} a new state, or the initial state if nothing was modified
     */
    this.produce = (base, recipe, patchListener) => {
      if (isFunction(base) && !isFunction(recipe)) {
        const defaultBase = recipe;
        recipe = base;
        const self = this;
        return function curriedProduce(base2 = defaultBase, ...args) {
          return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
        };
      }
      if (!isFunction(recipe))
        die(6);
      if (patchListener !== void 0 && !isFunction(patchListener))
        die(7);
      let result;
      if (isDraftable(base)) {
        const scope = enterScope(this);
        const proxy = createProxy(scope, base, void 0);
        let hasError = true;
        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          if (hasError)
            revokeScope(scope);
          else
            leaveScope(scope);
        }
        usePatchesInScope(scope, patchListener);
        return processResult(result, scope);
      } else if (!base || !isObjectish(base)) {
        result = recipe(base);
        if (result === void 0)
          result = base;
        if (result === NOTHING)
          result = void 0;
        if (this.autoFreeze_)
          freeze(result, true);
        if (patchListener) {
          const p = [];
          const ip = [];
          getPlugin(PluginPatches).generateReplacementPatches_(base, result, {
            patches_: p,
            inversePatches_: ip
          });
          patchListener(p, ip);
        }
        return result;
      } else
        die(1, base);
    };
    this.produceWithPatches = (base, recipe) => {
      if (isFunction(base)) {
        return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
      }
      let patches, inversePatches;
      const result = this.produce(base, recipe, (p, ip) => {
        patches = p;
        inversePatches = ip;
      });
      return [result, patches, inversePatches];
    };
    if (isBoolean(config?.autoFreeze))
      this.setAutoFreeze(config.autoFreeze);
    if (isBoolean(config?.useStrictShallowCopy))
      this.setUseStrictShallowCopy(config.useStrictShallowCopy);
    if (isBoolean(config?.useStrictIteration))
      this.setUseStrictIteration(config.useStrictIteration);
  }
  createDraft(base) {
    if (!isDraftable(base))
      die(8);
    if (isDraft(base))
      base = current(base);
    const scope = enterScope(this);
    const proxy = createProxy(scope, base, void 0);
    proxy[DRAFT_STATE].isManual_ = true;
    leaveScope(scope);
    return proxy;
  }
  finishDraft(draft, patchListener) {
    const state = draft && draft[DRAFT_STATE];
    if (!state || !state.isManual_)
      die(9);
    const { scope_: scope } = state;
    usePatchesInScope(scope, patchListener);
    return processResult(void 0, scope);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(value) {
    this.autoFreeze_ = value;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(value) {
    this.useStrictShallowCopy_ = value;
  }
  /**
   * Pass false to use faster iteration that skips non-enumerable properties
   * but still handles symbols for compatibility.
   *
   * By default, strict iteration is enabled (includes all own properties).
   */
  setUseStrictIteration(value) {
    this.useStrictIteration_ = value;
  }
  shouldUseStrictIteration() {
    return this.useStrictIteration_;
  }
  applyPatches(base, patches) {
    let i;
    for (i = patches.length - 1; i >= 0; i--) {
      const patch = patches[i];
      if (patch.path.length === 0 && patch.op === "replace") {
        base = patch.value;
        break;
      }
    }
    if (i > -1) {
      patches = patches.slice(i + 1);
    }
    const applyPatchesImpl = getPlugin(PluginPatches).applyPatches_;
    if (isDraft(base)) {
      return applyPatchesImpl(base, patches);
    }
    return this.produce(
      base,
      (draft) => applyPatchesImpl(draft, patches)
    );
  }
};
function createProxy(rootScope, value, parent, key) {
  const [draft, state] = isMap(value) ? getPlugin(PluginMapSet).proxyMap_(value, parent) : isSet(value) ? getPlugin(PluginMapSet).proxySet_(value, parent) : createProxyProxy(value, parent);
  const scope = parent?.scope_ ?? getCurrentScope();
  scope.drafts_.push(draft);
  state.callbacks_ = parent?.callbacks_ ?? [];
  state.key_ = key;
  if (parent && key !== void 0) {
    registerChildFinalizationCallback(parent, state, key);
  } else {
    state.callbacks_.push(function rootDraftCleanup(rootScope2) {
      rootScope2.mapSetPlugin_?.fixSetContents(state);
      const { patchPlugin_ } = rootScope2;
      if (state.modified_ && patchPlugin_) {
        patchPlugin_.generatePatches_(state, [], rootScope2);
      }
    });
  }
  return draft;
}

// src/core/current.ts
function current(value) {
  if (!isDraft(value))
    die(10, value);
  return currentImpl(value);
}
function currentImpl(value) {
  if (!isDraftable(value) || isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  let copy;
  let strict = true;
  if (state) {
    if (!state.modified_)
      return state.base_;
    state.finalized_ = true;
    copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
    strict = state.scope_.immer_.shouldUseStrictIteration();
  } else {
    copy = shallowCopy(value, true);
  }
  each(
    copy,
    (key, childValue) => {
      set(copy, key, currentImpl(childValue));
    },
    strict
  );
  if (state) {
    state.finalized_ = false;
  }
  return copy;
}

// src/immer.ts
var immer = new Immer2();
var produce = immer.produce;

// src/devModeChecks/identityFunctionCheck.ts
var runIdentityFunctionCheck = (resultFunc, inputSelectorsResults, outputSelectorResult) => {
  if (inputSelectorsResults.length === 1 && inputSelectorsResults[0] === outputSelectorResult) {
    let isInputSameAsOutput = false;
    try {
      const emptyObject = {};
      if (resultFunc(emptyObject) === emptyObject) isInputSameAsOutput = true;
    } catch {
    }
    if (isInputSameAsOutput) {
      let stack = void 0;
      try {
        throw new Error();
      } catch (e) {
        ({ stack } = e);
      }
      console.warn(
        "The result function returned its own inputs without modification. e.g\n`createSelector([state => state.todos], todos => todos)`\nThis could lead to inefficient memoization and unnecessary re-renders.\nEnsure transformation logic is in the result function, and extraction logic is in the input selectors.",
        { stack }
      );
    }
  }
};

// src/devModeChecks/inputStabilityCheck.ts
var runInputStabilityCheck = (inputSelectorResultsObject, options, inputSelectorArgs) => {
  const { memoize, memoizeOptions } = options;
  const { inputSelectorResults, inputSelectorResultsCopy } = inputSelectorResultsObject;
  const createAnEmptyObject = memoize(() => ({}), ...memoizeOptions);
  const areInputSelectorResultsEqual = createAnEmptyObject.apply(null, inputSelectorResults) === createAnEmptyObject.apply(null, inputSelectorResultsCopy);
  if (!areInputSelectorResultsEqual) {
    let stack = void 0;
    try {
      throw new Error();
    } catch (e) {
      ({ stack } = e);
    }
    console.warn(
      "An input selector returned a different result when passed same arguments.\nThis means your output selector will likely run more frequently than intended.\nAvoid returning a new reference inside your input selector, e.g.\n`createSelector([state => state.todos.map(todo => todo.id)], todoIds => todoIds.length)`",
      {
        arguments: inputSelectorArgs,
        firstInputs: inputSelectorResults,
        secondInputs: inputSelectorResultsCopy,
        stack
      }
    );
  }
};

// src/devModeChecks/setGlobalDevModeChecks.ts
var globalDevModeChecks = {
  inputStabilityCheck: "once",
  identityFunctionCheck: "once"
};

// src/utils.ts
var NOT_FOUND = /* @__PURE__ */ Symbol("NOT_FOUND");
function assertIsFunction(func, errorMessage = `expected a function, instead received ${typeof func}`) {
  if (typeof func !== "function") {
    throw new TypeError(errorMessage);
  }
}
function assertIsArrayOfFunctions(array, errorMessage = `expected all items to be functions, instead received the following types: `) {
  if (!array.every((item) => typeof item === "function")) {
    const itemTypes = array.map(
      (item) => typeof item === "function" ? `function ${item.name || "unnamed"}()` : typeof item
    ).join(", ");
    throw new TypeError(`${errorMessage}[${itemTypes}]`);
  }
}
var ensureIsArray = (item) => {
  return Array.isArray(item) ? item : [item];
};
function getDependencies(createSelectorArgs) {
  const dependencies = Array.isArray(createSelectorArgs[0]) ? createSelectorArgs[0] : createSelectorArgs;
  assertIsArrayOfFunctions(
    dependencies,
    `createSelector expects all input-selectors to be functions, but received the following types: `
  );
  return dependencies;
}
function collectInputSelectorResults(dependencies, inputSelectorArgs) {
  const inputSelectorResults = [];
  const { length } = dependencies;
  for (let i = 0; i < length; i++) {
    inputSelectorResults.push(dependencies[i].apply(null, inputSelectorArgs));
  }
  return inputSelectorResults;
}
var getDevModeChecksExecutionInfo = (firstRun, devModeChecks) => {
  const { identityFunctionCheck, inputStabilityCheck } = {
    ...globalDevModeChecks,
    ...devModeChecks
  };
  return {
    identityFunctionCheck: {
      shouldRun: identityFunctionCheck === "always" || identityFunctionCheck === "once" && firstRun,
      run: runIdentityFunctionCheck
    },
    inputStabilityCheck: {
      shouldRun: inputStabilityCheck === "always" || inputStabilityCheck === "once" && firstRun,
      run: runInputStabilityCheck
    }
  };
};

// src/lruMemoize.ts
function createSingletonCache(equals) {
  let entry;
  return {
    get(key) {
      if (entry && equals(entry.key, key)) {
        return entry.value;
      }
      return NOT_FOUND;
    },
    put(key, value) {
      entry = { key, value };
    },
    getEntries() {
      return entry ? [entry] : [];
    },
    clear() {
      entry = void 0;
    }
  };
}
function createLruCache(maxSize, equals) {
  let entries = [];
  function get(key) {
    const cacheIndex = entries.findIndex((entry) => equals(key, entry.key));
    if (cacheIndex > -1) {
      const entry = entries[cacheIndex];
      if (cacheIndex > 0) {
        entries.splice(cacheIndex, 1);
        entries.unshift(entry);
      }
      return entry.value;
    }
    return NOT_FOUND;
  }
  function put(key, value) {
    if (get(key) === NOT_FOUND) {
      entries.unshift({ key, value });
      if (entries.length > maxSize) {
        entries.pop();
      }
    }
  }
  function getEntries() {
    return entries;
  }
  function clear() {
    entries = [];
  }
  return { get, put, getEntries, clear };
}
var referenceEqualityCheck = (a, b) => a === b;
function createCacheKeyComparator(equalityCheck) {
  return function areArgumentsShallowlyEqual(prev, next) {
    if (prev === null || next === null || prev.length !== next.length) {
      return false;
    }
    const { length } = prev;
    for (let i = 0; i < length; i++) {
      if (!equalityCheck(prev[i], next[i])) {
        return false;
      }
    }
    return true;
  };
}
function lruMemoize(func, equalityCheckOrOptions) {
  const providedOptions = typeof equalityCheckOrOptions === "object" ? equalityCheckOrOptions : { equalityCheck: equalityCheckOrOptions };
  const {
    equalityCheck = referenceEqualityCheck,
    maxSize = 1,
    resultEqualityCheck
  } = providedOptions;
  const comparator = createCacheKeyComparator(equalityCheck);
  let resultsCount = 0;
  const cache = maxSize <= 1 ? createSingletonCache(comparator) : createLruCache(maxSize, comparator);
  function memoized() {
    let value = cache.get(arguments);
    if (value === NOT_FOUND) {
      value = func.apply(null, arguments);
      resultsCount++;
      if (resultEqualityCheck) {
        const entries = cache.getEntries();
        const matchingEntry = entries.find(
          (entry) => resultEqualityCheck(entry.value, value)
        );
        if (matchingEntry) {
          value = matchingEntry.value;
          resultsCount !== 0 && resultsCount--;
        }
      }
      cache.put(arguments, value);
    }
    return value;
  }
  memoized.clearCache = () => {
    cache.clear();
    memoized.resetResultsCount();
  };
  memoized.resultsCount = () => resultsCount;
  memoized.resetResultsCount = () => {
    resultsCount = 0;
  };
  return memoized;
}

// src/weakMapMemoize.ts
var StrongRef = class {
  constructor(value) {
    this.value = value;
  }
  deref() {
    return this.value;
  }
};
var getWeakRef = () => typeof WeakRef === "undefined" ? StrongRef : WeakRef;
var Ref = /* @__PURE__ */ getWeakRef();
var UNTERMINATED = 0;
var TERMINATED = 1;
function createCacheNode() {
  return {
    s: UNTERMINATED,
    v: void 0,
    o: null,
    p: null
  };
}
function maybeDeref(r) {
  if (r instanceof Ref) {
    return r.deref();
  }
  return r;
}
function weakMapMemoize(func, options = {}) {
  let fnNode = createCacheNode();
  const { resultEqualityCheck } = options;
  let lastResult;
  let resultsCount = 0;
  function memoized() {
    let cacheNode = fnNode;
    const { length } = arguments;
    for (let i = 0, l = length; i < l; i++) {
      const arg = arguments[i];
      if (typeof arg === "function" || typeof arg === "object" && arg !== null) {
        let objectCache = cacheNode.o;
        if (objectCache === null) {
          cacheNode.o = objectCache = /* @__PURE__ */ new WeakMap();
        }
        const objectNode = objectCache.get(arg);
        if (objectNode === void 0) {
          cacheNode = createCacheNode();
          objectCache.set(arg, cacheNode);
        } else {
          cacheNode = objectNode;
        }
      } else {
        let primitiveCache = cacheNode.p;
        if (primitiveCache === null) {
          cacheNode.p = primitiveCache = /* @__PURE__ */ new Map();
        }
        const primitiveNode = primitiveCache.get(arg);
        if (primitiveNode === void 0) {
          cacheNode = createCacheNode();
          primitiveCache.set(arg, cacheNode);
        } else {
          cacheNode = primitiveNode;
        }
      }
    }
    const terminatedNode = cacheNode;
    let result;
    if (cacheNode.s === TERMINATED) {
      result = cacheNode.v;
    } else {
      result = func.apply(null, arguments);
      resultsCount++;
      if (resultEqualityCheck) {
        const lastResultValue = maybeDeref(lastResult);
        if (lastResultValue != null && resultEqualityCheck(lastResultValue, result)) {
          result = lastResultValue;
          resultsCount !== 0 && resultsCount--;
        }
        const needsWeakRef = typeof result === "object" && result !== null || typeof result === "function";
        lastResult = needsWeakRef ? /* @__PURE__ */ new Ref(result) : result;
      }
    }
    terminatedNode.s = TERMINATED;
    terminatedNode.v = result;
    return result;
  }
  memoized.clearCache = () => {
    fnNode = createCacheNode();
    memoized.resetResultsCount();
  };
  memoized.resultsCount = () => resultsCount;
  memoized.resetResultsCount = () => {
    resultsCount = 0;
  };
  return memoized;
}

// src/createSelectorCreator.ts
function createSelectorCreator(memoizeOrOptions, ...memoizeOptionsFromArgs) {
  const createSelectorCreatorOptions = typeof memoizeOrOptions === "function" ? {
    memoize: memoizeOrOptions,
    memoizeOptions: memoizeOptionsFromArgs
  } : memoizeOrOptions;
  const createSelector2 = (...createSelectorArgs) => {
    let recomputations = 0;
    let dependencyRecomputations = 0;
    let lastResult;
    let directlyPassedOptions = {};
    let resultFunc = createSelectorArgs.pop();
    if (typeof resultFunc === "object") {
      directlyPassedOptions = resultFunc;
      resultFunc = createSelectorArgs.pop();
    }
    assertIsFunction(
      resultFunc,
      `createSelector expects an output function after the inputs, but received: [${typeof resultFunc}]`
    );
    const combinedOptions = {
      ...createSelectorCreatorOptions,
      ...directlyPassedOptions
    };
    const {
      memoize,
      memoizeOptions = [],
      argsMemoize = weakMapMemoize,
      argsMemoizeOptions = []
    } = combinedOptions;
    const finalMemoizeOptions = ensureIsArray(memoizeOptions);
    const finalArgsMemoizeOptions = ensureIsArray(argsMemoizeOptions);
    const dependencies = getDependencies(createSelectorArgs);
    const memoizedResultFunc = memoize(function recomputationWrapper() {
      recomputations++;
      return resultFunc.apply(
        null,
        arguments
      );
    }, ...finalMemoizeOptions);
    let firstRun = true;
    const selector = argsMemoize(function dependenciesChecker() {
      dependencyRecomputations++;
      const inputSelectorResults = collectInputSelectorResults(
        dependencies,
        arguments
      );
      lastResult = memoizedResultFunc.apply(null, inputSelectorResults);
      if (process.env.NODE_ENV !== "production") {
        const { devModeChecks = {} } = combinedOptions;
        const { identityFunctionCheck, inputStabilityCheck } = getDevModeChecksExecutionInfo(firstRun, devModeChecks);
        if (identityFunctionCheck.shouldRun) {
          identityFunctionCheck.run(
            resultFunc,
            inputSelectorResults,
            lastResult
          );
        }
        if (inputStabilityCheck.shouldRun) {
          const inputSelectorResultsCopy = collectInputSelectorResults(
            dependencies,
            arguments
          );
          inputStabilityCheck.run(
            { inputSelectorResults, inputSelectorResultsCopy },
            { memoize, memoizeOptions: finalMemoizeOptions },
            arguments
          );
        }
        if (firstRun) firstRun = false;
      }
      return lastResult;
    }, ...finalArgsMemoizeOptions);
    return Object.assign(selector, {
      resultFunc,
      memoizedResultFunc,
      dependencies,
      dependencyRecomputations: () => dependencyRecomputations,
      resetDependencyRecomputations: () => {
        dependencyRecomputations = 0;
      },
      lastResult: () => lastResult,
      recomputations: () => recomputations,
      resetRecomputations: () => {
        recomputations = 0;
      },
      memoize,
      argsMemoize
    });
  };
  Object.assign(createSelector2, {
    withTypes: () => createSelector2
  });
  return createSelector2;
}
var createSelector = /* @__PURE__ */ createSelectorCreator(weakMapMemoize);

// src/index.ts
function createThunkMiddleware(extraArgument) {
  const middleware = ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  };
  return middleware;
}
var thunk = createThunkMiddleware();
var withExtraArgument = createThunkMiddleware;

var Ie=(...e)=>{let t=createSelectorCreator(...e),r=Object.assign((...n)=>{let a=t(...n),o=(i,...h)=>a(isDraft(i)?current(i):i,...h);return Object.assign(o,a),o},{withTypes:()=>r});return r},ye=Ie(weakMapMemoize);var Ne=typeof window<"u"&&window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__:function(){if(arguments.length!==0)return typeof arguments[0]=="object"?compose:compose.apply(null,arguments)};var Z=e=>e&&typeof e.match=="function";function P(e,t){function r(...n){if(t){let a=t(...n);if(!a)throw new Error(C(0));return {type:e,payload:a.payload,..."meta"in a&&{meta:a.meta},..."error"in a&&{error:a.error}}}return {type:e,payload:n[0]}}return r.toString=()=>`${e}`,r.type=e,r.match=n=>isAction(n)&&n.type===e,r}function he(e){return typeof e=="function"&&"type"in e&&Z(e)}function Ae(e){return isAction(e)&&Object.keys(e).every(yt)}function yt(e){return ["type","payload","error","meta"].indexOf(e)>-1}function At(e={}){return ()=>r=>n=>r(n)}var L=class e extends Array{constructor(...t){super(...t),Object.setPrototypeOf(this,e.prototype);}static get[Symbol.species](){return e}concat(...t){return super.concat.apply(this,t)}prepend(...t){return t.length===1&&Array.isArray(t[0])?new e(...t[0].concat(this)):new e(...t.concat(this))}};function Te(e){return isDraftable(e)?produce(e,()=>{}):e}function M(e,t,r){return e.has(t)?e.get(t):e.set(t,r(t)).get(t)}function Tt(e){return typeof e!="object"||e==null||Object.isFrozen(e)}function mt(e={}){return ()=>n=>a=>n(a);}function je(e){let t=typeof e;return e==null||t==="string"||t==="boolean"||t==="number"||Array.isArray(e)||isPlainObject$1(e)}function Fe(e,t="",r=je,n,a=[],o){let i;if(!r(e))return {keyPath:t||"<root>",value:e};if(typeof e!="object"||e===null||o?.has(e))return  false;let h=n!=null?n(e):Object.entries(e),s=a.length>0;for(let[c,y]of h){let A=t?t+"."+c:c;if(!(s&&a.some(f=>f instanceof RegExp?f.test(A):A===f))){if(!r(y))return {keyPath:A,value:y};if(typeof y=="object"&&(i=Fe(y,A,r,n,a,o),i))return i}}return o&&Ve(e)&&o.add(e),false}function Ve(e){if(!Object.isFrozen(e))return  false;for(let t of Object.values(e))if(!(typeof t!="object"||t===null)&&!Ve(t))return  false;return  true}function St(e={}){return ()=>t=>r=>t(r)}function xt(e){return typeof e=="boolean"}var Le=()=>function(t){let{thunk:r=true,immutableCheck:n=true,serializableCheck:a=true,actionCreatorCheck:o=true}=t??{},i=new L;return r&&(xt(r)?i.push(thunk):i.push(withExtraArgument(r.extraArgument))),i};var me="RTK_autoBatch",Ct=()=>e=>({payload:e,meta:{[me]:true}}),_e=e=>t=>{setTimeout(t,e);},Et=(e,t)=>r=>{let n=false,a=()=>{n||(n=true,cancelAnimationFrame(o),clearTimeout(i),r());},o=e(a),i=setTimeout(a,t);},Se=(e={type:"raf"})=>t=>(...r)=>{let n=t(...r),a=true,o=false,i=false,h=new Set,s=e.type==="tick"?queueMicrotask:e.type==="raf"?typeof window<"u"&&window.requestAnimationFrame?Et(window.requestAnimationFrame,100):_e(10):e.type==="callback"?e.queueNotification:_e(e.timeout),c=()=>{i=false,o&&(o=false,h.forEach(y=>y()));};return Object.assign({},n,{subscribe(y){let A=()=>a&&y(),S=n.subscribe(A);return h.add(y),()=>{S(),h.delete(y);}},dispatch(y){try{return a=!y?.meta?.[me],o=!a,o&&(i||(i=!0,s(c))),n.dispatch(y)}finally{a=true;}}})};var Ue=e=>function(r){let{autoBatch:n=true}=r??{},a=new L(e);return n&&a.push(Se(typeof n=="object"?n:void 0)),a};function Rt(e){let t=Le(),{reducer:r=void 0,middleware:n,devTools:a=true,duplicateMiddlewareCheck:o=true,preloadedState:i=void 0,enhancers:h=void 0}=e||{},s;if(typeof r=="function")s=r;else if(isPlainObject$1(r))s=combineReducers(r);else throw new Error(C(1));let c;typeof n=="function"?c=n(t):c=t();let y=compose;a&&(y=Ne({trace:false,...typeof a=="object"&&a}));let A=applyMiddleware(...c),S=Ue(A),f=typeof h=="function"?h(S):S(),d=y(...f);return createStore(s,i,d)}function ee(e){let t={},r=[],n,a={addCase(o,i){let h=typeof o=="string"?o:o.type;if(!h)throw new Error(C(28));if(h in t)throw new Error(C(29));return t[h]=i,a},addAsyncThunk(o,i){return i.pending&&(t[o.pending.type]=i.pending),i.rejected&&(t[o.rejected.type]=i.rejected),i.fulfilled&&(t[o.fulfilled.type]=i.fulfilled),i.settled&&r.push({matcher:o.settled,reducer:i.settled}),a},addMatcher(o,i){return r.push({matcher:o,reducer:i}),a},addDefaultCase(o){return n=o,a}};return e(a),[t,r,n]}function wt(e){return typeof e=="function"}function ke(e,t){let[r,n,a]=ee(t),o;if(wt(e))o=()=>Te(e());else {let h=Te(e);o=()=>h;}function i(h=o(),s){let c=[r[s.type],...n.filter(({matcher:y})=>y(s)).map(({reducer:y})=>y)];return c.filter(y=>!!y).length===0&&(c=[a]),c.reduce((y,A)=>{if(A)if(isDraft(y)){let f=A(y,s);return f===void 0?y:f}else {if(isDraftable(y))return produce(y,S=>A(S,s));{let S=A(y,s);if(S===void 0){if(y===null)return y;throw Error("A case reducer on a non-draftable value must not return undefined")}return S}}return y},h)}return i.getInitialState=o,i}var We=(e,t)=>Z(e)?e.match(t):e(t);function _(...e){return t=>e.some(r=>We(r,t))}function K(...e){return t=>e.every(r=>We(r,t))}function ne(e,t){if(!e||!e.meta)return  false;let r=typeof e.meta.requestId=="string",n=t.indexOf(e.meta.requestStatus)>-1;return r&&n}function H(e){return typeof e[0]=="function"&&"pending"in e[0]&&"fulfilled"in e[0]&&"rejected"in e[0]}function ze(...e){return e.length===0?t=>ne(t,["pending"]):H(e)?_(...e.map(t=>t.pending)):ze()(e[0])}function te(...e){return e.length===0?t=>ne(t,["rejected"]):H(e)?_(...e.map(t=>t.rejected)):te()(e[0])}function Ge(...e){let t=r=>r&&r.meta&&r.meta.rejectedWithValue;return e.length===0?K(te(...e),t):H(e)?K(te(...e),t):Ge()(e[0])}function Be(...e){return e.length===0?t=>ne(t,["fulfilled"]):H(e)?_(...e.map(t=>t.fulfilled)):Be()(e[0])}function Ke(...e){return e.length===0?t=>ne(t,["pending","fulfilled","rejected"]):H(e)?_(...e.flatMap(t=>[t.pending,t.rejected,t.fulfilled])):Ke()(e[0])}var Pt="ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW",D=(e=21)=>{let t="",r=e;for(;r--;)t+=Pt[Math.random()*64|0];return t};var Mt=["name","message","stack","code"],q=class{constructor(t,r){this.payload=t;this.meta=r;}payload;meta;_type},re=class{constructor(t,r){this.payload=t;this.meta=r;}payload;meta;_type},qe=e=>{if(typeof e=="object"&&e!==null){let t={};for(let r of Mt)typeof e[r]=="string"&&(t[r]=e[r]);return t}return {message:String(e)}},He="External signal was aborted",ge=(()=>{function e(t,r,n){let a=P(t+"/fulfilled",(s,c,y,A)=>({payload:s,meta:{...A||{},arg:y,requestId:c,requestStatus:"fulfilled"}})),o=P(t+"/pending",(s,c,y)=>({payload:void 0,meta:{...y||{},arg:c,requestId:s,requestStatus:"pending"}})),i=P(t+"/rejected",(s,c,y,A,S)=>({payload:A,error:(n&&n.serializeError||qe)(s||"Rejected"),meta:{...S||{},arg:y,requestId:c,rejectedWithValue:!!A,requestStatus:"rejected",aborted:s?.name==="AbortError",condition:s?.name==="ConditionError"}}));function h(s,{signal:c}={}){return (y,A,S)=>{let f=n?.idGenerator?n.idGenerator(s):D(),d=new AbortController,l,u;function p(T){u=T,d.abort();}c&&(c.aborted?p(He):c.addEventListener("abort",()=>p(He),{once:true}));let g=(async function(){let T;try{let k=n?.condition?.(s,{getState:A,extra:S});if(bt(k)&&(k=await k),k===!1||d.signal.aborted)throw {name:"ConditionError",message:"Aborted due to condition callback returning false."};let R=new Promise((x,E)=>{l=()=>{E({name:"AbortError",message:u||"Aborted"});},d.signal.addEventListener("abort",l,{once:!0});});y(o(f,s,n?.getPendingMeta?.({requestId:f,arg:s},{getState:A,extra:S}))),T=await Promise.race([R,Promise.resolve(r(s,{dispatch:y,getState:A,extra:S,requestId:f,signal:d.signal,abort:p,rejectWithValue:((x,E)=>new q(x,E)),fulfillWithValue:((x,E)=>new re(x,E))})).then(x=>{if(x instanceof q)throw x;return x instanceof re?a(x.payload,f,s,x.meta):a(x,f,s)})]);}catch(k){T=k instanceof q?i(null,f,s,k.payload,k.meta):i(k,f,s);}finally{l&&d.signal.removeEventListener("abort",l);}return n&&!n.dispatchConditionRejection&&i.match(T)&&T.meta.condition||y(T),T})();return Object.assign(g,{abort:p,requestId:f,arg:s,unwrap(){return g.then($e)}})}}return Object.assign(h,{pending:o,rejected:i,fulfilled:a,settled:_(i,a),typePrefix:t})}return e.withTypes=()=>e,e})();function $e(e){if(e.meta&&e.meta.rejectedWithValue)throw e.payload;if(e.error)throw e.error;return e.payload}function bt(e){return e!==null&&typeof e=="object"&&typeof e.then=="function"}var Xe=Symbol.for("rtk-slice-createasyncthunk"),It={[Xe]:ge},Je=(n=>(n.reducer="reducer",n.reducerWithPrepare="reducerWithPrepare",n.asyncThunk="asyncThunk",n))(Je||{});function vt(e,t){return `${e}/${t}`}function Qe({creators:e}={}){let t=e?.asyncThunk?.[Xe];return function(n){let{name:a,reducerPath:o=a}=n;if(!a)throw new Error(C(11));let i=(typeof n.reducers=="function"?n.reducers(Nt()):n.reducers)||{},h=Object.keys(i),s={sliceCaseReducersByName:{},sliceCaseReducersByType:{},actionCreators:{},sliceMatchers:[]},c={addCase(T,m){let k=typeof T=="string"?T:T.type;if(!k)throw new Error(C(12));if(k in s.sliceCaseReducersByType)throw new Error(C(13));return s.sliceCaseReducersByType[k]=m,c},addMatcher(T,m){return s.sliceMatchers.push({matcher:T,reducer:m}),c},exposeAction(T,m){return s.actionCreators[T]=m,c},exposeCaseReducer(T,m){return s.sliceCaseReducersByName[T]=m,c}};h.forEach(T=>{let m=i[T],k={reducerName:T,type:vt(a,T),createNotation:typeof n.reducers=="function"};Ft(m)?Lt(k,m,c,t):jt(k,m,c);});function y(){let[T={},m=[],k=void 0]=typeof n.extraReducers=="function"?ee(n.extraReducers):[n.extraReducers],R={...T,...s.sliceCaseReducersByType};return ke(n.initialState,x=>{for(let E in R)x.addCase(E,R[E]);for(let E of s.sliceMatchers)x.addMatcher(E.matcher,E.reducer);for(let E of m)x.addMatcher(E.matcher,E.reducer);k&&x.addDefaultCase(k);})}let A=T=>T,S=new Map,f=new WeakMap,d;function l(T,m){return d||(d=y()),d(T,m)}function u(){return d||(d=y()),d.getInitialState()}function p(T,m=false){function k(x){let E=x[T];return typeof E>"u"&&m&&(E=M(f,k,u)),E}function R(x=A){let E=M(S,m,()=>new WeakMap);return M(E,x,()=>{let z={};for(let[J,j]of Object.entries(n.selectors??{}))z[J]=Dt(j,x,()=>M(f,x,u),m);return z})}return {reducerPath:T,getSelectors:R,get selectors(){return R(k)},selectSlice:k}}let g={name:a,reducer:l,actions:s.actionCreators,caseReducers:s.sliceCaseReducersByName,getInitialState:u,...p(o),injectInto(T,{reducerPath:m,...k}={}){let R=m??o;return T.inject({reducerPath:R,reducer:l},k),{...g,...p(R,true)}}};return g}}function Dt(e,t,r,n){function a(o,...i){let h=t(o);return typeof h>"u"&&n&&(h=r()),e(h,...i)}return a.unwrapped=e,a}var Ot=Qe();function Nt(){function e(t,r){return {_reducerDefinitionType:"asyncThunk",payloadCreator:t,...r}}return e.withTypes=()=>e,{reducer(t){return Object.assign({[t.name](...r){return t(...r)}}[t.name],{_reducerDefinitionType:"reducer"})},preparedReducer(t,r){return {_reducerDefinitionType:"reducerWithPrepare",prepare:t,reducer:r}},asyncThunk:e}}function jt({type:e,reducerName:t,createNotation:r},n,a){let o,i;if("reducer"in n){if(r&&!Vt(n))throw new Error(C(17));o=n.reducer,i=n.prepare;}else o=n;a.addCase(e,o).exposeCaseReducer(t,o).exposeAction(t,i?P(e,i):P(e));}function Ft(e){return e._reducerDefinitionType==="asyncThunk"}function Vt(e){return e._reducerDefinitionType==="reducerWithPrepare"}function Lt({type:e,reducerName:t},r,n,a){if(!a)throw new Error(C(18));let{payloadCreator:o,fulfilled:i,pending:h,rejected:s,settled:c,options:y}=r,A=a(e,o,y);n.exposeAction(t,A),i&&n.addCase(A.fulfilled,i),h&&n.addCase(A.pending,h),s&&n.addCase(A.rejected,s),c&&n.addMatcher(A.settled,c),n.exposeCaseReducer(t,{fulfilled:i||ae,pending:h||ae,rejected:s||ae,settled:c||ae});}function ae(){}function _t(){return {ids:[],entities:{}}}function Ye(e){function t(r={},n){let a=Object.assign(_t(),r);return n?e.setAll(a,n):a}return {getInitialState:t}}function Ze(){function e(t,r={}){let{createSelector:n=ye}=r,a=A=>A.ids,o=A=>A.entities,i=n(a,o,(A,S)=>A.map(f=>S[f])),h=(A,S)=>S,s=(A,S)=>A[S],c=n(a,A=>A.length);if(!t)return {selectIds:a,selectEntities:o,selectAll:i,selectTotal:c,selectById:n(o,h,s)};let y=n(t,o);return {selectIds:n(t,a),selectEntities:y,selectAll:n(t,i),selectTotal:n(t,c),selectById:n(y,h,s)}}return {getSelectors:e}}var Ut=isDraft;function et(e){let t=w((r,n)=>e(n));return function(n){return t(n,void 0)}}function w(e){return function(r,n){function a(i){return Ae(i)}let o=i=>{a(n)?e(n.payload,i):e(n,i);};return Ut(r)?(o(r),r):produce(r,o)}}function O(e,t){return t(e)}function b(e){return Array.isArray(e)||(e=Object.values(e)),e}function $(e){return isDraft(e)?current(e):e}function oe(e,t,r){e=b(e);let n=$(r.ids),a=new Set(n),o=[],i=new Set([]),h=[];for(let s of e){let c=O(s,t);a.has(c)||i.has(c)?h.push({id:c,changes:s}):(i.add(c),o.push(s));}return [o,h,n]}function ie(e){function t(d,l){let u=O(d,e);u in l.entities||(l.ids.push(u),l.entities[u]=d);}function r(d,l){d=b(d);for(let u of d)t(u,l);}function n(d,l){let u=O(d,e);u in l.entities||l.ids.push(u),l.entities[u]=d;}function a(d,l){d=b(d);for(let u of d)n(u,l);}function o(d,l){d=b(d),l.ids=[],l.entities={},r(d,l);}function i(d,l){return h([d],l)}function h(d,l){let u=false;d.forEach(p=>{p in l.entities&&(delete l.entities[p],u=true);}),u&&(l.ids=l.ids.filter(p=>p in l.entities));}function s(d){Object.assign(d,{ids:[],entities:{}});}function c(d,l,u){let p=u.entities[l.id];if(p===void 0)return  false;let g=Object.assign({},p,l.changes),T=O(g,e),m=T!==l.id;return m&&(d[l.id]=T,delete u.entities[l.id]),u.entities[T]=g,m}function y(d,l){return A([d],l)}function A(d,l){let u={},p={};d.forEach(T=>{T.id in l.entities&&(p[T.id]={id:T.id,changes:{...p[T.id]?.changes,...T.changes}});}),d=Object.values(p),d.length>0&&d.filter(m=>c(u,m,l)).length>0&&(l.ids=Object.values(l.entities).map(m=>O(m,e)));}function S(d,l){return f([d],l)}function f(d,l){let[u,p]=oe(d,e,l);r(u,l),A(p,l);}return {removeAll:et(s),addOne:w(t),addMany:w(r),setOne:w(n),setMany:w(a),setAll:w(o),updateOne:w(y),updateMany:w(A),upsertOne:w(S),upsertMany:w(f),removeOne:w(i),removeMany:w(h)}}function Wt(e,t,r){let n=0,a=e.length;for(;n<a;){let o=n+a>>>1,i=e[o];r(t,i)>=0?n=o+1:a=o;}return n}function zt(e,t,r){let n=Wt(e,t,r);return e.splice(n,0,t),e}function tt(e,t){let{removeOne:r,removeMany:n,removeAll:a}=ie(e);function o(u,p){return i([u],p)}function i(u,p,g){u=b(u);let T=new Set(g??$(p.ids)),m=new Set,k=u.filter(R=>{let x=O(R,e),E=!m.has(x);return E&&m.add(x),!T.has(x)&&E});k.length!==0&&l(p,k);}function h(u,p){return s([u],p)}function s(u,p){let g={};if(u=b(u),u.length!==0){for(let T of u){let m=e(T);g[m]=T,delete p.entities[m];}u=b(g),l(p,u);}}function c(u,p){u=b(u),p.entities={},p.ids=[],i(u,p,[]);}function y(u,p){return A([u],p)}function A(u,p){let g=false,T=false;for(let m of u){let k=p.entities[m.id];if(!k)continue;g=true,Object.assign(k,m.changes);let R=e(k);if(m.id!==R){T=true,delete p.entities[m.id];let x=p.ids.indexOf(m.id);p.ids[x]=R,p.entities[R]=k;}}g&&l(p,[],g,T);}function S(u,p){return f([u],p)}function f(u,p){let[g,T,m]=oe(u,e,p);g.length&&i(g,p,m),T.length&&A(T,p);}function d(u,p){if(u.length!==p.length)return  false;for(let g=0;g<u.length;g++)if(u[g]!==p[g])return  false;return  true}let l=(u,p,g,T)=>{let m=$(u.entities),k=$(u.ids),R=u.entities,x=k;T&&(x=new Set(k));let E=[];for(let j of x){let be=m[j];be&&E.push(be);}let z=E.length===0;for(let j of p)R[e(j)]=j,z||zt(E,j,t);z?E=p.slice().sort(t):g&&E.sort(t);let J=E.map(e);d(k,J)||(u.ids=J);};return {removeOne:r,removeMany:n,removeAll:a,addOne:w(o),updateOne:w(y),upsertOne:w(S),setOne:w(h),setMany:w(s),setAll:w(c),addMany:w(i),updateMany:w(A),upsertMany:w(f)}}function Gt(e={}){let{selectId:t,sortComparer:r}={sortComparer:false,selectId:i=>i.id,...e},n=r?tt(t,r):ie(t),a=Ye(n),o=Ze();return {selectId:t,sortComparer:r,...a,...o,...n}}var Bt="task",nt="listener",rt="completed",xe="cancelled",at=`task-${xe}`,ot=`task-${rt}`,se=`${nt}-${xe}`,it=`${nt}-${rt}`,I=class{constructor(t){this.code=t;this.message=`${Bt} ${xe} (reason: ${t})`;}code;name="TaskAbortError";message};var ce=(e,t)=>{if(typeof e!="function")throw new TypeError(C(32))},U=()=>{},de=(e,t=U)=>(e.catch(t),e),ue=(e,t)=>(e.addEventListener("abort",t,{once:true}),()=>e.removeEventListener("abort",t));var N=e=>{if(e.aborted)throw new I(e.reason)};function Ce(e,t){let r=U;return new Promise((n,a)=>{let o=()=>a(new I(e.reason));if(e.aborted){o();return}r=ue(e,o),t.finally(()=>r()).then(n,a);}).finally(()=>{r=U;})}var st=async(e,t)=>{try{return await Promise.resolve(),{status:"ok",value:await e()}}catch(r){return {status:r instanceof I?"cancelled":"rejected",error:r}}finally{t?.();}},X=e=>t=>de(Ce(e,t).then(r=>(N(e),r))),Ee=e=>{let t=X(e);return r=>t(new Promise(n=>setTimeout(n,r)))};var {assign:W}=Object,ct={},le="listenerMiddleware",Kt=(e,t)=>{let r=n=>ue(e,()=>n.abort(e.reason));return (n,a)=>{ce(n);let o=new AbortController;r(o);let i=st(async()=>{N(e),N(o.signal);let h=await n({pause:X(o.signal),delay:Ee(o.signal),signal:o.signal});return N(o.signal),h},()=>o.abort(ot));return a?.autoJoin&&t.push(i.catch(U)),{result:X(e)(i),cancel(){o.abort(at);}}}},Ht=(e,t)=>{let r=async(n,a)=>{N(t);let o=()=>{},h=[new Promise((s,c)=>{let y=e({predicate:n,effect:(A,S)=>{S.unsubscribe(),s([A,S.getState(),S.getOriginalState()]);}});o=()=>{y(),c();};})];a!=null&&h.push(new Promise(s=>setTimeout(s,a,null)));try{let s=await Ce(t,Promise.race(h));return N(t),s}finally{o();}};return((n,a)=>de(r(n,a)))},lt=e=>{let{type:t,actionCreator:r,matcher:n,predicate:a,effect:o}=e;if(t)a=P(t).match;else if(r)t=r.type,a=r.match;else if(n)a=n;else if(!a)throw new Error(C(21));return ce(o),{predicate:a,type:t,effect:o}},pt=W(e=>{let{type:t,predicate:r,effect:n}=lt(e);return {id:D(),effect:n,type:t,predicate:r,pending:new Set,unsubscribe:()=>{throw new Error(C(22))}}},{withTypes:()=>pt}),dt=(e,t)=>{let{type:r,effect:n,predicate:a}=lt(t);return Array.from(e.values()).find(o=>(typeof r=="string"?o.type===r:o.predicate===a)&&o.effect===n)},Re=e=>{e.pending.forEach(t=>{t.abort(se);});},qt=(e,t)=>()=>{for(let r of t.keys())Re(r);e.clear();},ut=(e,t,r)=>{try{e(t,r);}catch(n){setTimeout(()=>{throw n},0);}},we=W(P(`${le}/add`),{withTypes:()=>we}),ft=P(`${le}/removeAll`),Pe=W(P(`${le}/remove`),{withTypes:()=>Pe}),$t=(...e)=>{console.error(`${le}/error`,...e);},Xt=(e={})=>{let t=new Map,r=new Map,n=f=>{let d=r.get(f)??0;r.set(f,d+1);},a=f=>{let d=r.get(f)??1;d===1?r.delete(f):r.set(f,d-1);},{extra:o,onError:i=$t}=e;ce(i);let h=f=>(f.unsubscribe=()=>t.delete(f.id),t.set(f.id,f),d=>{f.unsubscribe(),d?.cancelActive&&Re(f);}),s=(f=>{let d=dt(t,f)??pt(f);return h(d)});W(s,{withTypes:()=>s});let c=f=>{let d=dt(t,f);return d&&(d.unsubscribe(),f.cancelActive&&Re(d)),!!d};W(c,{withTypes:()=>c});let y=async(f,d,l,u)=>{let p=new AbortController,g=Ht(s,p.signal),T=[];try{f.pending.add(p),n(f),await Promise.resolve(f.effect(d,W({},l,{getOriginalState:u,condition:(m,k)=>g(m,k).then(Boolean),take:g,delay:Ee(p.signal),pause:X(p.signal),extra:o,signal:p.signal,fork:Kt(p.signal,T),unsubscribe:f.unsubscribe,subscribe:()=>{t.set(f.id,f);},cancelActiveListeners:()=>{f.pending.forEach((m,k,R)=>{m!==p&&(m.abort(se),R.delete(m));});},cancel:()=>{p.abort(se),f.pending.delete(p);},throwIfCancelled:()=>{N(p.signal);}})));}catch(m){m instanceof I||ut(i,m,{raisedBy:"effect"});}finally{await Promise.all(T),p.abort(it),a(f),f.pending.delete(p);}},A=qt(t,r);return {middleware:f=>d=>l=>{if(!isAction(l))return d(l);if(we.match(l))return s(l.payload);if(ft.match(l)){A();return}if(Pe.match(l))return c(l.payload);let u=f.getState(),p=()=>{if(u===ct)throw new Error(C(23));return u},g;try{if(g=d(l),t.size>0){let T=f.getState(),m=Array.from(t.values());for(let k of m){let R=!1;try{R=k.predicate(l,T,u);}catch(x){R=!1,ut(i,x,{raisedBy:"predicate"});}R&&y(k,l,f,p);}}}finally{u=ct;}return g},startListening:s,stopListening:c,clearListeners:A}};var Jt=e=>({middleware:e,applied:new Map}),Qt=e=>t=>t?.meta?.instanceId===e,Yt=()=>{let e=D(),t=new Map,r=Object.assign(P("dynamicMiddleware/add",(...h)=>({payload:h,meta:{instanceId:e}})),{withTypes:()=>r}),n=Object.assign(function(...s){s.forEach(c=>{M(t,c,Jt);});},{withTypes:()=>n}),a=h=>{let s=Array.from(t.values()).map(c=>M(c.applied,h,c.middleware));return compose(...s)},o=K(r,Qt(e));return {middleware:h=>s=>c=>o(c)?(n(...c.payload),h.dispatch):a(h)(s)(c),addMiddleware:n,withMiddleware:r,instanceId:e}};var en=e=>"reducerPath"in e&&typeof e.reducerPath=="string",tn=e=>e.flatMap(t=>en(t)?[[t.reducerPath,t.reducer]]:Object.entries(t)),Me=Symbol.for("rtk-state-proxy-original"),nn=e=>!!e&&!!e[Me],rn=new WeakMap,an=(e,t,r)=>M(rn,e,()=>new Proxy(e,{get:(n,a,o)=>{if(a===Me)return n;let i=Reflect.get(n,a,o);if(typeof i>"u"){let h=r[a];if(typeof h<"u")return h;let s=t[a];if(s){let c=s(void 0,{type:D()});if(typeof c>"u")throw new Error(C(24));return r[a]=c,c}}return i}})),on=e=>{if(!nn(e))throw new Error(C(25));return e[Me]},sn={},cn=(e=sn)=>e;function dn(...e){let t=Object.fromEntries(tn(e)),r=()=>Object.keys(t).length?combineReducers(t):cn,n=r();function a(s,c){return n(s,c)}a.withLazyLoadedSlices=()=>a;let o={},i=(s,c={})=>{let{reducerPath:y,reducer:A}=s,S=t[y];return !c.overrideExisting&&S&&S!==A||(c.overrideExisting&&S!==A&&delete o[y],t[y]=A,n=r()),a},h=Object.assign(function(c,y){return function(S,...f){return c(an(y?y(S,...f):S,t,o),...f)}},{original:on});return Object.assign(a,{inject:i,selector:h})}function C(e){return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `}

export { Je as ReducerType, me as SHOULD_AUTOBATCH, I as TaskAbortError, L as Tuple, actionTypes_default as __DO_NOT_USE__ActionTypes, we as addListener, applyMiddleware, It as asyncThunkCreator, Se as autoBatchEnhancer, bindActionCreators, Qe as buildCreateSlice, ft as clearAllListeners, combineReducers, dn as combineSlices, compose, Rt as configureStore, P as createAction, At as createActionCreatorInvariantMiddleware, ge as createAsyncThunk, ye as createDraftSafeSelector, Ie as createDraftSafeSelectorCreator, Yt as createDynamicMiddleware, Gt as createEntityAdapter, mt as createImmutableStateInvariantMiddleware, Xt as createListenerMiddleware, produce as createNextState, ke as createReducer, createSelector, createSelectorCreator, St as createSerializableStateInvariantMiddleware, Ot as createSlice, createStore, current, Fe as findNonSerializableValue, C as formatProdErrorMessage, freeze, isAction, he as isActionCreator, K as isAllOf, _ as isAnyOf, Ke as isAsyncThunkAction, isDraft, Ae as isFluxStandardAction, Be as isFulfilled, Tt as isImmutableDefault, ze as isPending, je as isPlain, isPlainObject$1 as isPlainObject, te as isRejected, Ge as isRejectedWithValue, legacy_createStore, lruMemoize, qe as miniSerializeError, D as nanoid, original, Ct as prepareAutoBatched, Pe as removeListener, $e as unwrapResult, weakMapMemoize };
