import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchBar({
  autoFocus = false,
  variant = "header",
  initialQuery = "",
  placeholder = "Search chargers, power supplies…",
}: {
  autoFocus?: boolean;
  variant?: "header" | "large";
  initialQuery?: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  const inputId = useId();

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  const onSubmit = () => {
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const inputClasses =
    variant === "large"
      ? "h-12 flex-1 bg-transparent px-4 text-base sm:text-lg focus:outline-none"
      : "h-9 flex-1 bg-transparent px-3 text-sm focus:outline-none";

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={`flex items-center rounded-md border border-input bg-background focus-within:border-brand ${
        variant === "large" ? "max-w-xl" : "w-full max-w-sm"
      }`}
    >
      <label htmlFor={inputId} className="sr-only">
        Search products
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        autoFocus={autoFocus}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
        placeholder={placeholder}
        className={inputClasses}
      />
      <button
        type="submit"
        aria-label="Search"
        className={`flex shrink-0 items-center justify-center bg-transparent text-muted-foreground hover:text-foreground ${
          variant === "large" ? "h-12 w-12" : "h-9 w-9"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </button>
    </form>
  );
}