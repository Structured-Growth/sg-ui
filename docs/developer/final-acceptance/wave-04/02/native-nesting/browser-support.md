# Native nesting syntax facts

These are syntax-history observations from primary browser-vendor documentation,
not a new SGUI minimum-browser promise or execution in those historical versions.

| Exact syntax distinction | Primary source |
| --- | --- |
| Chrome shipped initial CSS nesting in112; relaxed lookahead/bare element-name syntax followed in120. The representative uses explicit `& > svg`, with declarations preceding the nested rule. | [Chrome relaxed nesting syntax update](https://developer.chrome.com/blog/css-nesting-relaxed-syntax-update), [Chrome nesting documentation](https://developer.chrome.com/docs/css-ui/css-nesting) |
| Firefox117 introduced CSS Nesting and the `&` selector. | [Firefox117 developer release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/117) |
| Safari16.5 introduced initial nesting with an explicit-symbol requirement for element selectors; Safari17.2 added relaxed element-selector parsing. | [WebKit Safari16.5 features](https://webkit.org/blog/14154/webkit-features-in-safari-16-5/), [WebKit Safari17.2 features](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/) |

Current Playwright projects are Chromium, Firefox and WebKit; they are engine
coverage, not those versions or physical Safari. No declared numeric browser floor
was found in the maintained package/browser-policy source. The proposed component
keeps its exact prior flat rule, so native syntax is introduced with a baseline
fallback rather than an unreviewed change to required browser syntax. It does not
claim legacy-engine or device support. Bare nested element names, Sass-style
concatenation, mixed declaration ordering and grouped-parent specificity changes
are outside this representative and the proposed shallow guard.
