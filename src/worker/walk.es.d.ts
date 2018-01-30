
declare module 'acorn/dist/walk.es' {
  // import 必须在 declare module 里面, @see https://stackoverflow.com/questions/42693836/typescript-custom-declaration-files-for-untyped-npm-modules
  import * as ESTree from 'estree';

  export function simple(node: ESTree.Program, visitor: any, base?: any, state?: any, override?: any): void;
  export function ancestor(node: ESTree.Program, visitor: any, base?: any, state?: any): void;
  export const base: any;

  import * as acorn from 'acorn';
}