import { baseUrl } from "./axios.config";

baseUrl.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const sendFriendRequest = (userId, friendId) => {
    return baseUrl.post(`/friendship/request/`, { user_id: userId, friend_id: friendId });
};

export const acceptFriendRequest = (friendshipId) => {
    return baseUrl.put(`/friendship/accept/${friendshipId}/`);
};

export const rejectFriendRequest = (friendshipId) => {
    return baseUrl.put(`/friendship/reject/${friendshipId}/`);
};

export const removeFriend = (friendshipId) => {
    return baseUrl.delete(`/friendship/remove/${friendshipId}/`);
};

export const getPendingFriendRequests = (userId) => {
    return baseUrl.get(`/friendship/pending/${userId}/`);
};

export const getAllFriends = (userId) => {
    return baseUrl.get(`/friendship/friends/${userId}/`);
};
