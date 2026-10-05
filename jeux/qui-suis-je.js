// Jeu « Qui suis-je ? » : deviner un personnage biblique à partir de trois indices,
// du plus difficile au plus facile. Moins on utilise d'indices, plus on marque de points (3, 2 ou 1).
// Pour ajouter un personnage : une entrée dans FIGURES
// (n = nom, c = les trois indices, r = source, x = explication donnée après la réponse).
(() => {
const FIGURES = [
  { n: "Noé", r: "Genèse 6–9",
    c: ["J’ai vécu neuf cent cinquante ans.", "Après une longue traversée, j’ai planté une vigne.", "J’ai construit une arche pour traverser le déluge."],
    x: "Noé est l’ancêtre de toute l’humanité d’après le déluge. L’alliance et les lois qui portent son nom concernent tous les peuples." },
  { n: "Melkhisédek", r: "Genèse 14:18-20",
    c: ["J’étais à la fois roi et prêtre.", "J’ai apporté du pain et du vin à un vainqueur.", "Roi de Salem, j’ai béni Abram au nom du Dieu Très-Haut."],
    x: "Le Talmud (Nedarim 32b) l’identifie à Sem, fils de Noé." },
  { n: "Jethro", r: "Exode 2:16 ; 18",
    c: ["J’avais sept filles qui gardaient mon troupeau.", "J’ai reconnu que l’Éternel est plus grand que tous les dieux.", "Prêtre de Midian, j’ai conseillé à mon gendre Moïse de nommer des juges."],
    x: "La section de la Torah qui raconte le don des Dix Paroles porte son nom : Yitro." },
  { n: "Ruth", r: "Ruth 1:16 ; 2 ; 4:17",
    c: ["J’ai glané des épis dans le champ d’un homme de Bethléem.", "J’ai dit à ma belle-mère : « Ton peuple sera mon peuple, et ton Dieu sera mon Dieu. »", "Moabite, je suis l’arrière-grand-mère du roi David."],
    x: "Son livre est lu à Chavouot, la fête du don de la Torah." },
  { n: "Naaman", r: "2 Rois 5",
    c: ["Une jeune captive d’Israël servait ma femme et lui a parlé d’un prophète.", "Je me suis plongé sept fois dans le Jourdain.", "Général araméen, j’ai été guéri de la lèpre par le prophète Élisée."],
    x: "Après sa guérison, il déclare qu’il n’y a de Dieu sur toute la terre qu’en Israël (2 Rois 5:15)." },
  { n: "Job", r: "Job 1–2",
    c: ["J’habitais le pays d’Outs.", "Trois amis sont venus me consoler et sont restés sept jours sans parler.", "J’ai perdu mes biens, mes enfants et ma santé, sans maudire Dieu."],
    x: "Le livre le présente comme un homme intègre et droit, qui craint Dieu, sans le rattacher au peuple d’Israël." },
  { n: "Cyrus", r: "Isaïe 45:1 ; Esdras 1",
    c: ["Le prophète Isaïe m’appelle l’oint de l’Éternel.", "J’ai rendu les ustensiles du Temple emportés à Babylone.", "Roi de Perse, j’ai autorisé les exilés à rebâtir le Temple de Jérusalem."],
    x: "Son édit, vers 538 av. EC, met fin à l’exil de Babylone." },
  { n: "La reine de Saba", r: "1 Rois 10:1-13",
    c: ["Je suis arrivée à Jérusalem avec des chameaux chargés d’aromates, d’or et de pierres précieuses.", "J’ai posé des énigmes à un roi, et il a répondu à toutes.", "Je suis venue de loin éprouver la sagesse de Salomon."],
    x: "Impressionnée, elle loue l’Éternel, le Dieu de Salomon (1 Rois 10:9)." },
  { n: "Rahab", r: "Josué 2 ; 6:22-25",
    c: ["Ma maison était bâtie dans le rempart de la ville.", "J’ai caché deux explorateurs sous des tiges de lin, sur mon toit.", "À Jéricho, un cordon écarlate à ma fenêtre a sauvé ma famille."],
    x: "Elle reconnaît que l’Éternel est Dieu « en haut dans les cieux et en bas sur la terre » (Josué 2:11)." },
  { n: "Balaam", r: "Nombres 22–24",
    c: ["Je venais de Pethor, sur le fleuve.", "Mon ânesse a vu un ange avant moi, puis elle m’a parlé.", "Engagé par le roi de Moab pour maudire Israël, je l’ai béni."],
    x: "Sa bénédiction « Qu’elles sont belles tes tentes, ô Jacob » est encore récitée à l’entrée de la synagogue." },
  { n: "Jonas", r: "Jonas 1–3",
    c: ["J’ai embarqué à Jaffa pour fuir vers Tarsis.", "J’ai passé trois jours et trois nuits dans le ventre d’un grand poisson.", "Envoyé à Ninive, j’ai vu toute une ville se repentir."],
    x: "Son livre, lu à Yom Kippour, montre que le repentir est ouvert à tous les peuples." },
  { n: "Abraham", r: "Genèse 11:31 ; 17:5 ; 18",
    c: ["J’ai quitté Ur des Chaldéens avec mon père.", "J’ai accueilli trois visiteurs à l’entrée de ma tente.", "Dieu a changé mon nom et m’a promis d’être le père d’une multitude de nations."],
    x: "Son nom passe d’Abram à Abraham : « père d’une multitude de nations »." },
  { n: "La fille de Pharaon", r: "Exode 2:5-10",
    c: ["Je descendais me baigner au fleuve avec mes servantes.", "J’ai eu pitié d’un bébé qui pleurait dans un panier.", "J’ai adopté Moïse et je lui ai donné son nom."],
    x: "La tradition l’appelle Bitya (1 Chroniques 4:18 ; Meguila 13a)." },
  { n: "Hiram", r: "1 Rois 5:15-26",
    c: ["J’ai toujours été l’ami du roi David.", "J’ai envoyé par mer des cèdres et des cyprès du Liban.", "Roi de Tyr, j’ai aidé Salomon à bâtir le Temple."],
    x: "Il bénit l’Éternel d’avoir donné à David un fils sage (1 Rois 5:21)." },
  { n: "Nabuchodonosor", r: "Daniel 2–3 ; 2 Rois 25",
    c: ["J’ai rêvé d’une immense statue aux pieds de fer et d’argile.", "J’ai fait jeter trois jeunes gens dans une fournaise ardente.", "Roi de Babylone, j’ai détruit le Premier Temple de Jérusalem."],
    x: "Le Premier Temple est détruit au VIe siècle av. EC et le peuple de Juda est exilé à Babylone." },
  { n: "Esther", r: "Esther 2:7 ; 7",
    c: ["Mon autre nom est Hadassa.", "Orpheline, j’ai été élevée par mon cousin Mardochée.", "Reine de Perse, j’ai déjoué le complot d’Haman contre mon peuple."],
    x: "La fête de Pourim rappelle ce retournement." },
  { n: "Ébed-Mélekh", r: "Jérémie 38:7-13 ; 39:15-18",
    c: ["J’étais serviteur dans le palais du roi Sédécias.", "J’ai pris de vieux chiffons et des cordes pour un sauvetage.", "Koushite, j’ai tiré le prophète Jérémie de la citerne."],
    x: "Dieu lui promet la vie sauve, « parce que tu as eu confiance en moi » (Jérémie 39:18)." },
  { n: "Hagar", r: "Genèse 16 ; 21:9-21",
    c: ["Un ange m’a trouvée près d’une source, dans le désert.", "J’ai appelé Dieu « El-Roï », le Dieu qui me voit.", "Servante égyptienne de Saraï, je suis la mère d’Ismaël."],
    x: "Dieu entend la voix de son fils dans le désert et promet d’en faire une grande nation (Genèse 21:17-18)." },
  { n: "Élie", r: "1 Rois 17–18 ; 2 Rois 2:11",
    c: ["Des corbeaux m’apportaient du pain et de la viande.", "J’ai défié les prophètes de Baal sur le mont Carmel.", "J’ai été emporté au ciel dans un tourbillon."],
    x: "Le prophète Malachie annonce son retour (Malachie 3:23)." },
  { n: "Daniel", r: "Daniel 1:7 ; 5 ; 6",
    c: ["À Babylone, on m’a donné le nom de Beltchatsar.", "J’ai déchiffré une écriture tracée sur le mur du palais.", "J’ai été jeté dans la fosse aux lions."],
    x: "Une partie de son livre est écrite en araméen." },
  { n: "Moïse", r: "Exode 3 ; 12–20",
    c: ["J’ai gardé les troupeaux de mon beau-père à Midian.", "J’ai vu un buisson qui brûlait sans se consumer.", "J’ai fait sortir Israël d’Égypte et reçu la Torah au Sinaï."],
    x: "La Torah dit de lui qu’il était l’homme le plus humble de la terre (Nombres 12:3)." },
  { n: "David", r: "1 Samuel 16–17",
    c: ["J’étais le plus jeune fils d’Isaï de Bethléem.", "J’ai joué de la harpe pour apaiser le roi Saül.", "Avec une fronde, j’ai vaincu Goliath."],
    x: "Arrière-petit-fils de Ruth la Moabite, il fait de Jérusalem sa capitale." },
  { n: "Joseph", r: "Genèse 37 ; 40–41",
    c: ["Mon père m’a offert une tunique que mes frères m’ont enviée.", "J’ai interprété les songes de deux prisonniers, puis ceux de Pharaon.", "Vendu par mes frères, je suis devenu vice-roi d’Égypte."],
    x: "Il sauve l’Égypte et sa propre famille de sept années de famine." },
  { n: "Salomon", r: "1 Rois 3 ; 6",
    c: ["J’ai demandé à Dieu un cœur intelligent plutôt que la richesse.", "J’ai tranché le litige de deux mères autour d’un enfant.", "Fils de David, j’ai bâti le Premier Temple."],
    x: "Dans sa prière de dédicace, il demande que Dieu exauce aussi l’étranger qui vient prier au Temple (1 Rois 8:41-43)." }
];

// Textes anglais (www/en/jeux.js), dans le même ordre que FIGURES
FIGURES.forEach((f, i) => { f.en = FIGURES_EN[i]; });

const ROUND = 5, OPTIONS = 6, MAX = ROUND * 3;
const total = g => g.pts.reduce((a, b) => a + b, 0);

GAMES.push({
  id: "qui", he: "מי אני", tint: 6,
  get name() { return T("Qui suis-je ?", "Who am I?"); },
  icon: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20c.4-3.6 2.9-5.8 6.2-5.8 2.1 0 3.9.9 5 2.5"/><path d="M16.4 7.6a2.3 2.3 0 1 1 3.4 2c-.8.5-1.1 1-1.1 1.9"/><circle class="fill" cx="18.7" cy="14.6" r="1"/>',
  best: v => `${TXT.best} <b>${v}/${MAX}</b>`,

  start() {
    const all = FIGURES.map((_, i) => i);
    const list = shuffle(all).slice(0, ROUND);
    const opts = list.map(i => shuffle([i, ...shuffle(all.filter(j => j !== i)).slice(0, OPTIONS - 1)]));
    return { list, opts, i: 0, shown: 1, picks: [], pts: [] };
  },

  render(g) {
    const states = g.list.map((_, k) => g.picks[k] != null ? (g.pts[k] > 0 ? "good" : "bad") : k === g.i ? "cur" : "todo");
    if (g.done) {
      return gameEnd(this, {
        states, big: `${total(g)}/${MAX}`, sub: "points", title: praise(total(g) / MAX), record: g.record,
        text: T("Trois points pour un personnage trouvé au premier indice, deux au deuxième, un au troisième.",
                "Three points for a character found on the first clue, two on the second, one on the third."),
        body: `
          <section>
            <h2 class="label">${T("Les personnages", "The characters")}</h2>
            <ol class="review">
              ${g.list.map((fi, k) => {
                const f = L(FIGURES[fi]), ok = g.pts[k] > 0;
                return `<li>
                  <span class="st ${ok ? "ok" : "ko"}" aria-label="${ok ? T("trouvé", "found") : T("manqué", "missed")}">${ok ? "✓" : "✗"}</span>
                  <div>
                    <p class="rq"><b>${f.n}</b></p>
                    <p class="ra">${TXT.points(g.pts[k])} · ${f.r}</p>
                  </div></li>`;
              }).join("")}
            </ol>
          </section>`
      });
    }

    const fi = g.list[g.i], f = L(FIGURES[fi]), pick = g.picks[g.i], answered = pick != null;
    const shown = answered ? 3 : g.shown, stake = 4 - g.shown, last = g.i === ROUND - 1;
    return `
    ${gameTop(this, `score <b>${total(g)}</b>`)}
    <div class="gauge">${gauge(states, `${g.i + 1}/${ROUND}`, T("personnage", "character"))}</div>

    <div class="qhead">
      <h2 class="question" tabindex="-1" id="q-text">${fr(this.name)}</h2>
      <ol class="clues">
        ${f.c.slice(0, shown).map((c, k) => `
          <li class="clue"><span class="clue-n">${T("Indice", "Clue")} ${k + 1}</span><span class="clue-t">${fr(c)}</span></li>`).join("")}
      </ol>
      ${!answered && g.shown < 3 ? `
        <button class="btn ghost" data-act="clue" id="clue">
          <span>${T("Indice suivant", "Next clue")}</span><small>${T("la réponse vaudra ", "the answer will be worth ") + TXT.points(stake - 1)}</small>
        </button>` : ""}
    </div>

    <div class="names" role="group" aria-label="${TXT.answers}">
      ${g.opts[g.i].map(j => {
        const cls = !answered ? "" : j === fi ? "correct" : j === pick ? "wrong" : "dim";
        return `<button class="opt ${cls}" data-act="pick" data-j="${j}" ${answered ? "disabled" : ""}>${L(FIGURES[j]).n}</button>`;
      }).join("")}
    </div>

    <div class="feedback" aria-live="polite">${answered ? `
      <p class="verdict ${pick === fi ? "ok" : "ko"}">${fr(pick === fi
        ? T("Trouvé : ", "Found: ") + TXT.points(g.pts[g.i])
        : TXT.notQuite + f.n)}</p>
      <p>${fr(f.x)}</p>
      <p class="ref">${TXT.source}<b>${f.r}</b></p>` : ""}</div>

    <div class="actions${answered ? "" : " idle"}">
      ${answered
        ? `<button class="btn" data-act="next" id="next">${last ? TXT.seeScore : T("Personnage suivant", "Next character")}</button>`
        : `<p class="hint">${fr(T("Bonne réponse maintenant : ", "Right answer now: ") + TXT.points(stake))}</p>`}
    </div>`;
  },

  act(action, el, g) {
    if (action === "clue" && g.shown < 3) {
      g.shown++;
      render(g.shown < 3 ? "clue" : undefined);
    } else if (action === "pick" && g.picks[g.i] == null) {
      const j = +el.dataset.j;
      g.picks[g.i] = j;
      g.pts[g.i] = j === g.list[g.i] ? 4 - g.shown : 0;
      render("next");
    } else if (action === "next") {
      if (g.i < ROUND - 1) { g.i++; g.shown = 1; }
      else { g.done = true; g.record = saveGameBest("qui", total(g)); }
      window.scrollTo(0, 0);
      render(g.done ? "replay" : "q-text");
    }
  }
});
})();
