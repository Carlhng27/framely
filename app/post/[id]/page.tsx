import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { getPost, listComments } from '@/lib/queries';
import Avatar from '@/components/Avatar';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';
import { timeAgo } from '@/lib/time';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const me = getCurrentUser();
  const post = getPost(params.id, me.id);
  if (!post) notFound();
  const comments = listComments(post.id);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar name={post.author.display_name} color={post.author.avatar_color} />
        <div>
          <Link href={`/profile/${post.author.username}`} className="focus-ring text-sm font-semibold text-ink hover:underline">
            {post.author.display_name}
          </Link>
          <p className="text-xs text-ink/50">{timeAgo(post.created_at)}</p>
        </div>
      </div>

      <div className="relative aspect-square w-full bg-line">
        <Image src={post.image_url} alt={post.caption || 'Post image'} fill sizes="600px" className="object-cover" />
      </div>

      <div className="px-4 py-3">
        <LikeButton postId={post.id} initialLiked={post.liked_by_me} initialCount={post.like_count} />
        {post.caption && (
          <p className="mt-2 text-sm text-ink">
            <span className="font-semibold">{post.author.username}</span> {post.caption}
          </p>
        )}
        <div className="mt-4">
          <CommentSection postId={post.id} initialComments={comments} />
        </div>
      </div>
    </div>
  );
}
