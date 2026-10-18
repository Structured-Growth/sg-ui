from pathlib import Path
import json,hashlib,difflib,re
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-04/07'; proposed=out/'proposed-files'
paths=['apps/docs/native-fixtures/scenarios/components/DataToolbar/DataToolbar.fixture.tsx','packages/ui/tests/browser/toolbar-container-boundary.spec.ts','packages/ui/tests/browser/navigation-shell-container-boundary.spec.ts','packages/ui/tests/browser/modal-container-boundary.spec.ts']
base={p:(root/p).read_text() for p in paths}
new=dict(base)
p=paths[0]
old='return <Provider style={enlarged ? { "--sgui-label-size": "1.75rem", "--sgui-body-size": "2rem" } : undefined}>'
replacement='''// Controls consume density-specific text roles; enlarging only label/body roles
  // no longer enlarges Button or TextField. Override the owned source tokens so
  // explicit compact controls and inherited comfortable actions both double.
  return <Provider style={enlarged ? {
    "--sgui-label-size": "1.75rem", "--sgui-body-size": "2rem",
    "--sgui-compact-control-text-size": "1.5rem",
    "--sgui-comfortable-control-text-size": "1.75rem",
  } : undefined}>'''
assert old in new[p]; new[p]=new[p].replace(old,replacement)
helper='''import { expect, type Page, type TestInfo } from '@playwright/test';

/** Attach real native geometry and captures even when an existing assertion fails.
 * Read-only observations: never scroll a container, focus a control or rewrite CSS.
 * These are enlarged-text/layout records, not browser-controls zoom or AT speech.
 */
export async function recordContainerBoundary(page: Page, info: TestInfo, selector: string) {
  const observations = await page.locator(selector).evaluateAll(roots => roots.map(root => {
    const rect = (node: Element) => {
      const bounds = node.getBoundingClientRect();
      return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
    };
    const style = getComputedStyle(root);
    return {
      part: root.getAttribute('data-sgui-part'), label: root.getAttribute('aria-label'), rect: rect(root),
      clientWidth: root.clientWidth, scrollWidth: root.scrollWidth,
      clientHeight: root.clientHeight, scrollHeight: root.scrollHeight,
      scrollLeft: root.scrollLeft, scrollTop: root.scrollTop,
      containerName: style.containerName, containerType: style.containerType, direction: style.direction,
      controls: Array.from(root.querySelectorAll('button, input, [role="tab"]'), control => {
        const computed = getComputedStyle(control);
        return { text: control.getAttribute('aria-label') ?? control.textContent,
          rect: rect(control), focused: document.activeElement === control,
          fontSize: computed.fontSize, outlineStyle: computed.outlineStyle,
          outlineWidth: computed.outlineWidth, outlineOffset: computed.outlineOffset };
      }),
    };
  }));
  const viewport = await page.evaluate(() => ({ width: innerWidth, height: innerHeight,
    rootFontSize: getComputedStyle(document.documentElement).fontSize, devicePixelRatio,
    visualViewportScale: visualViewport?.scale, focusedTag: document.activeElement?.tagName }));
  await info.attach('container-boundary-geometry', {
    body: JSON.stringify({ url: page.url(), project: info.project.name, status: info.status, viewport, observations }, null, 2),
    contentType: 'application/json',
  });
  await info.attach('container-boundary-rendered', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
}

/** Ensure a keyboard focus indicator exists before checking its full bounds.
 * Existing center-hit and focus assertions remain with their original owners.
 */
export async function expectContainerFocusRing(page: Page) {
  const active = page.locator(':focus');
  await expect(active).toHaveCount(1);
  await expect.poll(() => active.evaluate(node => {
    const style = getComputedStyle(node), rect = node.getBoundingClientRect();
    if (style.outlineStyle === 'none' || parseFloat(style.outlineWidth) <= 0) return false;
    const outside = Math.max(0, parseFloat(style.outlineWidth) + (parseFloat(style.outlineOffset) || 0));
    const focus = { left: rect.left - outside, right: rect.right + outside,
      top: rect.top - outside, bottom: rect.bottom + outside };
    if (focus.left < -1 || focus.right > innerWidth + 1 || focus.top < -1 || focus.bottom > innerHeight + 1) return false;
    for (let ancestor = node.parentElement; ancestor; ancestor = ancestor.parentElement) {
      const computed = getComputedStyle(ancestor), bounds = ancestor.getBoundingClientRect();
      const left = bounds.left + ancestor.clientLeft, top = bounds.top + ancestor.clientTop;
      if (/(auto|scroll|hidden|clip)/.test(computed.overflowX)
        && (focus.left < left - 1 || focus.right > left + ancestor.clientWidth + 1)) return false;
      if (/(auto|scroll|hidden|clip)/.test(computed.overflowY)
        && (focus.top < top - 1 || focus.bottom > top + ancestor.clientHeight + 1)) return false;
    }
    return true;
  })).toBe(true);
}
'''
helperPath='packages/ui/tests/browser/container-boundary-observations.ts'
for p,selector in zip(paths[1:],['[data-sgui-part="data-toolbar"]','[data-sgui-part="app-shell"]','[role="dialog"]']):
 s=new[p]
 s='import { recordContainerBoundary, expectContainerFocusRing } from \'./container-boundary-observations\';\n'+s
 # These attachments are also retained when an existing assertion fails.
 marker=s.index('\n',s.index("from '@playwright/test';"))+1
 s=s[:marker]+f'''\ntest.afterEach(async ({{ page }}, info) => {{
  await recordContainerBoundary(page, info, '{selector}');
}});\n'''+s[marker:]
 if 'toolbar-' in p:
  needle="    await expect(wideInput).toHaveCSS('width', '240px');"
  at=s.index(needle)+len(needle)
  s=s[:at]+'''
    // Guard the stress fixture itself: old label/body token overrides left
    // explicit compact controls at their ordinary 12px text size.
    const rem = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
    for (const input of [narrowInput, wideInput]) {
      await expect.poll(() => input.evaluate(node => parseFloat(getComputedStyle(node).fontSize)))
        .toBeCloseTo(rem * (enlarged ? 1.5 : .75), 1);
    }
    for (const toolbar of [narrow, wide]) {
      await expect.poll(() => toolbar.getByRole('button', { name: 'Create course', exact: true })
        .evaluate(node => parseFloat(getComputedStyle(node).fontSize)))
        .toBeCloseTo(rem * (enlarged ? 1.75 : .875), 1);
    }
'''+s[at:]
  needle="    await expect(narrowInput).toHaveAttribute('data-focus-visible', 'true');"
  assert needle in s;s=s.replace(needle,needle+'\n    await expectContainerFocusRing(page);')
 elif 'navigation-' in p:
  # Keep every existing focus/scroll assertion; add actual indicator clipping check
  # at the same keyboard stops rather than create another near-duplicate case.
  needle='      await visibleMainFocus(input);';assert needle in s;s=s.replace(needle,needle+'\n      await expectContainerFocusRing(page);')
  needle="      await visibleMainFocus(first.getByRole('button', { name: `First host action ${i}`, exact: true }));"
  assert needle in s;s=s.replace(needle,needle+'\n      await expectContainerFocusRing(page);')
 else:
  # Validate every existing modal keyboard focus stop against clipping ancestors,
  # not just the control center. Capture live open state before Escape removes it.
  needle='  })).toBe(true);\n}\n\nasync function arrangement'
  assert needle in s;s=s.replace(needle,'  })).toBe(true);\n  await expectContainerFocusRing(control.page());\n}\n\nasync function arrangement')
  # Remaining test titles dismiss before afterEach; keep one open-state capture.
  s=re.sub(r"(?m)^( +)await page.keyboard.press\('Escape'\);", lambda m: m[1]+"await recordContainerBoundary(page, test.info(), '[role=\"dialog\"]');\n"+m[0], s)
 new[p]=s
new[helperPath]=helper
for p,s in new.items():
 target=proposed/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(s)
patch=''.join(''.join(difflib.unified_diff(base.get(p,'').splitlines(keepends=True),s.splitlines(keepends=True),fromfile='a/'+p if p in base else '/dev/null',tofile='b/'+p)) for p,s in new.items())
(out/'container-evidence.patch').write_text(patch)
hash=lambda b:hashlib.sha256(b).hexdigest()
(out/'container-proposal-inputs.json').write_text(json.dumps({'baseHashes':{p:hash(s.encode()) for p,s in base.items()},'proposedHashes':{p:hash(s.encode()) for p,s in new.items()},'newHelper':helperPath,'runtimeStatus':'not executed; static preparation only'},indent=2)+'\n')
print('Prepared',len(new),'exact files and container-evidence.patch; shared fixtures/specs unchanged.')
