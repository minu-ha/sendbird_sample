import ChannelHeader from 'components/channel/ChannelHeader';
import { FC, ReactNode, RefObject } from 'react';

interface ChannelProps {
  currentlyJoinedChannel: {
    name: string;
  } | null;
  children: ReactNode;
  handleLeaveChannel: () => void;
  channelRef: RefObject<HTMLDivElement>;
}

const Channel: FC<ChannelProps> = ({
  currentlyJoinedChannel,
  children,
  handleLeaveChannel,
  channelRef,
}) => {
  if (currentlyJoinedChannel) {
    return (
      <div className="channel" ref={channelRef}>
        <ChannelHeader>{currentlyJoinedChannel.name}</ChannelHeader>
        <div>
          <button className="leave-channel" onClick={handleLeaveChannel}>
            Leave Channel
          </button>
        </div>
        <div>{children}</div>
      </div>
    );
  }
  return <div className="channel"></div>;
};

export default Channel;
