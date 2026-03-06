export let notifications = [
    { id: 901, iconType: 'alert', title: 'System Maintenance', description: 'Scheduled maintenance tonight at 11 PM EST.', timestamp: '10m ago', unread: true, category: 'System', recipientRole: 'all' },
    { id: 902, iconType: 'people', title: 'New Hire: Sarah Jenkins', description: 'Sarah joined the Marketing team as Lead.', timestamp: '2h ago', unread: true, category: 'HR', recipientRole: 'all' },
    { id: 903, iconType: 'documents', title: 'Q1 Financial Report', description: 'Finance uploaded the quarterly review.', timestamp: '5h ago', unread: false, category: 'Finance', recipientRole: 'admin' },
    { id: 904, iconType: 'calendar', title: 'Town Hall Meeting', description: 'Monthly all-hands meeting tomorrow at 2 PM.', timestamp: '1d ago', unread: false, category: 'Calendar', recipientRole: 'all' },
    { id: 905, iconType: 'mail', title: 'Project Alpha Update', description: 'Phase 1 completed ahead of schedule.', timestamp: '1d ago', unread: false, category: 'Work', recipientRole: 'employee' },
    { id: 906, iconType: 'check', title: 'Task Completed', description: 'Database migration verified.', timestamp: '2d ago', unread: false, category: 'System', recipientRole: 'admin' },
    { id: 907, iconType: 'alert', title: 'Security Alert', description: 'Unusual login attempt blocked.', timestamp: '3d ago', unread: true, category: 'System', recipientRole: 'admin' },
    { id: 908, iconType: 'people', title: 'Birthday: Mike Johnson', description: 'Wish Mike a happy birthday!', timestamp: '3d ago', unread: false, category: 'HR', recipientRole: 'all' },
    { id: 909, iconType: 'documents', title: 'New Policy: Remote Work', description: 'Updated guidelines for 2026.', timestamp: '4d ago', unread: false, category: 'HR', recipientRole: 'all' },
    { id: 910, iconType: 'calendar', title: 'Design Sprint', description: 'Design team sprint planning.', timestamp: '4d ago', unread: false, category: 'Calendar', recipientRole: 'all' },
    { id: 911, iconType: 'mail', title: 'Client Feedback', description: 'New feedback from Client X.', timestamp: '5d ago', unread: false, category: 'Work', recipientRole: 'employee' },
    { id: 912, iconType: 'check', title: 'Code Review', description: 'PR #1024 approved.', timestamp: '5d ago', unread: false, category: 'Work', recipientRole: 'employee' },
    { id: 110, iconType: 'people', title: 'Anniversary: Alice Chen', description: 'Celebrating 3 years at Operix!', timestamp: '6d ago', unread: false, category: 'HR', recipientRole: 'all' },
    { id: 914, iconType: 'documents', title: 'Spec Updated', description: 'API v2 specifications updated.', timestamp: '1w ago', unread: false, category: 'Work', recipientRole: 'all' },
    { id: 915, iconType: 'alert', title: 'Quota Reached', description: 'API usage limit at 90%.', timestamp: '1w ago', unread: false, category: 'System', recipientRole: 'admin' }
];

