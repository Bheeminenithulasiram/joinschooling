import React from "react";
import Link from "next/link";
import { FolderSearch } from "lucide-react";

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon?: any;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="card p-10 sm:p-14 text-center flex flex-col items-center justify-center max-w-lg mx-auto border border-dashed border-slate-300">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold mb-4">
        <Icon size={28} />
      </div>
      <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1.5 leading-relaxed">{description}</p>
      {actionHref && actionLabel && (
        <div className="mt-6">
          <Link href={actionHref} className="btn-primary">
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}

