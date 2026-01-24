import React, { useState, useEffect } from 'react';

export const Search = ({ className }: { className?: string }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagefind, setPagefind] = useState<any>(null);

    const loadPagefind = async () => {
        if (pagefind) return; // Already loading or loaded
        setLoading(true);
        try {
            // Use a variable to prevent build-time resolution errors
            const url = "/pagefind/pagefind.js";
            const pf = await import(/* @vite-ignore */ url);
            setPagefind(pf);
            console.log("Pagefind loaded successfully");
        } catch (e) {
            console.warn("Pagefind not found (normal in dev mode):", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        setQuery(q);

        if (q.length > 2 && pagefind) {
            setLoading(true);
            try {
                console.log("Searching for:", q);
                const search = await pagefind.search(q);
                console.log("Raw results:", search.results);

                // The search returns a list of results, but we need to load the data for each
                const data = await Promise.all(search.results.slice(0, 5).map((r: any) => r.data()));
                console.log("Enriched data:", data);
                setResults(data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        } else {
            setResults([]);
        }
    };

    // If in dev mode and pagefind isn't found, we show a disabled-looking but functional-on-focus input
    // The previous logic completely changed the UI. Let's make it consistent.

    return (
        <div className={`relative font-mono w-full group ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-surface-highlight rounded-md leading-5 bg-surface-elevation-low text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200"
                placeholder={loading ? "Initializing search..." : "Search command..."}
                value={query}
                onChange={handleSearch}
                onFocus={loadPagefind}
                onMouseEnter={loadPagefind}
            />

            {results.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full bg-zinc-900 border border-zinc-700 shadow-2xl max-h-80 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                    {results.map((result, index) => (
                        <li key={index} className="group border-b border-zinc-800 last:border-0">
                            <a href={result.url} className="cursor-pointer select-none relative block py-3 pl-4 pr-4 hover:bg-zinc-800 transition-colors text-text">
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-primary block truncate">{result.meta.title}</span>
                                    <span className="text-xs text-gray-400 mt-1 block line-clamp-2" dangerouslySetInnerHTML={{ __html: result.excerpt }}></span>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
