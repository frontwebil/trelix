type User = {
  id: string;
  name: string;
  avatar: string;
};

export type MessageType = {
  id: string;
  text: string;
  receiverId: string;
  createdAt: Date;
  senderId: string;
  sender: User;
  receiver: User;
};
