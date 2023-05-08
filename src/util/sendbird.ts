import SendbirdChat from '@sendbird/chat';
import { OpenChannelModule, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import { SENDBIRD_INFO } from '../constants/sendbird';

const sb = SendbirdChat.init({
  appId: SENDBIRD_INFO.appId,
  modules: [new OpenChannelModule()],
}) as SendbirdOpenChat;
