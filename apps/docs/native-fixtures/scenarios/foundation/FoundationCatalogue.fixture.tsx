import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "../../types";
import { expect, userEvent, within } from "../../play-assertions";
import { ThemeScope } from "@structured-growth/sg-ui/theme";
import { tokens } from "@structured-growth/sg-ui/tokens";
import tokenSource from "../../token-source.json";
import { Box } from "@structured-growth/sg-ui/experimental";
import { Button } from "@structured-growth/sg-ui/experimental";
import { Progress } from "@structured-growth/sg-ui/experimental";
import { Stack } from "@structured-growth/sg-ui/experimental";
import { Surface } from "@structured-growth/sg-ui/experimental";
import { Typography } from "@structured-growth/sg-ui/experimental";

import { HierarchicalMenu, MonthPicker, YearPicker } from "@structured-growth/sg-ui/experimental";
import {SideNavigation,DocumentEditorToolbar,RichTextFormattingToolbar,TextColorPickerControl,type SideNavigationModel} from "@structured-growth/sg-ui/components";
import {DateRangeSelector,PeriodPicker,ToggleButtonGroup,type DateRange} from "@structured-growth/sg-ui/experimental";
import {SGAccountProvider,SGNavigationProvider,type SGAccountAdapter} from "@structured-growth/sg-ui/adapters";
import {StateIndicatorHost} from "../../state-indicator-host";
import type {FixtureGlobals} from "../../types";
import { IconPanelNavigation } from "@structured-growth/sg-ui/components";

const themes = ["light", "dark"] as const;
const densities = ["compact", "comfortable"] as const;
const palette = ["surface", "surfaceSubtle", "text", "textMuted", "border", "divider",
  "action", "actionHover", "onAction", "danger", "focus", "backdrop"] as const;
const spaces = ["space1", "space2", "space3", "space4"] as const;

