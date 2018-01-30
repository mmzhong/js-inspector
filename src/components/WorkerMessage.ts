export enum MessageType {
  transform,
  executeBefore,
  executeAfter
}

export interface MessageData {
  readonly type: MessageType
  readonly value: string
}