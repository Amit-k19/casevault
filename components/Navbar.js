"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/");
  }

  return (
    <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-ink/10 bg-cream">
      <Link href="/" className="text-2xl font-serif font-bold text-ink tracking-tight">
        CaseVault
      </Link>
      <div className="flex items-center gap-4 sm:gap-6">
        <Link href="/" className="text-sm text-ink/70 hover:text-ink transition-colors">
          Gallery
        </Link>
        {loggedIn ? (
          <>
            <Link
              href="/upload"
              className="bg-ink text-cream text-sm px-4 py-2 rounded-sm hover:bg-ink/90 transition-colors"
            >
              Upload
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-ink/60 hover:text-ink transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-ink text-cream text-sm px-4 py-2 rounded-sm hover:bg-ink/90 transition-colors"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
