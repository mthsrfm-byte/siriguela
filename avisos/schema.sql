CREATE TABLE IF NOT EXISTS avisos (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL,
  produto TEXT NOT NULL,
  abertura TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmado_em TEXT,
  avisado_em TEXT,
  tentar_apos INTEGER NOT NULL DEFAULT 0,
  UNIQUE(email, produto, abertura)
);
CREATE INDEX IF NOT EXISTS avisos_pendentes ON avisos(tentar_apos, abertura) WHERE avisado_em IS NULL;

-- aviso no navegador (Web Push) das sungas: uma linha por navegador inscrito
CREATE TABLE IF NOT EXISTS push (
  id INTEGER PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  avisado_em TEXT,
  status INTEGER,
  tentar_apos INTEGER NOT NULL DEFAULT 0
);
