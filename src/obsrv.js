import React, { useState } from "react";

export const reservedProps = [
  "_setters",
  "computeds",
  "actions",
  "getJS",
  "getJSON",
];

/**
 * Basic checks to inform of improper modelling structure
 * @param {Object} opts Object properties passed to init
 */
export const validateOpts = (opts) => {
  const { data } = opts;
  // Ensure data property is passed
  if (!data) throw new Error("Missing required data property");
  // Ensure data property is an object
  if (typeof data !== "object" || Array.isArray(data))
    throw new Error("data property should be an object");
  // Ensure data property contains no reserved props
  if (Object.keys(data).some((prop) => reservedProps.includes(prop)))
    throw new Error(
      `data property cannot contain reserved props: ${reservedProps.split(
        ", "
      )}`
    );
};

/**
 * @type {Object} defined handler for data proxy
 * @property {Function} get proxy getter which returns prop value
 * @property {Function} set proxy setted that calls state setter
 */
export const dataHandler = {
  get: (target, prop) => {
    return target[prop];
  },
  set: (target, prop, value) => {
    if (reservedProps.includes(prop)) {
      target[prop] = value;
    } else {
      target._setters[prop](value);
    }
    return true;
  },
};

/**
 * Constructs object recursively to define _setters object and data getters
 * @param {Object} model Object contructing the store
 * @returns {Object}
 */
export const buildData = (model) => {
  return Object.keys(model).reduce(
    (acc, key) => {
      if (typeof model[key] === "object" && !Array.isArray(model[key])) {
        acc[key] = new Proxy(buildData(model[key]), dataHandler);
      } else {
        const [data, dataSetter] = useState(model[key]);
        acc._setters[key] = dataSetter;
        acc[key] = data;
      }
      return acc;
    },
    { _setters: {} }
  );
};

/**
 * Builds and returns proxy for handling computeds
 * @param {Object} computeds definition object
 * @param {Object} dataProxy primary data proxy
 * @returns {Object} proxy
 */
export const getComputedsProxy = (computeds, dataProxy) => {
  const computedsHandler = {
    get: (target, prop) => {
      return dataProxy && target[prop](dataProxy);
    },
  };
  return new Proxy(computeds, computedsHandler);
};

/**
 * Builds and returns proxy for handling actions
 * @param {Object} actions definition object
 * @param {Object} dataProxy primary data proxy
 * @returns {Object} proxy
 */
export const getActionsProxy = (actions, dataProxy) => {
  const actionsHandler = {
    get: (target, prop) => {
      return dataProxy && target[prop].bind(null, dataProxy);
    },
  };
  return new Proxy(actions, actionsHandler);
};

/**
 * Recursively builds then returns only the model data in current state
 * @param {Object} data The data to traveres
 * @returns {Object}
 */
export const getRawData = (data) => {
  return Object.keys(data).reduce((acc, key) => {
    if (reservedProps.includes(key)) return acc;
    if (typeof data[key] === "object" && !Array.isArray(data[key])) {
      acc[key] = getRawData(data[key]);
    } else {
      acc[key] = data[key];
    }
    return acc;
  }, {});
};

/**
 * Main, returns the observable object with all properties and methods
 * @param {Object} opts Initial properties
 * @property {Object} opts.data Definition, initial data
 * @property {Object} opts.computeds Definition of computeds
 * @property {Object} opts.actions Definition of actions
 */
export default function (opts) {
  validateOpts(opts);
  const { data = {}, computeds = {}, actions = {} } = opts;
  const dataProxy = new Proxy(buildData(data), dataHandler);
  const computedsProxy = getComputedsProxy(computeds, dataProxy);
  const actionsProxy = getActionsProxy(actions, dataProxy);

  // Return observer
  return Object.assign(dataProxy, {
    computeds: computedsProxy,
    actions: actionsProxy,
    getJS: getRawData.bind(null, dataProxy),
    getJSON: (indent = false) =>
      JSON.stringify(getRawData(dataProxy), null, indent),
  });
}
