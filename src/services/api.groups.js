import { baseUrl } from "./axios.config";

baseUrl.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getGroups = () => baseUrl.get("/groups/");

export const createGroup = (groupData) => baseUrl.post("/groups/", groupData);

export const deleteGroup = (groupId) => baseUrl.delete(`/groups/${groupId}/`);

export const getGroupById = (groupId) => baseUrl.get(`/groups/${groupId}/`);

export const updateGroup = (groupId, groupData) => baseUrl.put(`/groups/${groupId}/`, groupData);

export const patchGroup = (groupId, groupData) => baseUrl.patch(`/groups/${groupId}/`, groupData);
