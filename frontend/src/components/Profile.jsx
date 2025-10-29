import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const config = {
        headers: { 'x-auth-token': token },
      };
      try {
        const res = await axios.get('http://localhost:3001/api/profile/me', config);
        setProfileData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (token) {
      getProfile();
    }
  }, [token]);

  if (loading) {
    return <h2 className="text-center mt-5">Loading Profile...</h2>;
  }

  if (!profileData) {
    return <h2 className="text-center mt-5">Could not load profile.</h2>;
  }

  const { profile, posts } = profileData;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Profile Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '100px', height: '100px', fontSize: '2.5rem'}}>
                    {profile.name.substring(0, 1)}
                </div>
              <h2 className="card-title">{profile.name}</h2>
              <p className="text-muted">{profile.email}</p>
              <p>Total Posts: <span className="badge bg-primary">{posts.length}</span></p>
            </div>
          </div>

          {/* User's Posts */}
          <h3 className="mb-4">My Posts</h3>
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post._id} className="card shadow-sm mb-3">
                <div className="card-body">
                  <p className="card-text fs-5">{post.text}</p>
                  <small className="text-muted">
                    Posted on {new Date(post.date).toLocaleString()}
                  </small>
                   <div className="mt-2">
                      <span className="me-3">👍 {post.likes.length} Likes</span>
                      <span>💬 {post.comments.length} Comments</span>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <p>You haven't created any posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
