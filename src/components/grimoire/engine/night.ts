import { cleanNightText, NIGHT_ORDER, role, TEAM_LABEL } from "./roles";
import {
  addReminder,
  uid,
  aliveNeighbours,
  aliveNonTravellers,
  checkWin,
  clone,
  demonKillBlocked,
  hasReminder,
  healthy,
  kill,
  log,
  malfunction,
  name,
  player,
  startDay,
  team,
} from "./state";
import type { Game, Player, StepChoice, Team, ToldEntry } from "./types";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface Step {
  key: string;
  kind: "dusk" | "dawn" | "minioninfo" | "demoninfo" | "role";
  roleId?: string;
  playerId?: string;
}

export interface PickSpec {
  count: number;
  label: string;
  optional?: boolean;
  allowSelf?: boolean;
  /** Restrict who can be picked. */
  filter?: (p: Player) => boolean;
}

export interface RolePickSpec {
  count: number;
  label: string;
  from: string[];
}

export interface Line {
  label: string;
  value: string;
  tone?: "good" | "evil" | "warn" | "muted";
}

export interface ShowCard {
  heading: string;
  roles?: string[];
  players?: string[];
  big?: string;
  text?: string;
}

/** Info a step gives: the true card, a suggested false one, and which parts the Storyteller may edit. */
export interface InfoSpec {
  truth: ShowCard;
  fake?: ShowCard;
  edit: { big?: "number" | "yesno"; players?: number; roles?: number; roleFrom?: string[]; heading?: string };
}

export interface StepView {
  title: string;
  skip?: string;
  official?: string;
  instructions: string[];
  pick?: PickSpec;
  rolePick?: RolePickSpec;
  options?: { id: string; label: string }[];
  lines: Line[];
  caveats: string[];
  show?: ShowCard;
  /** Show a "view grimoire" shortcut (Spy, Widow...). */
  grimoire?: boolean;
  info?: InfoSpec;
  /** The Storyteller still has to choose what to tell. */
  needsAnswer?: boolean;
}

interface Ctx {
  g: Game;
  step: Step;
  p?: Player;
  c: StepChoice;
  /** Why the acting player's ability doesn't work (empty = it works). */
  mal: string[];
  first: boolean;
}

