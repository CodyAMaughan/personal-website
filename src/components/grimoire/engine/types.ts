export type Team = "townsfolk" | "outsider" | "minion" | "demon" | "traveller" | "fabled" | "loric";
export type Alignment = "good" | "evil";

export interface Role {
  id: string;
  name: string;
  edition: string;
  team: Team;
  ability: string;
  firstNightReminder?: string;
  otherNightReminder?: string;
  reminders?: string[];
  remindersGlobal?: string[];
  setup?: boolean;
  flavor?: string;
}

/** When a reminder token should be removed automatically. */
export type Expiry = "dusk" | "dawn" | "never";

export interface Reminder {
  id: string;
  /** Character id that owns this reminder (e.g. "poisoner"), or "generic". */
  role: string;
  label: string;
  expires: Expiry;
  /** Placed automatically by the app (vs. by hand). */
  auto?: boolean;
  /** Night number on which it was placed (for Pukka etc). */
  night?: number;
  /** Character this reminder refers to (Pixie "Mad", Cannibal lunch...). */
  about?: string;
}

export interface Death {
  phase: "day" | "night";
  n: number;
  cause: string;
}

export interface Player {
  id: string;
  name: string;
  /** The character actually held. */
  role: string;
  /** What the player believes they are (Drunk, Lunatic, Marionette). */
  believes?: string;
  alignment: Alignment;
  alive: boolean;
  ghostVote: boolean;
  reminders: Reminder[];
  note?: string;
  death?: Death;
}

export interface Nomination {
  nominator: string;
  nominee: string;
  voters: string[];
}

export interface LogEntry {
  phase: string;
  text: string;
}

export interface StepChoice {
  targets: string[];
  option?: string;
  roles?: string[];
  /** What the Storyteller decided to tell: the truth, the suggested false info, or their own. */
  told?: "true" | "fake" | "custom";
  custom?: { big?: string; players?: string[]; roles?: string[] };
}

/** What a player was shown, plus who it was shown to. */
export interface ToldEntry {
  id: string;
  /** Night number, or 0 for something recorded by hand during the day. */
  night: number;
  day?: number;
  playerIds: string[];
  /** Character whose ability gave the info (or "generic"). */
  role: string;
  /** Plain-text summary, frozen when recorded. */
  text: string;
  /** Whether it matched the true info at the time. */
  truthful: boolean;
  /** The ability was drunk/poisoned when used. */
  malfunctioning?: boolean;
  note?: string;
}

export interface Game {
  version: 1;
  scriptName: string;
  scriptRoles: string[];
  players: Player[];
  bluffs: string[];
  phase: "setup" | "night" | "day";
  /** Current (or most recent) night. 0 before the game starts. */
  night: number;
  day: number;
  /** Step keys completed this night. */
  done: string[];
  /** Choices made for steps this night. */
  choices: Record<string, StepChoice>;
  nominations: Nomination[];
  executedToday: string | null;
  diedToday: string[];
  diedTonight: string[];
  /** Abilities that malfunctioned since dawn (for the Mathematician). */
  abnormal: number;
  /** Player ids the demon may not kill tonight because of the Exorcist. */
  exorcisedDemon: boolean;
  /** Prompts the Storyteller must resolve (Sweetheart, Barber, Boomdandy...). */
  pending: string[];
  log: LogEntry[];
  /** Record of info given to players (older saves may not have it). */
  told?: ToldEntry[];
  winner: Alignment | null;
}
