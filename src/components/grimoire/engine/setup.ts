import { defaultAlignment, role } from "./roles";
import { addReminder, clone, log, uid } from "./state";
import type { Game, Player, Team } from "./types";

/** Official distribution: [townsfolk, outsiders, minions, demons]. */
const BASE: Record<number, [number, number, number, number]> = {
  5: [3, 0, 1, 1],
  6: [3, 1, 1, 1],
  7: [5, 0, 1, 1],
  8: [5, 1, 1, 1],
  9: [5, 2, 1, 1],
  10: [7, 0, 2, 1],
  11: [7, 1, 2, 1],
  12: [7, 2, 2, 1],
  13: [9, 0, 3, 1],
  14: [9, 1, 3, 1],
  15: [9, 2, 3, 1],
};

export function distribution(n: number) {
  const [townsfolk, outsider, minion, demon] = BASE[Math.max(5, Math.min(15, n))];
  return { townsfolk, outsider, minion, demon };
}

const shuffle = <T,>(xs: T[]): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const pick = <T,>(xs: T[]): T | undefined => xs[Math.floor(Math.random() * xs.length)];

export function byTeam(roles: string[], t: Team) {
  return roles.filter((id) => role(id).team === t);
}

/** Outsider-count changes caused by characters in the bag. Godfather's sign is given. */
export function outsiderModifier(bag: string[], godfatherSign: 1 | -1 = 1): { delta: number; notes: string[] } {
  let delta = 0;
  const notes: string[] = [];
  if (bag.includes("baron")) {
    delta += 2;
    notes.push("Baron: +2 Outsiders");
  }
  if (bag.includes("godfather")) {
    delta += godfatherSign;
    notes.push(`Godfather: ${godfatherSign > 0 ? "+1" : "−1"} Outsider`);
  }
  if (bag.includes("vigormortis")) {
    delta -= 1;
    notes.push("Vigormortis: −1 Outsider");
  }
  if (bag.includes("fanggu")) {
    delta += 1;
    notes.push("Fang Gu: +1 Outsider");
  }
  return { delta, notes };
}

export interface BagResult {
  bag: string[];
  notes: string[];
}

/** Build a random legal bag for n (non-traveller) players. */
export function randomBag(scriptRoles: string[], n: number): BagResult {
  for (let attempt = 0; attempt < 200; attempt++) {
    const d = distribution(n);
    const demons = shuffle(byTeam(scriptRoles, "demon")).slice(0, d.demon);
    const minions = shuffle(byTeam(scriptRoles, "minion")).slice(0, d.minion);
    let { delta, notes } = outsiderModifier([...demons, ...minions], Math.random() < 0.5 ? 1 : -1);
    let outsiders = Math.max(0, d.outsider + delta);
    let townsfolk = n - d.minion - d.demon - outsiders;
    if (townsfolk < 0) continue;
    const tf = shuffle(byTeam(scriptRoles, "townsfolk")).slice(0, townsfolk);
    if (tf.length < townsfolk) continue;
    const required: string[] = [];
    if (tf.includes("huntsman") && scriptRoles.includes("damsel")) {
      required.push("damsel");
      notes = [...notes, "Huntsman: the Damsel is in play"];
      if (outsiders === 0) {
        outsiders = 1;
        tf.pop();
        if (tf.includes("huntsman") === false) continue;
      }
    }
    const pool = shuffle(byTeam(scriptRoles, "outsider").filter((id) => !required.includes(id)));
    const out = [...required, ...pool].slice(0, outsiders);
    if (out.length < outsiders) continue;
    return { bag: shuffle([...tf, ...out, ...minions, ...demons]), notes };
  }
  throw new Error("Couldn't build a legal bag from this script for that many players.");
}

/** Check a hand-built bag against the distribution. Returns warnings. */
export function validateBag(bag: string[], n: number): string[] {
  const warn: string[] = [];
  if (bag.length !== n) warn.push(`${bag.length} characters for ${n} players.`);
  const d = distribution(n);
  const count = (t: Team) => bag.filter((id) => role(id).team === t).length;
  const { delta, notes } = outsiderModifier(bag, 1);
  const gf = bag.includes("godfather");
  const expectedOut = d.outsider + delta;
  let okOut = gf ? [expectedOut, d.outsider + delta - 2] : [expectedOut];
  // Huntsman [+the Damsel] may add one extra Outsider.
  if (bag.includes("huntsman") && bag.includes("damsel")) okOut = [...okOut, ...okOut.map((x) => Math.max(0, x) + 1)];
  if (count("demon") !== d.demon) warn.push(`Expected ${d.demon} Demon, have ${count("demon")}.`);
  if (count("minion") !== d.minion) warn.push(`Expected ${d.minion} Minion(s), have ${count("minion")}.`);
  if (!okOut.map((x) => Math.max(0, x)).includes(count("outsider")))
    warn.push(`Expected ${okOut.map((x) => Math.max(0, x)).join(" or ")} Outsider(s)${notes.length ? ` (${notes.join(", ")})` : ""}, have ${count("outsider")}.`);
  if (bag.includes("huntsman") && !bag.includes("damsel")) warn.push("Huntsman is in play but the Damsel isn't.");
  return warn;
}

