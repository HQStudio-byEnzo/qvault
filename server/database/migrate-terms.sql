-- Legal terms consent tracking
CREATE TABLE IF NOT EXISTS accepted_terms (
  user_id TEXT PRIMARY KEY,
  terms_version TEXT NOT NULL,
  accepted_at TEXT NOT NULL DEFAULT (datetime('now')),
  user_agent TEXT,
  ip_address TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
