// Jeu « Mot mystère » : trouver un mot biblique en six essais. Après chaque essai, les lettres
// bien placées, mal placées et absentes sont signalées.
// Pour ajouter un mot : une entrée dans WORDS (w = mot en majuscules sans accent, de 4 à 7 lettres,
// k = catégorie, x = explication, r = source).
(() => {
const WORDS = [
  { w: "MOISE", k: "Personnage", x: "Il fait sortir Israël d’Égypte et reçoit la Torah au Sinaï.", r: "Exode 3 ; 19" },
  { w: "AARON", k: "Personnage", x: "Frère de Moïse et premier grand prêtre.", r: "Exode 28:1" },
  { w: "JONAS", k: "Personnage", x: "Le prophète envoyé à Ninive.", r: "Jonas 1:2" },
  { w: "DAVID", k: "Personnage", x: "Le berger de Bethléem devenu roi d’Israël.", r: "1 Samuel 16" },
  { w: "RUTH", k: "Personnage", x: "La Moabite, arrière-grand-mère du roi David.", r: "Ruth 4:17" },
  { w: "NAAMAN", k: "Personnage", x: "Le général araméen guéri par Élisée.", r: "2 Rois 5" },
  { w: "JETHRO", k: "Personnage", x: "Le prêtre de Midian, beau-père de Moïse.", r: "Exode 18" },
  { w: "CYRUS", k: "Personnage", x: "Le roi de Perse qui autorise le retour des exilés.", r: "Esdras 1" },
  { w: "BALAAM", k: "Personnage", x: "Le devin qui bénit Israël au lieu de le maudire.", r: "Nombres 22–24" },
  { w: "RAHAB", k: "Personnage", x: "Elle cache les explorateurs de Josué à Jéricho.", r: "Josué 2" },
  { w: "ESTHER", k: "Personnage", x: "La reine qui sauve son peuple du complot d’Haman.", r: "Esther 7" },
  { w: "DANIEL", k: "Personnage", x: "Jeté dans la fosse aux lions, il en sort vivant.", r: "Daniel 6" },
  { w: "ISAIE", k: "Personnage", x: "Le prophète de la maison de prière pour tous les peuples.", r: "Isaïe 56:7" },
  { w: "ABRAHAM", k: "Personnage", x: "Le père d’une multitude de nations.", r: "Genèse 17:5" },
  { w: "ISAAC", k: "Personnage", x: "Le fils d’Abraham et de Sarah.", r: "Genèse 21:3" },
  { w: "JACOB", k: "Personnage", x: "Le père des douze tribus, nommé aussi Israël.", r: "Genèse 32:29" },
  { w: "JOSEPH", k: "Personnage", x: "Vendu par ses frères, il devient vice-roi d’Égypte.", r: "Genèse 37 ; 41" },
  { w: "JOSUE", k: "Personnage", x: "Le successeur de Moïse, qui fait entrer Israël en Canaan.", r: "Josué 1" },
  { w: "SAMUEL", k: "Personnage", x: "Le prophète qui oint Saül, puis David.", r: "1 Samuel 10 ; 16" },
  { w: "SALOMON", k: "Personnage", x: "Le roi qui bâtit le Premier Temple.", r: "1 Rois 6" },
  { w: "ELIE", k: "Personnage", x: "Le prophète du mont Carmel, emporté dans un tourbillon.", r: "1 Rois 18 ; 2 Rois 2" },
  { w: "ESDRAS", k: "Personnage", x: "Le scribe qui ramène des exilés de Babylone.", r: "Esdras 7" },
  { w: "HIRAM", k: "Personnage", x: "Le roi de Tyr, allié de David et de Salomon.", r: "1 Rois 5:15" },
  { w: "BABEL", k: "Lieu", x: "La ville de la tour et de la confusion des langues.", r: "Genèse 11:9" },
  { w: "NINIVE", k: "Lieu", x: "La grande ville d’Assyrie qui se repent.", r: "Jonas 3" },
  { w: "ARARAT", k: "Lieu", x: "Les montagnes où l’arche s’arrête.", r: "Genèse 8:4" },
  { w: "SINAI", k: "Lieu", x: "La montagne du don de la Torah.", r: "Exode 19" },
  { w: "HEBRON", k: "Lieu", x: "La ville du tombeau des Patriarches.", r: "Genèse 23" },
  { w: "CARMEL", k: "Lieu", x: "La montagne où Élie affronte les prophètes de Baal.", r: "1 Rois 18" },
  { w: "JERICHO", k: "Lieu", x: "La première ville prise par Josué.", r: "Josué 6" },
  { w: "CANAAN", k: "Lieu", x: "Le pays promis à Abraham et à sa descendance.", r: "Genèse 12:5-7" },
  { w: "EGYPTE", k: "Lieu", x: "Le pays de l’esclavage et de la sortie.", r: "Exode 12" },
  { w: "MIDIAN", k: "Lieu", x: "Le pays où Moïse se réfugie et devient berger.", r: "Exode 2:15" },
  { w: "MOAB", k: "Lieu", x: "Le pays d’origine de Ruth.", r: "Ruth 1:4" },
  { w: "SION", k: "Lieu", x: "La colline de Jérusalem prise par David.", r: "2 Samuel 5:7" },
  { w: "EDEN", k: "Lieu", x: "Le jardin où Dieu place le premier homme.", r: "Genèse 2:8" },
  { w: "TORAH", k: "Mot clé", x: "L’enseignement : les cinq livres de Moïse.", r: "Deutéronome 33:4" },
  { w: "ARCHE", k: "Mot clé", x: "Le bateau de Noé pendant le déluge.", r: "Genèse 6:14" },
  { w: "DELUGE", k: "Mot clé", x: "Les eaux qui couvrent la terre au temps de Noé.", r: "Genèse 7" },
  { w: "COLOMBE", k: "Mot clé", x: "L’oiseau qui rapporte une feuille d’olivier à Noé.", r: "Genèse 8:11" },
  { w: "OLIVIER", k: "Mot clé", x: "L’arbre dont la colombe rapporte une feuille.", r: "Genèse 8:11" },
  { w: "MANNE", k: "Mot clé", x: "La nourriture d’Israël pendant quarante ans dans le désert.", r: "Exode 16" },
  { w: "CHOFAR", k: "Mot clé", x: "La corne que l’on fait sonner à Roch Hachana.", r: "Lévitique 23:24" },
  { w: "TEMPLE", k: "Mot clé", x: "La maison de prière pour tous les peuples, à Jérusalem.", r: "Isaïe 56:7" },
  { w: "PSAUME", k: "Mot clé", x: "Un chant de louange ; le livre en compte cent cinquante.", r: "Livre des Psaumes" },
  { w: "CHABBAT", k: "Mot clé", x: "Le septième jour, jour de repos.", r: "Genèse 2:2-3" },
  { w: "CHEMA", k: "Mot clé", x: "« Écoute » : le premier mot de la profession de foi d’Israël.", r: "Deutéronome 6:4" },
  { w: "MISHNA", k: "Mot clé", x: "Le recueil de la loi orale, rédigé par Rabbi Yehouda HaNassi vers 200 EC.", r: "Pirké Avot 1:1" },
  { w: "TALMUD", k: "Mot clé", x: "La Mishna et son commentaire ; les sept lois y sont discutées.", r: "Sanhédrin 56a" },
  { w: "POURIM", k: "Fête", x: "La fête qui rappelle le salut des Juifs de Perse.", r: "Esther 9:26" },
  { w: "SOUKKOT", k: "Fête", x: "La fête des cabanes, sept jours en automne.", r: "Lévitique 23:42" },
  { w: "MATSA", k: "Mot clé", x: "Le pain non levé de Pessa’h.", r: "Exode 12:39" },
  { w: "EXODE", k: "Mot clé", x: "Le deuxième livre de la Torah : la sortie d’Égypte.", r: "Livre de l’Exode" },
  { w: "GENESE", k: "Mot clé", x: "Le premier livre de la Torah, Béréchit en hébreu.", r: "Livre de la Genèse" },
  { w: "AUTEL", k: "Mot clé", x: "Noé en bâtit un en sortant de l’arche.", r: "Genèse 8:20" },
  { w: "VIGNE", k: "Mot clé", x: "Noé en plante une après le déluge.", r: "Genèse 9:20" }
];

const TRIES = 6;
// Clavier de chaque langue : AZERTY en français, QWERTY en anglais
const ROWS = { fr: ["AZERTYUIOP", "QSDFGHJKLM", "WXCVBN"], en: ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"] };
const RANK = { no: 1, near: 2, ok: 3 };
// Chaque langue a sa propre liste : les mots anglais sont dans www/en/jeux.js
const words = l => l === "en" ? WORDS_EN : WORDS;

const store = {
  load() { try { return JSON.parse(localStorage.getItem("bnq-mot") || "{}") || {}; } catch (e) { return {}; } },
  save(v) { try { localStorage.setItem("bnq-mot", JSON.stringify(v)); } catch (e) {} }
};

// Couleur de chaque lettre d'un essai : ok (bien placée), near (mal placée), no (absente)
function check(guess, word) {
  const res = Array(word.length).fill("no"), rest = {};
  for (let i = 0; i < word.length; i++) {
    if (guess[i] === word[i]) res[i] = "ok";
    else rest[word[i]] = (rest[word[i]] || 0) + 1;
  }
  for (let i = 0; i < word.length; i++) {
    if (res[i] !== "ok" && rest[guess[i]]) { res[i] = "near"; rest[guess[i]]--; }
  }
  return res;
}

GAMES.push({
  id: "mot", he: "מילה נסתרת", tint: 7,
  get name() { return T("Mot mystère", "Mystery word"); },
  icon: '<rect class="fill" x="2.8" y="8" width="5.4" height="8" rx="1.3"/><rect x="9.3" y="8" width="5.4" height="8" rx="1.3"/><rect x="15.8" y="8" width="5.4" height="8" rx="1.3"/>',
  best: v => `${T("Meilleure série", "Best streak")} <b>${v}</b>`,

  start() {
    // évite de reproposer les mots vus récemment (une liste de mots vus par langue)
    const list = words(lang), seenKey = "vus-" + lang;
    const s = store.load(), seen = (s[seenKey] || []).filter(i => i < list.length);
    const pool = list.map((_, i) => i).filter(i => !seen.includes(i));
    const wi = shuffle(pool.length ? pool : list.map((_, i) => i))[0];
    s[seenKey] = [...seen, wi].slice(-Math.floor(list.length / 2));
    store.save(s);
    return { lang, wi, rows: [], cur: "", msg: "", serie: s.serie || 0 };
  },

  render(g) {
    const { w, k, x, r } = words(g.lang)[g.wi], n = w.length, rows = ROWS[g.lang];
    const keys = {};
    g.rows.forEach(row => check(row, w).forEach((c, i) => {
      if ((RANK[c] || 0) > (RANK[keys[row[i]]] || 0)) keys[row[i]] = c;
    }));
    const key = (label, id, cls = "") =>
      `<button class="mm-key ${cls} ${keys[id] || ""}" data-act="key" data-k="${id}"${g.done ? " disabled" : ""}>${label}</button>`;
    const tries = g.rows.length;

    return `
    ${gameTop(this, `${T("série", "streak")} <b>${g.serie}</b>`)}

    <div class="qhead">
      <div class="chips"><span class="chip">${k}</span><span class="chip">${n} ${T("lettres", "letters")}</span></div>
      <h2 class="question" tabindex="-1" id="q-text">${fr(T("Quel est ce mot ?", "What is this word?"))}</h2>
      <p class="g-help">${fr(T("Six essais, sans accents. Vert : lettre bien placée. Jaune : lettre présente, mais ailleurs.",
                               "Six tries. Green: right letter, right place. Yellow: right letter, wrong place."))}</p>
    </div>

    <div class="mm-grid" style="--n:${n}" role="group" aria-label="${T("Grille des essais", "Guess grid")}">
      ${Array.from({ length: TRIES }, (_, t) => {
        const done = t < tries, text = done ? g.rows[t] : t === tries && !g.done ? g.cur : "";
        const cols = done ? check(text, w) : [];
        return `<div class="mm-row">${Array.from({ length: n }, (_, i) =>
          `<span class="mm-tile ${cols[i] || (text[i] ? "filled" : "")}">${text[i] || ""}</span>`).join("")}</div>`;
      }).join("")}
    </div>

    <div class="feedback" aria-live="polite">${g.done ? `
      <p class="verdict ${g.won ? "ok" : "ko"}">${g.won
        ? T(`Trouvé en ${tries} essai${tries > 1 ? "s" : ""}`, `Found in ${tries} ${tries > 1 ? "tries" : "try"}`)
        : fr(T("Le mot était : ", "The word was: ") + w)}</p>
      <p>${fr(x)}</p>
      <p class="ref">${TXT.source}<b>${r}</b></p>
      ${g.record ? `<p><span class="chip record">${T("Nouveau record de série", "New best streak")}</span></p>` : ""}` : g.msg ? `<p>${g.msg}</p>` : ""}</div>

    ${g.done ? `
    <div class="actions stack">
      <button class="btn" data-replay id="replay">${T("Mot suivant", "Next word")}</button>
      <button class="btn ghost" data-home id="home">${T("Retour à l’accueil", "Back to home")}</button>
    </div>` : `
    <div class="mm-kb" role="group" aria-label="${T("Clavier", "Keyboard")}">
      <div class="mm-kb-row">${[...rows[0]].map(c => key(c, c)).join("")}</div>
      <div class="mm-kb-row">${[...rows[1]].map(c => key(c, c)).join("")}</div>
      <div class="mm-kb-row">${key(T("Valider", "Enter"), "ENTER", "wide")}${[...rows[2]].map(c => key(c, c)).join("")}${key("⌫", "BACK", "wide")}</div>
    </div>`}`;
  },

  press(g, k) {
    if (g.done) return;
    const word = words(g.lang)[g.wi].w;
    g.msg = "";
    if (k === "BACK") g.cur = g.cur.slice(0, -1);
    else if (k === "ENTER") {
      if (g.cur.length < word.length) g.msg = T("Il manque des lettres.", "Not enough letters.");
      else {
        g.rows.push(g.cur);
        g.won = g.cur === word;
        g.cur = "";
        if (g.won || g.rows.length === TRIES) {
          g.done = true;
          const s = store.load();
          s.serie = g.serie = g.won ? g.serie + 1 : 0;
          store.save(s);
          if (g.won) g.record = saveGameBest("mot", g.serie);
        }
      }
    } else if (g.cur.length < word.length) g.cur += k;
    render(g.done ? "replay" : undefined);
  },

  act(action, el, g) {
    if (action === "key") this.press(g, el.dataset.k);
  },

  key(e, g) {
    if (g.done) return;   // la touche Entrée doit alors actionner le bouton « Mot suivant »
    if (e.key === "Enter") { e.preventDefault(); this.press(g, "ENTER"); }
    else if (e.key === "Backspace") { e.preventDefault(); this.press(g, "BACK"); }
    else if (e.key.length === 1) {
      // une lettre accentuée du clavier est ramenée à sa lettre de base (é → E)
      const c = e.key.normalize("NFD")[0].toUpperCase();
      if (c >= "A" && c <= "Z") this.press(g, c);
    }
  }
});
})();
