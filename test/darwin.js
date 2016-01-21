import test from 'ava';
import fn from '../';
import path from 'path';
const rootDir = path.resolve(__dirname, '../');

if (process.platform === 'darwin') {
  test('simple', t =>
    fn(rootDir).then(tagged => {
      t.ok(tagged.dependencies);
      t.ok(tagged.devDependencies);
      t.is(tagged.dependencies[0].code, 0);
      t.ok(tagged.dependencies[0].command.length > 10);
      t.ok(tagged.dependencies[0].path.includes(rootDir));
      t.is(tagged.dependencies[0].tag, 'blue');
      t.is(tagged.devDependencies[0].tag, 'yellow');
    })
  );

  test('launched from within node_modules dir', t =>
    fn(path.join(rootDir, 'node_modules')).then(tagged => {
      t.ok(tagged.dependencies);
      t.ok(tagged.devDependencies);
      t.is(tagged.dependencies[0].code, 0);
      t.ok(tagged.dependencies[0].command.length > 10);
      t.ok(tagged.dependencies[0].path.includes(rootDir));
      t.is(tagged.dependencies[0].tag, 'blue');
      t.is(tagged.devDependencies[0].tag, 'yellow');
    })
  );

  test('different colors', t =>
    fn(rootDir, {
      dependencyColor: 'green',
      devDependencyColor: 'purple'
    }).then(tagged => {
      t.ok(tagged.dependencies);
      t.ok(tagged.devDependencies);
      t.is(tagged.dependencies[0].tag, 'green');
      t.is(tagged.devDependencies[0].tag, 'purple');
    })
  );

  test('invalid path', t =>
    fn('/foo/bar').then(t.fail, err => t.ok(err.message.includes('couldn\'t find package.json')))
  );

  test('non-node path', t =>
    fn('/tmp').then(t.fail, err => t.ok(err.message.includes('couldn\'t find package.json')))
  );

  test.after('clear tags', t =>
    fn(rootDir, {clear: true}).then(tagged => {
      t.ok(tagged.dependencies);
      t.ok(tagged.devDependencies);
      t.is(tagged.dependencies[0].tag, 'clear');
      t.is(tagged.devDependencies[0].tag, 'clear');
    })
  );
} else {
  test('skip darwin tests', t =>
    t.pass()
  );
}
