# 🍽️ Veckans meny

En varm, lekfull måltidsplanerare byggd för en pekskärm i köket — där barnen
själva bläddrar, väljer och ser vad som blir middag, utan att någon behöver
logga in.

Ingen build-process, inget konto krävs för familjen, ingen prenumeration.
Ren HTML/JS som körs direkt i webbläsaren (React och Babel laddas från CDN,
JSX översätts på plats) — enkelt att redigera och driftsätta utan Node.js
eller npm.

---

## ✨ Vad appen kan göra

**📅 Meny** — planera innevarande vecka plus två veckor framåt. Varje dag
visar vald rätt med riktigt foto, kategori och vem i familjen som valde den.

**📖 Bibliotek** — 40+ färdiga rätter med riktiga recept och bilder (mest
från ICA.se), sökbart, filtrerbart på kategori, 🎉 Fredagsmys, 🥣 Soppor och
⭐ Favoriter. Lägg till egna rätter med foto eller bildlänk, eller klistra in
en receptlänk och låt appen hämta namn, bild och ingredienser automatiskt.

**🎁 Mysterielåda** — slumpar fram en rätt bland det som passar (hoppar
alltid över redan använda rätter samma vecka, och fredagsmys bara på
fredagar).

**🐟🥣 Balanskrav** — en vecka går bara att låsa när den innehåller minst en
fiskrätt och en soppa. Håller menyn varierad utan att man behöver tänka på det.

**🛒 Inköpslista** — räknas ihop automatiskt från veckans valda rätter,
skalbar efter antal portioner. Ladda ner som snygg PDF, textfil, eller
kopiera texten direkt.

**🏅 Klistermärken** — sju samlarmärken (första låsta veckan, provat 15
olika rätter, hela familjen har valt minst en gång, m.fl.) med konfetti när
ett nytt märke låses upp.

**🖥️ Idag-läge** — en lugn helskärmsvy för köksskärmen som bara visar
dagens rätt, stort och tydligt. Perfekt att lämna påslaget.

**👪 Familjen** — lägg till, byt namn på och ladda upp egna foton av alla i
familjen, direkt i appen.

**🔒 Föräldrakod (valfritt)** — lås biblioteket så bara vuxna kan
lägga till/ändra/ta bort rätter, utan att det påverkar barnens möjlighet att
välja och favoritmarkera mat.

**🔄 Delad i realtid** — köksskärmen och allas telefoner visar samma
levande data via Firebase. Ändrar någon en rätt på sin telefon dyker det
upp på skärmen i köket inom en sekund.

**📲 Installerbar** — "Lägg till på hemskärmen" gör den till en riktig
app-ikon, fungerar offline efter första besöket.

---

## 🚀 Kom igång: fyll i Firebase (en gång)

Detta krävs för att köksskärmen och telefonerna ska dela samma data i realtid.
Utan det sparas allt bara lokalt på respektive enhet.

