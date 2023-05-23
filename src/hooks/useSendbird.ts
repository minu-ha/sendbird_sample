import SendbirdChat, { SendbirdChatParams, UserUpdateParams } from '@sendbird/chat';
import { GroupChannelModule, SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import { SENDBIRD_INFO } from 'constants/sendbird';

export const useSendbird = () => {
  const setupUser = async () => {
    try {
      const params: SendbirdChatParams<[GroupChannelModule]> = {
        appId: SENDBIRD_INFO.APP_ID,
        localCacheEnabled: true,
        modules: [new GroupChannelModule()],
      };

      const instance = (await SendbirdChat.init(params)) as SendbirdGroupChat;

      await instance.connect(crypto.randomUUID());
      await instance.setChannelInvitationPreference(true);

      const userUpdateParams: UserUpdateParams = {};
      await instance.updateCurrentUserInfo(userUpdateParams);

      // 성공적으로 완료되었을 때 추가 작업 수행
    } catch (error) {
      // 오류 처리
      console.error('An error occurred:', error);
    }
  };

  const sb = SendbirdChat.instance as SendbirdGroupChat;
  return {
    sb,
    setupUser,
  };
};
