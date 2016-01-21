import test from 'ava';

if (process.platform === 'win32') {
  test('simple', t =>
    t.pass()
  );
} else {
  test('skip win32 tests', t =>
    t.pass()
  );
}
