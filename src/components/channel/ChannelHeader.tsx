import { FC, ReactNode } from 'react';

interface ChannelHeaderProps {
  children: ReactNode;
}

const ChannelHeader: FC<ChannelHeaderProps> = ({ children }) => {
  return <div className="channel-header">{children}</div>;
};

export default ChannelHeader;
