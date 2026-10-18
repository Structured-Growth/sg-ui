# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: current-state-design.spec.ts >> floating owned selected/pending design (active)
- Location: tests/browser/current-state-design.spec.ts:51:2

# Error details

```
Error: locator.evaluate: IndexSizeError: Failed to execute 'setEnd' on 'Range': There is no child at offset 6.
    at eval (eval at evaluate (:311:30), <anonymous>:6:11)
    at UtilityScript.evaluate (<anonymous>:313:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
```

# Page snapshot

```yaml
- generic [ref=e5]:
  - paragraph [ref=e6]: Select text, then press Alt+F10 to focus formatting. Escape returns to the editor.
  - textbox "Document" [active] [ref=e8]:
    - paragraph [ref=e9]: Select this paragraph 1 to apply formatting without losing text.
    - paragraph [ref=e10]: Select this paragraph 2 to apply formatting without losing text.
    - paragraph [ref=e11]: Select this paragraph 3 to apply formatting without losing text.
    - paragraph [ref=e12]: Select this paragraph 4 to apply formatting without losing text.
    - paragraph [ref=e13]: Select this paragraph 5 to apply formatting without losing text.
    - paragraph [ref=e14]: Select this paragraph 6 to apply formatting without losing text.
    - paragraph [ref=e15]: Select this paragraph 7 to apply formatting without losing text.
    - paragraph [ref=e16]: Select this paragraph 8 to apply formatting without losing text.
    - paragraph [ref=e17]: Select this paragraph 9 to apply formatting without losing text.
    - paragraph [ref=e18]: Select this paragraph 10 to apply formatting without losing text.
    - paragraph [ref=e19]: Select this paragraph 11 to apply formatting without losing text.
    - paragraph [ref=e20]: Select this paragraph 12 to apply formatting without losing text.
```