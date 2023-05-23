import SendbirdChat, { UserUpdateParams } from '@sendbird/chat';
import {
  GroupChannelCreateParams,
  GroupChannelFilter,
  GroupChannelListOrder,
  GroupChannelModule,
  MessageCollectionInitPolicy,
  MessageFilter,
} from '@sendbird/chat/groupChannel';
import ChannelList from 'components/channel/ChannelList';
import CreateUserForm from 'components/channel/CreateUserForm';
import MembersSelect from 'components/channel/MemberSelect';
import { SENDBIRD_INFO } from 'constants/sendbird';
import { FC, useRef, useState } from 'react';

interface OnMessagesUpdatedParams {
  context: any;
  channel: any;
  messages: any;
}

interface OnMessagesAddedParams {
  context: any;
  channel: any;
  messages: any;
}

interface OnMessagesDeletedParams {
  context: any;
  channel: any;
  messageIds: any;
}

let sb: any;
const ChannelPage: FC = () => {
  const [state, setState] = useState<any>({
    applicationUsers: [],
    groupChannelMembers: [],
    currentlyJoinedChannel: null,
    messages: [],
    channels: [],
    messageInputValue: '',
    userNameInputValue: '',
    userIdInputValue: '',
    channelNameUpdateValue: '',
    settingUpUser: true,
    file: null,
    messageToUpdate: null,
    messageCollection: null,
    loading: false,
    error: false,
  });

  const stateRef = useRef<any>();
  stateRef.current = state;

  const channelRef = useRef();

  /**
   *  유저 세팅
   */
  const setupUser = async () => {
    const { userNameInputValue, userIdInputValue } = state;
    const sendbirdChat = await SendbirdChat.init({
      appId: SENDBIRD_INFO.APP_ID,
      localCacheEnabled: true,
      modules: [new GroupChannelModule()],
    });
    console.log('sendbirdChat => ', sendbirdChat);

    await sendbirdChat.connect(userIdInputValue);
    await sendbirdChat.setChannelInvitationPreference(true);

    const userUpdateParams: UserUpdateParams = {};
    userUpdateParams.nickname = userNameInputValue;
    await sendbirdChat.updateCurrentUserInfo(userUpdateParams);

    sb = sendbirdChat;
    setState({ ...state, loading: true });
    const [channels, error] = await loadChannels(channelHandlers);
    if (error) {
      return onError(error);
    }

    setState({ ...state, channels: channels, loading: false, settingUpUser: false });
  };

  const channelHandlers = {
    onChannelsAdded: (context: any, channels: any) => {
      const updatedChannels = [...channels, ...stateRef.current.channels];
      setState({ ...stateRef.current, channels: updatedChannels, applicationUsers: [] });
    },
    onChannelsDeleted: (context: any, channels: string | any[]) => {
      const updatedChannels = stateRef.current.channels.filter((channel: { url: string }) => {
        return !channels.includes(channel.url);
      });
      setState({ ...stateRef.current, channels: updatedChannels });
    },
    onChannelsUpdated: (context: any, channels: any[]) => {
      const updatedChannels = stateRef.current.channels.map((channel: { url: any }) => {
        const updatedChannel = channels.find(
          incomingChannel => incomingChannel.url === channel.url
        );
        if (updatedChannel) {
          return updatedChannel;
        } else {
          return channel;
        }
      });

      setState({ ...stateRef.current, channels: updatedChannels });
    },
  };

  const messageHandlers = {
    onMessagesAdded: ({ context, channel, messages }: OnMessagesAddedParams) => {
      const updatedMessages = [...stateRef.current.messages, ...messages];

      setState({ ...stateRef.current, messages: updatedMessages });
    },
    onMessagesUpdated: ({ context, channel, messages }: OnMessagesUpdatedParams) => {
      const updatedMessages = [...stateRef.current.messages];
      for (const i in messages) {
        const incomingMessage = messages[i];
        const indexOfExisting = stateRef.current.messages.findIndex((message: { reqId: any }) => {
          return incomingMessage.reqId === message.reqId;
        });

        if (indexOfExisting !== -1) {
          updatedMessages[indexOfExisting] = incomingMessage;
        }
        if (!incomingMessage.reqId) {
          updatedMessages.push(incomingMessage);
        }
      }

      setState({ ...stateRef.current, messages: updatedMessages });
    },
    onMessagesDeleted: ({ context, channel, messageIds }: OnMessagesDeletedParams) => {
      const updateMessages = stateRef.current.messages.filter((message: { messageId: any }) => {
        return !messageIds.includes(message.messageId);
      });
      setState({ ...stateRef.current, messages: updateMessages });
    },
    // onChannelUpdated: (context, channel) => {},
    // onChannelDeleted: (context, channelUrl) => {},
    // onHugeGapDetected: () => {},
  };

  const handleJoinChannel = async (channelUrl: any) => {
    if (state.messageCollection && state.messageCollection.dispose) {
      state.messageCollection?.dispose();
    }

    if (state.currentlyJoinedChannel?.url === channelUrl) {
      return null;
    }
    const { channels } = state;
    setState({ ...state, loading: true });
    const channel = channels.find((channel: { url: any }) => channel.url === channelUrl);
    const onCacheResult = (err: any, messages: any[]) => {
      setState({
        ...stateRef.current,
        currentlyJoinedChannel: channel,
        messages: messages.reverse(),
        loading: false,
      });
    };

    const onApiResult = (err: any, messages: any[]) => {
      setState({
        ...stateRef.current,
        currentlyJoinedChannel: channel,
        messages: messages.reverse(),
        loading: false,
      });
    };

    const collection = loadMessages(channel, messageHandlers, onCacheResult, onApiResult);

    setState({ ...state, messageCollection: collection });
  };

  const onError = (error: { message: any }) => {
    setState({ ...state, error: error.message });
    console.log(error);
  };
  const handleDeleteChannel = async (channelUrl: any) => {
    const [channel, error] = await deleteChannel(channelUrl);
    if (error) {
      return onError(error);
    }
  };

  const addToChannelMembersList = (userId: any) => {
    const groupChannelMembers = [...state.groupChannelMembers, userId];
    setState({ ...state, groupChannelMembers: groupChannelMembers });
  };
  const onUserNameInputChange = (e: { currentTarget: { value: any } }) => {
    const userNameInputValue = e.currentTarget.value;
    setState({ ...state, userNameInputValue });
  };

  const onUserIdInputChange = (e: { currentTarget: { value: any } }) => {
    const userIdInputValue = e.currentTarget.value;
    setState({ ...state, userIdInputValue });
  };

  const handleCreateChannel = async (channelName = 'testChannel') => {
    const [groupChannel, error] = await createChannel(channelName, state.groupChannelMembers);
    if (error) {
      return onError(error);
    }
  };

  const handleUpdateChannelMembersList = async () => {
    const { currentlyJoinedChannel, groupChannelMembers } = state;
    await inviteUsersToChannel(currentlyJoinedChannel, groupChannelMembers);
    setState({ ...state, applicationUsers: [] });
  };

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div className="error">{state.error} check console for more information.</div>;
  }
  const handleLoadMemberSelectionList = async () => {
    setState({ ...state, currentlyJoinedChannel: null });
    const [users, error] = await getAllApplicationUsers();
    if (error) {
      return onError(error);
    }
    setState({
      ...state,
      currentlyJoinedChannel: null,
      applicationUsers: users,
      groupChannelMembers: [sb.currentUser.userId],
    });
  };
  return (
    <>
      <CreateUserForm
        setupUser={setupUser}
        settingUpUser={state.settingUpUser}
        userNameInputValue={state.userNameInputValue}
        userIdInputValue={state.userIdInputValue}
        onUserNameInputChange={onUserNameInputChange}
        onUserIdInputChange={onUserIdInputChange}
      />
      <ChannelList
        channels={state.channels}
        handleJoinChannel={handleJoinChannel}
        handleDeleteChannel={handleDeleteChannel}
        handleLoadMemberSelectionList={handleLoadMemberSelectionList}
      />
      <MembersSelect
        applicationUsers={state.applicationUsers}
        groupChannelMembers={state.groupChannelMembers}
        currentlyJoinedChannel={state.currentlyJoinedChannel}
        addToChannelMembersList={addToChannelMembersList}
        handleCreateChannel={handleCreateChannel}
        handleUpdateChannelMembersList={handleUpdateChannelMembersList}
      />
    </>
  );
};
export default ChannelPage;
const loadChannels = async (channelHandlers: any) => {
  const groupChannelFilter = new GroupChannelFilter();
  groupChannelFilter.includeEmpty = true;

  const collection = sb.groupChannel.createGroupChannelCollection({
    filter: groupChannelFilter,
    order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
  });

  collection.setGroupChannelCollectionHandler(channelHandlers);

  const channels = await collection.loadMore();
  return [channels, null];
};

