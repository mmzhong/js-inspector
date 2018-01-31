export enum MessageType {
  transform,
  executeBefore,
  executeAfter,
  console,
}

export interface MessageData {
  readonly type: MessageType
  readonly value: string
}