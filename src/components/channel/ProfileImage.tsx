import { FC } from 'react';
import { User } from 'sendbird';

interface ProfileImageProps {
  user: User;
}

const ProfileImage: FC<ProfileImageProps> = ({ user }) => {
  if (user.plainProfileUrl) {
    return <img className="profile-image" src={user.plainProfileUrl} alt={''} />;
  } else {
    return <div className="profile-image-fallback">{user.nickname.charAt(0)}</div>;
  }
};

export default ProfileImage;
