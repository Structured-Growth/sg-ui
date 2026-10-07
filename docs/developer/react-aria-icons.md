# Owned public icon contracts

Task references: M-36, I-02–I-07, B-04.

The public icon catalog now uses owned SVG components backed by Lucide vectors.
All existing public icon names remain; symbols used by the editor, toolbar, account
actions and other direct imports are also available from the same public catalog.
There is no MUI icon implementation or upstream SVG prop type in these entry points.
The experimental icon entry points share these implementations.

Import the stylesheet once and provide Provider or ThemeScope for direction-aware
styles. Individual imports keep the rest of the catalog out of the module graph:

```tsx
import "@structured-growth/sg-ui/styles.css";
import { AddIcon, type IconProps } from "@structured-growth/sg-ui/icons/AddIcon";
import { getActivityTypeIcon } from "@structured-growth/sg-ui/icons";

<AddIcon size={20} />;
getActivityTypeIcon("lesson", { size: 20 });
```

The root, /components and /icons barrels export the same named icons, IconProps,
getActivityTypeIcon and ActivityIconOptions. /icons/<Name>Icon exports the named icon
and IconProps. Import a specific icon for basic controls.

## Breaking prop mappings

| Previous contract | Owned replacement |
| --- | --- |
| fontSize=small/medium/large/inherit | size={20}/{24}/{35}/"1em" |
| sx | className and native style |
| Theme palette color name | color with a CSS color or owned token variable |
| titleAccess | label for a meaningful standalone icon |
| SvgIconProps/component/inheritViewBox/htmlColor | Owned IconProps; native SVG ref |
| getActivityTypeIcon(type, fontSize) | getActivityTypeIcon(type, { size, overrides, fallback }) |

Icons default to size="1em", strokeWidth=2, color="currentColor" and fill="none".
An icon is decorative by default: aria-hidden=true and focusable=false. Name the
containing action at the control level. Set label for a standalone meaningful image;
it renders role=img and aria-label. Host labels are translated by the host.
The native SVG ref, id, className and style are supported.
Directional arrows and navigation symbols mirror in RTL using compiled scoped CSS.
Use mirrorInRtl to explicitly override a symbol's default.

## Activity behavior

The activity helper matches case-insensitively, preserves the known alias groups
and defaults to 20px decorative icons. It does not infer names from host data.

| Activity type | Public icon |
| --- | --- |
| lesson | MenuBookOutlinedIcon |
| quiz, exam | QuizOutlinedIcon |
| assignment, project | FactCheckOutlinedIcon |
| lab, practice | ScienceOutlinedIcon |
| Unknown, empty, null or undefined | WorkOutlineOutlinedIcon |

The optional overrides record uses lower-case keys and applies before built-in
mapping, including unknown types. An explicit null override suppresses the icon.
The fallback replaces the unknown-type symbol; an explicit null fallback suppresses
it. Missing overrides inherit the built-in map. The helper never fetches activity
metadata or application data. Host-provided nodes own their styling and accessible
names. Activity aliases retain their presentation meaning without prescribing a
host's database or API names.

## Complete symbol mapping

These mappings cover both the former public barrel and direct source imports.
Existing Filled/Outlined names remain compatibility names; the replacement catalog
uses a consistent stroked vector style.

| SGUI public name | Vector symbol |
| --- | --- |
| AccessTimeFilledIcon | Clock |
| AccountCircleIcon | CircleUserRound |
| AddIcon | Plus |
| ApartmentIcon | Building |
| ArrowDropDownIcon | ChevronDown |
| ArrowForwardIcon | ArrowRight |
| AssignmentTurnedInIcon | ClipboardCheck |
| AutoStoriesIcon | BookOpen |
| BookIcon | Book |
| BuildIcon | Wrench |
| BusinessCenterIcon | BriefcaseBusiness |
| CachedIcon | RefreshCw |
| CalendarTodayIcon | CalendarDays |
| CheckIcon | Check |
| ChevronRightIcon | ChevronRight |
| CircleIcon | Circle |
| ClassIcon | NotebookTabs |
| CloseIcon | X |
| CodeIcon | Code |
| ComputerIcon | Monitor |
| ContentCopyIcon | Copy |
| CorporateFareIcon | Building2 |
| DashboardIcon | LayoutDashboard |
| DeleteOutlineIcon | Trash2 |
| DescriptionIcon | FileText |
| DescriptionOutlinedIcon | FileText |
| DnsIcon | Server |
| DragIndicatorIcon | GripVertical |
| EditIcon | Pencil |
| EventIcon | Calendar |
| ExpandLessIcon | ChevronUp |
| ExpandMoreIcon | ChevronDown |
| ExploreIcon | Compass |
| FactCheckOutlinedIcon | ClipboardCheck |
| FilterListIcon | ListFilter |
| FontDownloadIcon | Type |
| FormatAlignCenterIcon | AlignCenter |
| FormatAlignJustifyIcon | AlignJustify |
| FormatAlignLeftIcon | AlignLeft |
| FormatAlignRightIcon | AlignRight |
| FormatBoldIcon | Bold |
| FormatClearIcon | RemoveFormatting |
| FormatColorFillIcon | PaintBucket |
| FormatColorTextIcon | Baseline |
| FormatIndentDecreaseIcon | IndentDecrease |
| FormatIndentIncreaseIcon | IndentIncrease |
| FormatItalicIcon | Italic |
| FormatListBulletedIcon | List |
| FormatListNumberedIcon | ListOrdered |
| FormatSizeIcon | CaseSensitive |
| FormatStrikethroughIcon | Strikethrough |
| FormatUnderlinedIcon | Underline |
| GroupIcon | Users |
| HighlightIcon | Highlighter |
| HorizontalRuleIcon | Minus |
| ImageIcon | Image |
| KeyboardArrowDownIcon | ChevronDown |
| KeyboardArrowLeftIcon | ChevronLeft |
| LinkIcon | Link |
| LockIcon | Lock |
| LockResetIcon | LockKeyholeOpen |
| LogoutIcon | LogOut |
| ManageAccountsIcon | UserRoundCog |
| MenuBookIcon | BookOpen |
| MenuBookOutlinedIcon | BookOpen |
| MoreHorizIcon | Ellipsis |
| MoreVertIcon | EllipsisVertical |
| PaidIcon | CircleDollarSign |
| PeopleIcon | Users |
| PersonIcon | UserRound |
| PersonAddIcon | UserRoundPlus |
| PhotoCameraBackIcon | Camera |
| QuizOutlinedIcon | FileQuestionMark |
| RedoIcon | Redo2 |
| RemoveIcon | Minus |
| SchoolIcon | GraduationCap |
| ScienceOutlinedIcon | FlaskConical |
| SearchIcon | Search |
| SortIcon | ArrowDownUp |
| StarIcon | Star |
| SubscriptIcon | Subscript |
| SuperscriptIcon | Superscript |
| TaskAltIcon | CircleCheck |
| TerminalIcon | Terminal |
| TranslateIcon | Languages |
| TuneIcon | SlidersHorizontal |
| UndoIcon | Undo2 |
| UploadFileIcon | FileUp |
| ViewColumnIcon | Columns3 |
| ViewListIcon | Rows3 |
| ViewWeekIcon | Columns3 |
| VisibilityOffIcon | EyeOff |
| VpnKeyIcon | KeyRound |
| WindowIcon | PanelsTopLeft |
| WorkOutlineOutlinedIcon | Briefcase |
