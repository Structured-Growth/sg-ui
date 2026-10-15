'use client';
import {ThemeScope} from '@structured-growth/sg-ui/theme';
import {Button,Menu,Navigation,NavigationItem,Stack,TextField} from '@structured-growth/sg-ui/experimental';
import {DashboardIcon} from '@structured-growth/sg-ui/icons';
import {Example} from '../components/Example';
import {useExampleSource} from './useExampleSource';

export function SizingThemeExample() {
  const source=useExampleSource();
  const body=`<ThemeScope density="compact" interactionMode="touch" style={{"--sgui-touch-target-size":"3rem","--sgui-touch-navigation-icon-size":"1.5rem"}}>
  <Stack gap={3}>
    <Navigation label="Workspace navigation"><NavigationItem href="#workspace"><DashboardIcon size="var(--sgui-side-navigation-icon-size)"/>Workspace</NavigationItem></Navigation>
    <TextField label="Workspace name" defaultValue="Design workspace"/>
    <Menu label="Workspace actions" trigger={<Button>Open workspace actions</Button>} items={[{id:'settings',label:'Workspace settings'},{id:'members',label:'Manage members'}]}/>
  </Stack>
</ThemeScope>`;
  return <Example title="Theme-sized touch targets" description="Compact spacing with a theme-defined 48px target floor and 24px navigation icons, inherited into the menu portal." source={source({name:'ThemeSizedTouchTargets',imports:["import { Button, Menu, Navigation, NavigationItem, Stack, TextField } from '@structured-growth/sg-ui/experimental';","import { DashboardIcon } from '@structured-growth/sg-ui/icons';"],body})}>
    <ThemeScope density="compact" interactionMode="touch" style={{'--sgui-touch-target-size':'3rem','--sgui-touch-navigation-icon-size':'1.5rem'}}>
      <Stack gap={3}>
        <Navigation label="Workspace navigation"><NavigationItem href="#workspace"><DashboardIcon size="var(--sgui-side-navigation-icon-size)"/>Workspace</NavigationItem></Navigation>
        <TextField label="Workspace name" defaultValue="Design workspace"/>
        <Menu label="Workspace actions" trigger={<Button>Open workspace actions</Button>} items={[{id:'settings',label:'Workspace settings'},{id:'members',label:'Manage members'}]}/>
      </Stack>
    </ThemeScope>
  </Example>;
}
