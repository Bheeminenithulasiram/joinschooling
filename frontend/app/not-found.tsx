import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <div className="font-display text-7xl font-extrabold gradient-text">404</div>
        <div className="mt-2 font-display text-2xl font-bold">Page not found</div>
        <p className="mt-2 text-ink-500">The page you are looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">Back home</Link>
      </div>
    </div>
  );
}