const meta = {
  title: "Foundations/Foundation Catalogue",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { description: { component: "D-20: production semantic palettes, spacing, density, surfaces, keyboard focus and motion. Typography roles (including bodyAlt2) and font metadata are covered by [Foundations/Typefaces](?path=/story/foundations-typefaces--defaults). The shared native fixture host Provider supplies production tokens, locale and direction. Use the theme/density/direction toolbar for inherited examples; explicit light/dark comparisons remain fixed. No token overrides or simulated preference styles are used." } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function ThemeComparison({ children }: { children: ReactNode }) {
  return <Stack gap={4}>
    {themes.map(theme => <ThemeScope key={theme} theme={theme} style={{ background: tokens.surface, padding: tokens.space4 }}>
      <Stack gap={4}>
        <Typography as="h2" variant="h5">{theme} theme</Typography>
        {children}
      </Stack>
    </ThemeScope>)}
  </Stack>;
}

export const Palettes: Story = {
  render: () => <ThemeComparison>
    <Typography>Semantic colors change with the production scope. Labels remain outside swatches so color alone does not identify a token.</Typography>
    <Stack direction="row" wrap gap={4}>
      {palette.map(name => <Stack key={name} gap={2}>
        <Box aria-hidden="true" style={{ inlineSize: "calc(4 * var(--sgui-space4))", blockSize: "calc(3 * var(--sgui-space4))", background: tokens[name], border: `1px solid ${tokens.border}` }} />
        <Typography variant="code" as="code">{name}</Typography>
        <Typography variant="caption" tone="muted">{tokens[name]}</Typography>
      </Stack>)}
    </Stack>
    <Stack direction="row" wrap gap={3}>
      <Typography>Default text on surface</Typography>
      <Typography tone="muted">Muted text on surface</Typography>
      <Typography tone="primary">Primary text on surface</Typography>
      <Typography tone="danger">Danger text on surface</Typography>
      <Button>Action / onAction</Button>
    </Stack>
  </ThemeComparison>,
};

export const Spacing: Story = {
  render: () => <Stack gap={4}>
    <Typography as="h1" variant="h4">Production spacing scale</Typography>
    <Typography>Bars show each shared spacing step; outlined examples apply the same token as padding. Rem lengths follow the host root text size.</Typography>
    {spaces.map((name, index) => <Stack key={name} gap={2}>
      <Typography as="h2" variant="bodyAlt2">{name}: {tokenSource.shared[name].$value}</Typography>
      <Box aria-hidden="true" data-spacing-bar={name} style={{ inlineSize: tokens[name], blockSize: tokens.space4, background: tokens.action }} />
      <Surface variant="outlined" padding={(index + 1) as 1 | 2 | 3 | 4}>
        <Typography variant="body2">Padding uses {tokens[name]}</Typography>
      </Surface>
    </Stack>)}
  </Stack>,
  play: async ({ canvasElement }) => {
    const view = canvasElement.ownerDocument.defaultView!;
    const widths = spaces.map(name => {
      const bar = canvasElement.querySelector<HTMLElement>(`[data-spacing-bar="${name}"]`)!;
      return Number.parseFloat(view.getComputedStyle(bar).inlineSize);
    });
    expect(widths[0]).toBeGreaterThan(0);
    widths.slice(1).forEach((width, index) => expect(width).toBeGreaterThan(widths[index]));
  },
};

export const Density: Story = {
  render: () => <ThemeComparison>
    <Typography>Identical controls inherit each density scope. Control height and horizontal padding come from production density tokens.</Typography>
    {densities.map(density => <ThemeScope key={density} density={density}>
      <Stack gap={3}>
        <Typography as="h3" variant="bodyAlt2">{density}</Typography>
        <Typography variant="code" as="code">{tokens.controlHeight} / {tokens.controlPadding}</Typography>
        <Stack direction="row" wrap gap={2}>
          <Button>{density} primary</Button>
          <Button variant="outlined" tone="neutral">{density} neutral</Button>
          <Button variant="text">{density} text</Button>
          <Button disabled>{density} disabled</Button>
        </Stack>
      </Stack>
    </ThemeScope>)}
  </ThemeComparison>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const view = canvasElement.ownerDocument.defaultView!;
    const compact = canvas.getAllByRole("button", { name: "compact primary" });
    const comfortable = canvas.getAllByRole("button", { name: "comfortable primary" });
    compact.forEach((button, index) => {
      const smaller = view.getComputedStyle(button);
      const larger = view.getComputedStyle(comfortable[index]);
      expect(Number.parseFloat(smaller.minBlockSize)).toBeGreaterThan(0);
      expect(Number.parseFloat(larger.minBlockSize)).toBeGreaterThan(Number.parseFloat(smaller.minBlockSize));
      expect(Number.parseFloat(larger.paddingInlineStart)).toBeGreaterThan(Number.parseFloat(smaller.paddingInlineStart));
    });
  },
};

export const Surfaces: Story = {
  render: () => <ThemeComparison>
    <Typography>Every owned surface tone and variant uses the production surface, divider, radius and shadow tokens.</Typography>
    <Stack direction="row" wrap gap={4}>
      {(["default", "subtle"] as const).flatMap(tone =>
        (["flat", "outlined", "raised"] as const).map(variant => <Surface key={`${tone}-${variant}`} tone={tone} variant={variant} padding={4}>
          <Typography as="h3" variant="subtitle2">{tone} / {variant}</Typography>
          <Typography variant="body2">Surface text</Typography>
          <Typography variant="caption" tone="muted">Secondary text</Typography>
        </Surface>))}
    </Stack>
  </ThemeComparison>,
};

function FocusExample() {
  const [activations, setActivations] = useState(0);
  return <Stack gap={4}>
    <Typography as="h1" variant="h4">Keyboard focus</Typography>
    <Typography>Tab and Shift+Tab through the actions. Activate with Enter or Space. The disabled action is skipped. Change the global theme to inspect the ring on either surface; enable OS forced colors for the production system-color treatment.</Typography>
    <Typography variant="code" as="code">{tokens.focusWidth} / {tokens.focusOffset} / {tokens.focus}</Typography>
    <Surface tone="subtle" variant="outlined" padding={4}>
      <Stack direction="row" wrap gap={4}>
        <Button onPress={() => setActivations(count => count + 1)}>Primary focus action</Button>
        <Button variant="outlined" tone="neutral" onPress={() => setActivations(count => count + 1)}>Neutral focus action</Button>
        <Button disabled>Disabled focus action</Button>
        <Button variant="text" onPress={() => setActivations(count => count + 1)}>Text focus action</Button>
      </Stack>
    </Surface>
    <Typography role="status">Activations: {activations}</Typography>
  </Stack>;
}

export const KeyboardFocus: Story = {
  render: () => <FocusExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primary = canvas.getByRole("button", { name: "Primary focus action" });
    const neutral = canvas.getByRole("button", { name: "Neutral focus action" });
    // Establish the canvas starting point, then exercise actual keyboard traversal.
    primary.focus();
    await userEvent.tab();
    expect(neutral).toHaveFocus();
    expect(neutral).toHaveAttribute("data-focus-visible");
    await userEvent.keyboard(" ");
    expect(canvas.getByRole("status")).toHaveTextContent("Activations: 1");
    await userEvent.tab();
    expect(canvas.getByRole("button", { name: "Text focus action" })).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(neutral).toHaveFocus();
  },
};

