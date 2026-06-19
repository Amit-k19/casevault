export default function SlideCard({ slide }) {
  return (
    <a 
  href={slide.slideUrl} 
  target="_blank" 
  rel="noreferrer"
  className="bg-white border border-ink/10 rounded-sm overflow-hidden hover:shadow-lg transition-shadow block"
>
      <div className="h-40 bg-ink/5 flex items-center justify-center overflow-hidden">
        {slide.previewImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.previewImage}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-ink/30 text-xs uppercase tracking-wide">No preview</span>
        )}
      </div>
      <div className="p-5">
        <span className="inline-block text-[11px] uppercase tracking-wider text-gold mb-2 font-semibold">
          {slide.category}
        </span>
        <h3 className="font-serif text-lg font-semibold text-ink mb-1.5 leading-snug">
          {slide.title}
        </h3>
        <p className="text-sm text-ink/60 line-clamp-2 mb-3">{slide.description}</p>
        <div className="flex items-center justify-between text-xs text-ink/50 border-t border-ink/10 pt-2.5">
          <span>{slide.competitionName || "—"}</span>
          <span>{slide.year || ""}</span>
        </div>
      </div>
    </a>
  );
}
