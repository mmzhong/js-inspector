export enum MessageType {
  transform,
  executeBefore,
  executeAfter,
  scriptBefore,
  scriptAfter,
  timeoutStart,
  timeoutEnd,
  timeoutFinished,
  console,
}

export interface MessageData {
  readonly type: MessageType
  readonly value: string
}