export const MotionAndPreferences: Story = {
  render: () => <Stack gap={4}>
    <Typography as="h1" variant="h4">Production motion and display preferences</Typography>
    <Typography>Hover or press the action to inspect its background transition ({tokenSource.shared.motionDuration.$value}, {tokens.motionDuration}). Pending and indeterminate indicators use their existing production animations.</Typography>
    <Typography>Enable reduced motion in the OS or browser rendering tools: the button transition and spinner stop, circular progress stops rotating, and linear progress becomes a static full-width indicator. Progress names and determinate values remain available. Enable forced colors to inspect system focus, disabled and progress colors. Changing a theme or a token is not preference emulation.</Typography>
    <Stack direction="row" wrap gap={4}>
      <Button>Hover or press action</Button>
      <Button loading>Pending action</Button>
      <Button disabled>Unavailable action</Button>
    </Stack>
    <Progress label="Indeterminate linear work" />
    <Progress variant="circular" label="Indeterminate circular work" />
    <Progress label="Determinate work" value={40} valueText="40 of 100" />
  </Stack>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("progressbar", { name: "Determinate work" })).toHaveAttribute("aria-valuenow", "40");
    expect(canvas.getByRole("progressbar", { name: "Indeterminate linear work" })).not.toHaveAttribute("aria-valuenow");
    const circular = canvas.getByRole("progressbar", { name: "Indeterminate circular work" });
    expect(circular).not.toHaveAttribute("aria-valuenow");
    const view = canvasElement.ownerDocument.defaultView!;
    const animation = view.getComputedStyle(circular.querySelector("svg")!).animationName;
    const reduced = view.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) expect(animation).toBe("none");
    else expect(animation).not.toBe("none");
  },
};

// New acceptance host, separate from historical foundation scenarios.
function MotionCancellationExample({ side }: { side: "start" | "end" }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  return <ThemeScope>
    <Button onPress={() => setActiveId(null)}>Close from host</Button>
    <IconPanelNavigation aria-label="Motion tools" side={side} activeId={activeId} onActiveIdChange={setActiveId} items={[
      { id: "notes", label: "Notes", icon: <span>N</span>, content: <>
        <label>Notes draft<input defaultValue="Keep notes" /></label>
        <Button onPress={() => setActiveId("tasks")}>Switch to tasks</Button>
      </> },
      { id: "tasks", label: "Tasks", icon: <span>T</span>, content: <label>Tasks draft<input defaultValue="Keep tasks" /></label> },
    ]} />
  </ThemeScope>;
}
export const MotionCancellationStart: Story = { render: () => <MotionCancellationExample side="start" /> };
export const MotionCancellationEnd: Story = { render: () => <MotionCancellationExample side="end" /> };

function PointerPanelWidth({side,dir}:{side:"start"|"end";dir:"ltr"|"rtl"}) {
  const [requests,setRequests]=useState<number[]>([]);
  return <ThemeScope dir={dir} density="compact" style={{height:260}}>
    <IconPanelNavigation aria-label={`${side} width tools`} side={side} defaultActiveId="notes" resizable panelWidth={320} minPanelWidth={300} maxPanelWidth={322}
      onPanelWidthChange={width=>setRequests(previous=>[...previous,width])}
      items={[{id:"notes",label:`${side} notes`,icon:<span>N</span>,content:<label>Panel draft<input defaultValue="Retain draft"/></label>}]}/>
    <output aria-label={`${side} width requests`}>{JSON.stringify(requests)}</output>
  </ThemeScope>;
}
export const PointerPanelWidths:Story={render:()=> <><PointerPanelWidth side="start" dir="ltr"/><PointerPanelWidth side="end" dir="rtl"/></>};

export const StructuralSelectionIndicators:Story={render:(_args,{globals})=>
  <ThemeScope theme={globals.theme} density={globals.density} dir={globals.direction} data-testid="structural-indicator-scope" style={{width:"24rem",maxWidth:"100%"}}>
    <HierarchicalMenu label="Current page indicators" items={{sections:[{id:"pages",items:[
      {id:"current",label:"Current course",href:"#course",current:true},
      {id:"reports",label:"Course reports",href:"#reports"},
    ]}]}}/>
    <div style={{height:340}}><MonthPicker label="Selected month indicators" year={2026} defaultValue={4} min="2026-03-15" max="2026-06-10"/></div>
    <div data-testid="year-indicator-examples">
      <YearPicker label="Selected year indicators" defaultValue={2026} minYear={2020} maxYear={2031} isYearUnavailable={year=>year===2027}/>
      <YearPicker label="Paged year indicators" yearNavigation="paged" defaultValue={2026} minYear={2020} maxYear={2031} isYearUnavailable={year=>year===2027}/>
    </div>
  </ThemeScope>};

