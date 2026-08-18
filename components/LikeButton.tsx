'use client';

import { useState } from 'react';

export default function LikeButton({
  postId,
  initialLiked,
  initialCount,
}: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pop, setPop] = useState(false);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    setPending(true);
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));
    if (nextLiked) {
      setPop(true);
      setTimeout(() => setPop(false), 700);
    }
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.likeCount);
    } catch {
      setLiked(!nextLiked);
      setCount((c) => c - (nextLiked ? 1 : -1));
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike this post' : 'Like this post'}
      className="focus-ring group relative flex items-center gap-1.5 rounded-full px-1 py-1 text-sm font-medium transition disabled:opacity-60"
      disabled={pending}
    >
      <span className="relative inline-flex h-6 w-6 items-center justify-center">
        <HeartIcon filled={liked} />
        {pop && (
          <span className="animate-heart-pop pointer-events-none absolute inset-0 flex items-center justify-center">
            <HeartIcon filled className="scale-125" />
          </span>
        )}
      </span>
      <span className={liked ? 'text-coral' : 'text-ink/70 group-hover:text-ink'}>{count}</span>
    </button>
  );
}

function HeartIcon({ filled, className = '' }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 transition-transform ${filled ? 'text-coral' : 'text-ink/60'} ${className}`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.5s-7.5-4.6-10-9.3C.5 8 2 4.5 5.4 4c2-.3 3.8.7 4.9 2.3.1.1.1.2.2.3.1-.1.1-.2.2-.3C11.8 4.7 13.6 3.7 15.6 4c3.4.5 4.9 4 3.4 7.2-2.5 4.7-10 9.3-10 9.3z"
      />
    </svg>
  );
}
