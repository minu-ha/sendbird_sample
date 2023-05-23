import SendbirdChat from '@sendbird/chat';
import { SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import { FC } from 'react';

const ChatPage: FC = () => {
  const instance = SendbirdChat.instance as SendbirdGroupChat;
  console.log('instance => ', instance);

  return (
    <>
      <div></div>
    </>
  );
};

export default ChatPage;
