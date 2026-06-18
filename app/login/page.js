"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Login failed.");
      return;
    }

    // We store the JWT "wristband" in localStorage so it survives a page
    // refresh. Every protected request will read it from here.
    localStorage.setItem("token", data.token);
    router.push("/");
  }

  return (
    <main className="max-w-sm mx-auto px-6 py-24">
      <h1 className="text-2xl font-serif font-bold text-ink mb-6">Log in to CaseVault</h1>
      {error && (
        <p className="bg-red-50 text-red-700 text-sm p-3 rounded-sm mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm"
        />
        <button
          disabled={submitting}
          className="w-full bg-ink text-cream py-2.5 rounded-sm text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p className="text-sm text-ink/50 mt-5">
        No account?{" "}
        <Link href="/register" className="text-ink underline">
          Register
        </Link>
      </p>
    </main>
  );
}
