"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SlideCard from "@/components/SlideCard";

export default function HomePage() {
  const [slides, setSlides] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Re-fetches slides from our own API whenever the user changes a filter,
  // the search box, the sort order, or the page number.
  useEffect(() => {
    async function fetchSlides() {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "8",
        search,
        category,
        sort,
      });
      const res = await fetch(`/api/slides?${params.toString()}`);
      const data = await res.json();
      setSlides(data.slides || []);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    }
    fetchSlides();
  }, [search, category, sort, page]);

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
        <h1 className="text-4xl font-serif font-bold text-ink mb-2">The Gallery</h1>
        <p className="text-ink/60 mb-8">
          Curated case competition slides, browsable by anyone — log in to add your own.
        </p>

        <div className="flex flex-wrap gap-3 mb-10">
          <input
            type="text"
            placeholder="Search presentations..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="border border-ink/15 bg-white rounded-sm px-3 py-2 text-sm flex-1 min-w-[220px] focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="border border-ink/15 bg-white rounded-sm px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            <option value="Strategy">Strategy</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Social Impact">Social Impact</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-ink/15 bg-white rounded-sm px-3 py-2 text-sm"
          >
            <option value="newest">Latest Submissions</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {loading ? (
          <p className="text-ink/40 text-sm">Loading slides...</p>
        ) : slides.length === 0 ? (
          <p className="text-ink/40 text-sm">No slides found. Try a different search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <SlideCard key={slide._id} slide={slide} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 text-sm border border-ink/15 rounded-sm disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-sm text-ink/60">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm border border-ink/15 rounded-sm disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
