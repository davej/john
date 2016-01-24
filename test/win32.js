import test from 'ava';
import fn from '../';
import path from 'path';
const rootDir = path.resolve(__dirname, '../');

if (process.platform === 'win32') {
  test('simple run with defaults', t =>
    fn(rootDir).then(files => {
      t.ok(files.dependencies);
      t.ok(files.devDependencies);
      t.ok(files.dependencies[0].path.includes(rootDir));
      t.is(files.dependencies[0].hidden, false);
      t.is(files.devDependencies[0].hidden, false);
    })
  );

  test('launched from within node_modules dir', t =>
    fn(path.join(rootDir, 'node_modules')).then(files => {
      t.ok(files.dependencies);
      t.ok(files.devDependencies);
      t.ok(files.dependencies[0].path.includes(rootDir));
      t.is(files.dependencies[0].hidden, false);
      t.is(files.devDependencies[0].hidden, false);
    })
  );

  test('hide dependencies', t =>
    fn(rootDir, {
      dependencyHidden: true,
      devDependencyHidden: false
    }).then(files => {
      t.ok(files.dependencies);
      t.ok(files.devDependencies);
      t.is(files.dependencies[0].hidden, true);
      t.is(files.devDependencies[0].hidden, false);
    })
  );

  test('hide devDependencies', t =>
    fn(rootDir, {
      dependencyHidden: false,
      devDependencyHidden: true
    }).then(files => {
      t.ok(files.dependencies);
      t.ok(files.devDependencies);
      t.is(files.dependencies[0].hidden, false);
      t.is(files.devDependencies[0].hidden, true);
    })
  );

  test.after('clear and show all', t =>
    fn(rootDir, {clear: true}).then(files => {
      t.ok(files.dependencies);
      t.ok(files.devDependencies);
      t.is(files.dependencies[0].hidden, false);
      t.is(files.devDependencies[0].hidden, false);
    })
  );
} else {
  test('skip win32 tests', t =>
    t.pass()
  );
}
