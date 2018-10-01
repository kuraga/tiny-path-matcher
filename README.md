# TinyPathMatcher

This is a tiny (~50 SLOC and and zero-dependency) hierarchical path (tree node) matcher.

[![npm version](https://badge.fury.io/js/tiny-path-matcher.svg)](http://badge.fury.io/js/tiny-path-matcher)

## Installation

```sh
npm install tiny-path-matcher
```

(Note: an ES2018+ESM-compatible environment is required.)

## Getting started

```js
import { PathNode } from 'tiny-path-matcher';

const rootPathNode  = new PathNode(),
  usersPathNode     = new PathNode('users');
  userPathNode      = new PathNode(/^user-(?<userId>\d+)$/, { description: 'User page' });

rootPathNode.push(usersPathNode);
usersPathNode.push(userPathNode);

let [ pathNode, groups ] = rootPathNode.match([ 'users', 'user-12' ]);
// assert.strictEqual(pathNode, userPathNode)
// assert.deepStrictEqual(grooups, { 'userId': '12' });

rootPathNode.match([ 'users', 'user-12' ]);  // === null
```

## Example

See a full example [here](https://github.com/kuraga/tiny-path-matcher/blob/master/example.mjs).

## Author

Alexander Kurakin <<kuraga333@mail.ru>>

## Inspired by

* [route-trie](https://github.com/zensh/route-trie).

## Feedback and contribute

<https://github.com/kuraga/tiny-path-matcher/issues>

## License

MIT
