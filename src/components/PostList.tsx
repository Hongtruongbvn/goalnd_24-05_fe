import React, { useEffect, useState } from "react";
import { getPosts, deletePost } from "../api/postApi";
import { getComments, createComment } from "../api/postApi";
import type { Post } from "../types/Post";
import type { Comment } from "../types/Comment";

interface Props {
  onEdit: (post: Post) => void;
  refresh: number;
}

const PostList: React.FC<Props> = ({ onEdit, refresh }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<number, string>>({});

  const fetchPosts = async () => {
    const res = await getPosts();
    setPosts(res.data);

    res.data.forEach(async (post: Post) => {
      const cRes = await getComments(post.id);
      setComments((prev) => ({ ...prev, [post.id]: cRes.data }));
    });
  };

  const handleCreateComment = async (postId: number) => {
    if (!newComment[postId]?.trim()) return;

    await createComment(postId, newComment[postId]);
    setNewComment((prev) => ({ ...prev, [postId]: "" }));

    const updated = await getComments(postId);
    setComments((prev) => ({ ...prev, [postId]: updated.data }));
  };

  useEffect(() => {
    fetchPosts();
  }, [refresh]);

  return (
    <div className="post-list">
      <h2 className="post-list-title">Posts</h2>
      {posts.map((p) => (
        <div key={p.id} className="post-card">
          <h3 className="post-title">{p.title}</h3>
          <p className="post-content">{p.content}</p>
          <div className="post-actions">
            <button
              className="action-button edit-button"
              onClick={() => onEdit(p)}
            >
              Edit
            </button>
            <button
              className="action-button delete-button"
              onClick={() => deletePost(p.id).then(fetchPosts)}
            >
              Delete
            </button>
          </div>

          <div className="comments-section">
            <h4 className="comments-title">Comments:</h4>
            <ul className="comments-list">
              {comments[p.id]?.map((c) => (
                <li key={c.id} className="comment-item">
                  <p className="comment-content">{c.content}</p>
                  <span className="comment-date">
                    {new Date(c.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="comment-form">
              <input
                type="text"
                className="comment-input"
                placeholder="Write a comment..."
                value={newComment[p.id] || ""}
                onChange={(e) =>
                  setNewComment((prev) => ({ ...prev, [p.id]: e.target.value }))
                }
              />
              <button
                className="comment-button"
                onClick={() => handleCreateComment(p.id)}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
