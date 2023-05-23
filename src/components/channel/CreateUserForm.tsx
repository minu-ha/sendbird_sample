import { ChangeEvent, FC, KeyboardEvent } from 'react';

interface CreateUserFormProps {
  setupUser: () => void;
  settingUpUser: boolean;
  userNameInputValue: string;
  userIdInputValue: string;
  onUserNameInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onUserIdInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const CreateUserForm: FC<CreateUserFormProps> = ({
  setupUser,
  settingUpUser,
  userNameInputValue,
  userIdInputValue,
  onUserNameInputChange,
  onUserIdInputChange,
}) => {
  const handleEnterPress = (event: KeyboardEvent, setupUser: () => void) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      setupUser();
    }
  };

  if (settingUpUser) {
    return (
      <div className="overlay">
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className="overlay-content"
          onKeyDown={(event: KeyboardEvent) => handleEnterPress(event, setupUser)}
        >
          <div>User ID</div>
          <input
            onChange={onUserIdInputChange}
            className="form-input"
            type="text"
            value={userIdInputValue}
          />
          <div>User Nickname</div>
          <input
            onChange={onUserNameInputChange}
            className="form-input"
            type="text"
            value={userNameInputValue}
          />
          <button className="user-submit-button" onClick={setupUser}>
            Connect
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default CreateUserForm;
