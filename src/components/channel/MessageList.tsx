import Message from 'components/channel/Message';
import ProfileImage from 'components/channel/ProfileImage';
import { FC } from 'react';
import { FileMessage, User, UserMessage } from 'sendbird';

interface MessagesListProps {
  messages: UserMessage[];
  handleDeleteMessage: (message: UserMessage) => void;
  updateMessage: (message: UserMessage) => void;
}

const MessagesList: FC<MessagesListProps> = ({ messages, handleDeleteMessage, updateMessage }) => {
  let sb: { currentUser: { userId: string } };

  return (
    <div className="message-list">
      {messages.map((message: UserMessage | FileMessage) => {
        if (!message.sender) return null;
        const messageSentByYou = message.sender.userId === sb.currentUser?.userId;
        return (
          <div
            key={message.messageId}
            className={`message-item ${messageSentByYou ? 'message-from-you' : ''}`}
          >
            <Message
              message={message}
              handleDeleteMessage={handleDeleteMessage}
              updateMessage={updateMessage}
              messageSentByYou={messageSentByYou}
            />
            <ProfileImage user={message.sender as User} />
          </div>
        );
      })}
    </div>
  );
};

export default MessagesList;
