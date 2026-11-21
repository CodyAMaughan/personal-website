import rolesJson from "../data/roles.json";
import nightsheet from "../data/nightsheet.json";
import type { Alignment, Role, Team } from "./types";

export const ROLES: Record<string, Role> = Object.fromEntries(
  (rolesJson as Role[]).map((r) => [r.id, r]),
);

export const NIGHT_ORDER = nightsheet as { firstNight: string[]; otherNight: string[] };

/** Normalise ids from script JSON ("scarlet_woman", "Scarlet Woman") to official ids. */
export function normaliseId(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function role(id: string | undefined): Role {
  if (id && ROLES[id]) return ROLES[id];
  return {
    id: id ?? "unknown",
    name: id ? id.replace(/^./, (c) => c.toUpperCase()) : "Unknown",
    edition: "custom",
    team: "townsfolk",
    ability: "",
  };
}

export function defaultAlignment(team: Team): Alignment {
  return team === "minion" || team === "demon" ? "evil" : "good";
}

export const TEAM_LABEL: Record<Team, string> = {
  townsfolk: "Townsfolk",
  outsider: "Outsider",
  minion: "Minion",
  demon: "Demon",
  traveller: "Traveller",
  fabled: "Fabled",
  loric: "Loric",
};

export const TEAM_ORDER: Team[] = ["townsfolk", "outsider", "minion", "demon", "traveller", "fabled", "loric"];

/** Official toolmaker icons (Community Created Content Policy). */
export function iconUrls(id: string, alignment?: Alignment): string[] {
  const r = ROLES[id];
  if (!r) return [];
  const edition = r.edition === "custom" ? null : r.edition;
  if (!edition) return [];
  const suffixed = r.team === "fabled" || r.team === "loric" ? "" : alignment === "evil" ? "_e" : alignment === "good" ? "_g" : defaultAlignment(r.team) === "evil" ? "_e" : "_g";
  const file = `${edition}/${id}${suffixed}.webp`;
  return [
    `https://release.botc.app/resources/characters/${file}`,
    `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/characters/${file}`,
  ];
}

/** Replace ":reminder:" markup and *TOKEN* emphasis in official night text. */
export function cleanNightText(text: string | undefined): string {
  if (!text) return "";
  return text.replace(/\s*:reminder:\s*/g, " ").replace(/\*([^*]+)\*/g, "$1").replace(/\s+/g, " ").trim();
}
