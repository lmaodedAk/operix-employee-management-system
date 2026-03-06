import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [team, setTeam] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user, login: authLogin, logout: authLogout } = useAuth();

    useEffect(() => {
        const fetchInitialData = async () => {
            let role = user?.role || 'employee';
            try {
                const saved = localStorage.getItem('user');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    role = parsed.role;
                }
            } catch (e) { }

            try {
                const [notifsData, teamData, tasksData, requestsData] = await Promise.all([
                    apiService.getNotifications(role),
                    apiService.getTeam(),
                    apiService.getTasks(),
                    apiService.getRequests(role === 'employee' ? user?.name : null)
                ]);

                if (Array.isArray(notifsData)) setNotifications(notifsData);
                if (Array.isArray(teamData)) setTeam(teamData);
                if (Array.isArray(tasksData)) setTasks(tasksData);
                if (Array.isArray(requestsData)) setRequests(requestsData);
            } catch (error) {
                console.error("Critical failure fetching initial data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [user?.role, user?.name]);

    const createRequest = async (type, title, description, payload) => {
        const newRequest = {
            type,
            title,
            description,
            payload,
            submitterName: user?.name || 'Unknown',
            submitterEmail: user?.email,
            status: 'pending'
        };
        try {
            const savedReq = await apiService.createRequest(newRequest);
            setRequests(prev => [savedReq, ...prev]);
            addNotification({
                iconType: 'clock',
                title: 'Request Submitted',
                description: `Your request to ${type} has been sent for approval.`,
                category: 'System'
            });
        } catch (e) {
            console.error("Failed to create request");
        }
    };

    const refreshData = async () => {
        try {
            const currentRole = user?.role || 'employee';
            const [notifsData, teamData, tasksData, requestsData] = await Promise.all([
                apiService.getNotifications(currentRole),
                apiService.getTeam(),
                apiService.getTasks(),
                apiService.getRequests(currentRole === 'employee' ? user?.name : null)
            ]);

            if (Array.isArray(notifsData)) setNotifications(notifsData);
            if (Array.isArray(teamData)) setTeam(teamData);
            if (Array.isArray(tasksData)) setTasks(tasksData);
            if (Array.isArray(requestsData)) setRequests(requestsData);
        } catch (error) {
            console.error("Failed to refresh data", error);
        }
    };

    const addNotification = async (notif) => {
        try {
            await apiService.createNotification(notif);
            refreshData();
        } catch (e) { console.error(e); }
    };

    const addEmployee = async (employee) => {
        if (user?.role !== 'admin') {
            await createRequest('add_employee', `Add ${employee.name}`, `Add new employee ${employee.name} as ${employee.role}`, employee);
            return;
        }
        try {
            await apiService.addEmployee(employee);
            refreshData();
        } catch (e) { console.error(e); }
    };

    const addTask = async (task) => {
        if (user?.role !== 'admin') {
            await createRequest('add_task', `Task: ${task.title}`, `Assign ${task.title} to ${task.assignedTo}`, task);
            return;
        }
        try {
            await apiService.addTask(task);
            refreshData();
        } catch (e) { console.error(e); }
    };

    const approveRequest = async (id) => {
        try {
            const req = requests.find(r => r.id === id);
            await apiService.updateRequestStatus(id, 'approved');

            if (req) {
                await addNotification({
                    iconType: 'check',
                    title: `Request Approved: ${req.title}`,
                    description: `Your ${req.type?.replace('_', ' ')} request has been approved.`,
                    category: 'System'
                });
            }
            refreshData();
        } catch (e) { console.error(e); }
    };

    const rejectRequest = async (id) => {
        try {
            const req = requests.find(r => r.id === id);
            await apiService.updateRequestStatus(id, 'rejected');

            if (req) {
                await addNotification({
                    iconType: 'alert',
                    title: `Request Declined: ${req.title}`,
                    description: `Your ${req.type?.replace('_', ' ')} request was declined.`,
                    category: 'System'
                });
            }
            refreshData();
        } catch (e) { console.error(e); }
    };

    const completeTask = async (id) => {
        try {
            await apiService.updateTaskStatus(id, 'completed');
            refreshData();
        } catch (e) { console.error(e); }
    };

    const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const markAllNotificationsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <AppContext.Provider value={{
            notifications,
            team,
            tasks,
            requests,
            loading,
            user,
            login: authLogin,
            logout: authLogout,
            addNotification,
            addEmployee,
            addTask,
            approveRequest,
            rejectRequest,
            completeTask,
            markNotificationRead,
            markAllNotificationsRead,
            clearNotifications,
            createRequest,
            refreshData
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
