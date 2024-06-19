import {baseUrl} from "./axios.config";

export const getNotifications = () => baseUrl.get("/notifications/");

export const createNotification = (notificationData) => baseUrl.post("/notifications/", notificationData);

export const deleteNotification = (notificationId) => baseUrl.delete(`/notifications/${notificationId}/`);

export const getNotificationById = (notificationId) => baseUrl.get(`/notifications/${notificationId}/`);

export const updateNotification = (notificationId, notificationData) => baseUrl.put(`/notifications/${notificationId}/`, notificationData);

export const patchNotification = (notificationId, notificationData) => baseUrl.patch(`/notifications/${notificationId}/`, notificationData);
