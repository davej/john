import test from 'ava';
import fn from './';
import path from 'path';

test('simple', t =>
  fn(__dirname).then(tagged => {
    console.log(tagged);
    t.ok(tagged.dependencies);
    t.ok(tagged.devDependencies);
    t.is(tagged.dependencies[0].code, 0);
    t.ok(tagged.dependencies[0].command.length > 10);
    t.ok(tagged.dependencies[0].path.includes(__dirname));
    t.is(tagged.dependencies[0].tag, 'blue');
    t.is(tagged.devDependencies[0].tag, 'yellow');
  })
);

test('launched from within node_modules dir', t =>
  fn(path.join(__dirname, 'node_modules')).then(tagged => {
    t.ok(tagged.dependencies);
    t.ok(tagged.devDependencies);
    t.is(tagged.dependencies[0].code, 0);
    t.ok(tagged.dependencies[0].command.length > 10);
    t.ok(tagged.dependencies[0].path.includes(__dirname));
    t.is(tagged.dependencies[0].tag, 'blue');
    t.is(tagged.devDependencies[0].tag, 'yellow');
  })
);

test('different colors', t =>
  fn(__dirname, {
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
  fn('/foo/bar').then(t.fail, err => t.is(err.code, 'ENOENT'))
);

test('non-node path', t =>
  fn('/tmp').then(t.fail, err => t.is(err.code, 'ENOENT'))
);

test.after('clear tags', t =>
  fn(__dirname, {clear: true}).then(tagged => {
    t.ok(tagged.dependencies);
    t.ok(tagged.devDependencies);
    t.is(tagged.dependencies[0].tag, 'clear');
    t.is(tagged.devDependencies[0].tag, 'clear');
  })
);
