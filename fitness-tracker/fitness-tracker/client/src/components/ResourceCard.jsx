import { useState } from "react";
import { getYouTubeId, thumbUrl } from "../youtube.js";

const TYPE_ICON = { video: "▶️", article: "📰", tip: "💡", recipe: "🥗" };

export default function ResourceCard({ item, onFavorite, onDelete, onPlay }) {
  const [open, setOpen] = useState(false);
  const videoId = item.type === "video" ? getYouTubeId(item.url) : null;

  return (
    <article className="card res-card">
      {/* top picture */}
      {videoId ? (
        <button className="res-thumb" onClick={() => onPlay(item, videoId)} title="Play video">
          <img src={thumbUrl(videoId)} alt="" loading="lazy" />
          <span className="play-badge">▶</span>
        </button>
      ) : (
        <div className={"res-thumb res-thumb-" + item.type}>
          <span className="res-emoji">{TYPE_ICON[item.type]}</span>
        </div>
      )}

      <div className="res-body">
        <div className="res-meta">
          <span className={"pill pill-" + item.type}>{item.type}</span>
          <span className="pill pill-cat">{item.category}</span>
          {item.level !== "all" && <span className="pill pill-level">{item.level}</span>}
          {item.custom && <span className="pill pill-mine">added by you</span>}
        </div>

        <h3 className="res-title">{item.title}</h3>
        {item.description && <p className="res-desc">{item.description}</p>}

        {open && item.body && <p className="res-text">{item.body}</p>}

        {item.tags.length > 0 && (
          <div className="res-tags">
            {item.tags.slice(0, 5).map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
        )}

        <div className="res-actions">
          {videoId && (
            <button className="btn small" onClick={() => onPlay(item, videoId)}>
              ▶ Play here
            </button>
          )}
          {item.body && (
            <button className="btn small secondary" onClick={() => setOpen(!open)}>
              {open ? "Hide" : item.type === "recipe" ? "View recipe" : "Read tip"}
            </button>
          )}
          {item.url && (
            <a className="btn small secondary" href={item.url} target="_blank" rel="noreferrer">
              {item.type === "video" && !videoId ? "Search on YouTube ↗" : "Open ↗"}
            </a>
          )}
          <span className="spacer" />
          <button
            className={"icon-btn star" + (item.favorite ? " on" : "")}
            title={item.favorite ? "Remove from favourites" : "Save to favourites"}
            onClick={() => onFavorite(item.id)}
          >
            {item.favorite ? "★" : "☆"}
          </button>
          {item.custom && (
            <button className="icon-btn" title="Delete" onClick={() => onDelete(item.id)}>
              ✕
            </button>
          )}
        </div>
        {item.source && <div className="res-source">Source: {item.source}</div>}
      </div>
    </article>
  );
}
