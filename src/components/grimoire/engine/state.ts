import { role } from "./roles";
import type { Expiry, Game, Player, Reminder } from "./types";

export const uid = () => Math.random().toString(36).slice(2, 9);

export function clone<T>(v: T): T {
  return structuredClone(v);
}

export function newGame(): Game {
  return {
    version: 1,
    scriptName: "",
    scriptRoles: [],
    players: [],
    bluffs: [],
    phase: "setup",
    night: 0,
    day: 0,
    done: [],
    choices: {},
    nominations: [],
    executedToday: null,
    diedToday: [],
    diedTonight: [],
    abnormal: 0,
    exorcisedDemon: false,
    pending: [],
    log: [],
    told: [],
    winner: null,
  };
}

export function phaseLabel(g: Game): string {
  if (g.phase === "setup") return "Setup";
  if (g.phase === "night") return g.night === 1 ? "First night" : `Night ${g.night}`;
  return `Day ${g.day}`;
}

export function log(g: Game, text: string) {
  g.log.push({ phase: phaseLabel(g), text });
}

export function player(g: Game, id: string | undefined): Player | undefined {
  return g.players.find((p) => p.id === id);
}

export function name(g: Game, id: string | undefined): string {
  return player(g, id)?.name ?? "?";
}

/** The character a player acts as (the Drunk acts as the Townsfolk they believe they are). */
export function actingRole(p: Player): string {
  return p.believes ?? p.role;
}

export function team(p: Player) {
  return role(p.role).team;
}

export function isTraveller(p: Player) {
  return team(p) === "traveller";
}

export function alive(g: Game): Player[] {
  return g.players.filter((p) => p.alive);
}

export function aliveNonTravellers(g: Game): Player[] {
  return g.players.filter((p) => p.alive && !isTraveller(p));
}

export function addReminder(p: Player, roleId: string, label: string, expires: Expiry, night?: number, auto = true): Reminder {
  const r: Reminder = { id: uid(), role: roleId, label, expires, auto, night };
  p.reminders.push(r);
  return r;
}

export function removeReminders(g: Game, pred: (r: Reminder, p: Player) => boolean) {
  for (const p of g.players) p.reminders = p.reminders.filter((r) => !pred(r, p));
}

export function hasReminder(p: Player, label: string, roleId?: string) {
  return p.reminders.some((r) => r.label === label && (!roleId || r.role === roleId));
}

/* ------------------------------------------------------------------ */
/* Seats                                                               */
/* ------------------------------------------------------------------ */

export function seatIndex(g: Game, id: string) {
  return g.players.findIndex((p) => p.id === id);
}

/** Walk the circle from a player in a direction, returning players in order (excluding start). */
export function walk(g: Game, id: string, dir: 1 | -1): Player[] {
  const n = g.players.length;
  const start = seatIndex(g, id);
  const out: Player[] = [];
  for (let k = 1; k < n; k++) out.push(g.players[(start + dir * k + n * n) % n]);
  return out;
}

/** Nearest alive neighbours (skipping dead players and, by convention, not skipping travellers). */
export function aliveNeighbours(g: Game, id: string): Player[] {
  const a = walk(g, id, -1).find((p) => p.alive);
  const b = walk(g, id, 1).find((p) => p.alive);
  const out: Player[] = [];
  if (a) out.push(a);
  if (b && b.id !== a?.id) out.push(b);
  return out;
}

/* ------------------------------------------------------------------ */
/* Health                                                              */
/* ------------------------------------------------------------------ */

/** Townsfolk poisoned by a healthy, living No Dashii. Derived, so it updates as players die/move. */
export function noDashiiVictims(g: Game): string[] {
  const out: string[] = [];
  for (const nd of g.players) {
    if (nd.role !== "nodashii" || !nd.alive) continue;
    if (nd.reminders.some((r) => r.label === "Poisoned" || r.label === "Drunk")) continue;
    for (const dir of [-1, 1] as const) {
      const t = walk(g, nd.id, dir).find((p) => team(p) === "townsfolk");
      if (t && !out.includes(t.id)) out.push(t.id);
    }
  }
  return out;
}

export function isDrunk(p: Player) {
  return p.role === "drunk" || p.reminders.some((r) => r.label === "Drunk");
}

export function isPoisoned(g: Game, p: Player) {
  return p.reminders.some((r) => r.label === "Poisoned") || noDashiiVictims(g).includes(p.id);
}

