"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function UploadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Strategy",
    competitionName: "",
    year: new Date().getFullYear(),
    tags: "",
    previewImage: "",
    slideUrl: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You need to log in before uploading.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/slides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          year: Number(form.year),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed.");
      }

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 sm:px-10 py-12">
        <h1 className="text-3xl font-serif font-bold text-ink mb-2">Curate Your Work</h1>
        <p className="text-ink/60 mb-8 text-sm">
          Submit your case analysis. Paste links for the slide file and preview
          image (e.g. a Google Drive or Imgur link) — no file upload server needed.
        </p>

        {error && (
          <p className="bg-red-50 text-red-700 text-sm p-3 rounded-sm mb-5">{error}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white border border-ink/10 rounded-sm p-7"
        >
          <Field label="Case Title">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Executive Summary">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Competition Name">
              <input
                name="competitionName"
                value={form.competitionName}
                onChange={handleChange}
                className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Year">
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm"
              />
            </Field>
          </div>

          <Field label="Category">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm"
            >
              <option>Strategy</option>
              <option>Finance</option>
              <option>Marketing</option>
              <option>Social Impact</option>
            </select>
          </Field>

          <Field label="Tags (comma separated)">
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="growth, market entry"
              className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Preview Image URL">
            <input
              name="previewImage"
              value={form.previewImage}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Slide File URL (PDF / PPTX link)">
            <input
              name="slideUrl"
              value={form.slideUrl}
              onChange={handleChange}
              required
              placeholder="https://..."
              className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm"
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="bg-ink text-cream px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "Publish to Vault"}
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-ink/50 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
