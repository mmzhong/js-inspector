import * as _acorn from 'acorn';
import * as ESTree from 'estree';

declare global {
  namespace acorn {
    export class Node extends _acorn.Node {
      body: Node | Node[];
      [key: string]: any;
    }
    export interface Options extends _acorn.Options {}
    export function parse(code: string, options: _acorn.Options): Node;

    namespace walk {
      function simple(node: ESTree.Program, visitor: any, base?: any, state?: any, override?: any): void;
      function ancestor(node: ESTree.Program, visitor: any, base?: any, state?: any): void;
      const base: any;
    }
  }
}