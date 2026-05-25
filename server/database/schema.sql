-- ============================================
-- Kipit Database Schema (Turso/LibSQL)
-- ============================================

-- Table utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0,
  verification_code TEXT,
  verification_expires TEXT,
  password_hint TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Table principale du coffre-fort
CREATE TABLE IF NOT EXISTS vault_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('link', 'password', 'crypto')),
  label TEXT NOT NULL DEFAULT '',
  is_encrypted INTEGER NOT NULL DEFAULT 0,
  payload TEXT NOT NULL,
  iv TEXT,
  url TEXT,
  favorite INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index
CREATE INDEX IF NOT EXISTS idx_vault_items_user_id ON vault_items(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_items_user_type ON vault_items(user_id, type);
CREATE INDEX IF NOT EXISTS idx_vault_items_favorite ON vault_items(user_id, favorite);
