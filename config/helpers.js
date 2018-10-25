const fs = require('fs');

const isDefined = (value) => typeof value !== 'undefined';

const requireDefined = (name, value, extraErrorMessage = '') => {
  if (!isDefined(value)) {
    throw new Error(`Configuration value '${name}' is required${extraErrorMessage}`);
  }
};

const defaulted = (value, defaultValue) => {
  if (isDefined(value)) {
    return value;
  }

  if (typeof defaultValue === 'function') {
    return defaultValue();
  }

  return defaultValue;
};

const defaultedExceptProduction = (name, value, defaultValue, isProduction) => {
  if (isProduction) {
    requireDefined(name, value, ' in production');
  }

  return defaulted(value, defaultValue);
};

// eslint-disable-next-line max-len
const defaultedWithStaticProduction = (value, defaultValue, productionValue, isProduction) => (isProduction ? productionValue : defaulted(value, defaultValue));

// eslint-disable-next-line max-len
const variablyDefaulted = (value, defaultValue, productionDefaultValue, isProduction) => defaulted(value, (isProduction ? productionDefaultValue : defaultValue));

const processedOrDefault = (value, processing, defaultValue) => {
  if (isDefined(value)) {
    return processing(value);
  }

  if (typeof defaultValue === 'function') {
    return defaultValue();
  }

  return defaultValue;
};

const fileFallbackDefaultedExceptProduction = (name, env, defaultValue, isProduction) => {
  if (isDefined(env[name])) {
    return env[name];
  }

  const namePath = `${name}_PATH`;
  if (isDefined(env[namePath])) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return fs.readFileSync(env[namePath]).toString();
  }

  return defaultedExceptProduction(name, undefined, defaultValue, isProduction);
};

module.exports = {
  defaulted,
  defaultedExceptProduction,
  defaultedWithStaticProduction,
  fileFallbackDefaultedExceptProduction,
  isDefined,
  processedOrDefault,
  requireDefined,
  variablyDefaulted,
};