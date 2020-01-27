import React from 'react';

import MessageItem from './MessageItem';

const MessageList = ({ messages, onEditMessage, onRemoveMessage }) => (
  <ul className='messages'>
    {messages.map(message => (
      <MessageItem
        key={message.uid}
        message={message}
        onEditMessage={onEditMessage}
        onRemoveMessage={onRemoveMessage}
      />
    ))}
  </ul>
);

export default MessageList;
