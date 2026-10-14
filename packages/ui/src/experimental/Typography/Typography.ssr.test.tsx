import { expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { Typography } from "./Typography";
import { Box } from "../Box/Box";
import { Stack } from "../Stack/Stack";
import { Surface } from "../Surface/Surface";
import { Card, CardContent } from "../Card/Card";
import { Divider } from "../Divider/Divider";
it("renders the native presentation hierarchy with browser globals absent", () => {
 expect(typeof window).toBe("undefined"); expect(typeof document).toBe("undefined");
 const html = renderToString(<Box as="main"><Stack><Surface><Card><CardContent><Typography as="h2" variant="h1">Course</Typography><Divider /></CardContent></Card></Surface></Stack></Box>);
 expect(html).toContain('<main'); expect(html).toContain('<article'); expect(html).toContain('<h2'); expect(html).toContain('role="separator"');
});
