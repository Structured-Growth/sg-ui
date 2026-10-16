"""Check maintained icon metadata against source; no imports, builds or writes."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
ICONS = ROOT / "packages/ui/src/experimental/icons"
inputs = [Path(__file__).resolve(), ICONS / "icon-map.json",
          ROOT / "docs/developer/react-aria-icons.md"]
errors = []


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            errors.append(f"Duplicate JSON key: {key}")
        result[key] = value
    return result


mapping = json.loads((ICONS / "icon-map.json").read_text(), object_pairs_hook=unique_object)
implementations = {}
helpers = {}
helper_roles = {
    "activityTypeIcon.tsx": "getActivityTypeIcon selector; reuses wrappers, not a vector",
    "createVector.tsx": "createIcon factory; not a concrete wrapper",
}
for path in sorted(ICONS.glob("*.tsx")):
    if ".test." in path.name:
        continue
    inputs.append(path)
    text = path.read_text()
    match = re.search(r'export const (\w+Icon) = createIcon\((\w+), "(\w+Icon)"(?:, (?:true|false))?\);', text)
    if not match:
        if path.name not in helper_roles:
            errors.append(f"Unclassified implementation file: {path.name}")
        else:
            helpers[path.name] = helper_roles[path.name]
        continue
    name, vector, display_name = match.groups()
    if name in implementations or path.stem != name or name != display_name:
        errors.append(f"Wrapper identity mismatch or duplicate: {path.name}")
    if not re.search(r'import \{ ' + re.escape(vector) + r' \} from "lucide-react";', text):
        errors.append(f"Vector import mismatch: {name}")
    implementations[name] = vector

doc = (ROOT / "docs/developer/react-aria-icons.md").read_text().split("## Complete symbol mapping", 1)[1]
rows = re.findall(r"^\| (\w+Icon) \| (\w+) \|$", doc, re.M)
documentation = dict(rows)
if len(rows) != len(documentation):
    errors.append("Duplicate documentation wrapper row")
json_wrappers = {name + "Icon": vector for name, vector in mapping.items()}
for label, maintained in [("JSON", json_wrappers), ("documentation", documentation)]:
    for name in sorted(set(implementations) | set(maintained)):
        if implementations.get(name) != maintained.get(name):
            errors.append(f"{label} mismatch: {name}: source={implementations.get(name)!r}, maintained={maintained.get(name)!r}")
if len(implementations) != 96:
    errors.append(f"Expected reviewed inventory of 96 wrappers, found {len(implementations)}; reconcile inventory explicitly")
if set(helpers) != set(helper_roles):
    errors.append("Expected helper inventory changed")
inputs.append(ICONS / "index.ts")
summary = {
    "status": "pass" if not errors else "fail",
    "implementedWrappers": len(implementations),
    "jsonMappings": len(mapping),
    "documentationMappings": len(rows),
    "brushMapping": implementations.get("BrushIcon"),
    "helpersExcludedFromWrapperCount": helpers,
    "barrelExcludedFromWrapperCount": "index.ts reexports; not a vector wrapper",
    "errors": errors,
    "inputSha256": {str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest()
                    for p in sorted(set(inputs))},
    "limits": "Static source/metadata parity only; no runtime, browser, bundle, visual, AT, device or legal validation.",
}
print(json.dumps(summary, indent=2) + "\n", end="")
raise SystemExit(bool(errors))
