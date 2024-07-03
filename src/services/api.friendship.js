import { baseUrl } from "./axios.config";

baseUrl.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const sendFriendRequest = (userId, friendId, status = 'sent') => {
    return baseUrl.post('/friendships/', {
        user: userId,
        friend: friendId,
        status: status
    });
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



export const acceptFriendRequest = (friendshipId, userId, friendId) => {
    return baseUrl.put(`/friendships/update/${friendshipId}/`, { user: userId, friend: friendId, status: 'accepted' });
};

export const declineFriendRequest = (friendshipId, userId, friendId) => {
    return baseUrl.put(`/friendships/update/${friendshipId}/`, { user: userId, friend: friendId, status: 'rejected' });
};