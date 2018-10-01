import { PathNode } from './';
import assert from 'assert';


// Define nodes...
// The root doesn't need pattern
const rootPathNode  = new PathNode();
// Pattern could be a string...
const aboutPathNode = new PathNode('about', { description: 'About page' });
const usersPathNode = new PathNode('users');
// ...or a regular expression
const userPathNode  = new PathNode(/^user-(?<userId>\d+)$/, { description: 'User page' });

// Nodes store the second argument as `.data`
assert.deepEqual(aboutPathNode.data, { description: 'About page' });
assert.strictEqual(usersPathNode.data, undefined);

// Make tree...
rootPathNode.push(aboutPathNode);
rootPathNode.push(usersPathNode);
usersPathNode.push(userPathNode);

// The root doesn't have a parent...
assert.strictEqual(rootPathNode.parent, null);
// ..but others do now...
assert.strictEqual(usersPathNode.parent, rootPathNode);
assert.strictEqual(userPathNode.parent, usersPathNode);

// We could also do it different:
/*
(new PathNode())
  .push(new PathNode('about'))
  .parent
  .push(new PathNode('users'))
    .push(new PathNode(/^user-(?<userId>\d+)$/));
*/


// Matching...
// We can match the root
assert.deepStrictEqual(rootPathNode.match([]),                        [ rootPathNode, {} ]);
// Or another path. We get an array of two elements. Theirst is the matched node...
assert.deepStrictEqual(rootPathNode.match([ 'about' ]),               [ aboutPathNode, {} ]);
// We got `null` on invalid path
assert.strictEqual(    rootPathNode.match([ 'invalid' ]),             null);
// ...and the second element is a dictionary of matched regexp's groups
assert.deepStrictEqual(rootPathNode.match([ 'users', 'user-12' ]),    [ userPathNode, { 'userId': '12' } ]);
// Of course every chonk of path should satisfy pattern
assert.strictEqual(    rootPathNode.match([ 'users', 'user-vasya' ]), null);
assert.strictEqual(    rootPathNode.match([ 'Users', 'user-12' ]),    null);

// We can start from other node. And pass some "previously matched data"
assert.deepStrictEqual(usersPathNode.match([ 'user-12' ], { 'some': 'value' }),
  [ userPathNode, { 'some': 'value', 'userId': '12' } ]);


// More complex...
const calendarPathNode = new PathNode(/calendar(?:-(?<month>\d{1,2}))?/i);
rootPathNode.push(calendarPathNode);
assert.deepStrictEqual(rootPathNode.match([ 'calendar-06' ]), [ calendarPathNode, { 'month': '06' } ]);
// Regular expression is case-insensetive
assert.deepStrictEqual(rootPathNode.match([ 'CaLeNdAr-06' ]), [ calendarPathNode, { 'month': '06' } ]);
// Optional groups are also supported
assert.deepStrictEqual(rootPathNode.match([ 'calendar' ]), [ calendarPathNode, { 'month': undefined } ]);
