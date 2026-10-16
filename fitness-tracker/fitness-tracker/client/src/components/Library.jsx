import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "../api.js";
import { embedUrl } from "../youtube.js";
import ResourceCard from "./ResourceCard.jsx";
import AddResourceModal from "./AddResourceModal.jsx";

const TYPE_LABEL = { "": "All", video: "🎬 Videos", article: "📰 Articles", tip: "💡 Tips", recipe: "🥗 Recipes" };
const SUGGESTIONS = ["yoga", "weight loss", "back pain", "sleep", "protein", "stress", "hiit", "meditation"];

export default function Library() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [page, setPage] = useState(1);

  const [result, setResult] = useState({ items: [], total: 0, pages: 1 });
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [playing, setPlaying] = useState(null); // { item, videoId }
  const latestRequest = useRef(0);

  // wait 300 ms after typing stops before searching
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const loadMeta = useCallback(() => {
    api.getResourceMeta().then(setMeta).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    const id = ++latestRequest.current;
    setLoading(true);
    try {
      const data = await api.searchResources({
        q: debouncedQ,
        type,
        category,
        favorites: favoritesOnly,
        page,
      });
      if (id !== latestRequest.current) return; // an older request, ignore it
      setResult(data);
      setError("");
    } catch (err) {
      if (id === latestRequest.current) setError("Could not load the library. Is the server running?");
    } finally {
      if (id === latestRequest.current) setLoading(false);
    }
  }, [debouncedQ, type, category, favoritesOnly, page]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleFavorite = async (id) => {
    await api.toggleFavorite(id);
    await Promise.all([load(), loadMeta()]);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await api.deleteResource(id);
    await Promise.all([load(), loadMeta()]);
  };
  const handleAdd = async (data) => {
    await api.addResource(data);
    setShowAdd(false);
    await Promise.all([load(), loadMeta()]);
  };

  const clearAll = () => {
    setQ("");
    setType("");
    setCategory("");
    setFavoritesOnly(false);
    setPage(1);
  };
  const filtersActive = q || type || category || favoritesOnly;

  return (
    <section>
      <div className="card search-card">
        <div className="search-row">
          <input
            className="search-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="🔍  Search videos, articles, tips, recipes...  (try “yoga” or “back pain”)"
          />
          <button className="btn" onClick={() => setShowAdd(true)}>
            + Add resource
          </button>
        </div>

        <div className="chips">
          <span className="chips-label">Try:</span>
          {SUGGESTIONS.map((s) => (
            <button key={s} className="chip" onClick={() => setQ(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="tabs filter-tabs">
          {Object.entries(TYPE_LABEL).map(([key, label]) => (
            <button
              key={key}
              className={"tab" + (type === key ? " active" : "")}
              onClick={() => changeFilter(setType)(key)}
            >
              {label}
              {meta && key && meta.typeCounts[key] ? ` (${meta.typeCounts[key]})` : ""}
            </button>
          ))}
        </div>

        <div className="filter-row">
          <label className="inline">
            Category
            <select value={category} onChange={(e) => changeFilter(setCategory)(e.target.value)}>
              <option value="">All categories</option>
              {(meta ? meta.categories : []).map((c) => (
                <option key={c} value={c}>
                  {c}
                  {meta.categoryCounts[c] ? ` (${meta.categoryCounts[c]})` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="inline check">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(e) => changeFilter(setFavoritesOnly)(e.target.checked)}
            />
            ★ Favourites only {meta ? `(${meta.favorites})` : ""}
          </label>

          {filtersActive && (
            <button className="btn small secondary" onClick={clearAll}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <p className="result-count">
        {loading ? "Searching..." : `${result.total} result${result.total === 1 ? "" : "s"}`}
        {debouncedQ && !loading ? ` for “${debouncedQ}”` : ""}
      </p>

      {!loading && result.items.length === 0 && !error && (
        <div className="card empty-state">
          <p>No results found. Try another word, or clear the filters.</p>
        </div>
      )}

      <div className="res-grid">
        {result.items.map((item) => (
          <ResourceCard
            key={item.id}
            item={item}
            onFavorite={handleFavorite}
            onDelete={handleDelete}
            onPlay={(it, videoId) => setPlaying({ item: it, videoId })}
          />
        ))}
      </div>

      {result.pages > 1 && (
        <div className="pager">
          <button className="btn secondary small" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            ← Previous
          </button>
          <span>
            Page {page} of {result.pages}
          </span>
          <button className="btn secondary small" disabled={page >= result.pages} onClick={() => setPage(page + 1)}>
            Next →
          </button>
        </div>
      )}

      <p className="note">
        Built-in videos open a YouTube search for that topic. Click “+ Add resource” to save your own YouTube links and
        play them inside the app. This is general wellness information, not medical advice.
      </p>

      {showAdd && <AddResourceModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}

      {playing && (
        <div className="modal-backdrop" onClick={() => setPlaying(null)}>
          <div className="player" onClick={(e) => e.stopPropagation()}>
            <div className="player-head">
              <strong>{playing.item.title}</strong>
              <button className="icon-btn light" onClick={() => setPlaying(null)}>
                ✕
              </button>
            </div>
            <iframe
              src={embedUrl(playing.videoId)}
              title={playing.item.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
