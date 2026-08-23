'use client';

import { useState, useTransition } from 'react';
import { loginAction } from '@/app/admin/actions';

export function LoginForm() {
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-ink-border bg-ink-card p-8"
      >
        <h1 className="text-center text-2xl font-bold">Login</h1>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            Username
          </label>
          <input
            name="username"
            type="text"
            required
            autoComplete="username"
            maxLength={50}
            className="w-full rounded-lg border border-ink-border bg-ink px-4 py-2.5 text-white placeholder-zinc-500 focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            maxLength={100}
            className="w-full rounded-lg border border-ink-border bg-ink px-4 py-2.5 text-white placeholder-zinc-500 focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full disabled:opacity-50"
        >
          {isPending ? 'Loading...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
