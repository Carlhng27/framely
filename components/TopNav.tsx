import Link from 'next/link';
import type { User } from '@/lib/types';
import UserSwitcher from './UserSwitcher';

export default function TopNav({ me, users }: { me: User; users: User[] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-[600px] items-center justify-between px-4 py-3">
        <Link href="/" className="focus-ring font-display text-2xl font-semibold tracking-tight text-ink">
          Framely
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/upload"
            className="focus-ring rounded-full bg-coral px-4 py-1.5 text-sm font-semibold text-cream transition hover:bg-coral-dark"
          >
            + New post
          </Link>
          <Link
            href={`/profile/${me.username}`}
            className="focus-ring text-sm font-medium text-ink/70 transition hover:text-ink"
          >
            Profile
          </Link>
          <UserSwitcher me={me} users={users} />
        </nav>
      </div>
    </header>
  );
}
