import React from 'react';

// React.memo ka istemaal kiya
const Message = React.memo(({ message, own }) => {
  return (
    <div className={`d-flex ${own ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
      <div className={`p-2 rounded shadow-sm ${own ? 'bg-primary text-white' : 'bg-body-secondary'}`} style={{maxWidth: '70%'}}>
        <div>{message.text}</div>
        <small className="d-block text-end" style={{fontSize: '0.75rem'}}>{new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
      </div>
    </div>
  );
});

export default Message;
