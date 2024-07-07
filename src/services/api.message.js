import { baseUrl } from "./axios.config";

baseUrl.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getMessages = () => baseUrl.get("/messages/");

export const createMessage = (messageData) => baseUrl.post("/messages/", messageData);

export const deleteMessage = (messageId) => baseUrl.delete(`/messages/${messageId}/`);

export const getMessageById = (messageId) => baseUrl.get(`/messages/${messageId}/`);

export const updateMessage = (messageId, messageData) => baseUrl.put(`/messages/${messageId}/`, messageData);

export const patchMessage = (messageId, messageData) => baseUrl.patch(`/messages/${messageId}/`, messageData);
