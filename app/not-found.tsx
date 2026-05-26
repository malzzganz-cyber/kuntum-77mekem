import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-bg">
      <h1 className="text-4xl font-black uppercase mb-4">404 - Not Found</h1>
      <Link href="/" className="brutal-btn bg-yellow">
        Go Back Home
      </Link>
    </div>
  );
}
