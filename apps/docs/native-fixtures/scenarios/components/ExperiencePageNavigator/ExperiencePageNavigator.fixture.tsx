import type { Meta, StoryObj } from "../../../types";
import { useState } from "react";
import { Checkbox } from "@structured-growth/sg-ui/experimental";
import { SGNavigationProvider } from "@structured-growth/sg-ui";
import { ExperiencePageNavigator } from "@structured-growth/sg-ui/components";
import { Provider } from "@structured-growth/sg-ui/theme";
const meta = {
  title: "Navigation/ExperiencePageNavigator",
  component: ExperiencePageNavigator,
  tags: ["autodocs"],
  args: {
    pages: [{ key: "intro", title: "Introduction" }, { key: "lesson", title: "A lesson with a longer page heading that wraps in a narrow navigator" }],
    activePageKey: "intro", onSelectPage: () => {}, onAddPage: () => {}, onRemovePage: () => {}, onRenamePage: () => {}, onReorderPages: () => {},
  },
  decorators: [Story => <Provider><div style={{ width: 280, height: 360 }}><Story /></div></Provider>],
} satisfies Meta<typeof ExperiencePageNavigator>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {
  render: args => {
    const [pages, setPages] = useState(args.pages);
    const [activePageKey, setActivePageKey] = useState(args.activePageKey);
    return <ExperiencePageNavigator {...args} pages={pages} activePageKey={activePageKey}
      onSelectPage={setActivePageKey}
      onAddPage={() => setPages(current => [...current, { key: `page-${Date.now()}`, title: `Page ${current.length + 1}` }])}
      onRemovePage={key => { setPages(current => current.filter(page => page.key !== key)); if (activePageKey === key) setActivePageKey(pages.find(page => page.key !== key)?.key ?? null); }}
      onRenamePage={(key, title) => setPages(current => current.map(page => page.key === key ? { ...page, title } : page))}
      onReorderPages={(source, target) => setPages(current => {
        const next = [...current]; const sourceIndex = next.findIndex(page => page.key === source); const targetIndex = next.findIndex(page => page.key === target);
        const [page] = next.splice(sourceIndex, 1); next.splice(targetIndex, 0, page); return next;
      })} />;
  },
};
export const ReadOnly: Story = { args: { readOnly: true } };
export const LastPage: Story = { args: { pages: [{ key: "intro", title: "Introduction" }] } };
export const Dark: Story = { decorators: [Story => <Provider theme="dark"><Story /></Provider>] };
export const Scrollable: Story = { args: { pages: Array.from({ length: 20 }, (_, index) => ({ key: `page-${index}`, title: `Page heading ${index + 1}` })) } };

function AdjacentDestinationsFixture() {
  const [activePageKey,setActivePageKey] = useState('intro');
  const [accept,setAccept] = useState(false);
  const [linked,setLinked] = useState(false);
  const [disabled,setDisabled] = useState(false);
  const [requests,setRequests] = useState<string[]>([]);
  const pages = [{key:'intro',title:'Introduction'},{key:'practice',title:'Practice'}];
  const target = activePageKey === 'intro' ? pages[1] : pages[0];
  const destination = {key:target.key,label:target.title,disabled,...(linked?{href:'#'+target.key}:{})};
  return <><Checkbox label="Accept adjacent selection" checked={accept} onCheckedChange={setAccept}/>
    <Checkbox label="Use adjacent links" checked={linked} onCheckedChange={setLinked}/>
    <Checkbox label="Disable adjacent destination" checked={disabled} onCheckedChange={setDisabled}/>
    <SGNavigationProvider value={{pathname:activePageKey,navigate:href=>{setRequests(items=>[...items,'route:'+href]);setActivePageKey(href.slice(1));}}}>
      <ExperiencePageNavigator pages={pages} activePageKey={activePageKey} readOnly onSelectPage={key=>{setRequests(items=>[...items,'select:'+key]);if(accept)setActivePageKey(key);}}
        adjacentNavigation={activePageKey==='intro'?{previous:null,next:destination}:{previous:destination,next:null}}
        onAddPage={()=>{}} onRemovePage={()=>{}} onRenamePage={()=>{}} onReorderPages={()=>{}}/>
    </SGNavigationProvider><output aria-label="Adjacent requests">{JSON.stringify(requests)}</output>
  </>;
}
export const AdjacentDestinations: Story = {render: () => <AdjacentDestinationsFixture/>};
