/** Raw named color values. Semantic and component layers reference these names. */
export const palettes = {
  shared: {
    white:'#ffffff', black:'#000000', slate50:'#f8fafc', slate200:'#e2e8f0', slate300:'#cbd5e1',
    slate600:'#475569', slate800:'#1e293b', slate900:'#0f172a',
    red300:'#fca5a5', red400:'#f87171', red700:'#b91c1c', red800:'#991b1b',
    green400:'#4ade80', green700:'#15803d', amber300:'#fcd34d', amber800:'#92400e',
    slate900Alpha50:'#0f172a80', blackAlpha70:'#000000b3',
    gray975:'#080808', gray925:'#171717', gray50:'#f5f5f5',
    gray100:'#e5e5e5', gray850:'#262626',
    red200:'#fecaca', red900:'#7f1d1d', green200:'#bbf7d0', green900:'#14532d', amber200:'#fde68a', amber950:'#451a03',
  },
  material: {
    primary20:'#381e72', primary30:'#57418c', primary35:'#4f378b', primary40:'#6750a4',
    primary70:'#b69df8', primary80:'#d0bcff', primary90:'#eaddff', purple900:'#3b2068',
    neutral10:'#1c1b1f', neutralVariant15:'#2b2930', neutralVariant20:'#302d38',
    neutralVariant25:'#3a3544', neutralVariant30:'#443d50', neutralVariant35:'#49454f',
    neutralVariant50:'#79747e', neutralVariant60:'#938f99', neutralVariant80:'#cac4d0',
    neutral90:'#e6e1e5', neutralVariant90:'#e6dfea', neutralVariant92:'#ece5f2',
    neutralVariant95:'#f3edf7', neutralVariant97:'#f7f2fa', neutral99:'#fffbfe',
  },
  apple: {
    blue950:'#001b33', blue900:'#002f6c', blue850:'#003d85', blue800:'#004da8', blue700:'#005fcc',
    blue500:'#409cff', blue400:'#64b5ff', blue300:'#94cbff', blue200:'#b3d9ff',
    gray950:'#1c1c1e', gray900:'#2c2c2e', gray850:'#3a3a3c', gray800:'#48484a',
    gray650:'#86868b', gray600:'#8e8e93', gray550:'#98989d', gray300:'#c7c7cc', gray250:'#d1d1d6', gray200:'#e5e5ea', gray50:'#f2f2f7',
  },
  editorial: {
    rust950:'#431407', rust900:'#65220e', rust800:'#7c2d12', orange300:'#fdba74', orange200:'#fed7aa', orange100:'#ffedd5',
    stone950:'#1c1917', stone900:'#292524', stone700:'#44403c', stone600:'#57534e',
    stone300:'#d6d3d1', stone200:'#e7e5e4', stone50:'#fafaf9', cream200:'#fef3c7', cream50:'#fffbeb',
  },
  'structured-growth': {
    indigo900:'#312e81', indigo800:'#3730a3', indigo700:'#4338ca', indigo400:'#818cf8', indigo300:'#a5b4fc', indigo200:'#c7d2fe',
    white:'#ffffff', indigo25:'#f5f6fc', gray900:'#111827', slate875:'#172033', slate800:'#1e293b',
  },
  os: {
    canvas:'Canvas', canvasText:'CanvasText', buttonFace:'ButtonFace', buttonText:'ButtonText',
    grayText:'GrayText', highlight:'Highlight', highlightText:'HighlightText',
  },
} as const;

export type PaletteName = keyof typeof palettes;
export type PaletteReference = {[Name in PaletteName]: `palette.${Name}.${keyof (typeof palettes)[Name] & string}`}[PaletteName];
