export let DEMO_NOTIFICATIONS = [
    { id: 991, iconType: 'alert', title: 'System Maintenance', description: 'Scheduled maintenance tonight at 11 PM EST.', timestamp: '10m ago', unread: true, category: 'System' },
    { id: 992, iconType: 'people', title: 'New Hire: Akshat Jain', description: 'Akshat joined the Engineering team as Senior Lead.', timestamp: '2h ago', unread: true, category: 'HR' },
    { id: 993, iconType: 'documents', title: 'Q1 Financial Report', description: 'Finance uploaded the quarterly review.', timestamp: '5h ago', unread: false, category: 'Finance' },
    { id: 994, iconType: 'calendar', title: 'Town Hall Meeting', description: 'Monthly all-hands meeting tomorrow at 2 PM.', timestamp: '1d ago', unread: false, category: 'Calendar' }
];

export let DEMO_TEAM = [
    { id: 101, name: 'Akshat Jain', role: 'Senior Developer', department: 'Engineering', status: 'Active', joinDate: '2023-01-15' },
    { id: 102, name: 'Priya Sharma', role: 'UI/UX Designer', department: 'Design', status: 'Active', joinDate: '2023-03-22' },
    { id: 103, name: 'Arjun Malhotra', role: 'Marketing Lead', department: 'Marketing', status: 'Onboarding', joinDate: '2024-02-01' },
    { id: 104, name: 'Ananya Iyer', role: 'Product Manager', department: 'Product', status: 'Away', joinDate: '2022-11-10' },
    { id: 105, name: 'Rohan Gupta', role: 'HR Specialist', department: 'HR', status: 'Active', joinDate: '2023-06-30' },
    { id: 106, name: 'Siddharth Varma', role: 'Account Executive', department: 'Sales', status: 'Offline', joinDate: '2023-08-14' },
    { id: 107, name: 'Ishani Reddy', role: 'Frontend Developer', department: 'Engineering', status: 'Busy', joinDate: '2024-01-05' },
    { id: 108, name: 'Karan Singh', role: 'QA Engineer', department: 'Engineering', status: 'Active', joinDate: '2023-09-12' },
    { id: 109, name: 'Aditi Rao', role: 'DevOps Engineer', department: 'Engineering', status: 'Active', joinDate: '2023-05-20' },
    { id: 110, name: 'Vikram Sethi', role: 'Content Strategist', department: 'Marketing', status: 'Active', joinDate: '2024-03-01' },
    { id: 111, name: 'Meera Nair', role: 'Junior Designer', department: 'Design', status: 'Active', joinDate: '2024-06-15' },
    { id: 112, name: 'Rahul Bose', role: 'Recruiter', department: 'HR', status: 'Active', joinDate: '2023-11-30' },
    { id: 113, name: 'Sanjay Patel', role: 'Graphic Designer', department: 'Design', status: 'Active', joinDate: '2023-07-22' }
];

export let DEMO_TASKS = [
    { id: 991, title: 'Demo Task 1', date: '2026-02-05', assignedTo: 'Me', status: 'pending' },
    { id: 992, title: 'Demo Meeting', date: '2026-02-06', assignedTo: 'Team', status: 'completed' }
];

export let DEMO_REQUESTS = [
    { id: 991, title: 'Vacation Request', description: 'Requesting 2 days off for personal reasons.', status: 'pending', submitterName: 'Akshat Jain', createdAt: '2026-03-01' },
    { id: 992, title: 'Hardware Upgrade', description: 'Requesting a new monitor for the workstation.', status: 'approved', submitterName: 'Akshat Jain', createdAt: '2026-02-28' }
];

export const addDemoNotification = (notif) => {
    DEMO_NOTIFICATIONS = [notif, ...DEMO_NOTIFICATIONS];
};

export const updateDemoRequest = (id, status) => {
    DEMO_REQUESTS = DEMO_REQUESTS.map(req =>
        req.id === id ? { ...req, status } : req
    );
};

export const addDemoRequest = (req) => {
    DEMO_REQUESTS = [req, ...DEMO_REQUESTS];
};
