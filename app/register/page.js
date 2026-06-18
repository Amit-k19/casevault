"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Registration failed.");
      return;
    }

    router.push("/login");
  }

  return (
    <main className="max-w-sm mx-auto px-6 py-24">
      <h1 className="text-2xl font-serif font-bold text-ink mb-6">Create your account</h1>
      {error && (
        <p className="bg-red-50 text-red-700 text-sm p-3 rounded-sm mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm"
        />
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
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm"
        />
        <button
          disabled={submitting}
          className="w-full bg-ink text-cream py-2.5 rounded-sm text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="text-sm text-ink/50 mt-5">
        Already have an account?{" "}
        <Link href="/login" className="text-ink underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
