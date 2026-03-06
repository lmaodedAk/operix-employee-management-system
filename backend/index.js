import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

import { notifications, team, tasks, requests, auditLogs, logAction } from './seedData.js';


// Routes

// Notifications
app.get('/api/notifications', (req, res) => {
  const role = req.query.role; // 'admin' or 'employee'

  if (!role) {
    return res.json(notifications);
  }

  const filtered = notifications.filter(n =>
    n.recipientRole === 'all' || n.recipientRole === role
  );

  res.json(filtered);
});

app.post('/api/notifications', (req, res) => {
  const newNotification = {
    id: Date.now(),
    unread: true,
    timestamp: 'Just now',
    ...req.body
  };
  notifications.unshift(newNotification);
  res.status(201).json(newNotification);
});

// Team
app.get('/api/team', (req, res) => {
  res.json(team);
});

app.post('/api/team', (req, res) => {
  const newEmployee = {
    id: Date.now(),
    status: 'Active',
    joinDate: new Date().toLocaleDateString(),
    avatar: `https://ui-avatars.com/api/?name=${req.body.name}&background=random`,
    ...req.body
  };
  team.push(newEmployee);
  res.status(201).json(newEmployee);
});

// Tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: Date.now(),
    status: 'pending',
    ...req.body
  };
  tasks.push(newTask);

  // Notify Assignee
  if (newTask.assignedTo && newTask.assignedTo !== 'Unassigned') {
    const employeeNotif = {
      id: Date.now(),
      iconType: newTask.type === 'Meeting' ? 'calendar' : 'clipboard',
      title: `New ${newTask.type}: ${newTask.title}`,
      description: `You have been assigned to ${newTask.title} at ${newTask.time}`,
      timestamp: 'Just now',
      unread: true,
      category: 'Work',
      recipientRole: 'employee'
    };
    notifications.unshift(employeeNotif);
    logAction('Task Created', 'Admin', `Assigned ${newTask.title} to ${newTask.assignedTo}`);
  }

  res.status(201).json(newTask);
});




// ... Team/Tasks routes ...

