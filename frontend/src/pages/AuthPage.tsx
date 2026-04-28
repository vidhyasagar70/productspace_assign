import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signup({ name, email, password });
      } else {
        await login({ email, password });
      }

      navigate('/dashboard', { replace: true });
    } catch (submitError) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError('Unable to continue. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(251,146,60,0.2),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.18),transparent_40%)]" />

      <section className="relative mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/75 p-8 shadow-2xl backdrop-blur">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300">Mini SaaS</p>
        <h1 className="text-3xl font-bold">Task Command Center</h1>
        <p className="mt-2 text-slate-300">
          Securely manage your personal tasks with JWT authentication.
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-800/70 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              mode === 'login'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              mode === 'signup'
                ? 'bg-emerald-400 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Signup
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {mode === 'signup' && (
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
                maxLength={80}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-cyan-400 transition focus:ring"
                placeholder="Your name"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-cyan-400 transition focus:ring"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-cyan-400 transition focus:ring"
              placeholder="At least 8 characters"
            />
          </label>

          {error && (
            <p className="rounded-lg border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
};
