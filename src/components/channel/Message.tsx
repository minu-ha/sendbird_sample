import { FC } from 'react';
import { FileMessage, UserMessage } from 'sendbird';
import { timestampToTime } from 'util/message';

interface MessageProps {
  message: UserMessage | FileMessage;
  updateMessage: (message: UserMessage) => void;
  handleDeleteMessage: (message: UserMessage) => void;
  messageSentByYou: boolean;
}

const Message: FC<MessageProps> = ({
  message,
  updateMessage,
  handleDeleteMessage,
  messageSentByYou,
}) => {
  // let sb: { currentUser: { userId: string } };

  // const messageSentByCurrentUser = message.sender?.userId === sb.currentUser?.userId;

  if ((message as FileMessage).url && message.sender) {
    return (
      <div className={`message ${messageSentByYou ? 'message-from-you' : ''}`}>
        <div className="message-user-info">
          <div className="message-sender-name">{message.sender.nickname} </div>
          <div>{timestampToTime(message.createdAt)}</div>
        </div>
        <img src={(message as FileMessage).url} alt={''} />
      </div>
    );
  }

  return (
    <div className={`message ${messageSentByYou ? 'message-from-you' : ''}`}>
      <div className="message-info">
        <div className="message-user-info">
          <div className="message-sender-name">{message.sender?.nickname} </div>
          <div>{timestampToTime(message.createdAt)}</div>
        </div>
        {
          <div>
            <button
              className="control-button"
              onClick={() => updateMessage(message as UserMessage)}
            >
              <img className="message-icon" src="/icon_edit.png" alt={''} />
            </button>
            <button
              className="control-button"
              onClick={() => handleDeleteMessage(message as UserMessage)}
            >
              <img className="message-icon" src="/icon_delete.png" alt={''} />
            </button>
          </div>
        }
      </div>
      <div>{(message as UserMessage).message}</div>
    </div>
  );
};

export default Message;
