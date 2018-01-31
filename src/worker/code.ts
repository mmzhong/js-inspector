import * as ESTree from 'estree';
import delay from './delay';
import { MessageType } from '../components/WorkerMessage';

const parseOptions: acorn.Options = {
  ecmaVersion: 6,
  sourceType: 'script',
  locations: true
}

interface Insertion {
  position: number,
  data: ESTree.SourceLocation
}

type AcornNode = acorn.Node;
type Chunks = string[];
interface Transformer {
  [key: string]: (node: EnhancedNode, id: number, before: (node: EnhancedNode, id: number) => string, after: (node: EnhancedNode, id: number) => string) => void;
}

export interface EnhancedNode extends AcornNode {
  parent?: EnhancedNode;
  source(): string;
  update(newCode: string): void;
};

function shouldInjectTmpValue(type: string) {
  return type === 'ExpressionStatement' || type === 'BinaryExpression';
}
let tmpValueId = 0;
const globalTmpObject = '__tmp';
const tmpValuePrefix = '_';
export const defaultTransformer: Transformer = {
  CallExpression(node, id, before, after) {
    let source = node.source();
    const tmpValue = `${tmpValuePrefix}${tmpValueId}`;
    if (node.callee.source() === 'console.log') {
      source = `log(${node.arguments.map((arg: EnhancedNode) => arg.source()).join(', ')})`;
    }
    node.update(`(${before(node, id)}, ${globalTmpObject}.${tmpValue} = ${source}, ${after(node, id)}, ${globalTmpObject}.${tmpValue})`);
    tmpValueId++;
  },
  BinaryExpression(node, id, before, after) {
    const tmpValue = `${tmpValuePrefix}${tmpValueId}`;
    node.update(`(${before(node, id)}, ${globalTmpObject}.${tmpValue} = ${node.source()}, ${after(node, id)}, ${globalTmpObject}.${tmpValue})`);
    tmpValueId++;
  },
}

function before(node: EnhancedNode, id: number): string {
  const body = generate(function(messageType, id, type, source, location) {
    postMessage({
      type: "$messageType$",
      data: {
        id: "$id$",
        type: "$type$",
        source: "$source$",
        location: "$location$"
      }
    }),
    delay();
  }, MessageType.executeBefore, id, JSON.stringify(node.type), JSON.stringify(node.source()), JSON.stringify(node.loc));
  return body.substring(0, body.lastIndexOf(';')) // remove last comma
}

function after(node: EnhancedNode, id: number): string {
  const body = generate(function(messageType, id, type, source, location) {
    postMessage({
      type: "$messageType$",
      data: {
        id: "$id$",
        type: "$type$",
        source: "$source$",
        location: "$location$"
      }
    }),
    delay();
  }, MessageType.executeAfter, id, JSON.stringify(node.type), JSON.stringify(node.source()), JSON.stringify(node.loc));
  return body.substring(0, body.lastIndexOf(';')) // remove last comma
}

export function transform(code: string, transformer = defaultTransformer, options = parseOptions): string {
  const chunks = code.split('');
  const ast = acorn.parse(code, options);
  let id = 0;

  function walk(node: EnhancedNode, parent?: EnhancedNode) {
    enhanceNode(node, chunks, parent);
    
    Object.keys(node).forEach(key => {
      if (key === 'parent') return;

      const child = node[key];
      if (Array.isArray(child)) {
        child.forEach((c: EnhancedNode) => {
          if (c && typeof c.type === 'string') {
            walk(c, node);
          }
        });
      } else if (child && typeof child.type === 'string') {
        walk(child, node);
      }
    });
    transformer[node.type] && transformer[node.type](node as EnhancedNode, id, before, after);
    id++;
  }

  walk(ast as EnhancedNode, undefined);

  const source = (ast as EnhancedNode).source();
  return `const __tmp = {};${source}`;
}

function enhanceNode(node: AcornNode, chunks: Chunks, parent?: AcornNode): void {
  const { start, end } = node;

  node.parent = parent;

  (node as EnhancedNode).source = function() {
    return chunks.slice(start, end).join('');
  };
  (node as EnhancedNode).update = function(newCode: string):void {
    chunks[start] = newCode;
    for (let i = start + 1; i < end; i++) {
      chunks[i] = '';
    }
  }
}

export function generate(fn: (...args: any[]) => void, ...args: any[]): string {
  const fnStr = fn.toString();
  const argNames = getArgNames(fnStr);
  const body = getFnBody(fnStr);
  return injectArgs(body, args, argNames);
}

function getArgNames(fnStr: string): string[] {
  return fnStr.match(/^function\s*\((.*)\)[^{]{/)![1].split(',').map(s => s.trim());
}

function getFnBody(fnStr: string): string {
  const blockBeginIndex = fnStr.indexOf('{'), blockEndIndex = fnStr.lastIndexOf('}');
  return fnStr.substring(blockBeginIndex + 1, blockEndIndex);
}

function injectArgs(body: string, args: any[], argNames: string[]): string {
  argNames.forEach((name, i) => {
    const regexp = new RegExp(`['"]\\$${name}\\$['"]`, 'g');
    let value = args[i];
    body = body.replace(regexp, value);
  });
  return body;
}

export function execute(code: string) {
  const executeCode = eval; // prevent rollup warning
  postMessage({
    type: MessageType.scriptBefore
  });
  executeCode(code);
  postMessage({
    type: MessageType.scriptAfter
  });
}