1. Gå till [console.firebase.google.com](https://console.firebase.google.com),
   logga in med valfritt Google-konto, klicka **"Add project"**.
2. Vänster meny → **Databases & Storage → Realtime Database** (kan heta
   "Build" i äldre gränssnitt) → **Create database** → valfri region →
   starta i **test mode**.
3. ⚙️ (kugghjulet) → **Project settings** → scrolla till "Your apps" → klicka
   **`</>`** (webb-ikonen) → registrera appen → kopiera `firebaseConfig`-objektet.
4. Öppna `src/shim.js`, hitta `FIREBASE_CONFIG` nära toppen, och klistra in
   dina värden (apiKey, authDomain, databaseURL, projectId, storageBucket,
   messagingSenderId, appId).
5. **Rules-fliken** i Realtime Database → byt ut tidsvillkoret mot
   `{ "rules": { ".read": true, ".write": true } }` → **Publish** (annars
   slutar synken fungera efter testperiodens utgång).
6. Spara, committa — Netlify/Vercel bygger om automatiskt.

## 📂 Lägga koden på GitHub

**Om du aldrig använt git förut**, enklaste vägen är webbgränssnittet:

1. Gå till [github.com/new](https://github.com/new), skapa ett repo (t.ex.
   `veckans-meny`). Behöver inte vara publikt.
2. På repots sida: **Add file → Upload files**, dra in alla filer och mappar
   (inklusive hela `src/`-mappen och `netlify/`-mappen).
3. Klicka **Commit changes**.

Framtida ändringar: öppna filen direkt på GitHub (pennikonen), redigera i
webbläsaren, committa — det räcker.

**Om du är van vid git/terminalen** går det förstås lika bra på vanligt vis
(`git init`, `git add .`, `git commit`, `git push`).

## ☁️ Driftsätta med auto-uppdatering (Netlify eller Vercel)

Båda är gratis för den här typen av liten app och bygger om automatiskt varje
gång du ändrar något i GitHub-repot.

**Netlify:**
1. [app.netlify.com](https://app.netlify.com) → logga in med GitHub-kontot.
2. **Add new project → Import an existing project** → välj repot.
3. Build command: lämna tomt. Publish directory: `/` (roten). Deploy.
4. **Gör sajten publik**: Project configuration → General → Visitor access
   → Production visibility → **Public** (annars krävs Netlify-inloggning
   för att se länken).
5. Valfritt: stäng av "Powered by Netlify"-badgen i samma inställningar.

**Vercel:** samma flöde på [vercel.com/new](https://vercel.com/new) —
importera repot, inga build-inställningar behövs.

Efter det: varje gång en fil ändras på GitHub, dyker den uppdaterade appen
upp på samma länk inom någon minut, helt automatiskt.

## 🧪 Testa lokalt (valfritt, för den tekniskt intresserade)

Att bara dubbelklicka på `index.html` fungerar **inte** — webbläsare blockerar
filhämtning (`src/app.js` m.fl.) från `file://`-sidor av säkerhetsskäl. Kör
istället en enkel lokal server i mappen, t.ex.:

```
python3 -m http.server 8000
```

och öppna `http://localhost:8000` i webbläsaren.

---

## 📁 Filer

```
index.html                       sidans skal: laddar bibliotek + startar appen
src/app.js                       hela appens logik och gränssnitt
src/shim.js                      ikoner, Firebase-koppling (config fylls i här)
netlify/functions/fetch-recipe.js  hämtar recept-data från en länk (server-side)
netlify.toml                      pekar ut funktionsmappen ovan för Netlify
manifest.json                    gör appen installningsbar på hemskärmen
sw.js                            service worker, cachar för offline-bruk
icon-192.png / icon-512.png      appikoner
```

## ⚠️ Kända begränsningar

- **Firebase "test mode"** ger öppen läs/skrivrätt till alla som hittar din
  databas-URL. Helt okej för en privat familjeapp ingen annan känner till,
  men inte skyddat mot en riktad attack. Riktig säkerhet kräver inloggning
  (Firebase Auth), vilket krockar med målet "ingen inloggning för familjen".
- **Receptbilderna länkar direkt till ICA:s bildserver.** Fungerar idag, men
  om ICA byter URL-struktur kan bilder sluta fungera utan förvarning. Byt då
  till egna uppladdade foton via appens "Byt bild"-funktion.
- **Föräldrakoden är ett föräldralås, inte riktig säkerhet** — den lagras
  som vanlig text, tänkt för att hindra små barn, inte en säkerhetsgräns.
- **Auto-hämtning av recept** fungerar bara på sajter med strukturerad
  receptdata (schema.org). Funkar det inte för en viss sajt, fyll i
  ingredienserna manuellt istället.

---

## 🤝 Dela din egen kopia med vänner (gratis, ingen kod att röra)

Vill en vän eller släkting ha sin egen fristående app (egen data, egen
familj, delar ingenting med din) är det enklaste sättet Netlifys
"Deploy to Netlify"-knapp — den klonar hela repot till *deras* eget GitHub
och kopplar det till *deras* eget Netlify-konto i ett par klick, utan att
någon behöver ladda ner/ladda upp filer manuellt.

**Innan knappen fungerar:**
1. Gör det här GitHub-repot **publikt** (Settings → längst ner → Change
   repository visibility → Public).
2. Byt ut `<DIN-GITHUB-USERNAME>/<DITT-REPO-NAMN>` nedan mot ditt riktiga
   repo, t.ex. `janssonanders/veckans-meny`.

```
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/<DIN-GITHUB-USERNAME>/<DITT-REPO-NAMN>)
```

**Vad din vän behöver göra:**
1. Klicka knappen → logga in med GitHub → godkänn → Netlify skapar en egen
   kopia av koden i deras GitHub och deployar den automatiskt
2. Skapa ett eget, separat Firebase-projekt — samma steg som i "Kom igång"
   ovan, men *deras* Google-konto, *deras* projekt
3. Öppna sin nya `src/shim.js` på GitHub, klistra in sin egen
   `FIREBASE_CONFIG`, committa
4. Klart — öppna appens Familj-inställningar och byt namn/lägg till/ta bort
   familjemedlemmar direkt i appen. Ingen kodredigering behövs för det längre.

Varje kopia är helt separat: olika GitHub-repo, olika Netlify-sajt, olika
Firebase-databas. Inget någon gör i sin kopia påverkar din.
