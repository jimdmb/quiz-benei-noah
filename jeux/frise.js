// Jeu « La frise » : remettre cinq événements dans l'ordre, du plus ancien au plus récent.
// EVENTS est déjà dans l'ordre chronologique : pour ajouter un événement, l'insérer à sa place
// (t = titre, w = source ou date affichée après la vérification).
// Les dates sont celles de la chronologie historique courante ; la chronologie traditionnelle
// (Séder Olam) compte autrement certaines périodes, mais l'ordre des événements est le même.
(() => {
const EVENTS = [
  { t: "La création d’Adam", w: "Genèse 1–2" },
  { t: "Le déluge", w: "Genèse 6–9" },
  { t: "La tour de Babel", w: "Genèse 11" },
  { t: "Abram quitte Haran pour Canaan", w: "Genèse 12" },
  { t: "La ligature d’Isaac", w: "Genèse 22" },
  { t: "Joseph est vendu par ses frères", w: "Genèse 37" },
  { t: "La sortie d’Égypte", w: "Exode 12–14" },
  { t: "Le don de la Torah au Sinaï", w: "Exode 19–20" },
  { t: "Josué fait traverser le Jourdain", w: "Josué 3" },
  { t: "Ruth arrive à Bethléem", w: "Ruth 1, au temps des Juges" },
  { t: "Saül devient le premier roi d’Israël", w: "1 Samuel 10" },
  { t: "David règne à Jérusalem", w: "2 Samuel 5, vers 1000 av. EC" },
  { t: "Salomon bâtit le Premier Temple", w: "1 Rois 6, vers 960 av. EC" },
  { t: "Le royaume se divise en deux", w: "1 Rois 12, vers 930 av. EC" },
  { t: "Élie affronte les prophètes de Baal", w: "1 Rois 18, IXe siècle av. EC" },
  { t: "Jonas prêche à Ninive", w: "Jonas 3, VIIIe siècle av. EC" },
  { t: "Chute de Samarie, exil des dix tribus", w: "2 Rois 17, 722 av. EC" },
  { t: "Destruction du Premier Temple", w: "2 Rois 25, 586 av. EC" },
  { t: "Édit de Cyrus", w: "Esdras 1, 538 av. EC" },
  { t: "Dédicace du Second Temple", w: "Esdras 6, 516 av. EC" },
  { t: "Néhémie relève les murailles de Jérusalem", w: "Néhémie 2–6, vers 445 av. EC" },
  { t: "Alexandre le Grand conquiert la Judée", w: "332 av. EC" },
  { t: "La Torah est traduite en grec (Septante)", w: "IIIe siècle av. EC" },
  { t: "Décrets d’Antiochos IV contre le judaïsme", w: "167 av. EC" },
  { t: "Les Maccabées purifient le Temple", w: "164 av. EC" },
  { t: "Pompée entre dans Jérusalem", w: "63 av. EC" },
  { t: "Hérode agrandit le Second Temple", w: "vers 20 av. EC" },
  { t: "Destruction du Second Temple", w: "70 EC" },
  { t: "Chute de Massada", w: "73 EC" },
  { t: "Révolte de Bar Kokhba", w: "132–135 EC" },
  { t: "Rédaction de la Mishna", w: "vers 200 EC" },
  { t: "Maïmonide achève le Mishné Torah", w: "vers 1180 EC" }
];

// Textes anglais (www/en/jeux.js), dans le même ordre que EVENTS
EVENTS.forEach((e, i) => { e.en = EVENTS_EN[i]; });

const SIZE = 5, FRISES = 2, MAX = SIZE * FRISES;
const total = g => g.scores.reduce((a, b) => a + b, 0);
// rang de 1 à 5 : « 1re, 2e… » ou « 1st, 2nd… »
const ordinal = n => lang === "en" ? n + (["th", "st", "nd", "rd"][n] || "th") : n === 1 ? "1re" : n + "e";

// Événements « dans le bon ordre » : la plus longue suite croissante de la réponse.
// Un seul événement mal placé ne fait ainsi perdre qu'un point, sans décaler tous les autres.
function inOrder(placed) {
  const len = placed.map(() => 1), prev = placed.map(() => -1);
  let end = 0;
  placed.forEach((e, i) => {
    for (let j = 0; j < i; j++) if (placed[j] < e && len[j] + 1 > len[i]) { len[i] = len[j] + 1; prev[i] = j; }
    if (len[i] > len[end]) end = i;
  });
  const keep = new Set();
  for (let i = end; i >= 0; i = prev[i]) keep.add(placed[i]);
  return keep;
}

// États de la jauge : un segment par événement, frise après frise
function states(g) {
  return g.sets.flatMap((set, s) => set.map((_, k) =>
    g.results[s] ? (g.results[s][k] ? "good" : "bad") : s === g.s ? "cur" : "todo"));
}

GAMES.push({
  id: "frise", he: "סדר הדורות", tint: 2,
  get name() { return T("La frise", "Timeline"); },
  icon: '<path d="M3 12h18"/><circle class="fill" cx="6.5" cy="12" r="1.9"/><circle class="fill" cx="12" cy="12" r="1.9"/><circle class="fill" cx="17.5" cy="12" r="1.9"/><path d="M6.5 8.6V5.5M12 15.4v3.1M17.5 8.6V5.5"/>',
  best: v => `${TXT.best} <b>${v}/${MAX}</b>`,

  start() {
    const picked = shuffle(EVENTS.map((_, i) => i)).slice(0, MAX);
    const sets = Array.from({ length: FRISES }, (_, s) => picked.slice(s * SIZE, (s + 1) * SIZE).sort((a, b) => a - b));
    return { sets, s: 0, placed: [], pool: shuffle(sets[0]), checked: false, scores: [], results: [] };
  },

  render(g) {
    if (g.done) {
      return gameEnd(this, {
        states: states(g), big: `${total(g)}/${MAX}`, sub: T("dans l’ordre", "in order"), title: praise(total(g) / MAX), record: g.record,
        text: T("Un point par événement placé dans le bon ordre.", "One point for each event placed in the right order.")
      });
    }

    const set = g.sets[g.s], left = SIZE - g.placed.length, last = g.s === FRISES - 1;
    const ev = e => L(EVENTS[e]);
    const row = (n, cls, body) => `<li class="${cls}"><span class="ev-n" aria-hidden="true">${n}</span>${body}</li>`;
    const frise = g.checked
      ? set.map((e, k) => {
          const ok = g.results[g.s][k], mine = ordinal(g.placed.indexOf(e) + 1);
          return row(ok ? "✓" : "✗", ok ? "ok" : "ko", `
            <div class="ev">
              <span class="ev-t">${fr(ev(e).t)}</span>
              <span class="ev-w">${ev(e).w}${ok ? "" : T(` · placé en ${mine} position`, ` · you placed it ${mine}`)}</span>
            </div>`);
        })
      : Array.from({ length: SIZE }, (_, k) => g.placed[k] != null
          ? row(k + 1, "set", `<button class="ev" data-act="remove" data-k="${k}" aria-label="${T("Retirer : ", "Remove: ") + ev(g.placed[k]).t}"><span class="ev-t">${fr(ev(g.placed[k]).t)}</span></button>`)
          : row(k + 1, "empty", `<div class="ev">${k === g.placed.length ? T("Touchez l’événement suivant", "Tap the next event") : ""}</div>`));

    return `
    ${gameTop(this, `${T("frise", "round")} ${g.s + 1}/${FRISES} · score <b>${total(g)}</b>`)}

    <div class="qhead">
      <h2 class="question" tabindex="-1" id="q-text">${g.checked
        ? T(`${g.scores[g.s]} sur ${SIZE} dans le bon ordre`, `${g.scores[g.s]} out of ${SIZE} in the right order`)
        : T("Du plus ancien au plus récent", "From earliest to latest")}</h2>
      <p class="g-help">${g.checked
        ? T("Voici l’ordre exact, avec la source ou la date de chaque événement.", "Here is the exact order, with the source or date of each event.")
        : left === 0
          ? T("Touchez un événement placé pour le retirer, ou vérifiez votre frise.", "Tap a placed event to remove it, or check your timeline.")
          : T(`Touchez les événements dans l’ordre. Encore ${left} à placer.`, `Tap the events in order. ${left} left to place.`)}</p>
    </div>

    <ol class="frise" aria-label="${T("Frise chronologique", "Timeline")}">${frise.join("")}</ol>

    ${g.checked
      ? `<p class="src">${T("Dates de la chronologie historique courante. La chronologie traditionnelle (Séder Olam) compte autrement certaines périodes, mais l’ordre est le même.",
                           "Dates follow the standard historical chronology. The traditional chronology (Seder Olam) counts some periods differently, but the order is the same.")}</p>`
      : `<div class="pool" role="group" aria-label="${T("Événements à placer", "Events to place")}">
          ${g.pool.filter(e => !g.placed.includes(e)).map(e =>
            `<button class="ev" data-act="place" data-e="${e}"><span class="ev-t">${fr(ev(e).t)}</span></button>`).join("")}
        </div>`}

    ${g.checked || left === 0 ? `
    <div class="actions">
      ${g.checked
        ? `<button class="btn" data-act="next" id="next">${last ? TXT.seeScore : T("Frise suivante", "Next timeline")}</button>`
        : `<button class="btn" data-act="check" id="check">${T("Vérifier", "Check")}</button>`}
    </div>` : ""}`;
  },

  act(action, el, g) {
    if (action === "place" && !g.checked && g.placed.length < SIZE) {
      g.placed.push(+el.dataset.e);
      render(g.placed.length === SIZE ? "check" : undefined);
    } else if (action === "remove" && !g.checked) {
      g.placed.splice(+el.dataset.k, 1);
      render();
    } else if (action === "check" && g.placed.length === SIZE) {
      const set = g.sets[g.s];
      const keep = inOrder(g.placed);
      g.results[g.s] = set.map(e => keep.has(e));
      g.scores[g.s] = g.results[g.s].filter(Boolean).length;
      g.checked = true;
      window.scrollTo(0, 0);
      render("next");
    } else if (action === "next" && g.checked) {
      if (g.s < FRISES - 1) {
        g.s++;
        g.placed = [];
        g.pool = shuffle(g.sets[g.s]);
        g.checked = false;
      } else {
        g.done = true;
        g.record = saveGameBest("frise", total(g));
      }
      window.scrollTo(0, 0);
      render(g.done ? "replay" : "q-text");
    }
  }
});
})();