const deleteChannel = async (channelUrl: any) => {
  try {
    const channel = await sb.groupChannel.getChannel(channelUrl);
    await channel.delete();
    return [channel, null];
  } catch (error) {
    return [null, error];
  }
};

const createChannel = async (channelName: string, userIdsToInvite: any) => {
  try {
    const groupChannelParams: GroupChannelCreateParams = {
      name: channelName,
      invitedUserIds: userIdsToInvite,
      operatorUserIds: userIdsToInvite,
    };
    const groupChannel = await sb.groupChannel.createChannel(groupChannelParams);
    return [groupChannel, null];
  } catch (error) {
    return [null, error];
  }
};

const getAllApplicationUsers = async () => {
  try {
    const userQuery = sb.createApplicationUserListQuery({ limit: 100 });
    const users = await userQuery.next();
    return [users, null];
  } catch (error) {
    return [null, error];
  }
};

const inviteUsersToChannel = async (
  channel: { inviteWithUserIds: (arg0: any) => any },
  userIds: any
) => {
  await channel.inviteWithUserIds(userIds);
};

const loadMessages = (
  channel: {
    createMessageCollection: (arg0: { filter: any; startingPoint: number; limit: number }) => any;
  },
  messageHandlers: any,
  onCacheResult: (err: any, messages: any[]) => void,
  onApiResult: (err: any, messages: any[]) => void
) => {
  const messageFilter = new MessageFilter();

  const collection = channel.createMessageCollection({
    filter: messageFilter,
    startingPoint: Date.now(),
    limit: 100,
  });

  collection.setMessageCollectionHandler(messageHandlers);
  collection
    .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
    .onCacheResult(onCacheResult)
    .onApiResult(onApiResult);
  return collection;
};
