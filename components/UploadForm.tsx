'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function UploadForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError('Choose a photo first.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', caption);
      const res = await fetch('/api/posts', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not create the post.');
      }
      const { id } = await res.json();
      router.push(`/post/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="image" className="mb-2 block text-sm font-medium text-ink">
          Photo
        </label>
        {preview ? (
          <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-2xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Selected preview" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="mb-3 flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line text-ink/40">
            <span className="text-sm">No photo selected</span>
          </div>
        )}
        <input
          ref={fileRef}
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={onPickFile}
          className="focus-ring block w-full text-sm text-ink file:mr-3 file:rounded-full file:border-0 file:bg-coral file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream hover:file:bg-coral-dark"
        />
      </div>

      <div>
        <label htmlFor="caption" className="mb-2 block text-sm font-medium text-ink">
          Caption
        </label>
        <textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          placeholder="Write a caption..."
          className="focus-ring w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40"
        />
      </div>

      {error && <p className="text-sm text-coral-dark">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="focus-ring w-full rounded-full bg-coral px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-coral-dark disabled:opacity-60"
      >
        {submitting ? 'Sharing…' : 'Share post'}
      </button>
    </form>
  );
}
