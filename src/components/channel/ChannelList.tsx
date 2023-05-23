import ChannelName from 'components/channel/ChannelName';
import { FC } from 'react';
import { GroupChannel } from 'sendbird';

interface ChannelListProps {
  channels: GroupChannel[];
  handleJoinChannel: (url: string) => void;
  handleDeleteChannel: (url: string) => void;
  handleLoadMemberSelectionList: () => void;
}

const ChannelList: FC<ChannelListProps> = ({
  channels,
  handleJoinChannel,
  handleDeleteChannel,
  handleLoadMemberSelectionList,
}) => {
  return (
    <div className="channel-list">
      <div className="channel-type">
        <h1>Group Channels</h1>
        <button className="channel-create-button" onClick={() => handleLoadMemberSelectionList()}>
          Create Channel
        </button>
      </div>
      {channels.map((channel: GroupChannel) => {
        return (
          <div key={channel.url} className="channel-list-item">
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div
              className="channel-list-item-name"
              onClick={() => {
                handleJoinChannel(channel.url);
              }}
            >
              <ChannelName members={channel.members} />
              <div className="last-message">{channel.lastMessage?.messageId}</div>
            </div>
            <div>
              <button className="control-button" onClick={() => handleDeleteChannel(channel.url)}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img className="channel-icon" src="/icon_delete.png" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChannelList;