export let team = [
    { id: 101, name: 'Alice Chen', role: 'Senior Developer', department: 'Engineering', status: 'Active', joinDate: '2023-01-15', avatar: 'https://ui-avatars.com/api/?name=Alice+Chen&background=random' },
    { id: 102, name: 'Marcus Rodriguez', role: 'UI/UX Designer', department: 'Design', status: 'Active', joinDate: '2023-03-22', avatar: 'https://ui-avatars.com/api/?name=Marcus+Rodriguez&background=random' },
    { id: 103, name: 'Sarah Jenkins', role: 'Marketing Lead', department: 'Marketing', status: 'Onboarding', joinDate: '2024-02-01', avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random' },
    { id: 104, name: 'David Kim', role: 'Product Manager', department: 'Product', status: 'Away', joinDate: '2022-11-10', avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=random' },
    { id: 105, name: 'Emily White', role: 'HR Specialist', department: 'HR', status: 'Active', joinDate: '2023-06-30', avatar: 'https://ui-avatars.com/api/?name=Emily+White&background=random' },
    { id: 106, name: 'James Wilson', role: 'Account Executive', department: 'Sales', status: 'Offline', joinDate: '2023-08-14', avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=random' },
    { id: 107, name: 'Robert Taylor', role: 'Frontend Developer', department: 'Engineering', status: 'Busy', joinDate: '2024-01-05', avatar: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=random' },
    { id: 108, name: 'Lisa Anderson', role: 'QA Engineer', department: 'Engineering', status: 'Active', joinDate: '2023-09-12', avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=random' },
    { id: 109, name: 'Michael Brown', role: 'DevOps Engineer', department: 'Engineering', status: 'Active', joinDate: '2023-05-20', avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=random' },
    { id: 110, name: 'Sophie Martin', role: 'Content Strategist', department: 'Marketing', status: 'Active', joinDate: '2024-03-01', avatar: 'https://ui-avatars.com/api/?name=Sophie+Martin&background=random' },
    { id: 111, name: 'Kevin Lee', role: 'Junior Designer', department: 'Design', status: 'Active', joinDate: '2024-06-15', avatar: 'https://ui-avatars.com/api/?name=Kevin+Lee&background=random' },
    { id: 112, name: 'Rachel Green', role: 'Recruiter', department: 'HR', status: 'Active', joinDate: '2023-11-30', avatar: 'https://ui-avatars.com/api/?name=Rachel+Green&background=random' },
    { id: 113, name: 'Tom Harris', role: 'Graphic Designer', department: 'Design', status: 'Active', joinDate: '2023-07-22', avatar: 'https://ui-avatars.com/api/?name=Tom+Harris&background=random' }
];

export let tasks = [
    { id: 991, title: 'Fix Login Bug', date: '2026-02-06', time: '09:00', location: 'Remote', assignedTo: 'Me', department: 'Engineering', type: 'Task', status: 'pending' },
    { id: 992, title: 'Weekly Standup', date: '2026-02-06', time: '10:00', location: 'Zoom', assignedTo: 'Team', department: 'Engineering', type: 'Meeting', status: 'pending' },
    { id: 993, title: 'Client Presentation', date: '2026-02-06', time: '14:00', location: 'Boardroom', assignedTo: 'James Wilson', department: 'Sales', type: 'Meeting', status: 'pending' },
    { id: 994, title: 'Design Review', date: '2026-02-06', time: '11:00', location: 'Design Lab', assignedTo: 'Marcus Rodriguez', department: 'Design', type: 'Meeting', status: 'completed' },
    { id: 995, title: 'Submit Expense Report', date: '2026-02-07', time: '17:00', location: 'Office', assignedTo: 'Me', department: 'Finance', type: 'Task', status: 'pending' },
    { id: 996, title: 'Deploy to Production', date: '2026-02-07', time: '23:00', location: 'Remote', assignedTo: 'Michael Brown', department: 'Engineering', type: 'Task', status: 'pending' },
    { id: 997, title: 'Strategy Meeting', date: '2026-02-07', time: '09:00', location: 'Conference Room A', assignedTo: 'David Kim', department: 'Product', type: 'Meeting', status: 'pending' },
    { id: 998, title: 'Code Cleanup', date: '2026-02-07', time: '14:00', location: 'Remote', assignedTo: 'Alice Chen', department: 'Engineering', type: 'Task', status: 'pending' },
    { id: 999, title: 'Team Lunch', date: '2026-02-08', time: '12:00', location: 'Cafeteria', assignedTo: 'Team', department: 'HR', type: 'Meeting', status: 'pending' },
    { id: 1000, title: 'Security Audit', date: '2026-02-08', time: '10:00', location: 'Server Room', assignedTo: 'Michael Brown', department: 'IT', type: 'Task', status: 'pending' },
    { id: 1001, title: 'Q1 Marketing Plan', date: '2026-02-06', time: '15:00', location: 'Remote', assignedTo: 'Sarah Jenkins', department: 'Marketing', type: 'Task', status: 'pending' },
    { id: 1002, title: 'Candidate Screening', date: '2026-02-06', time: '11:00', location: 'Meeting Room B', assignedTo: 'Emily White', department: 'HR', type: 'Task', status: 'pending' },
    { id: 1003, title: 'Fix Navigation Bar', date: '2026-02-06', time: '13:00', location: 'Remote', assignedTo: 'Robert Taylor', department: 'Engineering', type: 'Task', status: 'pending' },
    { id: 1004, title: 'Regression Testing v2.1', date: '2026-02-06', time: '14:00', location: 'Remote', assignedTo: 'Lisa Anderson', department: 'Engineering', type: 'Task', status: 'pending' },
    { id: 1005, title: 'Blog Post Draft', date: '2026-02-07', time: '10:00', location: 'Remote', assignedTo: 'Sophie Martin', department: 'Marketing', type: 'Task', status: 'pending' },
    { id: 1006, title: 'Icon Set Update', date: '2026-02-07', time: '16:00', location: 'Design Lab', assignedTo: 'Kevin Lee', department: 'Design', type: 'Task', status: 'pending' }
];

export let requests = [
    { id: 1, type: 'add_employee', title: 'Add Robert Brown', description: 'Add new employee Robert Brown as Junior Dev', payload: { name: 'Robert Brown', role: 'Junior Developer', email: 'robert.b@operix.com' }, submitterName: 'Alice Chen', timestamp: '2h ago', status: 'pending' },
    { id: 2, type: 'add_task', title: 'Task: Prepare Demo', description: 'Assign Prepare Demo to Sarah Chen', payload: { title: 'Prepare Demo', assignedTo: 'Sarah Chen', priority: 'High', date: '2026-02-09', location: 'Remote', type: 'Task' }, submitterName: 'David Kim', timestamp: '5h ago', status: 'pending' },
    { id: 3, type: 'time_off', title: 'Time Off Request', description: 'Vacation request for next week (Feb 12-16)', payload: { reason: 'Vacation', dates: 'Feb 12-16' }, submitterName: 'Marcus Rodriguez', timestamp: '1d ago', status: 'approved' },
    { id: 4, type: 'time_off', title: 'Sick Leave', description: 'Not feeling well today', payload: { reason: 'Sick' }, submitterName: 'James Wilson', timestamp: '30m ago', status: 'pending' },
    { id: 5, type: 'time_off', title: 'Personal Day', description: 'Requesting a personal day off next Wednesday', payload: { reason: 'Personal' }, submitterName: 'Sarah Chen', timestamp: '1h ago', status: 'pending' }
];

export let auditLogs = [
    { id: 1, action: "System Start", actor: "System", details: "Server started", timestamp: new Date().toISOString() }
];

export const logAction = (action, actor, details) => {
    auditLogs.unshift({
        id: Date.now(),
        action,
        actor,
        details,
        timestamp: new Date().toISOString()
    });
    if (auditLogs.length > 100) auditLogs.pop();
};
