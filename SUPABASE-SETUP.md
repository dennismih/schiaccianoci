# 🎄 GUIDA SETUP SUPABASE - GALLERIA SCHIACCIANOCI

## 📋 PASSO 1: CREA ACCOUNT SUPABASE (2 minuti)

1. Vai su [supabase.com](https://supabase.com)
2. Clicca "Start your project" → "Sign up"
3. Registrati con GitHub o email
4. Conferma email se richiesto

## 🏗️ PASSO 2: CREA PROGETTO (3 minuti)

1. Dashboard Supabase → "New project"
2. **Organization**: Lascia quella di default
3. **Name**: `galleria-schiaccianoci` (o quello che vuoi)
4. **Database Password**: Crea una password sicura (SALVALA!)
5. **Region**: Europe (West) - più vicino all'Italia
6. **Pricing Plan**: Free (0$/mese)
7. Clicca "Create new project"
8. **Aspetta 2-3 minuti** che si crei il database

## 🗄️ PASSO 3: CREA LA TABELLA (2 minuti)

1. Nel progetto → vai su "SQL Editor" (menu laterale)
2. Clicca "New query"
3. **COPIA E INCOLLA** questo codice:

```sql
-- Crea tabella per i media
CREATE TABLE IF NOT EXISTS media_items (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_data TEXT NOT NULL,
  uploader_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aspect_ratio REAL DEFAULT 1.0
);

-- Abilita accesso pubblico (per la scuola)
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Tutti possono vedere i media
CREATE POLICY "Tutti possono vedere i media" ON media_items
  FOR SELECT USING (true);

-- Tutti possono caricare media
CREATE POLICY "Tutti possono caricare media" ON media_items
  FOR INSERT WITH CHECK (true);

-- Solo il proprietario può eliminare (+ admin)
CREATE POLICY "Solo il proprietario può eliminare" ON media_items
  FOR DELETE USING (uploader_id = current_setting('request.jwt.claims', true)::json->>'sub' OR uploader_id = 'admin');
```

4. Clicca "RUN" (pulsante verde)
5. Dovresti vedere "Success. No rows returned"

## 🔑 PASSO 4: OTTIENI LE CHIAVI (1 minuto)

1. Vai su "Settings" → "API" (menu laterale)
2. **COPIA questi due valori:**
   - **Project URL**: `https://qualcosa.supabase.co`
   - **anon public key**: `eyJ...` (chiave lunga)

## 📝 PASSO 5: CONFIGURA IL PROGETTO (1 minuto)

1. Nella cartella del tuo progetto, crea file `.env`
2. **INCOLLA** i tuoi valori:

```env
VITE_SUPABASE_URL=https://tuo-progetto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tua-chiave-anon-qui
```

**ESEMPIO:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0ODAwMCwiZXhwIjoxOTUyMTI0MDAwfQ.signature
```

## ✅ PASSO 6: TESTA IN LOCALE (2 minuti)

1. Apri terminale nella cartella progetto
2. Esegui:
```bash
npm install
npm run dev
```
3. Apri il browser → dovresti vedere il pallino verde "Online"
4. **PROVA A CARICARE UNA FOTO** → dovrebbe funzionare!

## 🚀 PASSO 7: DEPLOY SU GITHUB PAGES

1. **IMPORTANTE**: NON caricare il file `.env` su GitHub!
2. Su GitHub → Settings del repository → Secrets and variables → Actions
3. Aggiungi questi secrets:
   - `VITE_SUPABASE_URL`: il tuo URL
   - `VITE_SUPABASE_ANON_KEY`: la tua chiave
4. Carica tutti gli altri file del progetto
5. Il deploy automatico userà i secrets per la configurazione

## 🎯 RISULTATO FINALE

✅ **Database condiviso gratuito**
✅ **Foto visibili da qualsiasi dispositivo**
✅ **Aggiornamenti in tempo reale**
✅ **Backup automatico locale**
✅ **Gestione eliminazione per utente**

## 🆘 RISOLUZIONE PROBLEMI

### ❌ Pallino rosso "Offline"
- Controlla che l'URL e la chiave siano corretti nel file `.env`
- Verifica che la tabella sia stata creata correttamente

### ❌ "Error loading media"
- Vai su Supabase → Authentication → Settings
- Disabilita "Enable email confirmations"
- Abilita "Allow anonymous sign-ins"

### ❌ Non riesco a caricare foto
- Controlla le policies nella tabella (dovrebbero permettere INSERT a tutti)
- Verifica che il progetto Supabase sia attivo

## 📞 SUPPORTO

Se hai problemi:
1. Controlla la console del browser (F12) per errori
2. Verifica che tutti i passaggi siano stati seguiti
3. Il database ha un limite di 500MB gratuiti (più che sufficiente!)

**Il tuo schiaccianoci avrà una galleria perfetta! 🎄**