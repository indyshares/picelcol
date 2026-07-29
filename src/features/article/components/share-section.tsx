"use client";

import { useState } from "react";
import {
  Link2,
  Check,
  MessageCircle,
  Send,
} from "lucide-react";

type ShareButtonProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

function ShareButton({ href, label, icon }: ShareButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--bg)] hover:border-[var(--primary)]"
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

export function ShareSection({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <section className="mt-8 border-t border-[var(--border)] pt-6">
      <h3 className="mb-4 font-[var(--font-heading)] text-sm font-semibold text-[var(--text)]">
        แชร์บทความนี้
      </h3>
      <div className="flex flex-wrap gap-2">
        <ShareButton
          href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
          label="LINE"
          icon={<Send className="h-4 w-4 text-[#06C755]" />}
        />
        <ShareButton
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          label="X"
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          }
        />
        <ShareButton
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          label="Facebook"
          icon={
            <svg className="h-4 w-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          }
        />
        <ShareButton
          href={`https://threads.net/intent/post?text=${encodedTitle}%0A${encodedUrl}`}
          label="Threads"
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.495 11.174c.933-.494 1.582-1.287 1.582-2.42 0-2.093-1.683-3.133-3.994-3.133H9.705v12.542h4.774c2.565 0 4.534-.884 4.534-2.893 0-1.302-.759-2.245-2.518-2.642v-.107c.94-.38 1.517-1.08 1.517-2.188zm-3.618 4.625H11.05v-3.278h1.62c1.403 0 2.247.541 2.247 1.636 0 1.084-.798 1.642-2.04 1.642zm-.16-4.896H11.05V8.274h1.493c1.255 0 2.012.48 2.012 1.46 0 .973-.701 1.463-1.837 1.463zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z"/>
            </svg>
          }
        />
        <ShareButton
          href={`https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=87741124305&redirect_uri=${encodedUrl}`}
          label="Messenger"
          icon={<MessageCircle className="h-4 w-4 text-[#00B2FF]" />}
        />
        <button
          type="button"
          onClick={copyLink}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--bg)] hover:border-[var(--primary)]"
          title="คัดลอกลิงก์"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{copied ? "คัดลอกแล้ว" : "Copy Link"}</span>
        </button>
      </div>
    </section>
  );
}
