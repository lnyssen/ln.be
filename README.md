# Laurent Nyssen — Portfolio

Reproduction en Astro + React + Tailwind du site laurentnyssen.be, éditable via
Decap CMS.

## Commandes

```bash
npm install
npm run dev      # dev local
npm run build    # build statique dans dist/
npm run preview  # prévisualisation du build
```

## Design system

Relevé sur le site live :

| | |
| --- | --- |
| Display | Gambarino 400 (Fontshare) |
| Texte | Switzer 300–700 (Fontshare) |
| Fond | `#1c1c1c` — clair `#eeeeee` |
| Texte | `#fafafa` — clair `#1c1c1c` |
| Secondaire | `#8a8a8a` |
| Accent | `#9e9eff` |
| Accent fort | `#7b58e8` |
| H1 desktop | 78px / 1.3 / -0.01em |
| H2 | 60px / 1.1 / -0.02em |
| Corps | 20px / 1.3 |

Mise en page relevée puis alignée au pixel sur le site (à 1440) : gouttière de
50px pleine largeur, deux colonnes de 645px séparées de 50px, visuels en 3:2
sans arrondi, pas de gap de 38px entre les cartes. Le bloc « And also… » n'est
pas une section : il clôt la colonne de droite, à côté du dernier projet.

L'en-tête est collant sur 100px avec un `backdrop-filter: blur(28px)` et un fond
transparent — d'où le `overflow-x: clip` sur `html` plutôt que `hidden`, qui
casserait le sticky.

Les carrousels font glisser leur piste vers la gauche, un visuel toutes les
1,8 s avec un amorti de 700 ms. Un clone du premier visuel ferme la piste pour
que le passage du dernier au premier glisse dans le même sens. Visuels en rayon
10px. Pause au survol et au focus, bouton de pause global à côté de « Curated
work », et arrêt complet si `prefers-reduced-motion` est demandé.

La page Lab a son propre accent, orange `#ff6b2c` (`--lab`) : bouton TRY IT plein
(texte sombre, 6:1 — le blanc du site d'origine tombe à 2,7:1) et INSTRUCTIONS en
pilule contournée. Visuels carrés de 390px en rayon 25px, colonne de
texte à 560px.

Le pied de page est un panneau violet fixé au fond que le contenu découvre en
fin de scroll ; `--footer-h` réserve sa hauteur sous la page.

Les bandes diagonales du fond sont le monogramme LN agrandi (`Watermark.astro`),
tracé SVG repris du site, en `#121212` sur `#1c1c1c`.

Les deux familles viennent de Fontshare via deux `@import` séparés dans
`src/styles/global.css` — l'API ne renvoie qu'une famille si on cumule les
paramètres `f[]` dans une seule requête.

Le grain qui couvre la page est une tuile PNG 64px (`public/images/grain.png`),
régénérée localement plutôt que copiée : le site sert la sienne en base64 inline.

## Structure

```
src/
  components/   Header, Hero, SkillsTape, LabTeaser, ProjectCard, ProjectGrid,
                AlsoSection, Footer (.astro) + ProjectSlider, ThemeToggle (.jsx)
  content/projects/   11 projets
  content/lab/        3 expériences
  data/also.json      section « And also… »
  pages/index.astro   Work
  pages/lab.astro     Creative lab
public/
  images/       44 visuels projets + 3 visuels lab + grain
  admin/        Decap CMS
```

## Variante suisse — `/swiss`

Une seconde direction, même contenu, rendue depuis les mêmes collections.
Deux pages : `/swiss` (index) et `/swiss/lab`.

Grille de 12 colonnes visible (6 sous 900px), filets, Switzer en capitales
serrées, et un seul accent rouge. Le monogramme LN est le même que sur le site
principal.

| | clair | sombre |
| --- | --- | --- |
| Papier | `#faf9f6` | `#141414` |
| Encre | `#141414` | `#faf9f6` |
| Secondaire | `#6b6b6b` | `#9a9a9a` |
| Accent | `#7b58e8` | `#9e9eff` |

L'accent reprend les deux violets du site, chacun là où il tient : `#7b58e8`
sur papier (4,53:1), `#9e9eff` sur noir (7,71:1) — le premier tombe à 3,86:1
sur fond sombre, le second à 2,27:1 sur papier.

Les projets forment un index tabulaire numéroté. Chaque ligne est un
`<details name="work">` : la planche s'ouvre **au clic** — au doigt comme à la
souris, et au clavier — et l'attribut `name` referme la ligne précédente
nativement. Aucun JavaScript. Sur un navigateur antérieur à 2024 qui ignore
`name`, plusieurs lignes peuvent rester ouvertes : le repli est inoffensif. Les visuels font 559px de large sur
grand écran, pleine largeur sur mobile.

Grain de papier en surimpression (`grain.png`, tuile 64px), à deux intensités :
`--grain` vaut 0,55 sur papier et 0,4 sur encre — le bruit se voit plus sur le
noir. Ni dégradé ni ombre.

**Pointeur.** Un disque blanc de 26px en `mix-blend-mode: difference` : il
inverse ce qu'il survole, donc il reste lisible dans les deux thèmes sans rien
savoir d'eux. Sur un élément interactif il s'étire en étiquette (hauteur 34px,
largeur animée grâce à `interpolate-size`) qui annonce l'action :

| Survol | Étiquette |
| --- | --- |
| Ligne d'index fermée / ouverte | `VIEW` / `CLOSE` |
| Lien externe | `VISIT ↗` |
| Lien interne | `OPEN` · ancre `JUMP` |
| `mailto:` / `tel:` | `MAIL` / `CALL` |
| Interrupteur de thème | `THEME` |

Le texte de l'étiquette est noir : sous la fusion « difference » il laisse
passer le fond réel et se détache du disque inversé. Le curseur natif n'est
masqué que par `data-swiss-cursor`, posé par le composant lui-même : au doigt,
sans JavaScript ou en `prefers-reduced-motion`, le pointeur système reste.

**Animations.** L'accordéon s'ouvre en 420ms via `::details-content` et
`interpolate-size: allow-keywords` — natif, sans JavaScript ; sur un navigateur
qui l'ignore, l'ouverture reste sèche. Les éléments apparaissent en fondu
montant (16px, 620ms) au défilement, pilotés par un `IntersectionObserver` de
vingt lignes dans le layout. Le drapeau `data-reveal-ready` n'est posé par le
script que s'il anime réellement : sans JavaScript, ou en `prefers-reduced-motion`,
rien n'est jamais masqué.

## Contenu

Les 11 projets et les 3 expériences du Lab reprennent les titres, tags, textes,
liens et visuels du site live. `order` pilote l'ordre d'affichage.

Une entrée de projet :

```yaml
---
title: "Moirés"
slug: "moires"
order: 1
tags: ["Visual Identity", "UI/UX", "Print"]
images:
  - "/images/moires-1.jpg"
link: "https://www.moires.be/"
---
```

Une entrée de Lab porte `summary`, `image`, `demo` (bouton « Try it ») et `doc`
(bouton « Instructions »).

## Decap CMS — à configurer avant usage

Dans `public/admin/config.yml`, remplacer :

- `repo: USERNAME/laurent-portfolio` par le repo GitHub réel
- `app_id: GITHUB_APP_ID` par l'App ID de la GitHub App (auth implicite)

## Déploiement

Vercel : brancher le repo, framework Astro détecté automatiquement,
build `npm run build`, output `dist/`.
