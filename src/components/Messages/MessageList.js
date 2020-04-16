import React from 'react';

import MessageItem from './MessageItem';
// import { auth } from 'firebase';

const MessageList = ({
  authUser,
  messages,
  onEditMessage,
  onRemoveMessage
}) => (
  <div className='message-list'>
    {messages.map(message => (
      <MessageItem
        authUser={authUser}
        key={message.uid}
        message={message}
        onEditMessage={onEditMessage}
        onRemoveMessage={onRemoveMessage}
      />
    ))}
  </div>
);

export default MessageList;
