import { baseUrl } from "./axios.config";

baseUrl.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const getActions = () => baseUrl.get("/actions/");

export const createAction = (actionData) => baseUrl.post("/actions/", actionData);

export const deleteAction = (actionId) => baseUrl.delete(`/actions/${actionId}/`);

export const getActionById = (actionId) => baseUrl.get(`/actions/${actionId}/`);

export const updateAction = (actionId, actionData) => baseUrl.put(`/actions/${actionId}/`, actionData);

export const patchAction = (actionId, actionData) => baseUrl.patch(`/actions/${actionId}/`, actionData);
