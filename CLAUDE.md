# Skup Mieszkań Białystok — przewodnik dla Claude

Statyczna strona landing dla firmy skupu mieszkań w Białymstoku.
**Domena produkcyjna:** https://skupmieszkanbialystok.pl/

## Stack

- **Hosting:** Cloudflare Pages (projekt: `skup-mieszkan-bialystok`)
- **DNS:** Cloudflare (nameservery: `cortney.ns.cloudflare.com`, `tom.ns.cloudflare.com`)
- **Repo:** https://github.com/korzen1404/skup-mieszkan-bialystok (branch `main` = produkcja)
- **Domena:** kupiona w LH.pl, NS przekierowane na Cloudflare
- **Formularze:** Web3Forms (Access Key: `7a517cc9-cf91-4024-9792-1453a8ad107b`) → `kontakt.akinvest@gmail.com`
- **Email:** Cloudflare Email Routing: `biuro@skupmieszkanbialystok.pl` → `kontakt.akinvest@gmail.com` (tylko odbiór, bez wysyłki)
- **Analityka:** Google Analytics 4 (Measurement ID: `G-GWKZGCH3G1`) — ładuje się tylko po akceptacji cookies
- **Search:** Google Search Console (Domain property), sitemap.xml zgłoszony

## Pliki

- `index.html` — strona główna (jedna sekcja per sekcja, wszystko inline)
- `styles.css` — pełen styling (White Luxury theme: Playfair Display + DM Sans + gold accents)
- `script.js` — interakcje: sticky header, hamburger, FAQ accordion, scroll reveal, **cookie consent + GA4 conditional loader**
- `polityka-prywatnosci.html` — RODO compliant
- `polityka-cookies.html` — lista cookies + opt-out
- `sitemap.xml` — dla Google
- `robots.txt` — dla crawlerów (Cloudflare auto-dodaje sekcję dla AI bots na początku)
- `images/bialystok-map-neutral.png` — mapa w hero

## Workflow deploymentu

**Każdy `git push` na branch `main` automatycznie deployuje na produkcję** (Cloudflare Pages buduje i wdraża w ~30 sek).

Standardowa pętla:

```bash
cd "/Users/cezar/Documents/Claude AI/Strona Wycena Nieruchomości"
# edycje w index.html / styles.css / script.js
git status
git add <pliki>
git commit -m "krótki opis zmiany"
git push
# Cloudflare auto-deploy → ~30 sek → live na https://skupmieszkanbialystok.pl/
```

**Weryfikacja deploy:**
- Status buildu: https://dash.cloudflare.com/d86825609cc460a9e567545b441e1ca0/workers/services/view/skup-mieszkan-bialystok/production/deployments
- Lokalny test (po deployu): `curl -sI https://skupmieszkanbialystok.pl/` powinno zwrócić HTTP/2 200

**Lokalny podgląd (bez deploy):**
- Otwórz `index.html` w przeglądarce bezpośrednio, albo:
- `cd "/Users/cezar/Documents/Claude AI/Strona Wycena Nieruchomości" && python3 -m http.server 8080` → http://localhost:8080

## Ważne uwagi

### Token GitHub
Remote URL ma wpisany Personal Access Token (`ghp_fyKVHM...`) ze scope `public_repo`. **Wygasa po 30 dniach od utworzenia (21 maja 2026 → ~20 czerwca 2026).** Po wygaśnięciu:

1. Wygeneruj nowy token na https://github.com/settings/tokens/new (Note: `deploy-skup-mieszkan-bialystok`, Expiration: 90 days, Scope: `public_repo`)
2. `git remote set-url origin https://korzen1404:<NEW_TOKEN>@github.com/korzen1404/skup-mieszkan-bialystok.git`

### Placeholdery do uzupełnienia
W `index.html` (stopka) i `polityka-prywatnosci.html` są placeholdery do podmiany na prawdziwe dane:
- `[Nazwa firmy]`
- `[XXX-XXX-XX-XX]` (NIP)
- `[XXXXXXXXX]` (REGON)
- `[0000XXXXXX]` (KRS, jeśli sp. z o.o.)
- `[Imię i nazwisko]` w sekcji "O firmie"

