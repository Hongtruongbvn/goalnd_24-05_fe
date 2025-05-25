import axios from "axios";
import type { Post } from "../types/Post";
import type { Comment } from "../types/Comment";

const API = axios.create({
  baseURL: "https://goalnd-24-05-be.onrender.com",
});

export const getPosts = () => API.get<Post[]>("/posts");
export const getPost = (id: number) => API.get<Post>(`/posts/${id}`);
export const createPost = (data: Omit<Post, "id">) => API.post("/posts", data);
export const updatePost = (id: number, data: Omit<Post, "id">) =>
  API.put(`/posts/${id}`, data);
export const deletePost = (id: number) => API.delete(`/posts/${id}`);

export const getComments = (postId: number) =>
  API.get<Comment[]>(`/posts/${postId}/comments`);

export const createComment = (postId: number, content: string) =>
  API.post(`/posts/${postId}/comments`, { content });
