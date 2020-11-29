# Obsrv

[![Build Status](https://travis-ci.org/Fluidbyte/obsrv.svg?branch=master)](https://travis-ci.org/Fluidbyte/obsrv)

Micro state management library for React heavily inspired by [MobX](https://mobx.js.org/).

## Installation

```shell
npm install obsrv
```

## Getting Started

The simplest point to start is by creating a basic data store, here we're creating a user store:

```javascript
import obsrv from 'obsrv'

const userStore = obsrv({
  data: {
    firstName: 'John',
    lastName: 'Smith',
    email: 'jsmith@email.com',
  },
})
```

You can then use the store in a component:

```javascript
const UserForm = (({userStore}) => (
  <form>
    <label>First Name</label>
    <input
      type='text'
      value={userStore.firstName}
      onChange=(e => {
        userStore.firstName = e.target.value
      })
    />
    <!-- Addtitional fields... -->
  </form>
)
```

As you can see, the component simply refers to the store's properties for getting and setting properties. The store can be passed inside of the component (local state) or can use a mechanism such as React's Context to allow for global state maintenance.

## Computeds

Computed values can be added by creating the store with a `computeds` object, in the below example; returning the length of a property's value:

```diff
import obsrv from "obsrv";

const userStore = obsrv({
  data: {
    firstName: "John",
    lastName: "Smith",
    email: "jsmith@email.com",
  },
+  computeds: {
+    firstNameLength: ({ firstName }) => firstName.length
+  }
});
```

The computed can then be used by referencing it in the `computeds` object of the store:

```diff
const UserForm = (({userStore}) => (
  <form>
    <label>First Name</label>
    <input
      type='text'
      value={userStore.firstName}
      onChange=(e => {
        userStore.firstName = e.target.value
      })
    />
+    <span>{userStore.computeds.firstNameLength} characters</span>
    <!-- Addtitional fields... -->
  </form>
)
```

## Actions

Actions can be used to attach functions to the store via the `actions` property on the store:

```diff
import obsrv from "obsrv";

const userStore = obsrv({
  data: {
    firstName: "John",
    lastName: "Smith",
    email: "jsmith@email.com",
  },
  computeds: {
    firstNameLength: ({ firstName }) => firstName.length
  },
+  actions: {
+    whatIsMyFirstName: ({ firstName }) => alert(firstName)
+  }
});
```

Calling the action will call the method attached:

```diff
const UserForm = (({userStore}) => (
  <form>
    <label>First Name</label>
    <input
      type='text'
      value={userStore.firstName}
      onChange=(e => {
        userStore.firstName = e.target.value
      })
    />
    <span>{userStore.computeds.firstNameLength} characters</span>
+    <button
+      onClick={() => userStore.actions.whatIsMyFirstName()}
+    >
+      Click Me
+    </button>
    <!-- Addtitional fields... -->
  </form>
)
```

## Getting Model Data

There are two methods for returning the "raw" data object from the store:

```javascript
store.getJS() // Returns object literal
store.getJSON(indent) // Returns JSON with optional indent param (good for debugging)
```

## Development

Download the repository and run `yarn` or `npm install` to install all directories, scripts available are:

- `lint`: runs linter with `--fix` flag
- `test`: run all unit tests
- `test:watch`: run all unit tests in `watch` mode
- `example`: run `example` with hot module reload
- `build`: build `src/obsrv.js` to `dist/obsrv.min.js`
