import React, { FC } from 'react';

interface MessageInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sendMessage: () => void;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MessageInput: FC<MessageInputProps> = ({
  value,
  onChange,
  sendMessage,
  onFileInputChange,
}) => {
  const handleEnterPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    sendMessage: () => void
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="message-input">
      <input
        placeholder="write a message"
        value={value}
        onChange={onChange}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
          handleEnterPress(event, sendMessage)
        }
      />
      <div className="message-input-buttons">
        <button className="send-message-button" onClick={sendMessage}>
          Send Message
        </button>
        <label className="file-upload-label" htmlFor="upload">
          Select File
        </label>
        <input
          id="upload"
          className="file-upload-button"
          type="file"
          hidden
          onChange={onFileInputChange}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default MessageInput;
