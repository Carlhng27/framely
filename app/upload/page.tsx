import UploadForm from '@/components/UploadForm';

export default function UploadPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Share a new post</h1>
      <p className="mt-1 text-sm text-ink/60">Pick a photo and say something about it.</p>
      <div className="mt-6">
        <UploadForm />
      </div>
    </div>
  );
}
