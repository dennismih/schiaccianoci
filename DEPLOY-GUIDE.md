# 🎄 GUIDA DEPLOY GITHUB PAGES - GALLERIA SCHIACCIANOCI

## 📋 CHECKLIST RAPIDA

### ✅ Passo 1: Preparazione
- [ ] Hai un account GitHub? Se no, registrati su [github.com](https://github.com)
- [ ] Hai scaricato tutti i file del progetto?

### ✅ Passo 2: Crea Repository
1. Vai su GitHub.com e fai login
2. Clicca il pulsante verde "New" o "New repository"
3. **Nome repository**: `galleria-schiaccianoci` (puoi cambiarlo)
4. **Visibilità**: Seleziona "Public" (necessario per GitHub Pages gratuito)
5. **NON** selezionare "Add a README file"
6. Clicca "Create repository"

### ✅ Passo 3: Carica i File
**Metodo 1 - Drag & Drop (più facile):**
1. Nella pagina del repository appena creato
2. Clicca "uploading an existing file"
3. Trascina TUTTI i file del progetto nella finestra
4. Messaggio commit: "Setup galleria schiaccianoci"
5. Clicca "Commit changes"

**Metodo 2 - Git (se sai usarlo):**
```bash
git clone https://github.com/tuonome/galleria-schiaccianoci.git
cd galleria-schiaccianoci
# copia tutti i file del progetto qui
git add .
git commit -m "Setup galleria schiaccianoci"
git push origin main
```

### ✅ Passo 4: Attiva GitHub Pages
1. Nel repository, clicca tab "Settings" (in alto)
2. Scorri nel menu laterale fino a "Pages"
3. Sotto "Source" seleziona "GitHub Actions"
4. La pagina si ricaricherà automaticamente

### ✅ Passo 5: Aspetta il Deploy
1. Vai nel tab "Actions" del repository
2. Vedrai un workflow in esecuzione (pallino giallo/arancione)
3. Aspetta che diventi verde ✅ (2-5 minuti)
4. Il tuo sito sarà live!

## 🌐 URL DEL SITO

Il tuo sito sarà disponibile a:
```
https://tuonome.github.io/nome-repository/
```

**Esempio:**
- Username GitHub: `mario.rossi`
- Nome repository: `galleria-schiaccianoci`
- URL finale: `https://mario.rossi.github.io/galleria-schiaccianoci/`

## 📱 GENERA IL QR CODE

1. Copia l'URL del tuo sito
2. Vai su un generatore QR gratuito come:
   - [qr-code-generator.com](https://www.qr-code-generator.com/)
   - [qrcode-monkey.com](https://www.qrcode-monkey.com/)
3. Incolla l'URL
4. Genera e scarica il QR code
5. Stampalo e attaccalo allo schiaccianoci!

## 🔧 RISOLUZIONE PROBLEMI

### ❌ Il sito non si carica
- Aspetta 10 minuti dopo il primo deploy
- Controlla che il workflow in "Actions" sia completato (verde)
- Verifica che l'URL sia corretto

### ❌ Errore 404
- Assicurati che il repository sia "Public"
- Verifica di aver selezionato "GitHub Actions" in Pages settings

### ❌ Le immagini non si caricano
- È normale, il localStorage funziona solo quando gli utenti visitano il sito
- Ogni browser/dispositivo ha il suo storage separato

## 🎯 CONSIGLI PER LA SCUOLA

1. **Testa prima**: Visita il sito dal tuo telefono per verificare che funzioni
2. **QR Code grande**: Stampa il QR code abbastanza grande (almeno 5x5 cm)
3. **Istruzioni semplici**: Aggiungi un cartello: "Scansiona il QR, carica il tuo selfie!"
4. **Backup**: Salva l'URL del sito, nel caso il QR code si rovini

## 📞 SUPPORTO

Se hai problemi:
1. Controlla la sezione "Actions" del repository per errori
2. Verifica che tutti i file siano stati caricati correttamente
3. Aspetta almeno 10 minuti dopo ogni modifica

**Il sito funzionerà perfettamente per il tuo progetto scolastico! 🎄**