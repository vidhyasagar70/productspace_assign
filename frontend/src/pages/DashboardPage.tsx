import { useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  updateTaskStatusRequest,
} from '../api/task.api';
import { useAuth } from '../context/AuthContext';
import type { Task, TaskStatus } from '../types';

const getApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (error.response?.data as { message?: string } | undefined)?.message ??
      'Request failed';
  }

  if (error instanceof Error) return error.message;
  return 'Unexpected error';
};

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pendingCount = useMemo(
    () => tasks.filter((task) => task.status === 'pending').length,
    [tasks],
  );

  const fetchTasks = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const data = await getTasksRequest();
      setTasks(data.tasks);
    } catch (fetchError) {
      setError(getApiError(fetchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTasks();
  }, []);

  const createTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const data = await createTaskRequest({
        title,
        description: description.trim() || undefined,
      });
      setTasks((prev) => [data.task, ...prev]);
      setTitle('');
      setDescription('');
    } catch (createError) {
      setError(getApiError(createError));
    }
  };

  const toggleStatus = async (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'pending' ? 'completed' : 'pending';

    try {
      const data = await updateTaskStatusRequest(task.id, nextStatus);
      setTasks((prev) => prev.map((item) => (item.id === task.id ? data.task : item)));
    } catch (updateError) {
      setError(getApiError(updateError));
    }
  };

  const removeTask = async (taskId: number) => {
    try {
      await deleteTaskRequest(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (deleteError) {
      setError(getApiError(deleteError));
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(145deg,#0f172a,#020617)] px-4 py-8 text-slate-100">
      <section className="mx-auto w-full max-w-5xl">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Workspace</p>
              <h1 className="mt-2 text-3xl font-bold">Welcome, {user?.name}</h1>
              <p className="mt-1 text-slate-300">
                {pendingCount} pending of {tasks.length} total tasks
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-semibold transition hover:border-slate-200"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[360px,1fr]">
          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <h2 className="text-xl font-semibold">Create Task</h2>
            <form className="mt-4 space-y-3" onSubmit={createTask}>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                minLength={2}
                maxLength={140}
                placeholder="Task title"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-cyan-400 transition focus:ring"
              />
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="Description (optional)"
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-cyan-400 transition focus:ring"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Add Task
              </button>
            </form>

            {error && (
              <p className="mt-3 rounded-lg border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
                {error}
              </p>
            )}
          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <h2 className="text-xl font-semibold">Your Tasks</h2>

            {loading ? (
              <p className="mt-4 animate-pulse text-slate-300">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="mt-4 text-slate-400">No tasks yet. Create your first task.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            task.status === 'completed'
                              ? 'text-slate-400 line-through'
                              : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="mt-1 max-w-xl text-sm text-slate-300">{task.description}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleStatus(task)}
                          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                            task.status === 'pending'
                              ? 'bg-cyan-300 text-slate-950 hover:bg-cyan-200'
                              : 'bg-amber-300 text-slate-950 hover:bg-amber-200'
                          }`}
                        >
                          {task.status === 'pending' ? 'Mark Completed' : 'Mark Pending'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTask(task.id)}
                          className="rounded-lg bg-rose-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-rose-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      </section>
    </main>
  );
};