/** Reasons this player's ability will not work right now (empty = healthy & real). */
export function malfunction(g: Game, p: Player): string[] {
  const why: string[] = [];
  if (p.role === "drunk") why.push(`is the Drunk (thinks they are the ${role(p.believes).name})`);
  else if (p.reminders.some((r) => r.label === "Drunk")) why.push(`is drunk (${role(p.reminders.find((r) => r.label === "Drunk")!.role).name})`);
  if (p.role === "marionette") why.push(`is the Marionette (thinks they are the ${role(p.believes).name})`);
  if (p.role === "lunatic") why.push(`is the Lunatic (thinks they are the ${role(p.believes).name})`);
  if (p.reminders.some((r) => r.label === "Poisoned")) {
    const src = p.reminders.find((r) => r.label === "Poisoned")!.role;
    why.push(`is poisoned (${role(src).name})`);
  } else if (noDashiiVictims(g).includes(p.id)) why.push("is poisoned (No Dashii neighbour)");
  return why;
}

export function healthy(g: Game, p: Player) {
  return malfunction(g, p).length === 0;
}

/** Display-only reminder tokens derived from the game state. */
export function derivedReminders(g: Game, p: Player): Reminder[] {
  const out: Reminder[] = [];
  if (noDashiiVictims(g).includes(p.id)) out.push({ id: `nd-${p.id}`, role: "nodashii", label: "Poisoned", expires: "never", auto: true });
  if (p.role === "drunk") out.push({ id: `drunk-${p.id}`, role: "drunk", label: "Is the Drunk", expires: "never", auto: true });
  return out;
}

/* ------------------------------------------------------------------ */
/* Deaths & win conditions                                             */
/* ------------------------------------------------------------------ */

export type Cause = "demon" | "execution" | "ability" | "storyteller";

/** Can a demon kill land on this player right now? Returns the reason it fails, or null. */
export function demonKillBlocked(g: Game, target: Player): string | null {
  if (!target.alive) return `${target.name} is already dead`;
  if (target.reminders.some((r) => r.label === "Safe" && r.role === "monk")) return `${target.name} is protected by the Monk`;
  if (target.role === "soldier" && healthy(g, target)) return `${target.name} is the (healthy) Soldier`;
  return null;
}

export function kill(g: Game, id: string, cause: Cause, by?: string, opts: { noWin?: boolean } = {}): string[] {
  const p = player(g, id);
  const notes: string[] = [];
  if (!p || !p.alive) return notes;
  const aliveBefore = aliveNonTravellers(g).length;
  p.alive = false;
  p.death = { phase: g.phase === "night" ? "night" : "day", n: g.phase === "night" ? g.night : g.day, cause: by ?? cause };
  if (g.phase === "night") g.diedTonight.push(p.id);
  else g.diedToday.push(p.id);
  log(g, `${p.name} (${role(p.role).name}) died — ${by ?? cause}.`);

  const t = team(p);
  // Scarlet Woman catches the demon.
  if (t === "demon" && aliveBefore >= 5) {
    const sw = g.players.find((q) => q.role === "scarletwoman" && q.alive && healthy(g, q));
    if (sw) {
      sw.role = p.role;
      addReminder(sw, "scarletwoman", "Is The Demon", "never", g.night);
      log(g, `${sw.name} (Scarlet Woman) becomes the ${role(p.role).name}.`);
      notes.push(`Scarlet Woman ${sw.name} is now the ${role(p.role).name}. Wake them tonight to tell them.`);
      if (!g.pending.includes("scarletwoman")) g.pending.push("scarletwoman");
    }
  }
  // Grandmother dies if the demon kills the grandchild.
  if (cause === "demon" && p.reminders.some((r) => r.label === "Grandchild")) {
    const gm = g.players.find((q) => q.role === "grandmother" && q.alive);
    if (gm && healthy(g, gm)) {
      notes.push(`${gm.name} (Grandmother) dies too — their grandchild was killed by the Demon.`);
      notes.push(...kill(g, gm.id, "ability", "grandchild killed"));
    }
  }
  if (p.role === "sweetheart") {
    g.pending.push("sweetheart");
    notes.push("Sweetheart died: choose a player who becomes drunk from now on.");
  }
  if (p.role === "barber" && healthy(g, p)) {
    addReminder(p, "barber", "Haircuts Tonight", "dawn", g.night);
    notes.push("Barber died: tonight the Demon may swap 2 players' characters.");
  }
  if (cause === "execution" && p.role === "saint" && healthy(g, p)) {
    g.winner = "evil";
    log(g, "The Saint was executed — evil wins.");
  }
  if (cause === "execution" && p.role === "boomdandy" && healthy(g, p)) {
    g.pending.push("boomdandy");
    notes.push("Boomdandy executed: all but 3 players die. Count down from 10, players point; the majority-pointed player dies.");
  }
  // Pixie gains the ability of the Townsfolk they are mad about.
  if (t === "townsfolk") {
    for (const px of g.players) {
      if (px.role === "pixie" && px.reminders.some((r) => r.label === "Mad" && r.about === p.role) && !hasReminder(px, "Has Ability")) {
        addReminder(px, "pixie", "Has Ability", "never", g.night);
        notes.push(`${px.name} (Pixie) may now have the ${role(p.role).name} ability (if they were mad about it).`);
      }
    }
  }
  if (!opts.noWin) checkWin(g);
  return notes;
}