/** Create players from a bag and seat order; fills in believed characters and setup reminders. */
export function seatPlayers(g: Game, names: string[], bag: string[], shuffleSeats: boolean): Game {
  const next = clone(g);
  const roles = shuffleSeats ? shuffle(bag) : [...bag];
  // The Marionette must neighbour the Demon.
  const demonAt = roles.findIndex((id) => role(id).team === "demon");
  const marAt = roles.indexOf("marionette");
  if (shuffleSeats && demonAt >= 0 && marAt >= 0) {
    const n = roles.length;
    const neighbours = [(demonAt + 1) % n, (demonAt - 1 + n) % n];
    if (!neighbours.includes(marAt)) {
      const to = pick(neighbours)!;
      [roles[marAt], roles[to]] = [roles[to], roles[marAt]];
    }
  }
  const players: Player[] = names.map((nm, i) => ({
    id: uid(),
    name: nm.trim() || `Player ${i + 1}`,
    role: roles[i],
    alignment: defaultAlignment(role(roles[i]).team),
    alive: true,
    ghostVote: true,
    reminders: [],
  }));
  next.players = players;
  assignBelieves(next);
  placeSetupReminders(next);
  next.bluffs = suggestBluffs(next);
  log(next, `Seated ${players.length} players.`);
  return next;
}

/** Give the Drunk / Marionette a not-in-play Townsfolk, and the Lunatic the Demon. */
export function assignBelieves(g: Game) {
  const used = new Set(g.players.map((p) => p.role));
  const taken = new Set<string>();
  const freeTownsfolk = () =>
    shuffle(byTeam(g.scriptRoles, "townsfolk").filter((id) => !used.has(id) && !taken.has(id)));
  const demon = g.players.find((p) => role(p.role).team === "demon")?.role ?? byTeam(g.scriptRoles, "demon")[0];
  for (const p of g.players) {
    if (p.role === "drunk" || p.role === "marionette") {
      const b = p.believes && !used.has(p.believes) ? p.believes : freeTownsfolk()[0];
      p.believes = b;
      if (b) taken.add(b);
    } else if (p.role === "lunatic") {
      p.believes = demon;
    } else delete p.believes;
  }
}

export function placeSetupReminders(g: Game) {
  for (const p of g.players) p.reminders = p.reminders.filter((r) => !["Red Herring"].includes(r.label) && !(r.role === "puzzlemaster" && r.label === "Drunk"));
  const ft = g.players.find((p) => (p.believes ?? p.role) === "fortuneteller");
  if (ft) {
    const good = g.players.filter((p) => p.alignment === "good" && role(p.role).team !== "traveller");
    const rh = pick(good);
    if (rh) addReminder(rh, "fortuneteller", "Red Herring", "never", 0);
  }
  const pm = g.players.find((p) => p.role === "puzzlemaster");
  if (pm) {
    const cands = g.players.filter((p) => p.id !== pm.id && p.alignment === "good");
    const d = pick(cands);
    if (d) addReminder(d, "puzzlemaster", "Drunk", "never", 0);
  }
}

/** Add or remove setup reminders after a character change, without re-rolling ones still valid. */
export function syncSetupReminders(g: Game): string[] {
  const notes: string[] = [];
  const holder = (label: string, roleId: string) => g.players.find((p) => p.reminders.some((r) => r.role === roleId && r.label === label));
  const drop = (label: string, roleId: string) => {
    for (const p of g.players) p.reminders = p.reminders.filter((r) => !(r.role === roleId && r.label === label));
  };
  const ftInPlay = g.players.some((p) => (p.believes ?? p.role) === "fortuneteller");
  const rh = holder("Red Herring", "fortuneteller");
  if (ftInPlay && !rh) {
    const pickRh = pick(g.players.filter((p) => p.alignment === "good" && role(p.role).team !== "traveller"));
    if (pickRh) {
      addReminder(pickRh, "fortuneteller", "Red Herring", "never", 0);
      notes.push(`Red Herring placed on ${pickRh.name}. Move it on the Grimoire if you'd rather.`);
    }
  } else if (!ftInPlay && rh) {
    drop("Red Herring", "fortuneteller");
    notes.push("No Fortune Teller in play: Red Herring removed.");
  }
  const pm = g.players.find((p) => p.role === "puzzlemaster");
  const pmDrunk = holder("Drunk", "puzzlemaster");
  if (pm && !pmDrunk) {
    const d = pick(g.players.filter((p) => p.id !== pm.id && p.alignment === "good"));
    if (d) {
      addReminder(d, "puzzlemaster", "Drunk", "never", 0);
      notes.push(`Puzzlemaster's drunk placed on ${d.name}.`);
    }
  } else if (!pm && pmDrunk) {
    drop("Drunk", "puzzlemaster");
    notes.push("No Puzzlemaster in play: its Drunk token removed.");
  }
  return notes;
}

