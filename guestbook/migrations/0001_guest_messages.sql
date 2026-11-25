CREATE TABLE guest_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  password_key TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX guest_messages_recent ON guest_messages (created_at DESC, id DESC);
