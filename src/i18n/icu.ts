export type MessageValues = Record<string, string | number | boolean | Date | null | undefined>;

type Argument = {
  name: string;
  format?: "number" | "date" | "time" | "plural" | "selectordinal" | "select";
  offset?: number;
  choices?: Map<string, Part[]>;
};
type Part = string | Argument | { pound: true };

/** Owned ICU subset; unsupported styles/skeletons fail validation. */
function parse(message: string): Part[] {
  let position = 0;
  const fail = (): never => { throw new SyntaxError(`Invalid or unsupported ICU message at ${position}`); };
  const whitespace = () => { while (position < message.length && /\s/.test(message[position]!)) position++; };
  const word = () => {
    whitespace();
    const start = position;
    while (position < message.length && /[\w.=-]/.test(message[position]!)) position++;
    return message.slice(start, position) || fail();
  };
  const sequence = (nested: boolean, plural: boolean, depth: number): Part[] => {
    if (depth > 50) fail();
    const parts: Part[] = [];
    let literal = "";
    const flush = () => { if (literal) parts.push(literal); literal = ""; };
    while (position < message.length) {
      const character = message[position++]!;
      if (character === "}") {
        if (!nested) fail();
        flush();
        return parts;
      }
      if (character === "'") {
        if (message[position] === "'") { literal += "'"; position++; }
        else if (/[{}]/.test(message[position] ?? "") || (plural && message[position] === "#")) {
          // ICU quoting starts only before syntax characters.
          while (position < message.length) {
            const quoted = message[position++]!;
            if (quoted === "'") {
              if (message[position] === "'") { literal += "'"; position++; }
              else break;
            } else literal += quoted;
          }
        } else literal += character;
      } else if (character === "#" && plural) {
        flush(); parts.push({ pound: true });
      } else if (character === "{") {
        flush();
        const name = word();
        if (!/^[\w.]+$/.test(name)) fail();
        whitespace();
        const argument: Argument = { name };
        if (message[position] === ",") {
          position++;
          const format = word();
          if (!["number", "date", "time", "plural", "selectordinal", "select"].includes(format)) fail();
          argument.format = format as Argument["format"];
          whitespace();
          if (format === "plural" || format === "selectordinal" || format === "select") {
            if (message[position++] !== ",") fail();
            whitespace();
            if (format !== "select" && message.slice(position).startsWith("offset:")) {
              position += 7;
              const offset = word();
              if (!/^\d+$/.test(offset)) fail();
              argument.offset = Number(offset);
              if (!Number.isSafeInteger(argument.offset)) fail();
            }
            argument.choices = new Map();
            whitespace();
            while (position < message.length && message[position] !== "}") {
              let selector = word();
              if (format !== "select" && !/^(zero|one|two|few|many|other|=-?\d+(?:\.\d+)?)$/.test(selector)) fail();
              if (format !== "select" && selector.startsWith("=")) {
                const exact = Number(selector.slice(1));
                if (!Number.isFinite(exact)) fail();
                selector = `=${exact}`;
              }
              if (argument.choices.has(selector)) fail();
              whitespace();
              if (message[position++] !== "{") fail();
              argument.choices.set(selector, sequence(true, plural || format !== "select", depth + 1));
              whitespace();
            }
            if (!argument.choices.has("other")) fail();
          }
        }
        if (message[position++] !== "}") fail();
        parts.push(argument);
      } else literal += character;
    }
    if (nested) fail();
    flush();
    return parts;
  };
  return sequence(false, false, 0);
}

function supportedLocale(locale: string): string {
  try {
    const canonical = Intl.getCanonicalLocales(locale)[0];
    return canonical && Intl.NumberFormat.supportedLocalesOf(canonical).length ? canonical : "en-US";
  }
  catch { return "en-US"; }
}

export const formatIcuMessage = (message: string, locale: string, values?: MessageValues): string => {
  const resolvedLocale = supportedLocale(locale);
  const render = (parts: Part[], pound?: number): string => parts.map(part => {
    if (typeof part === "string") return part;
    if ("pound" in part) return new Intl.NumberFormat(resolvedLocale).format(pound!);
    const value = values?.[part.name];
    if (part.choices) {
      let selected: Part[] | undefined;
      if (part.format === "select") selected = part.choices.get(String(value));
      else {
        if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError("Plural values must be finite numbers");
        const count = value - (part.offset ?? 0);
        const category = new Intl.PluralRules(resolvedLocale, { type: part.format === "selectordinal" ? "ordinal" : "cardinal" }).select(count);
        selected = part.choices.get(`=${value}`) ?? part.choices.get(category);
        return render(selected ?? part.choices.get("other")!, count);
      }
      return render(selected ?? part.choices.get("other")!, pound);
    }
    if (value === null || value === undefined) return values ? "" : `{${part.name}${part.format ? `, ${part.format}` : ""}}`;
    if (part.format === "number" && typeof value === "number") return new Intl.NumberFormat(resolvedLocale).format(value);
    if ((part.format === "date" || part.format === "time") && (value instanceof Date || typeof value === "string")) {
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return new Intl.DateTimeFormat(resolvedLocale, part.format === "time" ? { hour: "numeric", minute: "2-digit" } : undefined).format(date);
    }
    return String(value);
  }).join("");
  // Malformed host/default messages must not crash a control or be partly replaced.
  try { return values ? render(parse(message)) : message; }
  catch { return message; }
};

/** Includes inactive plural/select branches. Throws on invalid/unsupported syntax. */
export const extractIcuVariables = (message: string): string[] => {
  const variables = new Set<string>();
  const visit = (parts: Part[]) => {
    for (const part of parts) {
      if (typeof part === "string" || "pound" in part) continue;
      variables.add(part.name);
      part.choices?.forEach(visit);
    }
  };
  visit(parse(message));
  return [...variables].sort();
};

/** Catalog-time validation; hosts own supported languages and fallback policy. */
export const validateIcuVariables = (englishMessage: string, translatedMessage: string): { missing: string[]; extra: string[] } => {
  const english = extractIcuVariables(englishMessage);
  const translated = extractIcuVariables(translatedMessage);
  return { missing: english.filter(name => !translated.includes(name)), extra: translated.filter(name => !english.includes(name)) };
};
