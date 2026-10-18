import {defaultThemeTokens} from '@structured-growth/sg-ui/tokens';
import {palettes, type PaletteReference} from './palettes';

/** Mirrors the public foundation's 42 color semantics, with app-owned palette definitions. */
export const semanticRoles = [
  'surface','surfaceSubtle','text','textMuted','textSubtle','border','divider','action','actionHover','onAction','danger','focus','backdrop',
  'surfaceRaised','surfaceOverlay','surfaceHover','surfacePressed','textInverse','textDisabled','borderSubtle','separator',
  'actionPressed','actionNeutral','actionNeutralHover','actionNeutralPressed','onActionNeutral','actionDestructive','onActionDestructive',
  'surfaceSelected','textSelected','borderSelected','surfaceDisabled','borderDisabled','validationError','validationInfo','validationSurface',
  'focusOnRaised','focusOnOverlay','actionDestructiveHover','actionDestructivePressed','validationSuccess','validationWarning',
] as const;
export type SemanticRole = typeof semanticRoles[number];
export type SemanticReference = PaletteReference | `semantic.${SemanticRole}`;
export type SemanticMap = Record<SemanticRole, SemanticReference>;
export type ThemeIdentity = 'none' | 'material' | 'apple' | 'editorial' | 'structured-growth';
export type Appearance = 'light' | 'dark';
export type Contrast = 'standard' | 'increased';
export type ThemeModes = Record<Appearance, Record<Contrast, SemanticMap>>;
export type CoreColors = Pick<SemanticMap,'surface'|'surfaceSubtle'|'surfaceRaised'|'surfaceOverlay'|'surfaceHover'|'surfacePressed'|'text'|'textMuted'|'border'|'borderSubtle'|'divider'|'action'|'actionHover'|'actionPressed'|'onAction'|'focus'>;
const semantic = <Role extends SemanticRole>(role:Role): `semantic.${Role}` => `semantic.${role}`;

