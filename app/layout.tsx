import type { Metadata } from 'next';
import { Fraunces, Work_Sans } from 'next/font/google';
import './globals.css';
import TopNav from '@/components/TopNav';
import { getCurrentUser, getAllUsers } from '@/lib/session';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['500', '600', '700'],
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-worksans',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Framely',
  description: 'Small moments, framed well.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const me = getCurrentUser();
  const users = getAllUsers();
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="font-body min-h-screen antialiased">
        <TopNav me={me} users={users} />
        <main className="mx-auto max-w-[600px] px-4 pb-16 pt-6 sm:px-0">{children}</main>
      </body>
    </html>
  );
}
