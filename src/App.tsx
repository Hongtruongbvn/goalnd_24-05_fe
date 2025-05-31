import { useState } from "react";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import type { Post } from "./types/Post";
import "./App.css";

function App() {
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="app-container">
      <h1 className="app-title">Blog App</h1>
      <div className="app-content">
        <PostForm
          postToEdit={editingPost}
          onSaved={() => {
            setEditingPost(null);
            setRefreshKey((k) => k + 1);
          }}
        />
        <PostList refresh={refreshKey} onEdit={(p) => setEditingPost(p)} />
      </div>
    </div>
  );
}

export default App;
