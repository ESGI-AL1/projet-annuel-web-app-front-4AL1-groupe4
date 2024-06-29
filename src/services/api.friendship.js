import { baseUrl } from "./axios.config";

baseUrl.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const sendFriendRequest = (friendId) => {
    return baseUrl.post(`/add_friend/`, { friend_id: friendId });
};

export const listFriends = () => {
    return baseUrl.get(`/friends/`);
};

export const listFriendRequests = () => {
    return baseUrl.get(`/friendships/`);
};

export const manageFriendRequest = (friendId, action) => {
    return baseUrl.post(`/manage_friend_request/${friendId}/${action}/`);
};
