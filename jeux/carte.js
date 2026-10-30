// Jeu « La carte » : retrouver un lieu parmi les points de la carte.
// Deux cartes : le Proche-Orient, puis la terre d'Israël. Les fonds viennent de carte-fonds.js
// (généré par tools/make-map.mjs) ; les lieux, fleuves et lacs sont donnés ici en longitude et latitude.
// Pour ajouter un lieu : une entrée dans PLACES (n = nom, lon, lat, d = description, r = source,
// x = précision facultative). Laisser au moins 30 unités de dessin entre deux points voisins.
(() => {
const PLACES = {
  proche: [
    { n: "Jérusalem", lon: 35.23, lat: 31.78, d: "La ville du Temple, capitale du roi David.", r: "2 Samuel 5 ; 1 Rois 6" },
    { n: "Ur", lon: 46.10, lat: 30.96, d: "La ville que quittent Terah et son fils Abram.", r: "Genèse 11:31",
      x: "Emplacement le plus souvent retenu : Tell el-Mouqayyar, dans le sud de l’Irak." },
    { n: "Haran", lon: 39.03, lat: 36.86, d: "L’étape où Terah s’arrête, et d’où Abram repart pour Canaan.", r: "Genèse 11:31 ; 12:4" },
    { n: "Babylone", lon: 44.42, lat: 32.54, d: "La ville de la tour de Babel, puis de l’exil de Juda.", r: "Genèse 11:9 ; 2 Rois 25" },
    { n: "Ninive", lon: 43.15, lat: 36.36, d: "La grande ville d’Assyrie où Jonas est envoyé.", r: "Jonas 1:2" },
    { n: "Suse", lon: 48.26, lat: 32.19, d: "La capitale perse d’Esther et de Néhémie.", r: "Esther 1:2 ; Néhémie 1:1" },
    { n: "Le mont Ararat", lon: 44.30, lat: 39.70, d: "La région où l’arche s’arrête après le déluge.", r: "Genèse 8:4",
      x: "La Torah parle des « monts d’Ararat », une région entière ; le sommet qui porte ce nom aujourd’hui en fait partie." },
    { n: "Damas", lon: 36.29, lat: 33.51, d: "La ville d’Éliézer, serviteur d’Abram, et du général Naaman.", r: "Genèse 15:2 ; 2 Rois 5" },
    { n: "Le mont Sinaï", lon: 33.97, lat: 28.54, d: "La montagne du don de la Torah.", r: "Exode 19",
      x: "Le point est placé à l’emplacement traditionnel (djebel Moussa) ; le lieu exact est discuté." },
    { n: "Alexandrie", lon: 29.92, lat: 31.20, d: "La ville d’Égypte où la Torah est traduite en grec.", r: "Meguila 9a" },
    { n: "Le pays de Goshen", lon: 31.90, lat: 30.75, d: "La région d’Égypte où s’installent Jacob et ses fils.", r: "Genèse 47:6" },
    { n: "Antioche", lon: 36.16, lat: 36.20, d: "La capitale des rois séleucides, adversaires des Maccabées.", r: "1 Maccabées 3:37" },
    { n: "Ecbatane", lon: 48.52, lat: 34.80, d: "La ville de Médie où l’on retrouve l’édit de Cyrus.", r: "Esdras 6:2" }
  ],
  israel: [
    { n: "Jérusalem", lon: 35.23, lat: 31.78, d: "La ville du Temple, capitale du roi David.", r: "2 Samuel 5 ; 1 Rois 6" },
    { n: "Hébron", lon: 35.10, lat: 31.53, d: "La ville du tombeau des Patriarches, première capitale de David.", r: "Genèse 23 ; 2 Samuel 2:11" },
    { n: "Béer-Shéva", lon: 34.79, lat: 31.25, d: "Le puits d’Abraham, à la limite sud du pays.", r: "Genèse 21:31" },
    { n: "Sichem", lon: 35.28, lat: 32.21, d: "La première étape d’Abram en Canaan.", r: "Genèse 12:6" },
    { n: "Jaffa", lon: 34.75, lat: 32.05, d: "Le port où Jonas embarque pour fuir.", r: "Jonas 1:3" },
    { n: "Le mont Carmel", lon: 35.03, lat: 32.73, d: "La montagne où Élie affronte les prophètes de Baal.", r: "1 Rois 18" },
    { n: "Tibériade", lon: 35.53, lat: 32.79, d: "Le dernier siège du Sanhédrin, au bord du lac de Kinnéret.", r: "Roch Hachana 31b" },
    { n: "Dan", lon: 35.65, lat: 33.25, d: "La ville la plus au nord : « de Dan à Béer-Shéva ».", r: "Juges 20:1" },
    { n: "Tyr", lon: 35.20, lat: 33.27, d: "La ville du roi Hiram, qui fournit les cèdres du Temple.", r: "1 Rois 5:15-26" },
    { n: "Massada", lon: 35.35, lat: 31.32, d: "La forteresse tombée après la destruction du Second Temple.", r: "Josèphe, Guerre des Juifs VII" },
    { n: "Qumrân", lon: 35.46, lat: 31.74, d: "Le site des manuscrits de la mer Morte.", r: "Manuscrits découverts à partir de 1947" },
    { n: "Le mont Nébo", lon: 35.73, lat: 31.77, d: "La montagne d’où Moïse contemple le pays.", r: "Deutéronome 34:1" },
    { n: "Modiïn", lon: 35.01, lat: 31.90, d: "La ville de Mattathias, où commence la révolte des Maccabées.", r: "1 Maccabées 2:1" },
    { n: "Ashkelon", lon: 34.55, lat: 31.67, d: "L’une des cinq villes des Philistins.", r: "1 Samuel 6:17" },
    { n: "Mégiddo", lon: 35.18, lat: 32.58, d: "La ville où tombe le roi Josias.", r: "2 Rois 23:29" }
  ]
};

const DEAD_SEA = [[35.50, 31.77], [35.56, 31.70], [35.58, 31.55], [35.58, 31.40], [35.52, 31.30], [35.48, 31.20], [35.45, 31.08], [35.38, 31.05], [35.37, 31.15], [35.40, 31.25], [35.38, 31.35], [35.39, 31.50], [35.44, 31.65], [35.47, 31.75]];
const KINNERET = [[35.55, 32.90], [35.63, 32.86], [35.65, 32.78], [35.62, 32.71], [35.57, 32.70], [35.53, 32.76], [35.51, 32.83]];

// Décor de chaque carte : fleuves (lignes), lacs (surfaces), noms des mers et des fleuves
const DECOR = {
  proche: {
    title: "Le Proche-Orient", reach: 18,
    rivers: [
      [[31.70, 26.55], [31.18, 27.18], [30.75, 28.10], [31.10, 29.07], [31.23, 30.05], [30.95, 30.60], [30.40, 31.45]],
      [[31.23, 30.05], [31.40, 30.80], [31.80, 31.50]],
      [[39.50, 39.70], [38.80, 38.80], [38.30, 37.90], [38.00, 36.83], [38.20, 36.20], [39.00, 35.95], [40.15, 35.33], [40.90, 34.45], [41.90, 34.40], [42.80, 33.60], [43.80, 33.35], [44.42, 32.54], [45.28, 31.31], [46.25, 31.05], [47.43, 31.00], [47.80, 30.50], [48.50, 30.00]],
      [[39.50, 38.50], [40.20, 37.90], [41.20, 37.50], [42.20, 37.33], [43.10, 36.35], [43.30, 35.50], [43.68, 34.60], [43.90, 34.20], [44.40, 33.33], [45.00, 32.90], [45.80, 32.50], [46.70, 32.00], [47.15, 31.85], [47.43, 31.00]],
      [[35.60, 32.70], [35.55, 32.20], [35.52, 31.77]]
    ],
    waters: [DEAD_SEA],
    labels: [
      { t: "Mer Méditerranée", lon: 29.6, lat: 33.9 }, { t: "Mer Rouge", lon: 35.5, lat: 26.9 },
      { t: "Golfe Persique", lon: 46.5, lat: 27.5 }, { t: "Mer Caspienne", lon: 49.3, lat: 39.4, rot: 65 },
      { t: "Nil", lon: 29.8, lat: 28.6 }, { t: "Euphrate", lon: 39.4, lat: 34.6, rot: 28 }, { t: "Tigre", lon: 44.5, lat: 34.9, rot: 60 }
    ]
  },
  israel: {
    title: "La terre d’Israël", reach: 15,
    rivers: [
      [[35.62, 33.20], [35.61, 33.05], [35.60, 32.90]],
      [[35.57, 32.70], [35.58, 32.50], [35.56, 32.30], [35.55, 32.10], [35.54, 31.95], [35.52, 31.77]]
    ],
    waters: [DEAD_SEA, KINNERET],
    labels: [
      { t: "Mer Méditerranée", lon: 34.25, lat: 32.2, rot: -68 }, { t: "Mer Morte", lon: 35.66, lat: 31.42 },
      { t: "Kinnéret", lon: 35.70, lat: 32.80 }, { t: "Jourdain", lon: 35.62, lat: 32.22 }
    ]
  }
};

// Textes anglais (www/en/jeux.js), dans le même ordre que PLACES
for (const m of Object.keys(PLACES)) PLACES[m].forEach((pl, i) => { pl.en = PLACES_EN[m][i]; });
const mapTitle = m => T(DECOR[m].title, MAP_TITLES_EN[m]);

const PER_MAP = 5, MAX = PER_MAP * 2;
const score = g => g.picks.filter((p, i) => p === g.qs[i].p).length;
const xy = (bg, lon, lat) => [+((lon - bg.lon0) * bg.kx).toFixed(1), +((bg.lat1 - lat) * bg.ky).toFixed(1)];

function drawMap(g) {
  const q = g.qs[g.i], bg = MAP_BG[q.m], decor = DECOR[q.m], places = PLACES[q.m];
  const pick = g.picks[g.i], answered = pick != null;
  const line = pts => pts.map(p => xy(bg, p[0], p[1]).join(" ")).join("L");
  const name = k => {
    const [x, y] = xy(bg, places[k].lon, places[k].lat), left = x > bg.w - 90;
    return `<text class="name" x="${left ? x - 9 : x + 9}" y="${y + 3.5}" text-anchor="${left ? "end" : "start"}">${L(places[k]).n}</text>`;
  };
  return `
    <svg class="map" viewBox="0 0 ${bg.w} ${bg.h}" data-act="map" role="group" aria-label="${mapTitle(q.m) + T(" : touchez un point", ": tap a point")}">
      <rect class="sea" width="${bg.w}" height="${bg.h}"/>
      <path class="land" fill-rule="evenodd" d="${bg.land}"/>
      ${decor.waters.map(w => `<path class="water" d="M${line(w)}Z"/>`).join("")}
      ${decor.rivers.map(r => `<path class="river" d="M${line(r)}"/>`).join("")}
      ${decor.labels.map(l => {
        const [x, y] = xy(bg, l.lon, l.lat);
        return `<text class="lbl" x="${x}" y="${y}"${l.rot ? ` transform="rotate(${l.rot} ${x} ${y})"` : ""}>${T(l.t, MAP_LABELS_EN[l.t])}</text>`;
      }).join("")}
      ${places.map((pl, k) => {
        const [x, y] = xy(bg, pl.lon, pl.lat);
        const cls = !answered ? "" : k === q.p ? "good" : k === pick ? "bad" : "dim";
        return `<circle class="dot ${cls}" cx="${x}" cy="${y}" r="5.5" data-k="${k}"${answered ? "" : ` tabindex="0" role="button" aria-label="Point ${k + 1}"`}/>`;
      }).join("")}
      ${answered ? name(q.p) + (pick !== q.p ? name(pick) : "") : ""}
    </svg>`;
}

GAMES.push({
  id: "carte", he: "מפה", tint: 4,
  get name() { return T("La carte", "The map"); },
  icon: '<path d="M12 21c-3.4-3.5-6-6.8-6-10a6 6 0 1 1 12 0c0 3.2-2.6 6.5-6 10z"/><circle cx="12" cy="10.8" r="2.2"/>',
  best: v => `${TXT.best} <b>${v}/${MAX}</b>`,

  start() {
    // cinq lieux par carte ; un lieu présent sur les deux cartes n'est demandé qu'une fois
    const draw = (m, skip) => shuffle(PLACES[m].map((_, p) => p).filter(p => !skip.includes(PLACES[m][p].n))).slice(0, PER_MAP).map(p => ({ m, p }));
    const first = draw("proche", []);
    return { qs: [...first, ...draw("israel", first.map(q => PLACES.proche[q.p].n))], i: 0, picks: [] };
  },

  render(g) {
    const states = g.qs.map((q, k) => g.picks[k] != null ? (g.picks[k] === q.p ? "good" : "bad") : k === g.i ? "cur" : "todo");
    if (g.done) {
      return gameEnd(this, {
        states, big: `${score(g)}/${MAX}`, sub: T("lieux trouvés", "places found"), title: praise(score(g) / MAX), record: g.record,
        body: `
          <section>
            <h2 class="label">${T("Les lieux", "The places")}</h2>
            <ol class="review">
              ${g.qs.map((q, k) => {
                const pl = L(PLACES[q.m][q.p]), ok = g.picks[k] === q.p;
                return `<li>
                  <span class="st ${ok ? "ok" : "ko"}" aria-label="${ok ? T("trouvé", "found") : T("manqué", "missed")}">${ok ? "✓" : "✗"}</span>
                  <div>
                    <p class="rq"><b>${pl.n}</b> · ${fr(pl.d)}</p>
                    <p class="ra">${ok ? "" : `<s>${L(PLACES[q.m][g.picks[k]]).n}</s> · `}${pl.r}</p>
                  </div></li>`;
              }).join("")}
            </ol>
          </section>`
      });
    }

    const q = g.qs[g.i], pl = L(PLACES[q.m][q.p]), pick = g.picks[g.i], answered = pick != null, last = g.i === MAX - 1;
    return `
    ${gameTop(this, `score <b>${score(g)}</b>`)}
    <div class="gauge">${gauge(states, `${g.i + 1}/${MAX}`, T("lieu", "place"))}</div>

    <div class="qhead">
      <div class="chips"><span class="chip">${mapTitle(q.m)}</span></div>
      <h2 class="question" tabindex="-1" id="q-text">${fr(T(`Où se trouve : ${pl.n} ?`, `Find on the map: ${pl.n}`))}</h2>
      <p class="g-help">${fr(pl.d)}${answered ? "" : T(" Touchez le bon point sur la carte.", " Tap the right point on the map.")}</p>
    </div>

    <div class="map-wrap">${drawMap(g)}</div>

    <div class="feedback" aria-live="polite">${answered ? `
      <p class="verdict ${pick === q.p ? "ok" : "ko"}">${pick === q.p
        ? T("Bien situé", "Well placed")
        : fr(T("Pas tout à fait. Vous avez touché : ", "Not quite. You tapped: ") + L(PLACES[q.m][pick]).n)}</p>
      ${pl.x ? `<p>${fr(pl.x)}</p>` : ""}
      <p class="ref">${TXT.source}<b>${pl.r}</b></p>` : ""}</div>

    ${answered ? `
    <div class="actions">
      <button class="btn" data-act="next" id="next">${last ? TXT.seeScore : T("Lieu suivant", "Next place")}</button>
    </div>` : ""}`;
  },

  pick(g, k) {
    if (g.picks[g.i] != null) return;
    g.picks[g.i] = k;
    render("next");
  },

  act(action, el, g, e) {
    if (action === "map") {
      // point le plus proche du doigt, dans la limite de `reach` unités de dessin
      const q = g.qs[g.i], bg = MAP_BG[q.m];
      const touch = el.createSVGPoint();
      touch.x = e.clientX; touch.y = e.clientY;
      const { x, y } = touch.matrixTransform(el.getScreenCTM().inverse());
      let best = -1, min = DECOR[q.m].reach;
      PLACES[q.m].forEach((pl, k) => {
        const [px, py] = xy(bg, pl.lon, pl.lat), d = Math.hypot(px - x, py - y);
        if (d < min) { min = d; best = k; }
      });
      if (best >= 0) this.pick(g, best);
    } else if (action === "next" && g.picks[g.i] != null) {
      if (g.i < MAX - 1) g.i++;
      else { g.done = true; g.record = saveGameBest("carte", score(g)); }
      window.scrollTo(0, 0);
      render(g.done ? "replay" : "q-text");
    }
  },

  key(e, g) {
    const k = document.activeElement?.dataset?.k;
    if ((e.key === "Enter" || e.key === " ") && k != null && !g.done) { e.preventDefault(); this.pick(g, +k); }
  }
});
})();
