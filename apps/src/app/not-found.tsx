import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Image
        src="/images/illustrations/error-404.svg"
        alt="Page not found"
        width={320}
        height={240}
        priority
      />
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
