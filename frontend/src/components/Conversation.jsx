import React, { useState, useEffect, useContext } from 'react';
import api from '../api'; // Nayi api file ko import kiya
import { AuthContext } from '../context/AuthContext';

const Conversation = ({ conversation, currentUser, online }) => {
  const { token } = useContext(AuthContext);
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    // Conversation ke members me se doosre user ki ID nikalo
    const friendId = conversation.members.find((m) => m !== currentUser?._id);

    const getFriendData = async () => {
      try {
        // 'axios.get' ki jagah 'api.get' ka istemaal kiya
        const res = await api.get(`/api/users/${friendId}`);
        setFriend(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (token && currentUser) {
      getFriendData();
    }
  }, [currentUser, conversation, token]);

  return (
    <div className="d-flex align-items-center p-2 position-relative" style={{ cursor: 'pointer' }}>
      <div className="position-relative me-3">
        <div 
          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" 
          style={{ width: '40px', height: '40px' }} // Yahan par galti thi, use theek kar diya hai
        >
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