interface Handler {
  allowDead?: boolean;
  view?: (x: Ctx, v: StepView) => void;
  apply?: (x: Ctx) => string[];
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Stable pseudo-random pick so suggestions don't jump around between renders. */
function stablePick<T>(xs: T[], seed: string): T | undefined {
  if (!xs.length) return undefined;
  return xs[hash(seed) % xs.length];
}

function seed(x: Ctx, salt = "") {
  return `${x.step.key}|${x.g.night}|${x.c.option ?? ""}|${salt}`;
}

const isTeam = (p: Player, t: Team) => team(p) === t;
const evilWord = (n: number) => String(n);

function others(x: Ctx) {
  return x.g.players.filter((p) => p.id !== x.p?.id);
}

function misregisterCaveats(g: Game, ids?: string[]): string[] {
  const out: string[] = [];
  const pool = ids ? g.players.filter((p) => ids.includes(p.id)) : g.players;
  for (const p of pool) {
    if (p.role === "recluse" && p.alive) out.push(`${p.name} is the Recluse — may register as evil / a Minion / a Demon.`);
    if (p.role === "spy" && p.alive) out.push(`${p.name} is the Spy — may register as good / a Townsfolk / an Outsider.`);
  }
  return out;
}

function notInPlay(g: Game, t: Team) {
  const used = new Set(g.players.flatMap((p) => [p.role, p.believes ?? ""]));
  return g.scriptRoles.filter((id) => role(id).team === t && !used.has(id));
}

function yesNo(b: boolean) {
  return b ? "YES" : "NO";
}

function numberInfo(heading: string, truth: number, fake: number): InfoSpec {
  return { truth: { heading, big: String(truth) }, fake: { heading, big: String(Math.max(0, fake)) }, edit: { big: "number" } };
}

function yesNoInfo(heading: string, truth: boolean, players?: string[]): InfoSpec {
  return { truth: { heading, big: yesNo(truth), players }, fake: { heading, big: yesNo(!truth), players }, edit: { big: "yesno" } };
}

function roleInfo(g: Game, heading: string, truth: string, fake: string | undefined): InfoSpec {
  return {
    truth: { heading, roles: [truth] },
    fake: fake ? { heading, roles: [fake] } : undefined,
    edit: { roles: 1, roleFrom: g.scriptRoles.filter((id) => role(id).team !== "traveller") },
  };
}

/** The card for the Storyteller's choice, or undefined if they haven't chosen yet. */
export function toldCard(info: InfoSpec, c: StepChoice, malfunctioning: boolean): ShowCard | undefined {
  const mode = c.told ?? (malfunctioning ? undefined : "true");
  if (mode === "true") return info.truth;
  if (mode === "fake") return info.fake ?? info.truth;
  if (mode === "custom") {
    const cu = c.custom ?? {};
    return {
      heading: info.edit.heading ?? info.truth.heading,
      big: info.edit.big ? cu.big : undefined,
      players: info.edit.players ? cu.players : info.truth.players,
      roles: info.edit.roles ? cu.roles : info.truth.roles,
      text: info.truth.text,
    };
  }
  return undefined;
}

/** Starting point for a custom answer: whatever the card would otherwise say. */
export function customFrom(info: InfoSpec, c: StepChoice): NonNullable<StepChoice["custom"]> {
  const base = (c.told === "fake" && info.fake) || info.truth;
  return {
    big: info.edit.big ? base.big ?? (info.edit.big === "yesno" ? "YES" : "0") : undefined,
    players: info.edit.players ? (base.players ?? []).slice(0, info.edit.players) : undefined,
    roles: info.edit.roles ? (base.roles ?? []).slice(0, info.edit.roles) : undefined,
  };
}

export function describeCard(g: Game, card: ShowCard): string {
  const parts = [
    card.players?.length ? card.players.map((id) => name(g, id)).join(" / ") : "",
    card.roles?.length ? card.roles.map((id) => role(id).name).join(" / ") : "",
    card.big ?? "",
    card.text ?? "",
  ].filter(Boolean);
  return `${card.heading}${parts.length ? ` — ${parts.join(" · ")}` : ""}`;
}

const sameCard = (a: ShowCard, b: ShowCard) =>
  (a.big ?? "") === (b.big ?? "") && (a.players ?? []).join() === (b.players ?? []).join() && [...(a.roles ?? [])].sort().join() === [...(b.roles ?? [])].sort().join();

/* ------------------------------------------------------------------ */
/* Handlers                                                            */
/* ------------------------------------------------------------------ */

function pairInfo(t: Team): Handler {
  return {
    view(x, v) {
      const g = x.g;
      const cands = others(x).filter((p) => isTeam(p, t));
      const truth = stablePick(cands, seed(x, "t"));
      let truthCard: ShowCard;
      if (!truth) {
        v.lines.push({ label: "True info", value: `No ${TEAM_LABEL[t]}s in play — show 0`, tone: "good" });
        truthCard = { heading: `There are no ${TEAM_LABEL[t]}s in play`, big: "0" };
      } else {
        const decoy = stablePick(others(x).filter((p) => p.id !== truth.id), seed(x, "d"))!;
        const pair = hash(seed(x, "o")) % 2 ? [truth, decoy] : [decoy, truth];
        v.lines.push({ label: "True info", value: `${role(truth.role).name}: ${pair.map((p) => p.name).join(" or ")}`, tone: "good" });
        v.lines.push({ label: "Real one", value: `${truth.name} (decoy: ${decoy.name})`, tone: "muted" });
        truthCard = { heading: "One of these players is the", roles: [truth.role], players: pair.map((p) => p.id) };
      }
      const fakeRole = stablePick(notInPlay(g, t).length ? notInPlay(g, t) : g.scriptRoles.filter((id) => role(id).team === t), seed(x, "fr"));
      const a = stablePick(others(x), seed(x, "fa"))!;
      const b = stablePick(others(x).filter((p) => p.id !== a.id), seed(x, "fb"))!;
      if (x.mal.length) v.lines.push({ label: "Suggested (false)", value: `${role(fakeRole).name}: ${a.name} or ${b.name}`, tone: "warn" });
      v.info = {
        truth: truthCard,
        fake: { heading: "One of these players is the", roles: fakeRole ? [fakeRole] : [], players: [a.id, b.id] },
        edit: { players: 2, roles: 1, roleFrom: g.scriptRoles.filter((id) => role(id).team === t), heading: "One of these players is the" },
      };
      v.caveats.push(...misregisterCaveats(g));
      if (t === "outsider" && g.players.some((p) => p.role === "drunk")) v.caveats.push("Remember the Drunk is an Outsider (show the Drunk token).");
      v.options = [{ id: String((Number(x.c.option) || 0) + 1), label: "Suggest a different pair" }];
    },
  };
}

function killHandler(opts: { starpass?: boolean } = {}): Handler {
  return {
    view(x, v) {
      if (x.g.exorcisedDemon) {
        v.skip = "The Exorcist chose the Demon — the Demon doesn't wake tonight.";
        return;
      }
      if (x.p && becameDemonTonight(x.g, x.p)) {
        v.skip = `${x.p.name} became the Demon tonight, so they don't choose again.`;
        return;
      }
      v.pick = { count: 1, label: "Demon's target", allowSelf: !!opts.starpass };
      const t = player(x.g, x.c.targets[0]);
      if (t) {
        if (opts.starpass && t.id === x.p?.id && !x.mal.length) {
          const minions = x.g.players.filter((p) => p.alive && isTeam(p, "minion"));
          v.lines.push({ label: "Star-pass", value: `${x.p!.name} dies and a Minion becomes the ${role(x.p!.role).name}.`, tone: "evil" });
          const sw = minions.find((m) => m.role === "scarletwoman" && healthy(x.g, m));
          if (sw && aliveNonTravellers(x.g).length >= 5) v.lines.push({ label: "Scarlet Woman", value: `${sw.name} catches it automatically.`, tone: "muted" });
          else v.options = minions.map((m) => ({ id: `heir:${m.id}`, label: `${m.name} becomes the Demon` }));
        } else {
          const blocked = x.mal.length ? `the Demon ${x.mal.join(", ")}` : demonKillBlocked(x.g, t);
          v.lines.push(blocked ? { label: "Result", value: `No death — ${blocked}`, tone: "good" } : { label: "Result", value: `${t.name} dies`, tone: "evil" });
          if (t.role === "mayor") v.caveats.push("Target is the Mayor: you may pick a different player to die instead.");
        }
        v.options = [...(v.options ?? []), { id: "nokill", label: "Nobody dies (Storyteller choice)" }];
      }
      v.instructions.push("Put the Demon to sleep. Deaths are announced at dawn.");
    },
    apply(x) {
      if (x.g.exorcisedDemon) return [];
      const t = player(x.g, x.c.targets[0]);
      if (!t || x.c.option === "nokill") return t ? [`${t.name} survives (Storyteller choice).`] : [];
      if (opts.starpass && t.id === x.p?.id && !x.mal.length) {
        const notes = kill(x.g, t.id, "demon", "star-pass", { noWin: true });
        const demonAlive = x.g.players.some((p) => p.alive && isTeam(p, "demon"));
        if (!demonAlive) {
          const heirId = x.c.option?.startsWith("heir:") ? x.c.option.slice(5) : x.g.players.find((p) => p.alive && isTeam(p, "minion"))?.id;
          const heir = player(x.g, heirId);
          if (heir) {
            heir.role = t.role;
            addReminder(heir, t.role, "Is The Demon", "never", x.g.night);
            notes.push(`${heir.name} is now the ${role(t.role).name}. Wake them and show YOU ARE + the ${role(t.role).name} token.`);
            log(x.g, `${heir.name} became the ${role(t.role).name} (star-pass).`);
          }
        }
        checkWin(x.g);
        return notes;
      }
      if (x.mal.length) return [`No death — the Demon ${x.mal.join(", ")}.`];
      const blocked = demonKillBlocked(x.g, t);
      if (blocked) {
        log(x.g, `Demon chose ${t.name}: ${blocked}.`);
        return [`No death — ${blocked}.`];
      }
      return kill(x.g, t.id, "demon", role(x.step.roleId).name);
    },
  };
}

const H: Record<string, Handler> = {
  washerwoman: pairInfo("townsfolk"),
  librarian: pairInfo("outsider"),
  investigator: pairInfo("minion"),

  chef: {
    view(x, v) {
      // Travellers are seated players too: an evil Traveller can complete a pair, and a good one breaks it.
      const ps = x.g.players;
      let pairs = 0;
      for (let i = 0; i < ps.length; i++) {
        const a = ps[i], b = ps[(i + 1) % ps.length];
        if (ps.length > 1 && a.alignment === "evil" && b.alignment === "evil") pairs++;
      }
      const fake = pairs === 0 ? 1 : pairs - 1;
      v.lines.push({ label: "True pairs", value: String(pairs), tone: "good" });
      if (x.mal.length) v.lines.push({ label: "Suggested (false)", value: String(fake), tone: "warn" });
      v.caveats.push(...misregisterCaveats(x.g));
      v.info = numberInfo("Pairs of evil players", pairs, fake);
    },
  },

  empath: {
    view(x, v) {
      const ns = aliveNeighbours(x.g, x.p!.id);
      const evil = ns.filter((p) => p.alignment === "evil").length;
      const fake = evil === 0 ? 1 : 0;
      v.lines.push({ label: "Alive neighbours", value: ns.map((p) => p.name).join(" & ") || "—", tone: "muted" });
      v.lines.push({ label: "True count", value: evilWord(evil), tone: "good" });
      if (x.mal.length) v.lines.push({ label: "Suggested (false)", value: String(fake), tone: "warn" });
      v.caveats.push(...misregisterCaveats(x.g, ns.map((p) => p.id)));
      v.info = numberInfo("Evil alive neighbours", evil, fake);
    },
  },

  fortuneteller: {
    view(x, v) {
      v.pick = { count: 2, label: "Fortune Teller's 2 choices", allowSelf: true };
      const ts = x.c.targets.map((id) => player(x.g, id)!).filter(Boolean);
      const rh = x.g.players.find((p) => hasReminder(p, "Red Herring"));
      if (rh) v.lines.push({ label: "Red herring", value: rh.name, tone: "muted" });
      if (ts.length === 2) {
        const yes = ts.some((p) => isTeam(p, "demon") || hasReminder(p, "Red Herring"));
        v.lines.push({ label: "True answer", value: yesNo(yes), tone: "good" });
        if (x.mal.length) v.lines.push({ label: "Suggested (false)", value: yesNo(!yes), tone: "warn" });
        v.caveats.push(...misregisterCaveats(x.g, ts.map((p) => p.id)).filter((c) => c.includes("Recluse")));
        v.info = yesNoInfo("Is one of them the Demon?", yes, ts.map((p) => p.id));
      }
    },
  },

  undertaker: {
    view(x, v) {
      const ex = player(x.g, x.g.executedToday ?? undefined);
      if (!ex) {
        v.skip = "Nobody was executed today (use Execute on the Day tab).";
        return;
      }
      const fake = stablePick(x.g.scriptRoles.filter((id) => id !== ex.role && !["traveller"].includes(role(id).team)), seed(x));
      v.lines.push({ label: "Executed", value: `${ex.name} — ${role(ex.role).name}`, tone: "good" });
      if (x.mal.length && fake) v.lines.push({ label: "Suggested (false)", value: role(fake).name, tone: "warn" });
      v.caveats.push(...misregisterCaveats(x.g, [ex.id]));
      v.info = roleInfo(x.g, `${ex.name} was the`, ex.role, fake);
    },
  },

  monk: {
    view(x, v) {
      v.pick = { count: 1, label: "Monk protects" };
      if (x.mal.length) v.caveats.push("The Monk's protection won't work tonight — no Safe token will be placed.");
    },
    apply(x) {
      const t = player(x.g, x.c.targets[0]);
      if (t && !x.mal.length) addReminder(t, "monk", "Safe", "dawn", x.g.night);
      return t ? [`${t.name} ${x.mal.length ? "is NOT protected (Monk malfunctioning)" : "is safe from the Demon tonight"}.`] : [];
    },
  },

  ravenkeeper: {
    allowDead: true,
    view(x, v) {
      if (!x.g.diedTonight.includes(x.p!.id)) {
        v.skip = "The Ravenkeeper didn't die tonight.";
        return;
      }
      v.pick = { count: 1, label: "Ravenkeeper chooses", allowSelf: true };
      const t = player(x.g, x.c.targets[0]);
      if (t) {
        const fake = stablePick(x.g.scriptRoles.filter((id) => id !== t.role), seed(x));
        v.lines.push({ label: "True", value: `${t.name} is the ${role(t.role).name}`, tone: "good" });
        if (x.mal.length && fake) v.lines.push({ label: "Suggested (false)", value: role(fake).name, tone: "warn" });
        v.caveats.push(...misregisterCaveats(x.g, [t.id]));
        v.info = roleInfo(x.g, `${t.name} is the`, t.role, fake);
      }
    },
  },

  butler: {
    view(x, v) {
      v.pick = { count: 1, label: "Butler's master" };
    },
    apply(x) {
      const t = player(x.g, x.c.targets[0]);
      if (t) addReminder(t, "butler", "Master", "dusk", x.g.night);
      return [];
    },
  },

  poisoner: {
    view(x, v) {
      v.pick = { count: 1, label: "Poisoner's target", allowSelf: true };
      if (x.mal.length) v.caveats.push("The Poisoner is malfunctioning — the poison won't take effect.");
    },
    apply(x) {
      const t = player(x.g, x.c.targets[0]);
      if (t && !x.mal.length) addReminder(t, "poisoner", "Poisoned", "dusk", x.g.night);
      return t ? [`${t.name} ${x.mal.length ? "is not" : "is"} poisoned until dusk tomorrow.`] : [];
    },
  },

  spy: {
    view(_x, v) {
      v.grimoire = true;
    },
  },

  scarletwoman: {
    view(x, v) {
      if (!x.g.pending.includes("scarletwoman")) {
        v.skip = "The Scarlet Woman didn't become the Demon today.";
        return;
      }
      v.show = { heading: "You are", roles: [x.p!.role] };
      v.lines.push({ label: "New Demon", value: `${x.p!.name} is now the ${role(x.p!.role).name}`, tone: "evil" });
    },
    apply(x) {
      x.g.pending = x.g.pending.filter((s) => s !== "scarletwoman");
      return [];
    },
  },

  imp: killHandler({ starpass: true }),
  nodashii: killHandler(),

  pukka: {
    view(x, v) {
      const prev = x.g.players.find((p) => p.reminders.some((r) => r.role === "pukka" && r.label === "Poisoned" && (r.night ?? 0) < x.g.night));
      if (prev) {
        const blocked = demonKillBlocked(x.g, prev);
        v.lines.push(blocked ? { label: "Previous victim", value: `${prev.name} survives — ${blocked}`, tone: "good" } : { label: "Previous victim", value: `${prev.name} dies, then becomes healthy`, tone: "evil" });
      }
      if (x.g.exorcisedDemon) {
        v.caveats.push("Exorcised: the Pukka doesn't wake to choose tonight.");
        return;
      }
      v.pick = { count: 1, label: "Pukka poisons", allowSelf: true };
      if (x.mal.length) v.caveats.push("The Pukka is malfunctioning — no new poison takes effect.");
    },
    apply(x) {
      const notes: string[] = [];
      const prev = x.g.players.find((p) => p.reminders.some((r) => r.role === "pukka" && r.label === "Poisoned" && (r.night ?? 0) < x.g.night));
      if (prev) {
        prev.reminders = prev.reminders.filter((r) => r.role !== "pukka");
        const blocked = demonKillBlocked(x.g, prev);
        if (!blocked) notes.push(...kill(x.g, prev.id, "demon", "Pukka"));
        else notes.push(`${prev.name} survives — ${blocked}.`);
      }
      const t = player(x.g, x.c.targets[0]);
      if (t && !x.g.exorcisedDemon && !x.mal.length) {
        addReminder(t, "pukka", "Poisoned", "never", x.g.night);
        notes.push(`${t.name} is poisoned by the Pukka (dies tomorrow night).`);
      }
      return notes;
    },
  },

  godfather: {
    view(x, v) {
      if (x.first) {
        const outs = x.g.players.filter((p) => isTeam(p, "outsider"));
        v.lines.push({ label: "Outsiders in play", value: outs.map((p) => role(p.role).name).join(", ") || "None", tone: "good" });
        v.show = { heading: "These Outsiders are in play", roles: outs.map((p) => p.role), text: outs.length ? undefined : "None" };
        return;
      }
      const died = x.g.diedToday.map((id) => player(x.g, id)!).filter((p) => p && isTeam(p, "outsider"));
      if (!died.length) {
        v.skip = "No Outsider died today.";
        return;
      }
      v.lines.push({ label: "Outsider died today", value: died.map((p) => p.name).join(", "), tone: "muted" });
      v.pick = { count: 1, label: "Godfather kills", allowSelf: true };
    },
    apply(x) {
      if (x.first) return [];
      const t = player(x.g, x.c.targets[0]);
      if (!t || x.mal.length) return t ? ["No death — the Godfather is malfunctioning."] : [];
      return kill(x.g, t.id, "ability", "Godfather");
    },
  },

  assassin: {
    view(x, v) {
      if (hasReminder(x.p!, "No Ability")) {
        v.skip = "The Assassin has used their ability.";
        return;
      }
      v.pick = { count: 1, label: "Assassin's target (optional)", optional: true, allowSelf: true };
      v.caveats.push("The Assassin's kill ignores protection (Monk, Soldier...).");
    },
    apply(x) {
      const t = player(x.g, x.c.targets[0]);
      if (!t) return [];
      addReminder(x.p!, "assassin", "No Ability", "never", x.g.night);
      if (x.mal.length) return ["No death — the Assassin is malfunctioning (ability used)."];
      return kill(x.g, t.id, "ability", "Assassin");
    },
  },

  exorcist: {
    view(x, v) {
      v.pick = { count: 1, label: "Exorcist chooses (not last night's player)" };
      const t = player(x.g, x.c.targets[0]);
      if (t && isTeam(t, "demon")) {
        v.lines.push(x.mal.length ? { label: "Result", value: "Exorcist malfunctioning — the Demon wakes as normal", tone: "warn" } : { label: "Result", value: `Demon chosen! Wake ${t.name}, show THIS CHARACTER SELECTED YOU + Exorcist, point to ${x.p!.name}. The Demon doesn't act tonight.`, tone: "good" });
      } else if (t) v.lines.push({ label: "Result", value: "Not the Demon — nothing happens", tone: "muted" });
    },
    apply(x) {
      const t = player(x.g, x.c.targets[0]);
      if (!t) return [];
      addReminder(t, "exorcist", "Chosen", "dusk", x.g.night);
      if (isTeam(t, "demon") && !x.mal.length) {
        x.g.exorcisedDemon = true;
        return [`${t.name} (Demon) is exorcised and won't wake tonight.`];
      }
      return [];
    },
  },

  grandmother: {
    view(x, v) {
      if (!x.first) {
        v.skip = "Handled automatically: if the Demon kills the grandchild, the Grandmother dies too.";
        return;
      }
      v.pick = { count: 1, label: "Grandchild (a good player)", filter: (p) => p.alignment === "good" };
      const t = player(x.g, x.c.targets[0]) ?? stablePick(others(x).filter((p) => p.alignment === "good"), seed(x));
      if (t) {
        if (!x.c.targets[0]) v.lines.push({ label: "Suggested", value: `${t.name} (${role(t.role).name})`, tone: "muted" });
        v.show = { heading: "Your grandchild is", players: [t.id], roles: [t.role] };
      }
    },
    apply(x) {
      const t = player(x.g, x.c.targets[0]) ?? stablePick(others(x).filter((p) => p.alignment === "good"), seed(x));
      if (t) addReminder(t, "grandmother", "Grandchild", "never", x.g.night);
      return [];
    },
  },

  clockmaker: {
    view(x, v) {
      const ps = x.g.players;
      const n = ps.length;
      const demons = ps.map((p, i) => [p, i] as const).filter(([p]) => isTeam(p, "demon"));
      const minions = ps.map((p, i) => [p, i] as const).filter(([p]) => isTeam(p, "minion"));
      let best = Infinity;
      for (const [, i] of demons) for (const [, j] of minions) best = Math.min(best, Math.min(Math.abs(i - j), n - Math.abs(i - j)));
      const truth = Number.isFinite(best) ? best : 0;
      const fake = truth === 1 ? 2 : truth - 1;
      v.lines.push({ label: "Steps Demon → nearest Minion", value: String(truth), tone: "good" });
      if (x.mal.length) v.lines.push({ label: "Suggested (false)", value: String(fake), tone: "warn" });
      v.caveats.push(...misregisterCaveats(x.g));
      v.info = numberInfo("Steps from the Demon to its nearest Minion", truth, fake);
    },
  },

  dreamer: {
    view(x, v) {
      v.pick = { count: 1, label: "Dreamer chooses" };
      const t = player(x.g, x.c.targets[0]);
      if (!t) return;
      const goodT = t.alignment === "good";
      const opp = x.g.scriptRoles.filter((id) => {
        const tm = role(id).team;
        return goodT ? tm === "minion" || tm === "demon" : tm === "townsfolk" || tm === "outsider";
      });
      const decoy = stablePick(opp.filter((id) => !x.g.players.some((p) => p.role === id)).length ? opp.filter((id) => !x.g.players.some((p) => p.role === id)) : opp, seed(x));
      const sameSide = x.g.scriptRoles.filter((id) => id !== t.role && (["townsfolk", "outsider"].includes(role(id).team) === goodT));
      const flip = hash(seed(x, "o")) % 2 === 1;
      const order = (xs: string[]) => (flip ? xs.filter(Boolean).reverse() : xs.filter(Boolean));
      const truePair = order([t.role, decoy ?? ""]);
      const fakePair = order([stablePick(sameSide, seed(x, "f")) ?? "", decoy ?? ""]);
      v.lines.push({ label: "True character", value: `${t.name} is the ${role(t.role).name}`, tone: "good" });
      v.lines.push({ label: "True info", value: truePair.map((id) => role(id).name).join(" + "), tone: "good" });
      if (x.mal.length) v.lines.push({ label: "Suggested (false)", value: fakePair.map((id) => role(id).name).join(" + "), tone: "warn" });
      v.caveats.push(...misregisterCaveats(x.g, [t.id]));
      v.info = {
        truth: { heading: `${t.name} is one of these`, roles: truePair },
        fake: { heading: `${t.name} is one of these`, roles: fakePair },
        edit: { roles: 2, roleFrom: x.g.scriptRoles },
      };
      v.options = [{ id: String((Number(x.c.option) || 0) + 1), label: "Suggest a different decoy" }];
    },
  },

  seamstress: {
    view(x, v) {
      if (hasReminder(x.p!, "No Ability")) {
        v.skip = "The Seamstress has used their ability.";
        return;
      }
      v.pick = { count: 2, label: "Seamstress's 2 players (optional)", optional: true };
      const ts = x.c.targets.map((id) => player(x.g, id)!).filter(Boolean);
      if (ts.length === 2) {
        const same = ts[0].alignment === ts[1].alignment;
        v.lines.push({ label: "Same alignment?", value: yesNo(same), tone: "good" });
        if (x.mal.length) v.lines.push({ label: "Suggested (false)", value: yesNo(!same), tone: "warn" });
        v.caveats.push(...misregisterCaveats(x.g, ts.map((p) => p.id)));
        v.info = yesNoInfo("Same alignment?", same, ts.map((p) => p.id));
      }
    },
    apply(x) {
      if (x.c.targets.length === 2) addReminder(x.p!, "seamstress", "No Ability", "never", x.g.night);
      return [];
    },
  },

  flowergirl: {
    view(x, v) {
      const demons = x.g.players.filter((p) => isTeam(p, "demon")).map((p) => p.id);
      const voted = x.g.nominations.some((nm) => nm.voters.some((id) => demons.includes(id)));
      v.lines.push({ label: "Did the Demon vote today?", value: yesNo(voted), tone: "good" });
      if (x.mal.length) v.lines.push({ label: "Suggested (false)", value: yesNo(!voted), tone: "warn" });
      v.caveats.push("Based on the votes you recorded on the Day screen.");
      v.info = yesNoInfo("Did the Demon vote today?", voted);
    },
  },

  oracle: {
    view(x, v) {
      const n = x.g.players.filter((p) => !p.alive && p.alignment === "evil").length;
      v.lines.push({ label: "Dead evil players", value: String(n), tone: "good" });
      if (x.mal.length) v.lines.push({ label: "Suggested (false)", value: String(n + 1), tone: "warn" });
      v.caveats.push(...misregisterCaveats(x.g, x.g.players.filter((p) => !p.alive).map((p) => p.id)));
      v.info = numberInfo("Dead evil players", n, n + 1);
    },
  },

  mathematician: {
    view(x, v) {
      const n = x.g.abnormal;
      v.lines.push({ label: "Abnormal abilities since dawn", value: String(n), tone: "good" });
      if (x.mal.length) v.lines.push({ label: "Suggested (false)", value: String(n + 1), tone: "warn" });
      v.caveats.push("Counted from steps where the acting player was drunk/poisoned. Adjust for anything else that worked abnormally.");
      v.info = numberInfo("Abilities that worked abnormally", n, n + 1);
    },
  },

  pixie: {
    view(x, v) {
      const tf = [...new Set(others(x).filter((p) => isTeam(p, "townsfolk")).map((p) => p.role))];
      const sug = stablePick(tf, seed(x));
      const chosen = x.c.roles?.[0] ?? sug;
      v.rolePick = { count: 1, label: "Townsfolk to show", from: tf };
      if (chosen) {
        v.lines.push({ label: "Show", value: role(chosen).name, tone: "good" });
        v.show = { heading: "Be mad that you are the", roles: [chosen] };
      }
    },
    apply(x) {
      const tf = [...new Set(others(x).filter((p) => isTeam(p, "townsfolk")).map((p) => p.role))];
      const chosen = x.c.roles?.[0] ?? stablePick(tf, seed(x));
      if (chosen) addReminder(x.p!, "pixie", "Mad", "never", x.g.night).about = chosen;
      return [];
    },
  },

  huntsman: {
    view(x, v) {
      if (hasReminder(x.p!, "No Ability")) {
        v.skip = "The Huntsman has used their ability.";
        return;
      }
      v.pick = { count: 1, label: "Huntsman guesses the Damsel (optional)", optional: true };
      const t = player(x.g, x.c.targets[0]);
      if (t?.role === "damsel" && !x.mal.length) {
        const free = notInPlay(x.g, "townsfolk");
        v.rolePick = { count: 1, label: "Damsel becomes", from: free };
        v.lines.push({ label: "Correct!", value: `${t.name} becomes a not-in-play Townsfolk`, tone: "good" });
      } else if (t) v.lines.push({ label: "Result", value: t.role === "damsel" ? "Malfunctioning — nothing happens" : "Not the Damsel — nothing happens", tone: "muted" });
    },
    apply(x) {
      const t = player(x.g, x.c.targets[0]);
      if (!t) return [];
      addReminder(x.p!, "huntsman", "No Ability", "never", x.g.night);
      if (t.role === "damsel" && !x.mal.length) {
        const nr = x.c.roles?.[0] ?? notInPlay(x.g, "townsfolk")[0];
        if (nr) {
          t.role = nr;
          log(x.g, `${t.name} (Damsel) became the ${role(nr).name}.`);
          return [`${t.name} is now the ${role(nr).name}. Wake them and show YOU ARE + ${role(nr).name}.`];
        }
      }
      return [];
    },
  },

  barber: {
    allowDead: true,
    view(x, v) {
      if (!hasReminder(x.p!, "Haircuts Tonight")) {
        v.skip = "The Barber didn't die today or tonight.";
        return;
      }
      v.instructions.push("Wake the Demon, show THIS CHARACTER SELECTED YOU + Barber. The Demon may choose 2 players (not another Demon) to swap characters.");
      v.pick = { count: 2, label: "Players to swap (optional)", optional: true, allowSelf: true };
    },
    apply(x) {
      const [a, b] = x.c.targets.map((id) => player(x.g, id)!);
      if (!a || !b) return [];
      [a.role, b.role] = [b.role, a.role];
      log(x.g, `Barber: ${a.name} and ${b.name} swapped characters.`);
      return [`Swap done. Wake ${a.name} and ${b.name} and show each YOU ARE + their new character.`];
    },
  },

  lunatic: {
    view(x, v) {
      if (x.first) {
        const n = aliveNonTravellers(x.g).length;
        if (n < 7) {
          v.skip = "Fewer than 7 players — no demon info for the Lunatic.";
          return;
        }
        const fakeMinions = others(x)
          .slice()
          .sort((a, b) => hash(seed(x, a.id)) - hash(seed(x, b.id)))
          .slice(0, Math.max(1, x.g.players.filter((p) => isTeam(p, "minion")).length));
        v.lines.push({ label: "Fake Minions", value: fakeMinions.map((p) => p.name).join(", "), tone: "warn" });
        v.lines.push({ label: "Bluffs", value: x.g.bluffs.map((id) => role(id).name).join(", "), tone: "muted" });
        v.show = { heading: "These are your Minions", players: fakeMinions.map((p) => p.id), roles: x.g.bluffs, text: "These characters are not in play" };
        return;
      }
      v.pick = { count: 1, label: "Lunatic 'attacks' (no effect)", allowSelf: true };
      v.instructions.push("Nobody dies from this. Remember the choice — the real Demon learns it when they wake.");
    },
    apply(x) {
      const t = player(x.g, x.c.targets[0]);
      if (t) {
        addReminder(t, "lunatic", "Chosen", "dawn", x.g.night);
        log(x.g, `The Lunatic chose ${t.name}.`);
      }
      return t ? [`Tell the Demon: the Lunatic (${x.p!.name}) chose ${t.name}.`] : [];
    },
  },

  marionette: {
    view(x, v) {
      const demon = x.g.players.find((p) => isTeam(p, "demon"));
      v.lines.push({ label: "Marionette", value: `${x.p!.name} (thinks they're the ${role(x.p!.believes).name})`, tone: "evil" });
      if (demon) v.instructions.push(`Wake ${demon.name} (Demon). Show THIS PLAYER IS + Marionette and point to ${x.p!.name}.`);
      v.show = { heading: "This player is the", roles: ["marionette"], players: [x.p!.id] };
    },
  },

  damsel: {
    view(x, v) {
      if (x.first) {
        v.skip = "Handled in Minion info (minions are shown the Damsel token).";
        return;
      }
      v.skip = "Only if the Huntsman found the Damsel — handled in the Huntsman step.";
    },
  },

  sweetheart: {
    allowDead: true,
    view(x, v) {
      if (!x.g.pending.includes("sweetheart")) {
        v.skip = "The Sweetheart hasn't died.";
        return;
      }
      v.pick = { count: 1, label: "Who becomes drunk (permanently)", allowSelf: false };
    },
    apply(x) {
      const t = player(x.g, x.c.targets[0]);
      x.g.pending = x.g.pending.filter((s) => s !== "sweetheart");
      if (t) addReminder(t, "sweetheart", "Drunk", "never", x.g.night);
      return t ? [`${t.name} is drunk for the rest of the game.`] : [];
    },
  },

  bureaucrat: {
    view(x, v) {
      v.pick = { count: 1, label: "Bureaucrat's choice (vote counts 3×)" };
    },
    apply(x) {
      const t = player(x.g, x.c.targets[0]);
      if (t && !x.mal.length) addReminder(t, "bureaucrat", "3 Votes", "dusk", x.g.night);
      return [];
    },
  },

  thief: {
    view(x, v) {
      v.pick = { count: 1, label: "Thief's choice (vote counts negatively)" };
    },
    apply(x) {
      const t = player(x.g, x.c.targets[0]);
      if (t && !x.mal.length) addReminder(t, "thief", "Negative Vote", "dusk", x.g.night);
      return [];
    },
  },

  bonecollector: {
    view(x, v) {
      if (hasReminder(x.p!, "No Ability")) {
        v.skip = "The Bone Collector has used their ability.";
        return;
      }
      v.pick = { count: 1, label: "Dead player regains their ability (optional)", optional: true, filter: (p) => !p.alive };
    },
    apply(x) {
      const t = player(x.g, x.c.targets[0]);
      if (!t) return [];
      addReminder(x.p!, "bonecollector", "No Ability", "never", x.g.night);
      if (!x.mal.length) addReminder(t, "bonecollector", "Has Ability", "dusk", x.g.night);
      return [`${t.name} has their ability until dusk tomorrow.`];
    },
  },
};

/* ------------------------------------------------------------------ */
/* Queue                                                               */
/* ------------------------------------------------------------------ */

/** A star-pass or Scarlet Woman catch tonight: the new Demon doesn't act again this night. */
function becameDemonTonight(g: Game, p: Player): boolean {
  return g.phase === "night" && p.reminders.some((r) => r.label === "Is The Demon" && r.night === g.night);
}

/** A Scarlet Woman who caught the Demon by day still wakes in her own slot to be told. */
function swToldTonight(g: Game, p: Player): boolean {
  return g.pending.includes("scarletwoman") && p.reminders.some((r) => r.role === "scarletwoman" && r.label === "Is The Demon");
}

/** The character a player wakes as. The Lunatic uses its own night entry. */
function wakesAs(p: Player): string {
  if (p.role === "lunatic") return "lunatic";
  return p.believes ?? p.role;
}

export function buildQueue(g: Game): Step[] {
  const first = g.night === 1;
  const order = first ? NIGHT_ORDER.firstNight : NIGHT_ORDER.otherNight;
  const steps: Step[] = [];
  for (const id of order) {
    if (id === "dusk" || id === "dawn") steps.push({ key: id, kind: id });
    else if (id === "minioninfo" || id === "demoninfo") {
      if (first) steps.push({ key: id, kind: id });
    } else {
      const actors = g.players.filter((p) => wakesAs(p) === id || (id === "marionette" && p.role === "marionette") || (id === "scarletwoman" && swToldTonight(g, p)));
      for (const p of actors) steps.push({ key: `${id}:${p.id}`, kind: "role", roleId: id, playerId: p.id });
    }
  }
  return steps;
}

function ctx(g: Game, step: Step): Ctx {
  const p = player(g, step.playerId);
  return { g, step, p, c: g.choices[step.key] ?? { targets: [] }, mal: p && step.kind === "role" ? malfunction(g, p) : [], first: g.night === 1 };
}

export function viewStep(g: Game, step: Step): StepView {
  const x = ctx(g, step);
  const v: StepView = { title: "", instructions: [], lines: [], caveats: [] };
  if (step.kind === "dusk") {
    v.title = "Dusk";
    v.instructions.push("Everyone closes their eyes. Expired reminder tokens have been cleared.");
    return v;
  }
  if (step.kind === "dawn") {
    v.title = "Dawn";
    const died = g.diedTonight.map((id) => name(g, id));
    v.lines.push({ label: "Died tonight", value: died.length ? died.join(", ") : "Nobody", tone: died.length ? "evil" : "good" });
    v.instructions.push("Wake everyone and announce who died. Completing this step starts the day.");
    return v;
  }
  const players = aliveNonTravellers(g);
  const demons = g.players.filter((p) => isTeam(p, "demon"));
  const minions = g.players.filter((p) => isTeam(p, "minion") && p.role !== "marionette");
  if (step.kind === "minioninfo") {
    v.title = "Minion info";
    if (players.length < 7) {
      v.skip = "Fewer than 7 players — no Minion info.";
      return v;
    }
    v.instructions.push("Wake all Minions. Show THIS IS THE DEMON and point to the Demon. Minions also see each other.");
    v.lines.push({ label: "Demon", value: demons.map((p) => p.name).join(", "), tone: "evil" });
    v.lines.push({ label: "Minions", value: minions.map((p) => `${p.name} (${role(p.role).name})`).join(", "), tone: "evil" });
    if (g.players.some((p) => p.role === "damsel")) v.lines.push({ label: "Damsel", value: "Show the Damsel token — it's in play", tone: "warn" });
    if (g.players.some((p) => p.role === "marionette")) v.caveats.push("Don't wake the Marionette — they think they're good.");
    v.show = { heading: "This is the Demon", players: demons.map((p) => p.id), roles: g.players.some((p) => p.role === "damsel") ? ["damsel"] : undefined, text: g.players.some((p) => p.role === "damsel") ? "The Damsel is in play" : undefined };
    return v;
  }
  if (step.kind === "demoninfo") {
    v.title = "Demon info";
    if (players.length < 7) {
      v.skip = "Fewer than 7 players — no Demon info.";
      return v;
    }
    v.instructions.push("Wake the Demon. Show THESE ARE YOUR MINIONS and point to them, then THESE CHARACTERS ARE NOT IN PLAY with 3 bluffs.");
    v.lines.push({ label: "Minions", value: minions.map((p) => p.name).join(", ") || "—", tone: "evil" });
    v.lines.push({ label: "Bluffs", value: g.bluffs.map((id) => role(id).name).join(", ") || "Pick bluffs on the Grimoire tab", tone: "good" });
    const lun = g.players.find((p) => p.role === "lunatic");
    if (lun) v.caveats.push(`Also tell the Demon: ${lun.name} is the Lunatic.`);
    v.show = { heading: "These are your Minions", players: minions.map((p) => p.id), roles: g.bluffs, text: "These characters are not in play" };
    return v;
  }

  const r = role(step.roleId);
  const h = H[step.roleId!] ?? {};
  v.title = r.name;
  v.official = cleanNightText(x.first ? r.firstNightReminder : r.otherNightReminder);
  if (x.p && !x.p.alive && !h.allowDead) {
    v.skip = `${x.p.name} is dead.`;
    return v;
  }
  if (h.view) h.view(x, v);
  else if (/chooses? (a|2) players?|might choose/i.test(v.official ?? "")) {
    const two = /2 players/.test(v.official ?? "");
    v.pick = { count: two ? 2 : 1, label: `${r.name} chooses`, optional: /might/.test(v.official ?? ""), allowSelf: true };
  }
  if (v.info && !v.skip) {
    v.show = toldCard(v.info, x.c, x.mal.length > 0);
    v.needsAnswer = !v.show;
  }
  return v;
}

/** Who sees a step's card. */
function recipients(g: Game, step: Step): string[] {
  if (step.kind === "minioninfo") return g.players.filter((p) => isTeam(p, "minion") && p.role !== "marionette").map((p) => p.id);
  if (step.kind === "demoninfo" || step.roleId === "marionette") return g.players.filter((p) => isTeam(p, "demon")).map((p) => p.id);
  return step.playerId ? [step.playerId] : [];
}

/** Add what was shown to the info record. Uses names from before the step's effects. */
function recordTold(g0: Game, g: Game, step: Step, v: StepView, mal: string[]) {
  if (!v.show) return;
  const truthful = step.roleId === "lunatic" ? false : v.info ? sameCard(v.show, v.info.truth) : true;
  const entry: ToldEntry = {
    id: uid(),
    night: g0.night,
    playerIds: recipients(g0, step),
    role: step.roleId ?? step.kind,
    text: describeCard(g0, v.show),
    truthful,
    malfunctioning: mal.length > 0 || undefined,
  };
  g.told = [...(g.told ?? []), entry];
}

/** Complete a step: applies its effects and returns notes for the Storyteller. */
export function completeStep(g0: Game, step: Step, opts: { skipped?: boolean } = {}): { game: Game; notes: string[] } {
  const g = clone(g0);
  if (opts.skipped && step.kind !== "dawn") {
    g.choices[step.key] = { targets: [] };
    if (!g.done.includes(step.key)) g.done.push(step.key);
    return { game: g, notes: [] };
  }
  const x = ctx(g, step);
  const v = viewStep(g0, step);
  const notes: string[] = [];
  if (!v.skip) {
    if (step.kind === "dawn") {
      startDay(g);
      return { game: g, notes: [] };
    }
    const h = step.roleId ? H[step.roleId] : undefined;
    if (h?.apply) notes.push(...h.apply(x));
    if (step.kind === "role" && x.mal.length && step.roleId !== "lunatic" && step.roleId !== "marionette") g.abnormal += 1;
    if (step.kind === "role" && x.p) {
      const picked = x.c.targets.map((id) => name(g, id));
      if (picked.length) log(g, `${role(step.roleId).name} (${x.p.name}) chose ${picked.join(" & ")}.`);
    }
    recordTold(g0, g, step, v, x.mal);
  }
  if (!g.done.includes(step.key)) g.done.push(step.key);
  return { game: g, notes };
}
