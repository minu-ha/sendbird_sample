import ProfileImage from 'components/channel/ProfileImage';
import { FC } from 'react';
import { GroupChannel, User } from 'sendbird';

interface MembersSelectProps {
  applicationUsers: User[];
  groupChannelMembers: string[];
  currentlyJoinedChannel: GroupChannel | null;
  addToChannelMembersList: (userId: string) => void;
  handleCreateChannel: () => void;
  handleUpdateChannelMembersList: () => void;
}

const MembersSelect: FC<MembersSelectProps> = ({
  applicationUsers,
  groupChannelMembers,
  currentlyJoinedChannel,
  addToChannelMembersList,
  handleCreateChannel,
  handleUpdateChannelMembersList,
}) => {
  if (applicationUsers.length > 0) {
    return (
      <div className="overlay">
        <div className="overlay-content">
          <button
            onClick={() => {
              if (currentlyJoinedChannel) {
                handleUpdateChannelMembersList();
              } else {
                handleCreateChannel();
              }
            }}
          >
            {currentlyJoinedChannel ? 'Submit' : 'Create'}
          </button>
          {applicationUsers.map(user => {
            const userSelected = groupChannelMembers.some(member => member === user.userId);
            return (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
              <div
                key={user.userId}
                className={`member-item ${userSelected ? 'member-selected' : ''}`}
                onClick={() => addToChannelMembersList(user.userId)}
              >
                <ProfileImage user={user} />
                <div className="member-item-name">{user.nickname}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default MembersSelect;
