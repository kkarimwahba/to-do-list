import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useStore from './store';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../client';

export default function TasksPage() {
  const router = useRouter();
  const { tasks, loadTasks, addTask, updateTask, deleteTask, alert, user, setUser } = useStore();

  const [task, setTask] = useState({ Name: '', Activity: '', StartDate: '', EndDate: '' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({ Name: '', Activity: '', StartDate: '', EndDate: '' });

  const { isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: loadTasks,
    enabled: !!user,
  });

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      } else {
        setUser(session.user);
        loadTasks();
      }
    };
    loadSession();
  }, [router]);

  const handleAddTask = async () => {
    await addTask(task);
    setTask({ Name: '', Activity: '', StartDate: '', EndDate: '' });
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditedTask({ Name: task.Name, Activity: task.Activity, StartDate: task.StartDate, EndDate: task.EndDate });
  };

  const handleSaveTask = async (id) => {
    await updateTask(id, editedTask);
    setEditingTaskId(null); // Exit editing mode
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4 w-4/5">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Your Tasks {user && `- ${user.email}`}
      </h1>

      {alert && (
        <div className={`${alert.type === 'success' ? 'bg-green-100 text-green-700' :
          alert.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'} border p-4 rounded mb-4`}>
          {alert.message}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Task Name"
          value={task.Name}
          onChange={(e) => setTask({ ...task, Name: e.target.value })}
          className="border p-2 rounded mb-2 mr-2 w-1/2"
        />
        <input
          type="text"
          placeholder="Task Activity"
          value={task.Activity}
          onChange={(e) => setTask({ ...task, Activity: e.target.value })}
          className="border p-2 rounded mb-2 mr-2 w-1/2"
        />
        <input
          type="date"
          value={task.StartDate}
          onChange={(e) => setTask({ ...task, StartDate: e.target.value })}
          className="border p-2 rounded mb-2 mr-2"
        />
        <input
          type="date"
          value={task.EndDate}
          onChange={(e) => setTask({ ...task, EndDate: e.target.value })}
          className="border p-2 rounded mb-2"
        />
        <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </div>

      <table className="min-w-full bg-white mb-4">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Activity</th>
            <th className="py-2">Start Date</th>
            <th className="py-2">End Date</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              {editingTaskId === task.id ? (
                <>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={editedTask.Name}
                      onChange={(e) => setEditedTask({ ...editedTask, Name: e.target.value })}
                      className="border p-2 rounded w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={editedTask.Activity}
                      onChange={(e) => setEditedTask({ ...editedTask, Activity: e.target.value })}
                      className="border p-2 rounded w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="date"
                      value={editedTask.StartDate}
                      onChange={(e) => setEditedTask({ ...editedTask, StartDate: e.target.value })}
                      className="border p-2 rounded w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="date"
                      value={editedTask.EndDate}
                      onChange={(e) => setEditedTask({ ...editedTask, EndDate: e.target.value })}
                      className="border p-2 rounded w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleSaveTask(task.id)} className="bg-green-500 text-white px-2 py-1 rounded">
                      Save
                    </button>
                    <button onClick={() => setEditingTaskId(null)} className="bg-gray-500 text-white px-2 py-1 ml-2 rounded">
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border px-4 py-2">{task.Name}</td>
                  <td className="border px-4 py-2">{task.Activity}</td>
                  <td className="border px-4 py-2">{task.StartDate}</td>
                  <td className="border px-4 py-2">{task.EndDate}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleEditTask(task)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} className="bg-red-500 text-white px-2 py-1 ml-2 rounded">
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-2 rounded mt-4 float-left">
        Logout
      </button>
    </div>
  );
}
