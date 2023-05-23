import { FC } from 'react';
import { Member } from 'sendbird';

interface ChannelNameProps {
  members: Member[];
}

const ChannelName: FC<ChannelNameProps> = ({ members }) => {
  const membersToDisplay = members.slice(0, 2);
  const membersNotToDisplay = members.slice(2);

  return (
    <>
      {membersToDisplay.map((member: Member) => {
        return <span key={member.userId}>{member.nickname}</span>;
      })}
      {membersNotToDisplay.length > 0 && `+ ${membersNotToDisplay.length}`}
    </>
  );
};

export default ChannelName;
