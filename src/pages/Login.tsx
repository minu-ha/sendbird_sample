import { FC } from 'react';
import { SENDBIRD_INFO } from '../constants/sendbird';
import SendbirdChat from '@sendbird/chat';
import { OpenChannelModule, SendbirdOpenChat } from '@sendbird/chat/openChannel';

const Login: FC = () => {
  const handleClick = async () => {
    try {
      const sb = SendbirdChat.init({
        appId: SENDBIRD_INFO.appId,
        modules: [new OpenChannelModule()],
      }) as SendbirdOpenChat;

      await sb.connect('minu0604@naver.com');
      console.log('User connected:', sb.currentUser);

      const params = {
        name: 'My new open channel',
        operatorIds: ['minu0604@naver.com'],
      };
      const channel = await sb.openChannel.createChannel(params as any);
      console.log('Open channel created:', channel);
      await channel.enter();

      window.location.href = channel.url;
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <>
      <button onClick={handleClick}>채팅방 열기</button>
    </>
  );
};

export default Login;