function CurrentSideNavigation({globals}:{globals:FixtureGlobals}){
 const [path,setPath]=useState('/course');
 const session={accountId:'native-state',email:'native@example.test',activeOrgId:'school',organizations:[{id:'school',name:'School'},{id:'other',name:'Other'}]};
 const adapter:SGAccountAdapter={getStoredAuthSession:()=>session,getStoredAuthSessions:()=>[session],setActiveStoredAuthSession:()=>{},markOrganizationSwitched:()=>{},logoutAccount:()=>new Promise<void>(()=>{}),logoutAllAccounts:()=>new Promise<void>(()=>{})};
 const model:SideNavigationModel={user:{initials:'ST',name:'State user',organization:'School',defaultOrganizationId:'school',organizations:[{id:'school',name:'School',role:'Member',billingScopeLabel:'Billing'},{id:'other',name:'Other',role:'Member',billingScopeLabel:'Billing'}]},rootMenu:{id:'root',sections:[{id:'routes',items:[{id:'course',label:'Current course',href:'/course'},{id:'reports',label:'Course reports',href:'/reports'}]}]}};
 return <StateIndicatorHost globals={globals}><SGAccountProvider value={adapter}><SGNavigationProvider value={{pathname:path,navigate:setPath}}>
  <div style={{height:400}}><SideNavigation aria-label="State navigation" model={model} onOrganizationChange={()=>new Promise<void>(()=>{})}/></div>
 </SGNavigationProvider></SGAccountProvider></StateIndicatorHost>;
}
export const CurrentSideNavigationStates:Story={render:(_args,{globals})=><CurrentSideNavigation globals={globals}/>};
function CurrentDocumentToolbar({globals}:{globals:FixtureGlobals}){
 const [bold,setBold]=useState(true),[italic,setItalic]=useState(false);
 return <StateIndicatorHost globals={globals}><DocumentEditorToolbar canEdit headingValue="normal" onHeadingChange={()=>{}} showZoomControls={false} showAlignmentControls={false}
  actions={{bold:{active:bold,onClick:()=>setBold(value=>!value)},italic:{active:italic,onClick:()=>setItalic(value=>!value)},bulletList:{active:false},orderedList:{active:false}}}/></StateIndicatorHost>;
}
export const CurrentDocumentToolbarStates:Story={render:(_args,{globals})=><CurrentDocumentToolbar globals={globals}/>};
function CurrentRichToolbar({globals}:{globals:FixtureGlobals}){
 const [bold,setBold]=useState(true),[underline,setUnderline]=useState(false);
 return <StateIndicatorHost globals={globals}><RichTextFormattingToolbar showFontFamilySelector={false} showFontSizeControls={false} boldActive={bold} onBold={()=>setBold(value=>!value)} italicActive="mixed" onItalic={()=>{}} underlineActive={underline} onUnderline={()=>setUnderline(value=>!value)}/></StateIndicatorHost>;
}
export const CurrentRichToolbarStates:Story={render:(_args,{globals})=><CurrentRichToolbar globals={globals}/>};
function CurrentColorPreset({globals}:{globals:FixtureGlobals}){
 const [color,setColor]=useState('var(--sgui-action)');
 return <StateIndicatorHost globals={globals}><TextColorPickerControl value={color} onChange={setColor}/></StateIndicatorHost>;
}
export const CurrentColorPresetStates:Story={render:(_args,{globals})=><CurrentColorPreset globals={globals}/>};
function CurrentQuarter({globals}:{globals:FixtureGlobals}){
 const [value,setValue]=useState<DateRange|null>({start:'2026-10-01',end:'2026-12-31'});
 return <StateIndicatorHost globals={globals}><form aria-label="Quarter state form"><PeriodPicker label="Quarter states" unit="quarter" display="inline" value={value} onValueChange={setValue} referenceDate="2026-10-16" name="quarter"/></form></StateIndicatorHost>;
}
export const CurrentQuarterStates:Story={render:(_args,{globals})=><CurrentQuarter globals={globals}/>};
function CurrentRangeIntents({globals}:{globals:FixtureGlobals}){
 return <StateIndicatorHost globals={globals}>
  <DateRangeSelector label="Endpoint intent states" months={1} rangeClickBehavior="active-endpoint" defaultValue={{start:'2026-10-07',end:'2026-10-09'}}/>
  <DateRangeSelector label="Adjustment intent states" months={1} defaultValue={{start:'2026-10-07',end:'2026-10-09'}}/>
 </StateIndicatorHost>;
}
export const CurrentRangeIntentStates:Story={render:(_args,{globals})=><CurrentRangeIntents globals={globals}/>};
export const CurrentForcedToggleStates:Story={render:(_args,{globals})=><StateIndicatorHost globals={globals}><ToggleButtonGroup label="Forced toggle choices" defaultSelectedIds={['selected']} options={[{id:'selected',label:'Selected option'},{id:'peer',label:'Other option'}]}/></StateIndicatorHost>};
