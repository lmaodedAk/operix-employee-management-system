import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 1000,
});

import { DEMO_NOTIFICATIONS, DEMO_TEAM, DEMO_TASKS, DEMO_REQUESTS, addDemoNotification, updateDemoRequest, addDemoRequest } from './demoData';

const safeRequest = async (requestFn, fallbackData, mutationCb = null) => {
    try {
        const response = await requestFn();
        return response.data;
    } catch (error) {
        console.warn('API Call Failed, using fallback:', error.message);
        if (mutationCb) mutationCb();
        return fallbackData; // Return fallback data on ANY error
    }
};

export const apiService = {
    getNotifications: (role) => safeRequest(() => api.get(`/notifications${role ? `?role=${role}` : ''}`), DEMO_NOTIFICATIONS),

    createNotification: (data) => {
        const payload = { ...data, id: Date.now() };
        return safeRequest(() => api.post('/notifications', data), payload, () => addDemoNotification(payload));
    },

    getTeam: () => safeRequest(() => api.get('/team'), DEMO_TEAM),
    addEmployee: (data) => safeRequest(() => api.post('/team', data), { ...data, id: Date.now() }),

    getTasks: () => safeRequest(() => api.get('/tasks'), DEMO_TASKS),
    addTask: (data) => safeRequest(() => api.post('/tasks', data), { ...data, id: Date.now() }),

    getRequests: (submitterName) => safeRequest(
        () => api.get(`/requests${submitterName ? `?submitterName=${submitterName}` : ''}`),
        submitterName ? DEMO_REQUESTS.filter(r => r.submitterName === submitterName) : DEMO_REQUESTS
    ),

    createRequest: (data) => {
        const payload = { ...data, id: Date.now() };
        return safeRequest(() => api.post('/requests', data), payload, () => addDemoRequest(payload));
    },

    updateRequestStatus: (id, status) => {
        return safeRequest(() => api.patch(`/requests/${id}`, { status }), { id, status }, () => updateDemoRequest(id, status));
    },

    updateTaskStatus: (id, status) => safeRequest(() => api.patch(`/tasks/${id}`, { status }), { id, status })
};
