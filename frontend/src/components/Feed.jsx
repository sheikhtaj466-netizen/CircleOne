import React, { useState, useEffect, useContext } from 'react';
import api from '../api'; // Nayi api file ko import kiya
import { AuthContext } from '../context/AuthContext';

const Feed = () => {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [commentText, setCommentText] = useState('');

  const getPosts = async () => {
    try {
      const res = await api.get('/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    if (token) getPosts();
  }, [token]);

  const onPostSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/api/posts', { text, isPrivate });
      getPosts();
      setText('');
      setIsPrivate(false);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const onLike = async postId => {
    try {
      await api.put(`/api/posts/like/${postId}`);
      getPosts();
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const onCommentSubmit = async (e, postId) => {
    e.preventDefault();
    try {
      await api.post(`/api/posts/comment/${postId}`, { text: commentText });
      getPosts();
      setCommentText('');
      setActiveCommentBox(null);
    } catch (err) {
      console.error("Error commenting on post:", err);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        {/* Create Post Form */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="card-title">What's on your mind?</h4>
            <form onSubmit={onPostSubmit}>
              <div className="mb-3">
                <textarea className="form-control" placeholder="Create a new post..." value={text} onChange={e => setText(e.target.value)} rows="3" required></textarea>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isPrivateCheck"
                  checked={isPrivate}
                  onChange={e => setIsPrivate(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="isPrivateCheck">
                  Make this post private (only you can see it)
                </label>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">Post</button>
              </div>
            </form>
          </div>
        </div>

        {/* Display Posts */}
        <h2 className="mb-4">Recent Posts</h2>
        {posts.map(post => (
          <div key={post._id} className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">{post.name}</h5>
                {post.isPrivate && <span className="badge bg-secondary">Private</span>}
              </div>
              <p className="card-text fs-5">{post.text}</p>
              <small className="text-muted">Posted on {new Date(post.date).toLocaleString()}</small>
              <hr />
              <div>
                <button onClick={() => onLike(post._id)} className="btn btn-light me-2">
                  👍 Like <span className="badge bg-secondary">{post.likes.length}</span>
                </button>
                <button onClick={() => setActiveCommentBox(activeCommentBox === post._id ? null : post._id)} className="btn btn-light">
                  💬 Comment <span className="badge bg-secondary">{post.comments.length}</span>
                </button>
              </div>
              {activeCommentBox === post._id && (
                <div className="mt-3">
                  <form onSubmit={(e) => onCommentSubmit(e, post._id)}>
                    <textarea className="form-control mb-2" placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} rows="2" required></textarea>
                    <button type="submit" className="btn btn-sm btn-outline-primary">Post Comment</button>
                  </form>
                  <hr/>
                  {post.comments.map(comment => (
                    <div key={comment._id} className="d-flex mb-2">
                      <div className="flex-shrink-0">
                        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>
                          {comment.name.substring(0, 1)}
                        </div>
                      </div>
                      <div className="ms-2">
                        <strong>{comment.name}</strong>
                        <div>{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