app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  // Updated to accept partial updates for locking, priority, status
  const updates = req.body; // status, locked, priority, assignedTo

  const taskIndex = tasks.findIndex(t => t.id == id);
  if (taskIndex > -1) {
    const task = tasks[taskIndex];
    const oldDate = task.date;
    const oldTime = task.time;

    // Check for lock
    if (task.locked && updates.locked !== false) { // Can only unlock if locked
      return res.status(403).json({ error: "Task is locked by Admin" });
    }

    // Apply updates
    Object.assign(task, updates);

    // Logic for specific updates
    if (updates.status === 'completed') {
      const adminNotif = {
        id: Date.now(),
        iconType: 'check',
        title: 'Task Completed',
        message: `Task "${task.title}" completed by ${task.assignedTo}`,
        description: `Task "${task.title}" completed by ${task.assignedTo}`,
        timestamp: 'Just now',
        unread: true,
        category: 'Work',
        recipientRole: 'admin'
      };
      notifications.unshift(adminNotif);
      logAction('Task Completed', task.assignedTo || 'Unknown', `Task ID: ${id}`);
    } else if (updates.status === 'blocked') {
      const adminNotif = {
        id: Date.now(),
        iconType: 'alert',
        title: 'Task Blocked',
        description: `Task "${task.title}" reported as BLOCKED by ${task.assignedTo}`,
        timestamp: 'Just now',
        unread: true,
        category: 'Work',
        recipientRole: 'admin'
      };
      notifications.unshift(adminNotif);
      logAction('Task Blocked', task.assignedTo || 'Unknown', `Task ID: ${id}`);
    }

    // Reschedule Check
    if ((updates.date && updates.date !== oldDate) || (updates.time && updates.time !== oldTime)) {
      const employeeNotif = {
        id: Date.now(),
        iconType: 'calendar',
        title: 'Schedule Changed',
        description: `"${task.title}" moved to ${task.date} at ${task.time}`,
        timestamp: 'Just now',
        unread: true,
        category: 'Work',
        recipientRole: 'employee'
      };
      notifications.unshift(employeeNotif);
      logAction('Task Rescheduled', 'Admin', `Task ${id} moved`);
    }

    if (updates.priority) {
      // Notify Employee of Priority Change
      const employeeNotif = {
        id: Date.now(),
        iconType: 'alert',
        title: 'Priority Changed',
        description: `Admin changed priority of "${task.title}" to ${updates.priority}`,
        timestamp: 'Just now',
        unread: true,
        category: 'Work',
        recipientRole: 'employee'
      };
      notifications.unshift(employeeNotif);
      logAction('Priority Update', 'Admin', `Task ${id} -> ${updates.priority}`);
    }

    if (updates.locked !== undefined) {
      const employeeNotif = {
        id: Date.now(),
        iconType: updates.locked ? 'alert' : 'check',
        title: updates.locked ? 'Task Locked' : 'Task Unlocked',
        description: `Admin ${updates.locked ? 'locked' : 'unlocked'} task "${task.title}"`,
        timestamp: 'Just now',
        unread: true,
        category: 'System',
        recipientRole: 'employee'
      };
      notifications.unshift(employeeNotif);
      logAction(updates.locked ? 'Task Locked' : 'Task Unlocked', 'Admin', `Task ${id}`);
    }

    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.get('/api/requests', (req, res) => {
  const { submitterName } = req.query;
  if (submitterName) {
    return res.json(requests.filter(r => r.submitterName === submitterName));
  }
  res.json(requests);
});

app.post('/api/requests', (req, res) => {
  const newRequest = {
    id: Date.now(),
    status: 'pending',
    timestamp: 'Just now',
    ...req.body
  };
  requests.unshift(newRequest);

  // Notify admin
  const adminNotif = {
    id: Date.now() + 1,
    iconType: 'alert',
    title: `New Request: ${newRequest.type === 'time_off' ? 'Time Off' : newRequest.type}`,
    description: `${newRequest.submitterName} requested ${newRequest.type === 'time_off' ? 'time off' : 'approval'}`,
    timestamp: 'Just now',
    unread: true,
    category: 'System',
    recipientRole: 'admin' // TARGET: Admin
  };
  notifications.unshift(adminNotif);

  logAction('Request Created', newRequest.submitterName, `Type: ${newRequest.type}`);

  res.status(201).json(newRequest);
});

app.patch('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  const index = requests.findIndex(r => r.id == id);
  if (index !== -1) {
    const request = requests[index];
    request.status = status;

    // Handle Side Effects
    if (status === 'approved') {
      const payload = request.payload || {};

      logAction('Request Approved', 'Admin', `ID: ${id}, Type: ${request.type}`);

      if (request.type === 'add_employee') {
        const newEmployee = {
          id: Date.now(),
          status: 'Active',
          joinDate: new Date().toLocaleDateString(),
          avatar: `https://ui-avatars.com/api/?name=${payload.name}&background=random`,
          ...payload
        };
        team.push(newEmployee);
      }
      else if (request.type === 'add_task' || request.type === 'meeting') {
        const newTask = {
          id: Date.now(),
          status: 'pending',
          ...payload
        };
        tasks.push(newTask);
      }

      // Notify original submitter (Mock logic: create notification)
      const submitterNotif = {
        id: Date.now() + 2,
        iconType: 'check',
        title: 'Request Approved',
        description: `Your request "${request.title}" has been approved.`,
        timestamp: 'Just now',
        unread: true,
        category: 'System',
        recipientRole: 'employee'
      };
      notifications.unshift(submitterNotif);

    } else if (status === 'rejected') {
      logAction('Request Rejected', 'Admin', `ID: ${id}`);
      // Notify original submitter
      const submitterNotif = {
        id: Date.now() + 2,
        iconType: 'alert',
        title: 'Request Rejected',
        description: `Your request "${request.title}" was rejected.`,
        timestamp: 'Just now',
        unread: true,
        category: 'System',
        recipientRole: 'employee'
      };
      notifications.unshift(submitterNotif);
    }

    res.json(request);
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

// Logs
app.get('/api/audit-logs', (req, res) => {
  res.json(auditLogs);
});

// --- Automated Checks (Mock) ---
setInterval(() => {
  // 1. Check for Overdue Tasks (Mock: 1% chance to generate one for demo)
  if (Math.random() > 0.99) {
    const adminNotif = {
      id: Date.now(),
      iconType: 'alert',
      title: 'Late Task Alert',
      description: 'Task "Database Backup" is overdue by 2 hours.',
      timestamp: 'Just now',
      unread: true,
      category: 'System',
      recipientRole: 'admin'
    };
    notifications.unshift(adminNotif);
    logAction('System Alert', 'System', 'Generated Late Task Notification');
  }

  // 2. High Workload Check (Mock)
  const taskCount = tasks.length;
  if (taskCount > 20 && Math.random() > 0.99) {
    const adminNotif = {
      id: Date.now(),
      iconType: 'people',
      title: 'High Workload Alert',
      description: 'Team has > 20 active tasks.',
      timestamp: 'Just now',
      unread: true,
      category: 'HR',
      recipientRole: 'admin'
    };
    notifications.unshift(adminNotif);
    logAction('System Alert', 'System', 'Generated Workload Notification');
  }
}, 30000); // Check every 30s

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
