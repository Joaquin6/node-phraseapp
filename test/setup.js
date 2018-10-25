import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Promise from 'bluebird';
import { uniqueId } from 'lodash';

import config from '../config';

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

global.sinon = sinon;
global.config = config;
global.expect = expect;
global.Promise = Promise;

global.createRandomString = uniqueId;

global.defaultServiceInjections = (injections = {}) => ({
  config,
  ...injections,
});
