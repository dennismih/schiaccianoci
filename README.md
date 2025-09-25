# Galleria Schiaccianoci 🎄

## 🔧 SETUP RAPIDO CON DATABASE CONDIVISO

### Passo 1: Setup Supabase (Database Gratuito)
1. Vai su [supabase.com](https://supabase.com) e registrati
2. Crea nuovo progetto → scegli nome e password
3. Vai su "SQL Editor" e esegui questo codice:

```sql
-- Crea tabella per i media
CREATE TABLE media_items (
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

CREATE POLICY "Tutti possono vedere i media" ON media_items
  FOR SELECT USING (true);

CREATE POLICY "Tutti possono caricare media" ON media_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Solo il proprietario può eliminare" ON media_items
  FOR DELETE USING (uploader_id = current_setting('request.jwt.claims', true)::json->>'sub');
```

4. Vai su Settings > API e copia:
   - Project URL
   - anon/public key

### Passo 2: Configura il Progetto
1. Crea file `.env` nella cartella principale
2. Incolla i tuoi valori:
```
VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
VITE_SUPABASE_ANON_KEY=tua-chiave-qui
```

### Passo 3: Testa in Locale
```bash
npm install
npm run dev
```

**ORA LE FOTO SONO CONDIVISE TRA TUTTI I DISPOSITIVI! 🎉**

## 🔧 SETUP RAPIDO CON DATABASE CONDIVISO

### Passo 1: Setup Supabase (Database Gratuito)
1. Vai su [supabase.com](https://supabase.com) e registrati
2. Crea nuovo progetto → scegli nome e password
3. Vai su "SQL Editor" e esegui questo codice:

```sql
-- Crea tabella per i media
CREATE TABLE media_items (
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

CREATE POLICY "Tutti possono vedere i media" ON media_items
  FOR SELECT USING (true);

CREATE POLICY "Tutti possono caricare media" ON media_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Solo il proprietario può eliminare" ON media_items
  FOR DELETE USING (uploader_id = current_setting('request.jwt.claims', true)::json->>'sub');
```

4. Vai su Settings > API e copia:
   - Project URL
   - anon/public key

### Passo 2: Configura il Progetto
1. Crea file `.env` nella cartella principale
2. Incolla i tuoi valori:
```
VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
VITE_SUPABASE_ANON_KEY=tua-chiave-qui
```

### Passo 3: Testa in Locale
```bash
npm install
npm run dev
```

**ORA LE FOTO SONO CONDIVISE TRA TUTTI I DISPOSITIVI! 🎉**

## 🚀 GUIDA RAPIDA PER GITHUB PAGES

### Passo 1: Crea il repository
1. Vai su [GitHub.com](https://github.com) e fai login
2. Clicca "New repository" (pulsante verde)
3. Nome repository: `galleria-schiaccianoci` (o quello che preferisci)
4. Seleziona "Public"
5. Clicca "Create repository"

### Passo 2: Carica i file
1. Scarica tutto il progetto come ZIP
2. Estrai i file
3. Trascina TUTTI i file nella pagina del repository GitHub
4. Scrivi un messaggio tipo "Primo upload galleria schiaccianoci"
5. Clicca "Commit changes"

### Passo 3: Attiva GitHub Pages
1. Nel tuo repository, vai su "Settings" (tab in alto)
2. Scorri fino a "Pages" nel menu laterale
3. Sotto "Source" seleziona "GitHub Actions"
4. Il sito si builderà automaticamente!

### Passo 4: Ottieni l'URL
- Dopo 2-3 minuti, l'URL sarà: `https://tuonome.github.io/nome-repository/`
- Usa questo URL per generare il QR code!

### 🎯 IMPORTANTE
- Il primo deploy può richiedere 5-10 minuti
- Ogni volta che modifichi i file, il sito si aggiorna automaticamente
- L'URL finale sarà qualcosa come: `https://tuonome.github.io/galleria-schiaccianoci/`

---

## Come far funzionare il progetto

### Opzione 1: Usando Node.js (Raccomandato)
1. Assicurati di avere Node.js installato sul tuo computer
2. Apri il terminale/prompt dei comandi nella cartella del progetto
3. Esegui: `npm install`
4. Esegui: `npm run dev`
5. Apri il browser all'indirizzo mostrato (solitamente http://localhost:5173)

### Opzione 2: Usando un server locale semplice
Se non hai Node.js, puoi usare Python (se installato):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Poi vai su http://localhost:8000

### Opzione 3: Usando Live Server (VS Code)
1. Installa l'estensione "Live Server" in VS Code
2. Fai click destro su index.html
3. Seleziona "Open with Live Server"

## Storage delle immagini
- Le immagini vengono salvate nel localStorage del browser
- Limite di circa 5-10MB per dominio
- I dati persistono finché non vengono cancellati manualmente
- Per un uso in produzione, considera un backend con database

## Deployment per la scuola

### Opzione A: GitHub Pages (Automatico)
1. Crea un repository su GitHub
2. Carica tutti i file del progetto
3. Vai su Settings > Pages > Source: "GitHub Actions"
4. Il sito si builderà automaticamente ad ogni push
5. URL sarà: `https://tuonome.github.io/nome-repository/`

### Opzione B: Build manuale
1. Esegui: `npm run build`
2. Carica la cartella `dist` su Netlify/Vercel
3. Genera il QR code con l'URL del sito

### Importante per GitHub Pages:
- Il workflow GitHub Actions è già configurato
- Si attiverà automaticamente quando carichi i file
- Non serve modificare nulla, funziona subito!

## Funzionalità
- ✅ Upload foto/video con drag & drop
- ✅ Layout Pinterest responsivo
- ✅ Visualizzazione fullscreen
- ✅ Controlli video integrati
- ✅ Sistema anti-screenshot
- ✅ Storage locale persistente
- ✅ Gestione eliminazione per utente
- ✅ Design natalizio responsive