Również w `index.html` w `<script type="application/ld+json">` (Schema.org LocalBusiness) — dane firmy.

### Cookie consent + GA4
`script.js` ładuje GA4 **tylko po akceptacji bannera cookies**. Klucz w `localStorage`: `cookie-consent` (`accepted` / `rejected`).

Aby zresetować zgodę (np. do testów): w DevTools console: `window.cookieConsent.reset()`.

### Edycja formularzy
Oba formularze (wycena + kontakt) POSTują do `https://api.web3forms.com/submit` z Access Key. Po submit Web3Forms przekierowuje na `https://web3forms.com/success`. Aby zmienić tę stronę docelową, edytuj `<input type="hidden" name="redirect" value="...">` w obu `<form>` w `index.html`.

### Zmiana emaila odbiorczego z formularzy
Panel Web3Forms: https://app.web3forms.com/forms → wybierz form → Settings → Recipient Emails. Nowy email trzeba najpierw dodać w Linked Emails (Workspace → Linked Emails) i potwierdzić.

### Filtr T-Mobile (CyberGuard)
Świeże domeny .pl bywają flagowane jako podejrzane przez T-Mobile CyberGuard. Jeśli klient T-Mobile widzi ostrzeżenie:
- Krótkoterminowo: wyłącz CyberGuard w aplikacji Mój T-Mobile
- Długoterminowo: zgłoś false-positive na abuse@t-mobile.pl (zwykle odblokowują w 24–72h)

### Cloudflare blokuje automatyzację
Niektóre strony Cloudflare dashboardu (Workers, Add Site) blokują Claude Code w Chrome Extension. Jeśli trafisz na nieskończony loader — poproś użytkownika by zrobił dany krok ręcznie (uwierzytelniony użytkownik nie jest blokowany).

## Wcześniejsze decyzje projektowe (kontekst)

- **Cloudflare Pages zamiast Vercel** — bo Vercel Hobby formalnie zabrania komercyjnego użycia, a Cloudflare Pages ma unlimited bandwidth i pozwala na komercję.
- **Cloudflare Email Routing zamiast Zoho Mail** — bo user potrzebuje tylko odbioru (forwarding). Wysyłka z `biuro@...` nie jest potrzebna.
- **Web3Forms zamiast `/api/send.js` w Vercel/Cloudflare Worker** — uproszczenie, brak kodu backendowego, łatwa zmiana hostingu w przyszłości.
- **Domena na Cloudflare DNS, ale zarejestrowana w LH.pl** — odnowienie raz w roku ~60 zł, NS przekierowane na Cloudflare dla SSL/CDN/Email Routing.

## Najczęstsze typy zmian, których oczekuje user

1. **Edycja tekstu** — zmiana copy w sekcjach (`index.html`)
2. **Dodanie / zmiana sekcji** — np. nowy case w "Dla kogo", nowa transakcja
3. **Aktualizacja danych firmy** — placeholdery NIP/REGON/KRS, dane w Schema.org
4. **Dodanie podstron SEO** — `/skup-mieszkan-z-hipoteka/`, `/skup-mieszkan-spadkowych/` itp. (linki już są w sekcji SEO podstrony, target stron jeszcze nie istnieje)
5. **Optymalizacja konwersji** — A/B testy CTA, zmiana headline
6. **Dodanie obrazków** — wrzuć do `images/`, użyj `<img src="images/...">`

## Czego NIE ruszać bez przemyślenia

- `script.js` — sekcja `Cookie consent + GA4 conditional loader` — działa jako jedna całość, edytuj ostrożnie
- `index.html` — `<script>window.GA_MEASUREMENT_ID = 'G-GWKZGCH3G1';</script>` — bez tego GA4 nie ładuje się
- `<script type="application/ld+json">` w `<head>` — JSON-LD musi być valid, źle sformatowany psuje Schema.org
- Nameservery Cloudflare w LH.pl — usunięcie wyłączy stronę, email i analitykę
