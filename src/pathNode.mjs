export default class PathNode {
  constructor(pattern = null, data = undefined) {
    if (pattern !== null
      && Object.prototype.toString.call(pattern) !== '[object String]'
      && Object.prototype.toString.call(pattern) !== '[object RegExp]') {
      throw TypeError('pattern should be a string or a regular expression');
    }

    this.pattern = pattern;
    this.data = data;

    this.parent = null;
    this.children = [];
  }

  push(node) {
    if (!(node instanceof PathNode)) {
      throw new TypeError('node should be a PathNode');
    }

    if (node.pattern === null) {
      throw new Error('can\'t push a root node (without pattern) as a child');
    }

    node.parent = this;
    this.children.push(node);

    return node;
  }

  match(chunks, matched = {}) {
    if (chunks.length === 0) {
      return [ this, matched ];
    }

    for (let chunk of chunks) {
      if (Object.prototype.toString.call(chunk) !== '[object String]') {
        throw new TypeError('every chunk should be a string or a regular expression');
      }
    }

    if (this.children.length !== 0) {
      const newChunks = chunks.slice(1);
      for (let child of this.children) {
        if (Object.prototype.toString.call(child.pattern) === '[object String]' && chunks[0] === child.pattern
          || Object.prototype.toString.call(child.pattern) === '[object RegExp]' && child.pattern.test(chunks[0])) {
          if (Object.prototype.toString.call(child.pattern) === '[object RegExp]') {
            matched = Object.assign(matched, child.pattern.exec(chunks[0]).groups);
          }

          const result = child.match(newChunks, matched);
          if (result !== null) {
            return result;
          }
        }
      }
    }

    return null;
  }
}
