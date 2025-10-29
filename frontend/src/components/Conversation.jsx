import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Conversation = ({ conversation, currentUser, online }) => { // Naya 'online' prop
  const { token } = useContext(AuthContext);
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser?._id);
    const getFriendData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/users/${friendId}`, { headers: { 'x-auth-token': token } });
        setFriend(res.data);
      } catch (err) { console.log(err); }
    };
    if (token && currentUser) getFriendData();
  }, [currentUser, conversation, token]);

  return (
    <div className="d-flex align-items-center p-2 position-relative" style={{cursor: 'pointer'}}>
      <div className="position-relative me-3">
          <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
              {friend ? friend.name.substring(0, 1) : '?'}
          </div>
          {/* Online Indicator (Green Dot) */}
          {online && <span className="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"></span>}
      </div>
      <strong>{friend ? friend.name : 'Loading...'}</strong>
    </div>
  );
};

export default React.memo(Conversation);