/** All derived roles are explicit references, not repeated color literals. */
function standardMap(core:CoreColors, mode:Appearance):SemanticMap {
  const dark = mode === 'dark';
  return {
    ...core,
    textSubtle:dark ? 'palette.shared.gray400' : 'palette.shared.gray600',
    danger:dark ? 'palette.shared.red400' : 'palette.shared.red700',
    backdrop:dark ? 'palette.shared.blackAlpha70' : 'palette.shared.slate900Alpha50',
    textInverse:semantic('surface'), textDisabled:semantic('textMuted'), separator:semantic('divider'),
    actionNeutral:semantic('text'), actionNeutralHover:semantic('textMuted'), actionNeutralPressed:semantic('text'),
    onActionNeutral:semantic('surface'), actionDestructive:semantic('danger'), onActionDestructive:semantic('onAction'),
    surfaceSelected:semantic('surfaceSubtle'), textSelected:semantic('text'), borderSelected:semantic('action'),
    surfaceDisabled:semantic('surfaceSubtle'), borderDisabled:semantic('divider'), validationError:semantic('danger'),
    validationInfo:semantic('action'), validationSurface:semantic('surfaceSubtle'), focusOnRaised:semantic('focus'), focusOnOverlay:semantic('focus'),
    actionDestructiveHover:dark ? 'palette.shared.red300' : 'palette.shared.red800',
    actionDestructivePressed:dark ? 'palette.shared.red300' : 'palette.shared.red800',
    validationSuccess:dark ? 'palette.shared.green400' : 'palette.shared.green900',
    validationWarning:dark ? 'palette.shared.amber300' : 'palette.shared.amber800',
  };
}
const cores:Record<Exclude<ThemeIdentity,'none'>, Record<Appearance, CoreColors>> = {
  material: {
    light:{surface:'palette.material.neutral99',surfaceSubtle:'palette.material.neutralVariant95',surfaceRaised:'palette.material.neutralVariant97',surfaceOverlay:'palette.material.neutralVariant97',surfaceHover:'palette.material.neutralVariant92',surfacePressed:'palette.material.neutralVariant90',text:'palette.material.neutral10',textMuted:'palette.material.neutralVariant35',border:'palette.material.neutralVariant50',borderSubtle:'palette.material.neutralVariant50',divider:'palette.material.neutralVariant50',action:'palette.material.primary40',actionHover:'palette.material.primary30',actionPressed:'palette.material.primary35',onAction:'palette.shared.white',focus:'palette.material.primary40'},
    dark:{surface:'palette.material.neutral10',surfaceSubtle:'palette.material.neutralVariant15',surfaceRaised:'palette.material.neutralVariant20',surfaceOverlay:'palette.material.neutralVariant20',surfaceHover:'palette.material.neutralVariant25',surfacePressed:'palette.material.neutralVariant30',text:'palette.material.neutral90',textMuted:'palette.material.neutralVariant80',border:'palette.material.neutralVariant60',borderSubtle:'palette.material.neutralVariant60',divider:'palette.material.neutralVariant60',action:'palette.material.primary80',actionHover:'palette.material.primary90',actionPressed:'palette.material.primary70',onAction:'palette.material.primary20',focus:'palette.material.primary80'},
  },
  apple: {
    light:{surface:'palette.shared.white',surfaceSubtle:'palette.apple.gray50',surfaceRaised:'palette.shared.white',surfaceOverlay:'palette.shared.white',surfaceHover:'palette.apple.gray200',surfacePressed:'palette.apple.gray250',text:'palette.apple.gray950',textMuted:'palette.apple.gray800',border:'palette.apple.gray650',borderSubtle:'palette.apple.gray650',divider:'palette.apple.gray650',action:'palette.apple.blue700',actionHover:'palette.apple.blue800',actionPressed:'palette.apple.blue850',onAction:'palette.shared.white',focus:'palette.apple.blue700'},
    dark:{surface:'palette.shared.black',surfaceSubtle:'palette.apple.gray950',surfaceRaised:'palette.apple.gray900',surfaceOverlay:'palette.apple.gray900',surfaceHover:'palette.apple.gray850',surfacePressed:'palette.apple.gray800',text:'palette.shared.white',textMuted:'palette.apple.gray300',border:'palette.apple.gray550',borderSubtle:'palette.apple.gray550',divider:'palette.apple.gray550',action:'palette.apple.blue400',actionHover:'palette.apple.blue300',actionPressed:'palette.apple.blue500',onAction:'palette.apple.blue950',focus:'palette.apple.blue400'},
  },
  editorial: {
    light:{surface:'palette.editorial.cream50',surfaceSubtle:'palette.editorial.cream200',surfaceRaised:'palette.editorial.cream50',surfaceOverlay:'palette.editorial.cream50',surfaceHover:'palette.editorial.cream200',surfacePressed:'palette.editorial.cream200',text:'palette.editorial.stone950',textMuted:'palette.editorial.stone700',border:'palette.editorial.stone600',borderSubtle:'palette.shared.slate300',divider:'palette.shared.slate300',action:'palette.editorial.rust800',actionHover:'palette.editorial.rust900',actionPressed:'palette.editorial.rust950',onAction:'palette.shared.white',focus:'palette.editorial.rust800'},
    dark:{surface:'palette.editorial.stone950',surfaceSubtle:'palette.editorial.stone900',surfaceRaised:'palette.editorial.stone900',surfaceOverlay:'palette.editorial.stone900',surfaceHover:'palette.editorial.stone900',surfacePressed:'palette.editorial.stone900',text:'palette.editorial.stone50',textMuted:'palette.editorial.stone200',border:'palette.editorial.stone300',borderSubtle:'palette.shared.slate600',divider:'palette.shared.slate600',action:'palette.editorial.orange200',actionHover:'palette.editorial.orange100',actionPressed:'palette.editorial.orange300',onAction:'palette.editorial.stone950',focus:'palette.editorial.orange200'},
  },
  'structured-growth': {
    light:{surface:'palette.structured-growth.canvas',surfaceSubtle:'palette.structured-growth.subtle',surfaceRaised:'palette.structured-growth.paper',surfaceOverlay:'palette.structured-growth.paper',surfaceHover:'palette.structured-growth.hover',surfacePressed:'palette.structured-growth.gold',text:'palette.structured-growth.navy',textMuted:'palette.structured-growth.mutedInk',border:'palette.structured-growth.controlBorder',borderSubtle:'palette.structured-growth.softBorder',divider:'palette.structured-growth.softBorder',action:'palette.structured-growth.navy',actionHover:'palette.structured-growth.navyHover',actionPressed:'palette.structured-growth.navyPressed',onAction:'palette.structured-growth.canvas',focus:'palette.structured-growth.goldAccessible'},
    dark:{surface:'palette.structured-growth.night',surfaceSubtle:'palette.structured-growth.nightSubtle',surfaceRaised:'palette.structured-growth.nightRaised',surfaceOverlay:'palette.structured-growth.nightRaised',surfaceHover:'palette.structured-growth.nightHover',surfacePressed:'palette.structured-growth.nightGold',text:'palette.structured-growth.lightInk',textMuted:'palette.structured-growth.mutedLightInk',border:'palette.structured-growth.darkBorder',borderSubtle:'palette.structured-growth.darkDivider',divider:'palette.structured-growth.darkDivider',action:'palette.structured-growth.goldLight',actionHover:'palette.structured-growth.goldPale',actionPressed:'palette.structured-growth.gold',onAction:'palette.structured-growth.navy',focus:'palette.structured-growth.goldPale'},

  },
};
const contrastAccents:Record<ThemeIdentity, Record<Appearance, PaletteReference>> = {
  none:{light:'palette.globalLight.actionPressed',dark:'palette.globalDark.actionHover'},
  material:{light:'palette.material.purple900',dark:'palette.material.primary90'},
  apple:{light:'palette.apple.blue900',dark:'palette.apple.blue200'},
  editorial:{light:'palette.editorial.rust950',dark:'palette.editorial.orange100'},
  'structured-growth':{light:'palette.structured-growth.navyPressed',dark:'palette.structured-growth.goldPale'},
};
function increasedMap(identity:ThemeIdentity,mode:Appearance):SemanticMap {
  const dark = mode === 'dark';
  const accent = contrastAccents[identity][mode];
  const surface:PaletteReference = identity==='structured-growth' ? (dark ? 'palette.structured-growth.night' : 'palette.structured-growth.canvas') : dark ? 'palette.shared.gray975' : 'palette.shared.white';
  const subtle:PaletteReference = identity==='structured-growth' ? (dark ? 'palette.structured-growth.nightSubtle' : 'palette.structured-growth.subtle') : dark ? 'palette.shared.gray925' : 'palette.shared.gray50';
  const text:PaletteReference = dark ? 'palette.shared.white' : 'palette.shared.black';
  const muted:PaletteReference = dark ? 'palette.shared.gray100' : 'palette.shared.gray850';
  return {
    surface, surfaceSubtle:subtle, surfaceRaised:surface, surfaceOverlay:surface, surfaceHover:subtle, surfacePressed:subtle,
    text, textMuted:muted, textSubtle:muted, border:text, borderSubtle:muted, divider:muted, separator:muted,
    action:accent, actionHover:accent, actionPressed:accent, onAction:surface, focus:accent,
    danger:dark ? 'palette.shared.red200' : 'palette.shared.red900',
    backdrop:dark ? 'palette.shared.blackAlpha70' : 'palette.shared.slate900Alpha50',
    textInverse:surface, textDisabled:muted,
    actionNeutral:text, actionNeutralHover:muted, actionNeutralPressed:text, onActionNeutral:surface,
    actionDestructive:semantic('danger'), onActionDestructive:surface,
    surfaceSelected:subtle, textSelected:text, borderSelected:accent,
    surfaceDisabled:subtle, borderDisabled:muted, validationError:semantic('danger'), validationInfo:accent, validationSurface:subtle,
    focusOnRaised:accent, focusOnOverlay:accent, actionDestructiveHover:semantic('danger'), actionDestructivePressed:semantic('danger'),
    validationSuccess:dark ? 'palette.shared.green200' : 'palette.shared.green900',
    validationWarning:dark ? 'palette.shared.amber200' : 'palette.shared.amber950',
  };
}
export const forcedColors:SemanticMap = {
  surface:'palette.os.canvas',surfaceSubtle:'palette.os.canvas',surfaceRaised:'palette.os.canvas',surfaceOverlay:'palette.os.canvas',surfaceHover:'palette.os.canvas',surfacePressed:'palette.os.canvas',
  text:'palette.os.canvasText',textMuted:'palette.os.canvasText',textSubtle:'palette.os.canvasText',textInverse:'palette.os.canvas',textDisabled:'palette.os.grayText',
  border:'palette.os.buttonText',borderSubtle:'palette.os.buttonText',divider:'palette.os.canvasText',separator:'palette.os.canvasText',
  action:'palette.os.highlight',actionHover:'palette.os.highlight',actionPressed:'palette.os.highlight',onAction:'palette.os.highlightText',focus:'palette.os.highlight',
  danger:'palette.os.canvasText',backdrop:'palette.os.canvas',actionNeutral:'palette.os.buttonFace',actionNeutralHover:'palette.os.buttonFace',actionNeutralPressed:'palette.os.buttonFace',onActionNeutral:'palette.os.buttonText',
  actionDestructive:'palette.os.buttonText',actionDestructiveHover:'palette.os.buttonText',actionDestructivePressed:'palette.os.buttonText',onActionDestructive:'palette.os.canvas',
  surfaceSelected:'palette.os.highlight',textSelected:'palette.os.highlightText',borderSelected:'palette.os.highlight',surfaceDisabled:'palette.os.canvas',borderDisabled:'palette.os.grayText',
  validationError:'palette.os.canvasText',validationInfo:'palette.os.canvasText',validationSurface:'palette.os.canvas',validationSuccess:'palette.os.canvasText',validationWarning:'palette.os.canvasText',focusOnRaised:'palette.os.highlight',focusOnOverlay:'palette.os.highlight',
};
export const themeIdentitySettings:Record<ThemeIdentity,{fontFamily:string;controlRadius:string;fieldRadius:string}> = {
  none:{fontFamily:defaultThemeTokens.light['--sgui-font-family'],controlRadius:defaultThemeTokens.light['--sgui-control-radius'],fieldRadius:defaultThemeTokens.light['--sgui-field-radius']},
  material:{fontFamily:'Roboto, "Noto Sans", Arial, sans-serif',controlRadius:'1.5rem',fieldRadius:'1.5rem'},
  apple:{fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',controlRadius:'0.625rem',fieldRadius:'0.5rem'},
  editorial:{fontFamily:'Georgia, "Times New Roman", serif',controlRadius:'0.125rem',fieldRadius:'0.125rem'},
  'structured-growth':{fontFamily:'"Geist", "Geist Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',controlRadius:'0.375rem',fieldRadius:'0.375rem'},
};
const createModes = (identity:ThemeIdentity):ThemeModes => {
  const standard = (appearance:Appearance):SemanticMap => {
    if(identity==='none')return Object.fromEntries(semanticRoles.map(role=>[role,`palette.${appearance==='light'?'globalLight':'globalDark'}.${role}`])) as SemanticMap;
    const map=standardMap(cores[identity][appearance],appearance);
    if(identity!=='structured-growth')return map;
    return {...map,
      surfaceSelected:appearance==='light'?'palette.structured-growth.selected':'palette.structured-growth.nightGold',
      borderSelected:appearance==='light'?'palette.structured-growth.goldAccessible':'palette.structured-growth.goldLight',
    };
  };
  return {
    light:{standard:standard('light'),increased:increasedMap(identity,'light')},
    dark:{standard:standard('dark'),increased:increasedMap(identity,'dark')},
  };
};
export const themeGraph = {
  palettes, semanticRoles,
  themes:{none:createModes('none'),material:createModes('material'),apple:createModes('apple'),editorial:createModes('editorial'),'structured-growth':createModes('structured-growth')},
  identitySettings:themeIdentitySettings,
  forcedColors,
} as const;
export type ThemeGraph = typeof themeGraph;
