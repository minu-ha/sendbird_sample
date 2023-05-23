import { FC } from 'react';
import { GroupChannel, Member } from 'sendbird';

interface MembersListProps {
  channel: GroupChannel | null;
  handleMemberInvite: () => void;
}

const MembersList: FC<MembersListProps> = ({ channel, handleMemberInvite }) => {
  if (channel) {
    return (
      <div className="members-list">
        <button onClick={handleMemberInvite}>Invite</button>
        {channel.members.map((member: Member) => (
          <div className="member-item" key={member.userId}>
            {member.nickname}
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export default MembersList;
