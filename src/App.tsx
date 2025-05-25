import { useState } from "react";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import type { Post } from "./types/Post";

function App() {
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="App" style={{ padding: "2em" }}>
      <PostForm
        postToEdit={editingPost}
        onSaved={() => {
          setEditingPost(null);
          setRefreshKey((k) => k + 1);
        }}
      />
      <PostList refresh={refreshKey} onEdit={(p) => setEditingPost(p)} />
    </div>
  );
}

export default App;
