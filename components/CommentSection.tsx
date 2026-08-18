'use client';

import { useState } from 'react';
import type { Comment } from '@/lib/types';
import Avatar from './Avatar';
import { timeAgo } from '@/lib/time';

export default function CommentSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not post that comment.');
      }
      const data = await res.json();
      setComments(data.comments);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {comments.length === 0 ? (
        <p className="py-4 text-sm text-ink/50">No comments yet. Say something nice.</p>
      ) : (
        <ul className="divide-y divide-line">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3 py-3">
              <Avatar name={c.author.display_name} color={c.author.avatar_color} size={30} />
              <div className="min-w-0">
                <p className="text-sm text-ink">
                  <span className="font-semibold">{c.author.username}</span> {c.body}
                </p>
                <p className="mt-0.5 text-xs text-ink/40">{timeAgo(c.created_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2 border-t border-line pt-3">
        <label htmlFor="comment" className="sr-only">
          Add a comment
        </label>
        <input
          id="comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="focus-ring flex-1 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink placeholder:text-ink/40"
        />
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="focus-ring rounded-full bg-coral px-4 py-2 text-sm font-semibold text-cream transition hover:bg-coral-dark disabled:opacity-50"
        >
          Post
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-coral-dark">{error}</p>}
    </div>
  );
}
