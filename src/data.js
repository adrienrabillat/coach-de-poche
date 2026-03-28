/* ═══════════════════════════════════════════════════════════════
   STATIC DATA — Programme, nutrition, achievements
   ═══════════════════════════════════════════════════════════════ */

export const PROGRAM = [
  {
    id: "A", name: "Pecs + Triceps", tag: "PUSH", color: "#d4644a", accent: "#fce8e4",
    focus: "Contraction + incline pour combler le haut des pecs",
    exercises: [
      { name: "Developpe Couche (Barre)", sets: 4, reps: "6-8", rest: 180, weight: "80-90kg", notes: "Pyramide: 60x10 80x6 90x4 80x6. Descente 2-3s." },
      { name: "Developpe Incline (Halteres)", sets: 4, reps: "8-10", rest: 120, weight: "30-36kg", notes: "30deg max. Squeeze 1s en haut. Priorite haut des pecs." },
      { name: "Ecarte Cable (Vis-a-vis)", sets: 3, reps: "12-15", rest: 90, weight: "10-15kg", notes: "Croise en haut, etirement complet en bas. Forme ronde." },
      { name: "Dips (PDC ou leste)", sets: 3, reps: "8-12", rest: 120, weight: "PDC", notes: "Penche en avant. Leste si trop facile." },
      { name: "Barre au Front", sets: 3, reps: "10-12", rest: 90, weight: "25kg", notes: "Coudes fixes, descends vers le front." },
      { name: "Extension Corde (Poulie)", sets: 3, reps: "12-15", rest: 60, weight: "25-30kg", notes: "Ecarte en bas. Derniere serie: dropset." },
    ]
  },
  {
    id: "B", name: "Dos + Biceps", tag: "PULL", color: "#3574a5", accent: "#e1eef7",
    focus: "Epaisseur du dos + chaine scapulaire",
    exercises: [
      { name: "Rowing Barre (Penche)", sets: 4, reps: "6-8", rest: 150, weight: "60-70kg", notes: "Buste 45deg, tire vers le nombril. Squeeze omoplates 1s." },
      { name: "Tirage Poitrine (Poulie)", sets: 4, reps: "8-10", rest: 120, weight: "70-80kg", notes: "Prise moyenne, tire vers les pecs." },
      { name: "Rowing 1 bras (Haltere)", sets: 3, reps: "10-12", rest: 90, weight: "30-35kg", notes: "Etirement complet, squeeze en haut." },
      { name: "Shrug Barre", sets: 3, reps: "12-15", rest: 90, weight: "60-80kg", notes: "Trapezes. Tiens 2s en haut." },
      { name: "Curl Pupitre (Machine)", sets: 3, reps: "10-12", rest: 90, weight: "25kg", notes: "Descente controlee. Zero elan." },
      { name: "Curl Marteau (Halteres)", sets: 3, reps: "10-12", rest: 60, weight: "18-20kg", notes: "Derniere serie: dropset." },
    ]
  },
  {
    id: "C", name: "Jambes + Abdos", tag: "LOWER", color: "#6b8e5a", accent: "#e8f0e4",
    focus: "Remise en route progressive",
    exercises: [
      { name: "Leg Press", sets: 4, reps: "10-12", rest: 120, weight: "120-160kg", notes: "Pieds hauts et ecartes pour ischios/fessiers." },
      { name: "Leg Curl (Machine)", sets: 3, reps: "10-12", rest: 90, weight: "A trouver", notes: "Ischio-jambiers. Negative lente." },
      { name: "Leg Extension", sets: 3, reps: "12-15", rest: 90, weight: "A trouver", notes: "Squeeze en haut 1s." },
      { name: "Mollets (Machine)", sets: 3, reps: "15-20", rest: 60, weight: "A trouver", notes: "Amplitude complete." },
      { name: "Crunch Poulie Haute", sets: 3, reps: "15-20", rest: 60, weight: "20-30kg", notes: "Expire a fond." },
      { name: "Planche", sets: 3, reps: "30-45s", rest: 60, weight: "PDC", notes: "Progresse vers 60s." },
    ]
  },
  {
    id: "D", name: "Epaules + Bras", tag: "UPPER", color: "#8a9a5b", accent: "#f0f2e6",
    focus: "Chaine scapulaire, deltoides 3D, bras complets",
    exercises: [
      { name: "Dev. Militaire (Halteres)", sets: 4, reps: "8-10", rest: 120, weight: "28-32kg", notes: "Full ROM." },
      { name: "Elevation Laterale (Machine)", sets: 4, reps: "12-15", rest: 60, weight: "45-55kg", notes: "Tempo lent. Dropset derniere serie." },
      { name: "Oiseau (Poulie)", sets: 3, reps: "12-15", rest: 60, weight: "5-10kg", notes: "Deltoide posterieur." },
      { name: "Shrug Halteres", sets: 3, reps: "12-15", rest: 90, weight: "30-40kg", notes: "Tiens 2s en haut." },
      { name: "Curl Biceps (Barre EZ)", sets: 3, reps: "10-12", rest: 90, weight: "25-30kg", notes: "Supination complete." },
      { name: "Barre au Front", sets: 3, reps: "10-12", rest: 90, weight: "25kg", notes: "Longue portion." },
      { name: "Extension Corde — Finisher", sets: 2, reps: "15-20", rest: 45, weight: "20kg", notes: "Derniere serie a l'echec." },
    ]
  }
]

