export interface MessageInterface {
  senderId: string;
  text: string;
  isSeen?: boolean;
  attachment?: string;
}
