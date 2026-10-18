import type {Page, TestInfo} from '@playwright/test';

// Observational capture metadata. No DOM/style changes or acceptance assertions.
export async function attachVisualFontEnvironment(page: Page, info: TestInfo) {
  const samples = await page.locator('section[aria-label^="Visual "] *, [role="dialog"] *').evaluateAll(nodes => nodes
    .filter(node => node instanceof HTMLElement && node.getClientRects().length > 0 &&
      ([...node.childNodes].some(child => child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) ||
        node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement))
    .map(node => {
      const parts: string[] = [];
      for (let element: Element | null = node; element; element = element.parentElement) {
        const parent: Element | null = element.parentElement;
        const index = parent ? [...parent.children].indexOf(element) + 1 : 1;
        parts.unshift(`${element.tagName.toLowerCase()}:nth-child(${index})`);
      }
      const style = getComputedStyle(node);
      return {selector: parts.join(' > '), text: node.textContent?.trim().slice(0, 160),
        fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight,
        fontStyle: style.fontStyle, lineHeight: style.lineHeight};
    }));
  const session = await page.context().newCDPSession(page);
  try {
    await session.send('DOM.enable'); await session.send('CSS.enable');
    const {root} = await session.send('DOM.getDocument');
    const fonts = [];
    for (const sample of samples) {
      const {nodeId} = await session.send('DOM.querySelector', {nodeId: root.nodeId, selector: sample.selector});
      const rendered = nodeId ? await session.send('CSS.getPlatformFontsForNode', {nodeId}) : {fonts: []};
      fonts.push({...sample, platformFonts: rendered.fonts});
    }
    await info.attach('browser-used-font-environment', {contentType: 'application/json', body: JSON.stringify({
      engine: info.project.name, browserVersion: page.context().browser()?.version(),
      environment: await page.evaluate(() => ({userAgent: navigator.userAgent, language: navigator.language,
        languages: navigator.languages, fontStatus: document.fonts.status, devicePixelRatio})), samples: fonts,
    }, null, 2)});
  } finally { await session.detach(); }
}