export const WEEK = [
  { d: "Lun", type: "gym", s: "A", l: "Pecs + Tri" },
  { d: "Mar", type: "run", l: "Run 5km" },
  { d: "Mer", type: "gym", s: "B", l: "Dos + Bi" },
  { d: "Jeu", type: "rest", l: "Repos" },
  { d: "Ven", type: "gym", s: "C", l: "Jambes" },
  { d: "Sam", type: "gym", s: "D", l: "Epaules" },
  { d: "Dim", type: "rest", l: "Repos" },
]

export const MEALS = [
  {
    id: "breakfast", title: "Petit-dejeuner", sub: "~350 cal — Pas de cuisson, low carb",
    opts: [
      { n: "Fromage blanc + amandes", items: ["300g fromage blanc 0% + stevia", "20g amandes", "Expresso sans sucre", "5g creatine"], cal: 340, prot: 32 },
      { n: "Fromage blanc + fruit", items: ["300g fromage blanc 0% + stevia", "1 pomme ou banane", "Expresso sans sucre", "5g creatine"], cal: 370, prot: 30 },
      { n: "Fromage blanc + beurre cacahuete", items: ["250g fromage blanc 0% + stevia", "15g beurre de cacahuete", "Expresso sans sucre", "5g creatine"], cal: 350, prot: 30 },
    ]
  },
  {
    id: "lunch", title: "Dejeuner (meal prep)", sub: "~680 cal — Prot + glucides + legumes",
    opts: [
      { n: "Poulet + riz + brocoli", items: ["200g poulet grille", "150g riz basmati cuit", "200g brocoli", "1 cs huile d'olive"], cal: 680, prot: 52 },
      { n: "Boeuf hache + patate douce", items: ["180g boeuf hache 5%", "200g patate douce", "Salade + tomates", "1 cs huile d'olive"], cal: 700, prot: 45 },
      { n: "Thon + pates completes", items: ["2 boites thon naturel", "150g pates completes cuites", "Sauce tomate", "Legumes au choix"], cal: 650, prot: 50 },
      { n: "Dinde + quinoa", items: ["200g dinde", "150g quinoa cuit", "Legumes rotis", "1 cs huile d'olive"], cal: 670, prot: 50 },
    ]
  },
  {
    id: "post", title: "Post-training", sub: "~314 cal — Jours de salle uniquement",
    opts: [
      { n: "Shaker gainer", items: ["1 scoop lean mass gainer + eau"], cal: 314, prot: 37 },
    ]
  },
  {
    id: "dinner", title: "Diner (non controle)", sub: "~550 cal — Strategie de limitation",
    opts: [
      { n: "Regles", items: ["Proteines en premier", "Legumes ensuite", "Feculents en dernier, c'est la que tu limites", "Pas de pain en plus", "Verre d'eau avant", "Si faim apres: fromage blanc 0%"], cal: 550, prot: 35 },
    ]
  },
  {
    id: "cheat", title: "Samedi soir", sub: "Cheat meal — 1 repas libre avec ta copine",
    opts: [
      { n: "Les regles", items: ["Resto ou commande, mange ce que tu veux", "1 repas, pas la journee", "Dimanche on reprend", "Zero culpabilite, c'est dans le plan"], cal: 0, prot: 0 },
    ]
  },
]

export const CHECKS = [
  { k: "protein", l: "160g+ proteines" },
  { k: "water", l: "3L d'eau" },
  { k: "noJunk", l: "Pas de junk" },
  { k: "creatine", l: "Creatine" },
  { k: "training", l: "Seance faite" },
  { k: "sleep", l: "8h+ sommeil" },
]

export const MILESTONES = [
  { w: 84, bf: 18, t: "Fin avril", n: "Le visage s'affine." },
  { w: 82, bf: 16, t: "Mi-mai", n: "Veines des bras." },
  { w: 80, bf: 15, t: "Fin juin", n: "Abdos du haut." },
  { w: 78, bf: 13, t: "Aout", n: "Separations visibles." },
  { w: 77, bf: 12, t: "Sept/Oct", n: "Objectif. 6-pack." },
]

export const STRENGTH = [
  { ex: "Dev. Couche", cur: "100x4", tgt: "100x8" },
  { ex: "Dev. Militaire", cur: "32x6", tgt: "36x8" },
  { ex: "Rowing Barre", cur: "70x6", tgt: "80x8" },
  { ex: "Curl Marteau", cur: "20x8", tgt: "24x10" },
  { ex: "Barre au Front", cur: "25x10", tgt: "30x12" },
]

export const ACHIEVEMENTS = [
  { id: "first_week", title: "Premiere semaine", desc: "7 jours de checklist complete", type: "streak", threshold: 7, color: "#c9956b" },
  { id: "minus_2kg", title: "-2 kg", desc: "Atteindre 84.4 kg", type: "weight", threshold: 84.4, color: "#6b8e5a" },
  { id: "streak_14", title: "2 semaines", desc: "14 jours sans junk", type: "nojunk", threshold: 14, color: "#8a9a5b" },
  { id: "milestone_84", title: "Jalon 84 kg", desc: "Premier jalon atteint", type: "weight", threshold: 84, color: "#c9956b" },
  { id: "minus_5kg", title: "-5 kg", desc: "Atteindre 81.4 kg", type: "weight", threshold: 81.4, color: "#d4644a" },
  { id: "milestone_80", title: "Jalon 80 kg", desc: "Les abdos du haut se dessinent", type: "weight", threshold: 80, color: "#3574a5" },
  { id: "streak_30", title: "1 mois clean", desc: "30 jours sans junk", type: "nojunk", threshold: 30, color: "#8a9a5b" },
  { id: "milestone_77", title: "Objectif final", desc: "77 kg — 12% BF", type: "weight", threshold: 77, color: "#d4af37" },
]