/** Bluffs that clash with a character now in play (held or believed). */
export function bluffClashes(g: Game): string[] {
  const inPlay = new Set(g.players.flatMap((p) => [p.role, p.believes ?? ""]));
  return g.bluffs.filter((id) => inPlay.has(id));
}

/** Warnings about the Marionette's seat. */
export function marionetteWarnings(g: Game): string[] {
  const n = g.players.length;
  const mi = g.players.findIndex((p) => p.role === "marionette");
  if (mi < 0) return [];
  const neighbours = [g.players[(mi + 1) % n], g.players[(mi - 1 + n) % n]];
  return neighbours.some((p) => role(p.role).team === "demon") ? [] : ["The Marionette must sit next to the Demon: move a seat on the player sheet."];
}

/** Change a player's character after the deal, keeping setup-dependent state consistent. */
export function changeRole(g: Game, playerId: string, id: string): string[] {
  const p = g.players.find((q) => q.id === playerId);
  if (!p) return [];
  const prev = p.believes;
  p.role = id;
  if (role(id).team !== "traveller") p.alignment = defaultAlignment(role(id).team);
  delete p.believes;
  return afterCharacterChange(g, p, prev);
}

/** Change what a Drunk / Marionette / Lunatic thinks they are. */
export function changeBelieves(g: Game, playerId: string, id: string): string[] {
  const p = g.players.find((q) => q.id === playerId);
  if (!p) return [];
  const prev = p.believes;
  p.believes = id;
  return afterCharacterChange(g, p, prev);
}

const BELIEVERS = ["drunk", "marionette", "lunatic"];

function afterCharacterChange(g: Game, p: Player, prevBelieves: string | undefined): string[] {
  const notes: string[] = [];
  // Fill in anyone who needs a believed character and lacks one (a new Demon also updates the Lunatic).
  for (const q of g.players) {
    if (!BELIEVERS.includes(q.role)) continue;
    if (!q.believes || (q.role === "lunatic" && role(q.believes).team !== "demon")) assignBelievesFor(g, q);
    else if (q.role === "lunatic" && q.id !== p.id && role(p.role).team === "demon") q.believes = p.role;
  }
  if (p.believes && p.believes !== prevBelieves) notes.push(`${p.name} thinks they are the ${role(p.believes).name}.`);
  if (p.believes && g.players.some((q) => q.id !== p.id && q.role === p.believes)) notes.push(`Someone really is the ${role(p.believes).name} too.`);
  notes.push(...syncSetupReminders(g));
  notes.push(...marionetteWarnings(g));
  const clash = bluffClashes(g);
  if (clash.length) notes.push(`Bluff ${clash.map((id) => role(id).name).join(", ")} is now in play: pick another on the Grimoire.`);
  return notes;
}

function assignBelievesFor(g: Game, p: Player) {
  if (p.role === "lunatic") {
    p.believes = g.players.find((q) => role(q.role).team === "demon")?.role ?? byTeam(g.scriptRoles, "demon")[0];
    return;
  }
  const used = new Set(g.players.flatMap((q) => [q.role, q.believes ?? ""]));
  p.believes = shuffle(byTeam(g.scriptRoles, "townsfolk").filter((id) => !used.has(id) && !g.bluffs.includes(id)))[0] ?? shuffle(byTeam(g.scriptRoles, "townsfolk").filter((id) => !used.has(id)))[0];
}

export function suggestBluffs(g: Game): string[] {
  const inPlay = new Set(g.players.flatMap((p) => [p.role, p.believes ?? ""]));
  const tf = shuffle(byTeam(g.scriptRoles, "townsfolk").filter((id) => !inPlay.has(id)));
  const out = shuffle(byTeam(g.scriptRoles, "outsider").filter((id) => !inPlay.has(id) && id !== "drunk"));
  return [...tf.slice(0, 3), ...out].slice(0, 3);
}
