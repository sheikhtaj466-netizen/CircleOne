import React, { useState, useEffect, useContext } from 'react';
import api from '../api'; // Nayi api file ko import kiya
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await api.get('/api/profile/me');
        setProfileData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      getProfile();
    }
  }, [token]);

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div>;
  }

  if (!profileData) {
    return <h2 className="text-center mt-5">Could not load profile. Please try again.</h2>;
  }

  // Safety checks ke saath data nikalo
  const { profile, posts } = profileData || {};

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        {/* Profile Header */}
        <div className="card shadow-sm mb-4">
          <div className="card-body text-center">
            <div 
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" 
              style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
            >
              {profile?.name?.substring(0, 1) || '?'}
            </div>
            <h2 className="card-title">{profile?.name || 'User'}</h2>
            <p className="text-muted">{profile?.email || 'No email'}</p>
            <p>Total Posts: <span className="badge bg-primary">{posts?.length || 0}</span></p>
          </div>
        </div>

        {/* User's Posts */}
        <h3 className="mb-4">My Posts</h3>
        {posts && posts.length > 0 ? (
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
  );
};

export default Profile;
