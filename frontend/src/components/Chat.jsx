import React, { useState, useEffect, useContext, useRef } from 'react';
import api from '../api'; // Nayi api file ko import kiya
import { AuthContext } from '../context/AuthContext';
import Conversation from './Conversation';
import Message from './Message';
import { io } from "socket.io-client";

const Chat = () => {
  const { token } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();
  const [currentUser, setCurrentUser] = useState(null);

  // Socket Connection
  useEffect(() => {
    socket.current = io("ws://localhost:3001");
    socket.current.on("getMessage", (data) => {
      if (data.conversationId === currentChat?._id) {
        setMessages((prev) => [...prev, data]);
      }
    });
    return () => socket.current.disconnect();
  }, [currentChat]);

  // User data aur conversations fetch karna
  useEffect(() => {
    const getMyData = async () => {
      try {
        const profileRes = await api.get("/api/profile/me");
        setCurrentUser(profileRes.data.profile);
        socket.current.emit("addUser", profileRes.data.profile._id);

        const convRes = await api.get("/api/conversations");
        setConversations(convRes.data);
      } catch (err) { console.log(err); }
    };
    if(token) getMyData();
  }, [token]);

  // Jab chat badle, toh puraane messages fetch karna
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await api.get(`/api/messages/${currentChat._id}`);
        setMessages(res.data);
      } catch (err) { console.log(err); }
    };
    if(currentChat) getMessages();
  }, [currentChat]);

  // Naya message bhejna
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(newMessage.trim() === '') return;
    const receiverId = currentChat.members.find(member => member !== currentUser._id);
    
    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId,
      conversationId: currentChat._id,
      text: newMessage,
    });
    setNewMessage("");
  };
  
  // Hamesha aakhri message par scroll karna
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="card shadow-sm" style={{height: '80vh'}}>
        <div className="row g-0 h-100">
          <div className="col-4 border-end">
            <div className="p-3 border-bottom"><h4 className="mb-0">Wappy🍉</h4></div>
            <div style={{overflowY: 'auto', height: 'calc(100% - 60px)'}}>
              {conversations.map((c) => (
                <div key={c._id} onClick={() => setCurrentChat(c)}>
                    <Conversation conversation={c} currentUser={currentUser} />
                </div>
              ))}
            </div>
          </div>
          <div className="col-8 d-flex flex-column">
            {currentChat ? (
              <>
                <div className="p-3 border-bottom"><strong>Chatting...</strong></div>
                <div className="flex-grow-1 p-3" style={{overflowY: 'auto'}}>
                  {messages.map((m) => (
                    <div ref={scrollRef} key={m._id}>
                        <Message message={m} own={m.sender === currentUser?._id} />
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="p-3 border-top d-flex">
                  <input type="text" className="form-control me-2" placeholder="Type a message..." onChange={(e) => setNewMessage(e.target.value)} value={newMessage}/>
                  <button type="submit" className="btn btn-primary">Send</button>
                </form>
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100"><p className="text-muted">Select a chat to start messaging</p></div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Chat;