export function checkWin(g: Game) {
  if (g.winner) return;
  const living = aliveNonTravellers(g);
  const demons = living.filter((p) => team(p) === "demon");
  if (g.players.length && demons.length === 0) {
    g.winner = "good";
    log(g, "No Demon remains — good wins.");
  } else if (living.length <= 2 && demons.length > 0) {
    g.winner = "evil";
    log(g, "Only two players remain — evil wins.");
  }
}

/* ------------------------------------------------------------------ */
/* Phases                                                              */
/* ------------------------------------------------------------------ */

export function startNight(g: Game) {
  g.phase = "night";
  g.night += 1;
  g.done = [];
  g.choices = {};
  g.diedTonight = [];
  g.exorcisedDemon = false;
  removeReminders(g, (r) => r.expires === "dusk");
  log(g, "Night falls.");
}

export function startDay(g: Game) {
  g.phase = "day";
  g.day = g.night;
  removeReminders(g, (r) => r.expires === "dawn");
  g.nominations = [];
  g.executedToday = null;
  g.diedToday = [];
  g.abnormal = 0;
  log(g, "Dawn.");
}

/* ------------------------------------------------------------------ */
/* Day actions                                                         */
/* ------------------------------------------------------------------ */

export function execute(g: Game, id: string): string[] {
  const p = player(g, id);
  if (!p) return [];
  g.executedToday = id;
  const notes: string[] = [];
  addReminder(p, "undertaker", "Died Today", "dawn", g.night);
  // Cannibal eats the executed player.
  const cannibal = g.players.find((q) => q.role === "cannibal" && q.alive);
  if (cannibal && p.alive) {
    cannibal.reminders = cannibal.reminders.filter((r) => r.role !== "cannibal");
    if (p.alignment === "good") {
      addReminder(cannibal, "cannibal", `Lunch: ${role(p.role).name}`, "never", g.night);
      notes.push(`${cannibal.name} (Cannibal) gains the ${role(p.role).name} ability.`);
    } else {
      addReminder(cannibal, "cannibal", "Poisoned", "never", g.night);
      notes.push(`${cannibal.name} (Cannibal) ate an evil player and is poisoned until a good player is executed.`);
    }
  }
  if (p.alive) notes.push(...kill(g, id, "execution"));
  else log(g, `${p.name} was executed (already dead).`);
  return notes;
}

/** Virgin check when a nomination is made. Returns notes; may execute the nominator. */
export function nominate(g: Game, nominator: string, nominee: string): string[] {
  const notes: string[] = [];
  g.nominations.push({ nominator, nominee, voters: [] });
  log(g, `${name(g, nominator)} nominated ${name(g, nominee)}.`);
  const v = player(g, nominee);
  const n = player(g, nominator);
  if (v && n && v.role === "virgin" && !hasReminder(v, "No Ability")) {
    addReminder(v, "virgin", "No Ability", "never", g.night);
    if (healthy(g, v)) {
      const registersTownsfolk = team(n) === "townsfolk";
      if (registersTownsfolk) {
        notes.push(`${n.name} is a Townsfolk and nominated the Virgin — ${n.name} is executed immediately. Day ends.`);
        notes.push(...execute(g, n.id));
      } else {
        notes.push(`${n.name} is not a Townsfolk (${role(n.role).name}${n.role === "spy" ? " — the Spy may register as a Townsfolk" : ""}). Nothing happens.`);
      }
    } else notes.push("The Virgin is drunk or poisoned — nothing happens, but the ability is used up.");
  }
  return notes;
}

export function slay(g: Game, slayerId: string, targetId: string, recluseCounts = false): string[] {
  const s = player(g, slayerId);
  const t = player(g, targetId);
  if (!s || !t) return [];
  const notes: string[] = [];
  const real = s.role === "slayer" && !hasReminder(s, "No Ability");
  if (s.role === "slayer") addReminder(s, "slayer", "No Ability", "never", g.night);
  log(g, `${s.name} claims Slayer and shoots ${t.name}.`);
  const hit = team(t) === "demon" || (recluseCounts && t.role === "recluse");
  if (real && healthy(g, s) && hit) {
    notes.push(`${t.name} dies!`);
    notes.push(...kill(g, t.id, "ability", "Slayer"));
  } else {
    notes.push("Nothing happens.");
    if (s.role === "slayer" && !healthy(g, s)) g.abnormal += 1;
  }
  return notes;
}
