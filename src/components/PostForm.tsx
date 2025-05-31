import React, { useEffect, useState } from "react";
import { createPost, updatePost } from "../api/postApi";
import type { Post } from "../types/Post";

interface Props {
  postToEdit: Post | null;
  onSaved: () => void;
}

const PostForm: React.FC<Props> = ({ postToEdit, onSaved }) => {
  const [form, setForm] = useState<Omit<Post, "id">>({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (postToEdit) {
      setForm({ title: postToEdit.title, content: postToEdit.content });
    } else {
      setForm({ title: "", content: "" });
    }
  }, [postToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (postToEdit) {
      await updatePost(postToEdit.id, form);
    } else {
      await createPost(form);
    }
    onSaved();
    setForm({ title: "", content: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2 className="form-title">{postToEdit ? "Edit" : "Create"} Post</h2>
      <input
        className="form-input"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        className="form-textarea"
        placeholder="Content"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        required
        rows={5}
      />
      <button type="submit" className="form-button">
        {postToEdit ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default PostForm;
