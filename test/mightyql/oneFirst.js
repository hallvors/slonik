// @flow

/* eslint-disable flowtype/no-weak-types */

import test from 'ava';
import sinon from 'sinon';
import ExtendableError from 'es6-error';
import {
  oneFirst,
  DataIntegrityError,
  NotFoundError
} from '../../src';

class TestError extends ExtendableError {}

test('returns value of the first column from the first row', async (t) => {
  const stub = sinon.stub().returns({
    rows: [
      {
        foo: 1
      }
    ]
  });

  const connection: any = {
    query: stub
  };

  const result = await oneFirst(connection, {}, '');

  t.deepEqual(result, 1);
});

test('throws an error if no rows are returned', async (t) => {
  const stub = sinon.stub().returns({
    rows: []
  });

  const connection: any = {
    query: stub
  };

  await t.throws(oneFirst(connection, {}, ''), NotFoundError);
});

test('throws an error if no rows are returned (user defined error constructor)', async (t) => {
  const stub = sinon.stub().returns({
    rows: []
  });

  const connection: any = {
    query: stub
  };

  const clientConfiguration = {
    errors: {
      NotFoundError: TestError
    }
  };

  await t.throws(oneFirst(connection, clientConfiguration, ''), TestError);
});

test('throws an error if more than one row is returned', async (t) => {
  const stub = sinon.stub().returns({
    rows: [
      {
        foo: 1
      },
      {
        foo: 2
      }
    ]
  });

  const connection: any = {
    query: stub
  };

  await t.throws(oneFirst(connection, {}, ''), DataIntegrityError);
});

test('throws an error if more than one column is returned', async (t) => {
  const stub = sinon.stub().returns({
    rows: [
      {
        bar: 1,
        foo: 1
      }
    ]
  });

  const connection: any = {
    query: stub
  };

  await t.throws(oneFirst(connection, {}, ''), DataIntegrityError);
});
