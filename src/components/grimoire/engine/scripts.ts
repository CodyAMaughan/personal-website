import { normaliseId, ROLES } from "./roles";

export interface Script {
  id: string;
  name: string;
  author?: string;
  roles: string[];
}

const TB = "washerwoman librarian investigator chef empath fortuneteller undertaker monk ravenkeeper virgin slayer soldier mayor butler drunk recluse saint poisoner spy scarletwoman baron imp bureaucrat thief gunslinger scapegoat beggar";
const EC = "investigator pixie empath dreamer mathematician oracle monk artist fisherman huntsman soldier ravenkeeper cannibal puzzlemaster recluse mutant damsel barber poisoner spy scarletwoman boomdandy marionette nodashii bishop bonecollector bureaucrat butcher matron";
const UD = "clockmaker grandmother librarian empath fortuneteller flowergirl oracle undertaker monk exorcist seamstress artist slayer lunatic mutant sweetheart recluse godfather assassin scarletwoman marionette pukka nodashii";

export const BUILT_IN_SCRIPTS: Script[] = [
  { id: "tb", name: "Trouble Brewing", author: "The Pandemonium Institute", roles: TB.split(" ") },
  { id: "extension-cord", name: "Extension Cord", author: "Viva La Sam", roles: EC.split(" ") },
  { id: "uncertain-death", name: "Uncertain Death", author: "Matt", roles: UD.split(" ") },
];

/** Parse official Script Tool JSON (or a plain list of ids). Unknown ids are reported. */
export function parseScript(text: string): { script: Script; unknown: string[] } {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) throw new Error("A script should be a JSON list of character ids.");
  let name = "Custom script";
  let author: string | undefined;
  const roles: string[] = [];
  const unknown: string[] = [];
  for (const entry of data) {
    const rawId = typeof entry === "string" ? entry : entry?.id;
    if (!rawId) continue;
    if (rawId === "_meta") {
      name = entry.name || name;
      author = entry.author || undefined;
      continue;
    }
    const id = normaliseId(rawId);
    if (ROLES[id]) {
      if (!roles.includes(id)) roles.push(id);
    } else unknown.push(rawId);
  }
  if (!roles.length) throw new Error("No known characters found in that script.");
  return { script: { id: `custom-${Date.now()}`, name, author, roles }, unknown };
}
