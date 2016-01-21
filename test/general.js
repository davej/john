import test from 'ava';
import fn from '../';

test('invalid path', t =>
  fn('/foo/bar').then(t.fail, err => t.ok(err.message.includes('couldn\'t find package.json')))
);

test('non-node path', t =>
  fn('/tmp').then(t.fail, err => t.ok(err.message.includes('couldn\'t find package.json')))
);
