import { baseUrl } from "./axios.config";

baseUrl.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const getComments = () => baseUrl.get("/comments/");


export const createComment = (commentData) => baseUrl.post("/comments/", commentData);

export const deleteComment = (commentId) => baseUrl.delete(`/comments/${commentId}/`);

export const getCommentById = (commentId) => baseUrl.get(`/comments/${commentId}/`);

export const updateComment = (commentId, commentData) => baseUrl.put(`/comments/${commentId}/`, commentData);

export const patchComment = (commentId, commentData) => baseUrl.patch(`/comments/${commentId}/`, commentData);
