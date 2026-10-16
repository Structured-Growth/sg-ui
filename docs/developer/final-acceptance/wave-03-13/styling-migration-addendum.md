# A-C-04 successor: explicit owned styling conversion

Join input: `wave-02-06/styling-mappings.json`, `parallel-01/api-snapshot.json#historical` and `wave-02-15/public-contract-index.json`. The retained historical primitive barrel directly reexports upstream props; its bytes do not contain their inherited declarations. The five wrapper fields remain mapped in the prior accepted table. This addendum supplies actionable conversions and an explicit limit, rather than claiming those five rows prove the full inherited surface.

| Former styling contract | Owned conversion | Breaking boundary |
| --- | --- | --- |
| `sx` object/callback/array | Use the named component's public `className`/native `style` only where exposed, or scope token overrides for identity. Convert spacing shorthands to logical CSS with owned spacing tokens. | No theme callback evaluation, responsive-object grammar, array merge or `sx` passthrough. Native `style` is not a drop-in SxProps value. |
| AppModal `paperSx` | Surface `className`/`style`; explicit width/height; bodyClassName/bodyStyle for body. | Keep surface and body ownership separate. |
| ClassCardFrame `headerSx`, `bodySx`, `footerSx` | Matching ClassName/Style part pair from prior mappings. | Native CSSProperties only. |
| Primitive upstream `classes`/slotProps/componentsProps or generated `.Mui*` selectors | Intentional removal of upstream slot topology. Use explicit owned parts where a current component exposes them; otherwise compose public components or request a new owned contract. | Do not rename an upstream class and assume matching DOM. No generic classes/slots compatibility API exists. Upstream historical declarations still need recovery to enumerate which primitives actually inherited each field. |
| TextField nested input styles | Current `className` styles field root and `inputClassName` styles input; owned tokens style decoration. | Current FieldOptions has no generic `style` or arbitrary native input spread contract. Do not recommend unsupported props. |
| Popover root styling | Scope tokens and documented presentation/size props. | Current PopoverProps exposes neither `className` nor `style`; geometry locks are internal, not a host slot API. |
| Box/Stack wrapper styles | Current native class/style contract and owned layout props. | `as` replaces legacy element selection where supported; arbitrary upstream component polymorphism is not retained. |
| Button | Owned variant/tone/density; native class/style. | Upstream styling system and `color` theme keys are removed; content/action migration is separate from styling. |

Before closing C-04, the A-B-05 owner must supply upstream declarations bound to the historical lockfile resolution, enumerate the exact inherited keys by export and record their intentional removal or owned replacement. Installing today's upstream package would not reconstruct that historical contract. The saved barrel and wrapper source are usable provenance but are insufficient for exhaustive inherited-field acceptance. No changes to public APIs are proposed solely to imitate retired styling machinery.
