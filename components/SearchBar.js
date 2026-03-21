import { Search } from "lucide-react";

export function SearchBar({ className = "" }) {
  return (
    <form role="search" className={`relative flex w-full ${className}`} action="#">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
        <Search size={20} strokeWidth={1.75} className="shrink-0" aria-hidden />
      </span>
      <input
        type="search"
        name="q"
        placeholder="Search for quality meats..."
        className="search-input h-11 w-full rounded-full border border-neutral-200/90 bg-white pl-11 pr-5 text-[15px] leading-normal text-neutral-900 transition-[border-color,box-shadow] duration-200 placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-[3px] focus:ring-neutral-900/[0.05]"
        aria-label="Search for quality meats"
      />
    </form>
  );
}
