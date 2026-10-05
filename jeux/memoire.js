// Jeu « Mémoire » : retrouver les paires de cartes en un minimum de coups.
// Trois jeux de cartes : mots hébreux et leur sens, fêtes, personnages.
// Pour ajouter une paire : une entrée dans DECKS (hébreu : [mot hébreu, translittération, sens] ;
// autres jeux : [carte A, carte B]). Huit paires sont tirées au hasard à chaque partie.
(() => {
const DECKS = [
  { id: "hebreu", name: "Mots hébreux", pairs: [
    ["שלום", "chalom", "Paix"], ["אמת", "émet", "Vérité"], ["קשת", "kéchet", "Arc"], ["תורה", "Torah", "Enseignement"],
    ["צדקה", "tsédaka", "Justice"], ["ברית", "berit", "Alliance"], ["אור", "or", "Lumière"], ["מים", "mayim", "Eau"],
    ["שמים", "chamayim", "Ciel"], ["ארץ", "érets", "Terre"], ["מלך", "mélekh", "Roi"], ["נביא", "navi", "Prophète"],
    ["תפילה", "tefila", "Prière"], ["חסד", "’hessed", "Bonté"], ["חכמה", "’hokhma", "Sagesse"], ["לב", "lev", "Cœur"],
    ["יום", "yom", "Jour"], ["לילה", "layla", "Nuit"], ["עץ", "ets", "Arbre"], ["הר", "har", "Montagne"],
    ["ים", "yam", "Mer"], ["לחם", "lé’hem", "Pain"], ["רוח", "roua’h", "Souffle"], ["קול", "kol", "Voix"],
    ["ספר", "séfer", "Livre"], ["אהבה", "ahava", "Amour"], ["אמונה", "émouna", "Foi"], ["חיים", "’hayim", "Vie"],
    ["שמש", "chémech", "Soleil"], ["ירח", "yaréa’h", "Lune"], ["כוכב", "kokhav", "Étoile"], ["בית", "bayit", "Maison"],
    ["דרך", "dérekh", "Chemin"], ["עם", "am", "Peuple"], ["תיבה", "téva", "Arche"], ["מבול", "maboul", "Déluge"],
    ["יונה", "yona", "Colombe"], ["זית", "zayit", "Olivier"], ["ענן", "anan", "Nuée"], ["אב", "av", "Père"]
  ] },
  { id: "fetes", name: "Fêtes", pairs: [
    ["Pessa’h", "La sortie d’Égypte"], ["Chavouot", "Le don de la Torah"], ["Soukkot", "Les cabanes du désert"],
    ["Roch Hachana", "La sonnerie du chofar"], ["Yom Kippour", "Le jour du pardon"], ["Hanoukka", "La victoire des Maccabées"],
    ["Pourim", "Le rouleau d’Esther"], ["Tichea Béav", "La destruction du Temple"]
  ] },
  { id: "personnages", name: "Personnages", pairs: [
    ["Noé", "L’arche"], ["Abraham", "Ur des Chaldéens"], ["Moïse", "Le buisson ardent"], ["Jonas", "Ninive"],
    ["Ruth", "Les champs de Boaz"], ["Naaman", "Le Jourdain"], ["Élie", "Le mont Carmel"], ["Cyrus", "L’édit du retour"],
    ["Jethro", "Les juges d’Israël"], ["Daniel", "La fosse aux lions"], ["Salomon", "Le Premier Temple"], ["Esther", "Suse"],
    ["David", "La fronde"], ["Rahab", "Jéricho"]
  ] }
];

const PAIRS = 8;
let lastDeck = "hebreu";
// Jeu de cartes dans la langue en cours : les paires anglaises sont dans www/en/jeux.js
const deckOf = (id, l) => l === "en" ? DECKS_EN[id] : DECKS.find(d => d.id === id);

// Petit arc à trois bandes pour le dos des cartes
const BACK = `<svg viewBox="0 0 40 22" aria-hidden="true"><path d="M4 21a16 16 0 0 1 32 0M10 21a10 10 0 0 1 20 0M16 21a4 4 0 0 1 8 0"/></svg>`;

GAMES.push({
  id: "memoire", he: "זיכרון", tint: 5,
  get name() { return T("Mémoire", "Memory"); },
  icon: '<rect x="3" y="5.5" width="7.8" height="13" rx="1.6"/><rect x="13.2" y="5.5" width="7.8" height="13" rx="1.6"/><circle class="fill" cx="6.9" cy="12" r="1.4"/><circle class="fill" cx="17.1" cy="12" r="1.4"/>',
  best: v => `${TXT.best} <b>${v} ${T("coups", "moves")}</b>`,

  start(deckId = lastDeck) {
    lastDeck = deckId;
    const pairs = shuffle(deckOf(deckId, lang).pairs).slice(0, PAIRS);
    // deux cartes par paire : side 0 = première face de la paire, side 1 = seconde
    const cards = shuffle(pairs.flatMap((_, p) => [{ p, side: 0 }, { p, side: 1 }]));
    return { deck: deckId, pairs, cards, open: [], found: [], moves: 0, lock: false };
  },

  face(g, card) {
    const pair = g.pairs[card.p];
    if (g.deck !== "hebreu") return `<span class="mem-t">${pair[card.side]}</span>`;
    return card.side === 0
      ? `<span class="he" lang="he">${pair[0]}</span><span class="mem-tr">${pair[1]}</span>`
      : `<span class="mem-t">${pair[2]}</span>`;
  },

  label(g, card) {
    const pair = g.pairs[card.p];
    return g.deck === "hebreu" ? (card.side === 0 ? pair[1] : pair[2]) : pair[card.side];
  },

  render(g) {
    const hebrew = g.deck === "hebreu", found = g.found.length;
    return `
    ${gameTop(this, `${T("coups", "moves")} <b>${g.moves}</b>`)}

    <div class="qhead">
      <h2 class="question" tabindex="-1" id="q-text">${g.done
        ? T(`Terminé en ${g.moves} coups`, `Finished in ${g.moves} moves`)
        : T("Retrouvez les paires", "Find the pairs")}</h2>
      <div class="mem-decks" role="group" aria-label="${T("Jeu de cartes", "Deck")}">
        ${DECKS.map(d => `<button class="mem-deck${d.id === g.deck ? " on" : ""}" data-act="deck" data-d="${d.id}" aria-pressed="${d.id === g.deck}">${deckOf(d.id, lang).name}</button>`).join("")}
      </div>
      <p class="g-help">${T(`${found} paire${found > 1 ? "s" : ""} sur ${PAIRS}`, `${found} of ${PAIRS} pairs`)}${hebrew ? T(" · un mot hébreu et son sens", " · a Hebrew word and its meaning") : ""}</p>
    </div>

    <div class="mem-grid">
      ${g.cards.map((card, i) => {
        const done = g.found.includes(card.p), up = done || g.open.includes(i);
        return `<button class="mem-card${up ? " up" : ""}${done ? " done" : ""}" data-act="flip" data-i="${i}"
          aria-label="${up ? this.label(g, card) : T(`Carte ${i + 1}, retournée`, `Card ${i + 1}, face down`)}"${done ? " disabled" : ""}>${up ? this.face(g, card) : BACK}</button>`;
      }).join("")}
    </div>

    ${g.done ? `
    <div class="feedback" aria-live="polite">
      <p class="verdict ok">${g.moves === PAIRS
        ? T("Sans une seule erreur. Kol hakavod !", "Not a single mistake. Kol hakavod!")
        : T(`${PAIRS} paires en ${g.moves} coups`, `${PAIRS} pairs in ${g.moves} moves`)}</p>
      ${g.record ? `<p><span class="chip record">${TXT.newBest}</span></p>` : ""}
      <ul class="mem-list">
        ${g.pairs.map(p => hebrew
          ? `<li><span class="he" lang="he">${p[0]}</span> <i>${p[1]}</i> · ${p[2]}</li>`
          : `<li><b>${p[0]}</b> · ${p[1]}</li>`).join("")}
      </ul>
    </div>
    <div class="actions stack">
      <button class="btn" data-replay id="replay">${T("Rejouer", "Play again")}</button>
      <button class="btn ghost" data-home id="home">${T("Retour à l’accueil", "Back to home")}</button>
    </div>` : ""}`;
  },

  act(action, el, g) {
    if (action === "deck") {
      state.g = this.start(el.dataset.d);
      render();
    } else if (action === "flip" && !g.lock && !g.done) {
      const i = +el.dataset.i;
      if (g.open.includes(i) || g.found.includes(g.cards[i].p)) return;
      g.open.push(i);
      if (g.open.length === 2) {
        g.moves++;
        const [a, b] = g.open;
        if (g.cards[a].p === g.cards[b].p) {
          g.found.push(g.cards[a].p);
          g.open = [];
          if (g.found.length === PAIRS) { g.done = true; g.record = saveGameBest("memoire", g.moves, true); }
        } else {
          // les deux cartes restent visibles un instant, puis se retournent
          g.lock = true;
          setTimeout(() => {
            if (state.g !== g) return;
            g.open = [];
            g.lock = false;
            render();
          }, 1000);
        }
      }
      render(g.done ? "replay" : undefined);
    }
  }
});
})();
