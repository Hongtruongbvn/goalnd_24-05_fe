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
    if (!newComment[postId]) return;

    await createComment(postId, newComment[postId]);
    setNewComment((prev) => ({ ...prev, [postId]: "" }));

    const updated = await getComments(postId);
    setComments((prev) => ({ ...prev, [postId]: updated.data }));
  };

  useEffect(() => {
    fetchPosts();
  }, [refresh]);

  return (
    <div>
      <h2>Posts</h2>
      {posts.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            padding: "1em",
            marginBottom: "10px",
          }}
        >
          <h3>{p.title}</h3>
          <p>{p.content}</p>
          <button onClick={() => onEdit(p)}>Edit</button>
          <button onClick={() => deletePost(p.id).then(fetchPosts)}>
            Delete
          </button>

          <div style={{ marginTop: "10px", paddingLeft: "1em" }}>
            <h4>Comments:</h4>
            <ul>
              {comments[p.id]?.map((c) => (
                <li key={c.id}>
                  <strong>{c.content}</strong> —{" "}
                  {new Date(c.created_at).toLocaleString()}
                </li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment[p.id] || ""}
              onChange={(e) =>
                setNewComment((prev) => ({ ...prev, [p.id]: e.target.value }))
              }
            />
            <button onClick={() => handleCreateComment(p.id)}>Comment</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
