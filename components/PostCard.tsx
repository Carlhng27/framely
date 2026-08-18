import Link from 'next/link';
import Image from 'next/image';
import type { PostWithMeta } from '@/lib/types';
import Avatar from './Avatar';
import LikeButton from './LikeButton';
import { timeAgo } from '@/lib/time';

export default function PostCard({ post }: { post: PostWithMeta }) {
  return (
    <article className="mb-8 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar name={post.author.display_name} color={post.author.avatar_color} />
        <div className="min-w-0">
          <Link href={`/profile/${post.author.username}`} className="focus-ring truncate text-sm font-semibold text-ink hover:underline">
            {post.author.display_name}
          </Link>
          <p className="text-xs text-ink/50">{timeAgo(post.created_at)}</p>
        </div>
      </div>

      <Link href={`/post/${post.id}`} className="focus-ring block">
        <div className="relative aspect-square w-full bg-line">
          <Image src={post.image_url} alt={post.caption || 'Post image'} fill sizes="600px" className="object-cover" />
        </div>
      </Link>

      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <LikeButton postId={post.id} initialLiked={post.liked_by_me} initialCount={post.like_count} />
          <Link href={`/post/${post.id}`} className="focus-ring text-sm text-ink/60 hover:text-ink">
            {post.comment_count === 1 ? '1 comment' : `${post.comment_count} comments`}
          </Link>
        </div>
        {post.caption && (
          <p className="mt-2 text-sm text-ink">
            <Link href={`/profile/${post.author.username}`} className="focus-ring font-semibold hover:underline">
              {post.author.username}
            </Link>{' '}
            {post.caption}
          </p>
        )}
      </div>
    </article>
  );
}
