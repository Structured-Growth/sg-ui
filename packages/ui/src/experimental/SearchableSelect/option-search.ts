/** Search metadata belongs to the host; IDs never double as implicit aliases. */
export interface SearchableSelectOption {
  id: string;
  label: string;
  keywords?: readonly string[];
  description?: string;
  disabled?: boolean;
}

export type SearchableSelectFilter = "contains" | "startsWith" | "fuzzy" | "none"
  | ((option: SearchableSelectOption, query: string) => boolean);

function normalize(value: string, locale: string): string {
  return value.toLocaleLowerCase(locale).normalize("NFD").replace(/\p{M}/gu, "").trim();
}

/** Bounded optimal-string-alignment distance, including adjacent transpositions. */
function distance(left: string, right: string, limit: number): number {
  const a = Array.from(left), b = Array.from(right);
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let older: number[] = [];
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let row = 1; row <= a.length; row++) {
    const current = [row];
    for (let column = 1; column <= b.length; column++) {
      current[column] = Math.min(current[column - 1]! + 1, previous[column]! + 1,
        previous[column - 1]! + (a[row - 1] === b[column - 1] ? 0 : 1));
      if (row > 1 && column > 1 && a[row - 1] === b[column - 2] && a[row - 2] === b[column - 1]) {
        current[column] = Math.min(current[column]!, older[column - 2]! + 1);
      }
    }
    older = previous;
    previous = current;
  }
  return previous[b.length]!;
}

/** Exact aliases first, then prefixes/contains, then conservative word typos.
 * Equal matches retain host order. Short queries never use typo correction. */
export function searchOptions(options: readonly SearchableSelectOption[], query: string,
  filter: SearchableSelectFilter = "contains", locale = "en-US"): SearchableSelectOption[] {
  const term = normalize(query, locale);
  if (!term || filter === "none") return [...options];
  if (typeof filter === "function") return options.filter(option => filter(option, query));
  const terms = term.split(/\s+/);
  return options.map((option, index) => {
    const texts = [option.label, ...(option.keywords ?? [])].map(text => normalize(text, locale));
    let score = Infinity;
    if (texts.some(text => text === term)) score = 0;
    else if (texts.some(text => text.startsWith(term))) score = 1;
    else if (filter !== "startsWith") {
      if (terms.every(word => texts.some(text => text.includes(word)))) score = 2;
      else if (filter === "fuzzy" && terms.every(word => {
        if (texts.some(text => text.includes(word))) return true;
        const length = Array.from(word).length;
        if (length < 3) return false;
        const limit = length >= 6 ? 2 : 1;
        return texts.some(text => text.split(/\s+/).some(candidate => distance(word, candidate, limit) <= limit));
      })) score = 3;
    }
    return { option, index, score };
  }).filter(result => Number.isFinite(result.score))
    .sort((left, right) => left.score - right.score || left.index - right.index)
    .map(result => result.option);
}
