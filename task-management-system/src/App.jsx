 import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
    const [tasks, setTasks] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const [editingTaskId, setEditingTaskId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "College",
        priority: "Medium",
        deadline: ""
    });

    const [filter, setFilter] = useState("All");

    // ===============================
    // GET TASKS FROM MONGODB
    // ===============================

    const fetchTasks = async () => {
        try {
            const response = await axios.get(API_URL);
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            alert("Could not connect to the backend.");
        }
    };

    // Load tasks when page opens
    useEffect(() => {
        fetchTasks();
    }, []);

    // ===============================
    // HANDLE FORM INPUT
    // ===============================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ===============================
    // ADD TASK
    // ===============================

    const handleAddTask = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert("Please enter a task title.");
            return;
        }

        try {
            const response = await axios.post(API_URL, {
                ...formData,
                completed: false
            });

            setTasks([response.data, ...tasks]);

            setFormData({
                title: "",
                description: "",
                category: "College",
                priority: "Medium",
                deadline: ""
            });

            setShowForm(false);
        } catch (error) {
            console.error("Failed to add task:", error);
            alert("Failed to add task.");
        }
    };

    // ===============================
    // EDIT TASK
    // ===============================

    const handleEdit = (task) => {
        setEditingTaskId(task._id);

        setFormData({
            title: task.title || "",
            description: task.description || "",
            category: task.category || "College",
            priority: task.priority || "Medium",
            deadline: task.deadline || ""
        });

        setShowEditForm(true);
    };

    // ===============================
    // SAVE EDIT
    // ===============================

    const handleSaveEdit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert("Please enter a task title.");
            return;
        }

        try {
            const response = await axios.put(
                `${API_URL}/${editingTaskId}`,
                formData
            );

            setTasks(
                tasks.map((task) =>
                    task._id === editingTaskId
                        ? response.data
                        : task
                )
            );

            setShowEditForm(false);
            setEditingTaskId(null);

            setFormData({
                title: "",
                description: "",
                category: "College",
                priority: "Medium",
                deadline: ""
            });
        } catch (error) {
            console.error("Failed to update task:", error);
            alert("Failed to update task.");
        }
    };

    // ===============================
    // DELETE TASK
    // ===============================

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/${id}`);

            setTasks(
                tasks.filter((task) => task._id !== id)
            );
        } catch (error) {
            console.error("Failed to delete task:", error);
            alert("Failed to delete task.");
        }
    };

    // ===============================
    // COMPLETE / UNCOMPLETE TASK
    // ===============================

    const handleComplete = async (id) => {
        const task = tasks.find((task) => task._id === id);

        if (!task) {
            return;
        }

        try {
            const response = await axios.put(
                `${API_URL}/${id}`,
                {
                    completed: !task.completed
                }
            );

            setTasks(
                tasks.map((task) =>
                    task._id === id
                        ? response.data
                        : task
                )
            );
        } catch (error) {
            console.error("Failed to update task:", error);
            alert("Failed to update task.");
        }
    };

    // ===============================
    // FILTER TASKS
    // ===============================

    const filteredTasks = tasks.filter((task) => {
        if (filter === "Pending") {
            return !task.completed;
        }

        if (filter === "Completed") {
            return task.completed;
        }

        return true;
    });

    // ===============================
    // STATISTICS
    // ===============================

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    const pendingTasks = tasks.filter(
        (task) => !task.completed
    ).length;

    // ===============================
    // UI
    // ===============================

    return (
        <div className="app">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="logo">
                    Task<span>Flow</span>
                </div>

                <nav>

                    <button className="nav-item active">
                        📊 Dashboard
                    </button>

                    <button className="nav-item">
                        📝 My Tasks
                    </button>

                    <button className="nav-item">
                        📁 Projects
                    </button>

                    <button className="nav-item">
                        📅 Calendar
                    </button>

                    <button className="nav-item">
                        ⚙️ Settings
                    </button>

                </nav>

            </aside>

            {/* MAIN */}

            <main className="main-content">

                {/* HEADER */}

                <header className="topbar">

                    <div>
                        <h1>Good Morning 👋</h1>
                        <p>Here's what's happening with your tasks today.</p>
                    </div>

                    <button
                        className="add-task-btn"
                        onClick={() => setShowForm(true)}
                    >
                        + Add Task
                    </button>

                </header>

                {/* STATISTICS */}

                <section className="stats">

                    <div className="stat-card">
                        <h3>Total Tasks</h3>
                        <strong>{totalTasks}</strong>
                    </div>

                    <div className="stat-card">
                        <h3>Pending</h3>
                        <strong>{pendingTasks}</strong>
                    </div>

                    <div className="stat-card">
                        <h3>Completed</h3>
                        <strong>{completedTasks}</strong>
                    </div>

                </section>

                {/* TASK SECTION */}

                <section className="task-section">

                    <div className="task-header">

                        <h2>My Tasks</h2>

                        <div className="filters">

                            <button
                                className={
                                    filter === "All"
                                        ? "filter active"
                                        : "filter"
                                }
                                onClick={() => setFilter("All")}
                            >
                                All
                            </button>

                            <button
                                className={
                                    filter === "Pending"
                                        ? "filter active"
                                        : "filter"
                                }
                                onClick={() => setFilter("Pending")}
                            >
                                Pending
                            </button>

                            <button
                                className={
                                    filter === "Completed"
                                        ? "filter active"
                                        : "filter"
                                }
                                onClick={() => setFilter("Completed")}
                            >
                                Completed
                            </button>

                        </div>

                    </div>

                    {/* TASK LIST */}

                    <div className="task-list">

                        {filteredTasks.length === 0 ? (

                            <div className="empty-state">
                                <h3>No tasks found</h3>
                                <p>Create a new task to get started.</p>
                            </div>

                        ) : (

                            filteredTasks.map((task) => (

                                <div
                                    className={
                                        task.completed
                                            ? "task-card completed"
                                            : "task-card"
                                    }
                                    key={task._id}
                                >

                                    <div className="task-check">

                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() =>
                                                handleComplete(task._id)
                                            }
                                        />

                                    </div>

                                    <div className="task-info">

                                        <h3>{task.title}</h3>

                                        {task.description && (
                                            <p>{task.description}</p>
                                        )}

                                        <div className="task-details">

                                            <span>
                                                📁 {task.category}
                                            </span>

                                            <span>
                                                ⚡ {task.priority}
                                            </span>

                                            {task.deadline && (
                                                <span>
                                                    📅 {task.deadline}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                    <div className="task-actions">

                                        <button
                                            title="Edit"
                                            onClick={() =>
                                                handleEdit(task)
                                            }
                                        >
                                            ✏️
                                        </button>

                                        <button
                                            title="Delete"
                                            onClick={() =>
                                                handleDelete(task._id)
                                            }
                                        >
                                            🗑️
                                        </button>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </section>

            </main>

            {/* ===============================
                ADD TASK MODAL
            =============================== */}

            {showForm && (

                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <h2>Add New Task</h2>

                            <button
                                onClick={() => setShowForm(false)}
                            >
                                ✕
                            </button>

                        </div>

                        <form onSubmit={handleAddTask}>

                            <label>Task Title</label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter task title"
                            />

                            <label>Description</label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter description"
                            />

                            <label>Category</label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="College">
                                    College
                                </option>

                                <option value="Project">
                                    Project
                                </option>

                                <option value="Personal">
                                    Personal
                                </option>

                            </select>

                            <label>Priority</label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="Low">
                                    Low
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="High">
                                    High
                                </option>

                            </select>

                            <label>Deadline</label>

                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                            />

                            <div className="modal-buttons">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button type="submit">
                                    Create Task
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* ===============================
                EDIT TASK MODAL
            =============================== */}

            {showEditForm && (

                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <h2>Edit Task</h2>

                            <button
                                onClick={() =>
                                    setShowEditForm(false)
                                }
                            >
                                ✕
                            </button>

                        </div>

                        <form onSubmit={handleSaveEdit}>

                            <label>Task Title</label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter task title"
                            />

                            <label>Description</label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter description"
                            />

                            <label>Category</label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="College">
                                    College
                                </option>

                                <option value="Project">
                                    Project
                                </option>

                                <option value="Personal">
                                    Personal
                                </option>

                            </select>

                            <label>Priority</label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="Low">
                                    Low
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="High">
                                    High
                                </option>

                            </select>

                            <label>Deadline</label>

                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                            />

                            <div className="modal-buttons">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEditForm(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button type="submit">
                                    Save Changes
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default App;