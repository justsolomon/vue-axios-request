# vue-axios-request

Vue library for making network requests using axios.

## Features

- Reactive data
- Compatible with Vue 2
- Lightweight
- Written in TypeScript
- Integrates with Vuex

## Installation

Using npm:

```
npm install vue-axios-request
```

Using yarn:

```
yarn add vue-axios-request
```

## Demo

You can find a demo available on [Codesandbox](https://codesandbox.io/s/vue-axios-request-demo-urmhy).

## Usage

The library exports two functions, `useNetworkRequest` and `getInitialState` which need to be setup as global methods in your `main.js` file at the root of your Vue project. To do this, you can make use of [Vue mixins](https://vuejs.org/v2/guide/mixins.html).

```js
import Vue from "vue";
import useNetworkRequest, { getInitialState } from "vue-axios-request";

Vue.mixin({
  methods: {
    getInitialState,
    useNetworkRequest(url, initialStateKeys, options) {
      const networkRequest = useNetworkRequest.bind(this);

      return networkRequest(
        "https://jsonplaceholder.typicode.com" + url,
        initialStateKeys,
        options,
      );
    },
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

When defining the method for `useNetworkRequest`, the imported function needs to be bound to the current instance of the method, i.e `this`. Afterwards, we return the bound function with the necessary parameters from the method as seen above.

The `useNetworkRequest` function takes in three parameters, namely:

1. `url`, the endpoint for the network request,
2. `initialStateKeys`, an object containing the keys for the network request's state (i.e `data`, `loading`, `error`), and
3. `options`, an object which can contain any of the below three properties:
   - `storeMutation`, the mutation for committing the request data to the store.
   - `config`, the Axios request config object.
   - `errorHandler`, a custom function for handling Axios errors.

When the function is called, it returns three methods:

- `reset`, which resets the initial network state's values to the default values.
- `cancel`, which cancels the ongoing network request.
- `dispatch`, which dispatches the network request using Axios.

### In Components

```js
<template>
  <div>
    <button @click="fetchUsers">
        {{ `${usersLoading ? "Loading..." : "Fetch Users"}` }}
    </button>
    <ul>
        <p v-for="(user, index) in users" :key="index">
          {{ user.name }}
        </p>
    </ul>
  </div>
</template>

<script>
const stateKeys = ["users", "usersLoading", "usersError"];

export default {
  name: "App",
  data() {
    return {
      ...this.getInitialState(...stateKeys),
    };
  },
  computed: {
    storeUsers() {
      return this.$store.getters.getUsers;
    },
  },
  methods: {
    fetchUsers() {
      const { dispatch } = this.useNetworkRequest(
        "/users",
        this.getInitialState(...stateKeys, true),
      );

      dispatch();
    },
  },
};
</script>
```

The `getInitialState` method takes in four parameters:

1. `data`, the key for the prop that will hold the request data,
2. `loading`, the key for the prop to contain the loading status of the request,
3. `error`, the key for the prop that will hold the request error,
4. `isRequest`, an optional param that is defined when the `getInitialState` method is being used to fetch the initial state keys for the `useNetworkRequest` method.

The method returns an object containing the keys passed in with their initial values, so they can be destructured in the `data` method of your Vue component.

In the above code sample, the `stateKeys` array contains 3 strings, which are intended for the `data`, `loading` and `error` params for the `getInitialState` method respectively. The array is destructured in the `getInitialState` method, whose result is in turn destructured into the `data` method of the Vue component. This enables the reactivity of the network state.

In the `fetchUsers` method, the global `useNetworkRequest` method is called, with the `"/users"` endpoint as the first parameter, and the object returned by `getInitialState` as the second parameter.

**NOTE**: When the `getInitialState` method is called to get the `initialStateKeys` param in the `useNetworkRequest`, an additional param `true` is added in the function call, to indicate that its being used in the `useNetworkRequest` method.

### With Vuex

To dispatch the network request's data to your VueX store, simply pass in the mutation from the `options` param to the `useNetworkRequest` method in your component. Using the [example above](#in-components), the `fetchUsers` method would be updated to:

```js
fetchUsers() {
    const { dispatch } = this.useNetworkRequest(
       "/users",
       this.getInitialState(...stateKeys, true),
       { storeMutation: "updateUsers" }
    );

    dispatch();
},
```

## Contributing

### Project setup

```
yarn install
```

### Compile TypeScript files to JavaScript files

```
yarn build
```

### Run your unit tests

```
yarn test:unit
```

### Lints and fixes files

```
yarn lint
```

### Format files using Prettier

```
yarn format
```

## License

[MIT](https://github.com/justsolomon/vue-axios-request/blob/main/LICENSE)
