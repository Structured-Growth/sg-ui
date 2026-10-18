import {expect, type Locator, type TestInfo} from '@playwright/test';

/** Geometry regression on the existing eight-case matrix; adds no screenshot cases. */
export async function assertVisualGridGeometry(region: Locator, viewportWidth: number, info: TestInfo) {
  const measurements = await region.getByRole('grid').evaluateAll(grids => grids.map(grid => {
    const pane = grid.parentElement!;
    const headers = [...grid.querySelectorAll<HTMLElement>('[data-width-column-index]')].map(header => {
      const button = header.querySelector<HTMLElement>('button');
      const label = button?.querySelector<HTMLElement>('span');
      const style = label ? getComputedStyle(label) : null;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      if (style) context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      return {width: header.getBoundingClientRect().width, height: header.getBoundingClientRect().height,
        labelWidth: label?.getBoundingClientRect().width ?? 0,
        wordWidth: context.measureText(label?.textContent?.match(/[A-Za-z]+/)?.[0] ?? '').width,
        lineHeight: style ? parseFloat(style.lineHeight) : 0};
    });
    const actions = [...grid.querySelectorAll<HTMLElement>('tbody tr > :last-child button')].map(button => {
      const label = button.querySelector<HTMLElement>('span')!;
      const cell = button.closest('td')!;
      const b = button.getBoundingClientRect(), l = label.getBoundingClientRect(), c = cell.getBoundingClientRect();
      return {buttonLeft:b.left,buttonRight:b.right,labelLeft:l.left,labelRight:l.right,cellLeft:c.left,cellRight:c.right};
    });
    const bounds = pane.getBoundingClientRect();
    return {label:grid.getAttribute('aria-label'), paneWidth:pane.clientWidth, scrollWidth:pane.scrollWidth, paneLeft:bounds.left, paneRight:bounds.right, headers, actions};
  }));
  await info.attach('visual-grid-geometry', {body:JSON.stringify(measurements,null,2),contentType:'application/json'});
  for (const grid of measurements) {
    for (const header of grid.headers) {
      expect(header.width, `${grid.label}: public flexible-column minimum`).toBeGreaterThanOrEqual(120);
      expect(header.labelWidth, `${grid.label}: caption has room for an ordinary word`).toBeGreaterThanOrEqual(header.wordWidth);
      // A 51-character pseudo-localized caption must not become a character tower.
      expect(header.height, `${grid.label}: bounded caption and resize-control rows`).toBeLessThan(header.lineHeight * 12 + 88);
    }
    if (viewportWidth === 360) expect(grid.scrollWidth, `${grid.label}: horizontal overflow preserves column minima`).toBeGreaterThan(grid.paneWidth);
    if (viewportWidth === 1280) expect(grid.scrollWidth, `${grid.label}: allocated widths include padding and fit the wide pane`).toBeLessThanOrEqual(grid.paneWidth + 1);
    for (const action of grid.actions) {
      if (viewportWidth === 1280) {
        expect(action.buttonLeft, `${grid.label}: wide action visible at inline edge`).toBeGreaterThanOrEqual(grid.paneLeft - 1);
        expect(action.buttonRight, `${grid.label}: wide action visible at inline edge`).toBeLessThanOrEqual(grid.paneRight + 1);
      }
      expect(action.labelLeft, `${grid.label}: action text inside button`).toBeGreaterThanOrEqual(action.buttonLeft - 1);
      expect(action.labelRight, `${grid.label}: action text inside button`).toBeLessThanOrEqual(action.buttonRight + 1);
      expect(action.buttonLeft, `${grid.label}: action inside cell`).toBeGreaterThanOrEqual(action.cellLeft - 1);
      expect(action.buttonRight, `${grid.label}: action inside cell`).toBeLessThanOrEqual(action.cellRight + 1);
    }
  }
}
