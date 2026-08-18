'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { User } from '@/lib/types';
import Avatar from './Avatar';

export default function UserSwitcher({ me, users }: { me: User; users: User[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function switchTo(userId: string) {
    setOpen(false);
    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Posting as ${me.display_name}. Switch demo user.`}
        className="focus-ring flex items-center gap-2 rounded-full border border-line bg-white/60 px-1.5 py-1 transition hover:border-coral disabled:opacity-50"
        disabled={pending}
      >
        <Avatar name={me.display_name} color={me.avatar_color} size={28} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="animate-rise-in absolute right-0 top-11 z-20 w-56 overflow-hidden rounded-2xl border border-line bg-white py-1 shadow-lg"
        >
          <li className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-ink/40">
            Switch demo user
          </li>
          {users.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                role="option"
                aria-selected={u.id === me.id}
                onClick={() => switchTo(u.id)}
                className={`focus-ring flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-cream ${
                  u.id === me.id ? 'font-semibold text-coral' : 'text-ink'
                }`}
              >
                <Avatar name={u.display_name} color={u.avatar_color} size={26} />
                <span>
                  {u.display_name}
                  <span className="block text-xs text-ink/50">@{u.username}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
