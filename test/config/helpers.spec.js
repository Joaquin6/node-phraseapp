import fs from 'fs';
import path from 'path';

import {
  defaulted,
  defaultedExceptProduction,
  defaultedWithStaticProduction,
  fileFallbackDefaultedExceptProduction,
  isDefined,
  processedOrDefault,
  requireDefined,
  variablyDefaulted,
} from '../../config/helpers';

describe('config helpers', () => {
  describe('isDefined', () => {
    it('returns false when given an undefined value', () => {
      expect(isDefined(undefined)).not.true;
    });

    it('returns false when given an undefined variable', () => {
      let foo;
      expect(isDefined(foo)).not.true;
    });

    it('returns true when given something that is defined', () => {
      expect(isDefined('hello')).true;
    });
  });

  describe('requireDefined', () => {
    it('does nothing when given a defined value', () => {
      expect(() => requireDefined('', '')).not.throw();
    });

    it('throws an error when given an undefined value', () => {
      expect(() => requireDefined('', undefined)).throw();
    });

    it('throws an error specifying the variable that is being checked', () => {
      const name = 'NAME';

      try {
        requireDefined(name, undefined);
      } catch (e) {
        expect(e.message).equal('Configuration value \'NAME\' is required');
        return;
      }

      expect(false, 'test should have thrown').true;
    });

    it('allows for extra text to be appended to the error message', () => {
      const name = 'NAME';
      const extra = ' blahblahblah';

      try {
        requireDefined(name, undefined, extra);
      } catch (e) {
        expect(e.message).equal('Configuration value \'NAME\' is required blahblahblah');
        return;
      }

      expect(false, 'test should have thrown').true;
    });
  });

  describe('defaulted', () => {
    it('returns the input value if it is not undefined', () => {
      expect(defaulted('hello', 'goodbye')).equal('hello');
    });

    it('returns the default value if the input is undefined', () => {
      expect(defaulted(undefined, 'goodbye')).equal('goodbye');
    });

    it('returns the result of invoking default value if the input is undefined and the default value is a function', () => {
      expect(defaulted(undefined, () => 'goodbye')).equal('goodbye');
    });

    it('does not invoke default value if the input is defined', () => {
      const defaultValue = sinon.stub().returns('goodbye');
      expect(defaulted('hello', defaultValue)).equal('hello');
      expect(defaultValue).not.called;
    });
  });

  describe('defaultedExceptProduction', () => {
    it('follows the behavior of `defaulted` if input value is defined', () => {
      expect(defaultedExceptProduction('NAME', 'hello', 'goodbye', false)).equal('hello');
      expect(defaultedExceptProduction('NAME', 'hello', 'goodbye', true)).equal('hello');
    });

    it('follows the behavior of `defaulted` if input value is undefined and isProduction is false', () => {
      const defaultValue = sinon.stub().returns('goodbye');

      expect(defaultedExceptProduction('NAME', undefined, defaultValue), false).equal('goodbye');
      expect(defaultValue).calledOnce;
    });

    it('throws an error if input value is undefined and isProduction is true', () => {
      const defaultValue = sinon.stub().returns('goodbye');

      try {
        defaultedExceptProduction('NAME', undefined, defaultValue, true);
      } catch (e) {
        expect(e.message).equal('Configuration value \'NAME\' is required in production');
        expect(defaultValue).not.called;
        return;
      }

      expect(false, 'test should have thrown').true;
    });
  });

  describe('defaultedWithStaticProduction', () => {
    it('follows the behavior of `defaulted` if isProduction is false', () => {
      expect(defaultedWithStaticProduction('hello', 'goodbye', '', false)).equal('hello');
      expect(defaultedWithStaticProduction(undefined, 'goodbye', '', false)).equal('goodbye');
    });

    it('returns the static value if `isProduction` is true', () => {
      expect(defaultedWithStaticProduction('hello', 'goodbye', 'prod', true)).equal('prod');
    });
  });

  describe('variablyDefaulted', () => {
    it('follows the behavior of `defaulted` if isProduction is false', () => {
      expect(variablyDefaulted('hello', 'goodbye', 'aloha', false)).equal('hello');
      expect(variablyDefaulted(undefined, 'goodbye', 'aloha', false)).equal('goodbye');
    });

    it('follows the behavior of `defaulted` if isProduction is true, but uses the second default value', () => {
      expect(variablyDefaulted('hello', 'goodbye', 'aloha', true)).equal('hello');
      expect(variablyDefaulted(undefined, 'goodbye', 'aloha', true)).equal('aloha');
    });
  });

  describe('processedOrDefault', () => {
    it('follows the behavior of `defaulted` if input value is undefined', () => {
      expect(processedOrDefault(undefined, null, 'goodbye')).equal('goodbye');
    });

    it('follows the behavior of `defaulted` if defaultValue is a function', () => {
      const defaultValueFunction = sinon.stub().returns('aloha');
      expect(processedOrDefault(undefined, null, defaultValueFunction)).equal('aloha');
    });

    it('runs input through process function if input is defined, and returns the result', () => {
      const processFunction = sinon.stub().returns('aloha');
      expect(processedOrDefault('hello', processFunction, 'goodbye')).equal('aloha');
      expect(processFunction).calledWithExactly('hello');
    });
  });

  describe('fileFallbackDefaultedExceptProduction', () => {
    const testfile = path.resolve(__dirname, __filename);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const testfileContents = fs.readFileSync(testfile).toString();

    it('follows `defaulted` behavior if input value is defined', () => {
      expect(fileFallbackDefaultedExceptProduction('NAME', { NAME: 'hello' }, 'goodbye', false)).equal('hello');
      expect(fileFallbackDefaultedExceptProduction('NAME', { NAME: 'hello' }, 'goodbye', true)).equal('hello');
    });

    it('reads the file specified by _PATH if _PATH is defined in the environment', () => {
      expect(fileFallbackDefaultedExceptProduction('NAME', { NAME_PATH: testfile }, 'goodbye', false)).equal(testfileContents);
      expect(fileFallbackDefaultedExceptProduction('NAME', { NAME_PATH: testfile }, 'goodbye', true)).equal(testfileContents);
    });

    it('follows `defaultedExceptProduction` behavior if input value and _PATH are not defined', () => {
      expect(fileFallbackDefaultedExceptProduction('NAME', { }, 'goodbye', false)).equal('goodbye');
      expect(() => fileFallbackDefaultedExceptProduction('NAME', {}, 'goodbye', true)).throw();
    });
  });
});
