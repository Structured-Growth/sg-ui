# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: date-picker-availability-parity.spec.ts >> datetime: host availability guards typed values and native submission
- Location: tests/date-picker-availability-parity.spec.ts:5:2

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.check: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('region', { name: /^(?:(?:AppModal|Icons|Button|Dialog|Popover|Tabs|Typography|Box|Stack|Surface|Card|Divider|Icon button|Button group|Menu|Split action|Link|Breadcrumbs|Tooltip|List|Navigation|Disclosure|Collapse|Chip|Badge|Progress|Status|Avatar|Table|Pagination|Provider|ThemeScope|PeriodPicker|DateTimeRangePicker|DateRangeComparisonPicker|SearchField|TextField|TextArea|Select|ComboBox|AsyncMultiSelect|Checkbox|Switch|RadioGroup|ToggleButton|ToggleButtonGroup|TagGroup|DateField|TimeField|Calendar|DatePicker|DateRangePicker|DateRangeSelector|IconPanelNavigation|AuthShell|AppShell|AppPageHeader|AppPageTabs|ExperiencePageNavigator|SideNavigation|EditableTitleField|DocumentEditorLayout|DocumentEditorToolbar|ContentEditorChrome|FloatingTextSelectionToolbar|RichTextFormattingToolbar|InsertContentMenuControl|TextAlignMenuControl|TextColorPickerControl|TextStyleMenuControl|ColumnsLayoutModal|LinkUrlModal|ImageUploadModal|PageRichTextEditorSection|SGNavigationProvider|SGLink|SGAccountProvider|SGTranslationProvider|AppInlineProgress|AppOperationSteps|AppPaginationFooter|ClassCardFrame|InstructorClassCard|LearnerClassCard|CardCollectionWithFooter|AppDataGrid|AppDataGridShell|DataToolbar|DataToolbarSelectionMenu|DataGridDragHandle|LearnerClassesDataGrid|DataGrid|RowSubHeader|Grid presets): )?Date and time availability$/ }).locator('[data-docs-preview]').getByRole('form', { name: 'Booking form' }).getByRole('checkbox', { name: 'Accept bookings on October 16', exact: true })
    - locator resolved to <input title="" tabindex="0" type="checkbox" aria-labelledby="_r_6n_" data-react-aria-pressable="true"/>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <span aria-hidden="true" class="sgui_indicator_1de517d4"></span> intercepts pointer events
  - retrying click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div dir="ltr" lang="en-US" data-sgui-scope="" data-docs-preview="" data-sgui-theme="light" data-sgui-density="compact" data-sgui-interaction="auto" data-demo-identity="material" data-demo-contrast="standard" class="sgui_root_96098259 sgui_scope_4c1123f0 docs_preview__Kl6Zr">…</div> intercepts pointer events
  - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <span aria-hidden="true" class="sgui_indicator_1de517d4"></span> intercepts pointer events
    - retrying click action
      - waiting 100ms
    14 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <span aria-hidden="true" class="sgui_indicator_1de517d4"></span> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div dir="ltr" lang="en-US" data-sgui-scope="" data-docs-preview="" data-sgui-theme="light" data-sgui-density="compact" data-sgui-interaction="auto" data-demo-identity="material" data-demo-contrast="standard" class="sgui_root_96098259 sgui_scope_4c1123f0 docs_preview__Kl6Zr">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <span aria-hidden="true" class="sgui_indicator_1de517d4"></span> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <span aria-hidden="true" class="sgui_indicator_1de517d4"></span> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - log
    - log
  - generic [ref=e3]:
    - link "Skip to content" [ref=e4] [cursor=pointer]:
      - /url: "#main-content"
    - banner [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - link "Structured Growth UI" [ref=e8] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e9]: Component documentation
        - generic [ref=e11]:
          - generic [ref=e12]: Documentation version
          - button "Development · unreleased Documentation version" [ref=e13] [cursor=pointer]:
            - generic [ref=e14]: Development · unreleased
          - combobox [ref=e20]
    - generic [ref=e21]:
      - navigation "Documentation" [ref=e22]:
        - generic [ref=e23]:
          - link "Overview" [ref=e24] [cursor=pointer]:
            - /url: /
          - separator [ref=e31]
          - searchbox "Find in navigation" [ref=e36]
          - generic [ref=e39]:
            - button "Back to Components" [ref=e40] [cursor=pointer]
            - heading "Calendar" [level=2] [ref=e45]
            - generic [ref=e46]:
              - link "Calendar" [ref=e47] [cursor=pointer]:
                - /url: /docs/components/calendar
              - link "DateField" [ref=e52] [cursor=pointer]:
                - /url: /docs/components/date-field
              - link "TimeField" [ref=e57] [cursor=pointer]:
                - /url: /docs/components/time-field
              - link "DatePicker" [ref=e62] [cursor=pointer]:
                - /url: /docs/components/date-picker
              - link "DateRangePicker" [ref=e67] [cursor=pointer]:
                - /url: /docs/components/date-range-picker
              - link "DateRangeSelector" [ref=e72] [cursor=pointer]:
                - /url: /docs/components/date-range-selector
              - link "PeriodPicker" [ref=e77] [cursor=pointer]:
                - /url: /docs/components/period-picker
              - link "DateTimeRangePicker" [ref=e82] [cursor=pointer]:
                - /url: /docs/components/date-time-range-picker
              - link "DateRangeComparisonPicker" [ref=e87] [cursor=pointer]:
                - /url: /docs/components/date-range-comparison-picker
          - separator [ref=e92]
          - generic [ref=e93]:
            - link "Installation" [ref=e94] [cursor=pointer]:
              - /url: /installation
            - link "Theming" [ref=e98] [cursor=pointer]:
              - /url: /theming
            - link "Release history" [ref=e104] [cursor=pointer]:
              - /url: /releases
            - link "Licenses" [ref=e109] [cursor=pointer]:
              - /url: /licensing
        - generic [ref=e114]:
          - paragraph [ref=e115]: Development documentation. Version 1 has not been released.
          - link "View on GitHub" [ref=e116] [cursor=pointer]:
            - /url: https://github.com/Structured-Growth/sg-ui
          - paragraph [ref=e117]: Public source. Commercial license required.
      - main [ref=e118]:
        - generic [ref=e120]:
          - generic [ref=e121]:
            - paragraph [ref=e122]: SGUI / Development
            - heading "DatePicker" [level=1] [ref=e123]
            - paragraph [ref=e124]: Flexible date text entry and a scoped calendar popup with clear and availability handling.
          - region "DatePicker at a glance" [ref=e127]:
            - generic [ref=e130]:
              - generic [ref=e131]: Course schedule
              - generic [ref=e132]:
                - textbox "Course schedule" [ref=e133]: 10/14/2026
                - button "Choose Course schedule" [ref=e134] [cursor=pointer]
              - generic [ref=e138]: Local value supplied by your host.
          - region [ref=e141]:
            - generic [ref=e142]:
              - heading "Prop playground" [level=2] [ref=e143]
              - paragraph [ref=e144]: Explore ISO values, field states and host-owned availability. The selected example theme also applies to picker portals.
              - generic [ref=e146]:
                - generic [ref=e147]:
                  - generic [ref=e148]:
                    - generic [ref=e149]: Example label
                    - textbox "Example label" [ref=e150]: Course schedule
                  - generic [ref=e151]:
                    - generic [ref=e152]: Example density
                    - button "Comfortable Example density" [ref=e153] [cursor=pointer]:
                      - generic [ref=e154]: Comfortable
                    - combobox [ref=e160]
                  - generic [ref=e161]:
                    - generic [ref=e162]: Date entry
                    - button "Flexible text Date entry" [ref=e163] [cursor=pointer]:
                      - generic [ref=e164]: Flexible text
                    - combobox [ref=e170]
                  - generic [ref=e171]:
                    - generic [ref=e172]: Relative reference date
                    - textbox "Relative reference date" [ref=e173]: 2026-10-16
                    - generic [ref=e174]: ISO civil date supplied by the host. This demo uses a fixed date.
                  - generic [ref=e175]:
                    - generic [ref=e176]: Description
                    - textbox "Description" [ref=e177]: Local value supplied by your host.
                  - generic [ref=e178]:
                    - generic [ref=e179]: Calendar navigation
                    - button "Month arrows Calendar navigation" [ref=e180] [cursor=pointer]:
                      - generic [ref=e181]: Month arrows
                    - combobox [ref=e187]
                  - generic [ref=e188]:
                    - generic [ref=e189]: Year choices
                    - button "120 years Year choices" [ref=e190] [cursor=pointer]:
                      - generic [ref=e191]: 120 years
                    - combobox [ref=e197]
                - generic [ref=e198]:
                  - generic [ref=e199] [cursor=pointer]:
                    - checkbox "Disabled" [ref=e201]
                    - generic [ref=e203]: Disabled
                  - generic [ref=e205] [cursor=pointer]:
                    - checkbox "Read only" [ref=e207]
                    - generic [ref=e209]: Read only
                  - generic [ref=e211] [cursor=pointer]:
                    - checkbox "Required" [ref=e213]
                    - generic [ref=e215]: Required
                  - generic [ref=e217] [cursor=pointer]:
                    - checkbox "Invalid" [ref=e219]
                    - generic [ref=e221]: Invalid
                  - generic [ref=e223] [cursor=pointer]:
                    - checkbox "Limit to October 2026" [ref=e225]
                    - generic [ref=e227]: Limit to October 2026
                  - generic [ref=e229] [cursor=pointer]:
                    - checkbox "Show title" [ref=e231]
                    - generic [ref=e233]: Show title
                  - generic [ref=e235] [cursor=pointer]:
                    - checkbox "Unavailable dates" [ref=e237]
                    - generic [ref=e239]: Unavailable dates
                  - generic [ref=e241]:
                    - generic [ref=e242]: Popup presentation
                    - button "popover Popup presentation" [ref=e243] [cursor=pointer]:
                      - generic [ref=e244]: popover
                    - combobox [ref=e250]
                  - generic [ref=e251] [cursor=pointer]:
                    - checkbox "Include time segments" [ref=e253]
                    - generic [ref=e255]: Include time segments
                  - button "Clear committed value" [ref=e257] [cursor=pointer]
              - generic [ref=e262]:
                - generic [ref=e263]: Course schedule
                - generic [ref=e264]:
                  - textbox "Course schedule" [ref=e265]: 10/14/2026
                  - button "Choose Course schedule" [ref=e266] [cursor=pointer]
                - generic [ref=e270]: Local value supplied by your host.
              - button [ref=e272] [cursor=pointer]:
                - generic [ref=e273]:
                  - generic [aria-hidden] [ref=e274]: +
                  - text: "Show source: Prop playground"
          - heading "Examples" [level=2] [ref=e275]
          - generic [ref=e277]:
            - region [ref=e278]:
              - generic [ref=e279]:
                - 'heading "DatePicker: Compact density" [level=2] [ref=e280]'
                - paragraph [ref=e281]: Compare segment, calendar and action target spacing in an independent scope.
                - generic [ref=e285]:
                  - generic [ref=e286]: Course schedule
                  - generic [ref=e287]:
                    - textbox "Course schedule" [ref=e288]: 10/14/2026
                    - button "Choose Course schedule" [ref=e289] [cursor=pointer]
                  - generic [ref=e293]: Local value supplied by your host.
                - button [ref=e295] [cursor=pointer]:
                  - generic [ref=e296]:
                    - generic [aria-hidden] [ref=e297]: +
                    - text: "Show source: Compact density"
            - region [ref=e298]:
              - generic [ref=e299]:
                - 'heading "DatePicker: Comfortable density" [level=2] [ref=e300]'
                - paragraph [ref=e301]: Compare segment, calendar and action target spacing in an independent scope.
                - generic [ref=e305]:
                  - generic [ref=e306]: Course schedule
                  - generic [ref=e307]:
                    - textbox "Course schedule" [ref=e308]: 10/14/2026
                    - button "Choose Course schedule" [ref=e309] [cursor=pointer]
                  - generic [ref=e313]: Local value supplied by your host.
                - button [ref=e315] [cursor=pointer]:
                  - generic [ref=e316]:
                    - generic [aria-hidden] [ref=e317]: +
                    - text: "Show source: Comfortable density"
            - region [ref=e318]:
              - generic [ref=e319]:
                - 'heading "DatePicker: Controlled host flow" [level=2] [ref=e320]'
                - paragraph [ref=e321]: Native fields serialize local values. Hosts own persistence, timezone and availability policy.
                - generic [ref=e324]:
                  - generic [ref=e327]:
                    - generic [ref=e328]: Course schedule
                    - generic [ref=e329]:
                      - textbox "Course schedule" [ref=e330]: 10/14/2026
                      - button "Choose Course schedule" [ref=e331] [cursor=pointer]
                    - generic [ref=e335]: Local value supplied by your host.
                  - button "Submit schedule locally" [ref=e336] [cursor=pointer]
                  - status [ref=e338]: Submitted 0 times. Host owns persistence.
                - button [ref=e340] [cursor=pointer]:
                  - generic [ref=e341]:
                    - generic [aria-hidden] [ref=e342]: +
                    - text: "Show source: Controlled host flow"
            - region [ref=e343]:
              - generic [ref=e344]:
                - 'heading "DatePicker: Flexible entry availability" [level=2] [ref=e345]'
                - paragraph [ref=e346]: One host availability rule covers direct entry and the calendar. An unavailable draft remains editable, blocks native submission and keeps the accepted value. Change the host rule to allow the date. This form saves locally; persistence belongs to the host.
                - form "Booking form" [ref=e349]:
                  - generic [ref=e350]:
                    - generic [ref=e351] [cursor=pointer]:
                      - checkbox "Accept bookings on October 16" [ref=e353]
                      - generic [ref=e355]: Accept bookings on October 16
                    - generic [ref=e358]:
                      - generic [ref=e359]: Booking date
                      - generic [ref=e360]:
                        - textbox "Booking date" [ref=e361]: 10/14/2026
                        - button "Choose Booking date" [ref=e362] [cursor=pointer]
                    - button "Save appointment" [ref=e366] [cursor=pointer]
                - button [ref=e369] [cursor=pointer]:
                  - generic [ref=e370]:
                    - generic [aria-hidden] [ref=e371]: +
                    - text: "Show source: Flexible entry availability"
            - region [ref=e372]:
              - generic [ref=e373]:
                - 'heading "DatePicker: Segmented entry availability" [level=2] [ref=e374]'
                - paragraph [ref=e375]: One host availability rule covers direct entry and the calendar. An unavailable draft remains editable, blocks native submission and keeps the accepted value. Change the host rule to allow the date. This form saves locally; persistence belongs to the host.
                - form "Booking form" [ref=e378]:
                  - generic [ref=e379]:
                    - generic [ref=e380] [cursor=pointer]:
                      - checkbox "Accept bookings on October 16" [ref=e382]
                      - generic [ref=e384]: Accept bookings on October 16
                    - generic [ref=e387]:
                      - generic [ref=e388]: Booking date
                      - generic [ref=e389]:
                        - group [ref=e390]:
                          - spinbutton "month, Booking date" [ref=e391]: "10"
                          - generic [aria-hidden] [ref=e392]: /
                          - spinbutton "day, Booking date" [ref=e393]: "14"
                          - generic [aria-hidden] [ref=e394]: /
                          - spinbutton "year, Booking date" [ref=e395]: "2026"
                        - button "Choose Booking date" [ref=e396] [cursor=pointer]
                    - button "Save appointment" [ref=e400] [cursor=pointer]
                - button [ref=e403] [cursor=pointer]:
                  - generic [ref=e404]:
                    - generic [aria-hidden] [ref=e405]: +
                    - text: "Show source: Segmented entry availability"
            - region [ref=e406]:
              - generic [ref=e407]:
                - 'heading "DatePicker: Date and time availability" [level=2] [ref=e408]'
                - paragraph [ref=e409]: One host availability rule covers direct entry and the calendar. An unavailable draft remains editable, blocks native submission and keeps the accepted value. Change the host rule to allow the date. This form saves locally; persistence belongs to the host.
                - form "Booking form" [ref=e412]:
                  - generic [ref=e413]:
                    - generic [ref=e414] [cursor=pointer]:
                      - checkbox "Accept bookings on October 16" [ref=e416]
                      - generic [ref=e418]: Accept bookings on October 16
                    - generic [ref=e421]:
                      - generic [ref=e422]: Booking date
                      - generic [ref=e423]:
                        - group [ref=e424]:
                          - spinbutton "month, Booking date" [ref=e425]: "10"
                          - generic [aria-hidden] [ref=e426]: /
                          - spinbutton "day, Booking date" [ref=e427]: "15"
                          - generic [aria-hidden] [ref=e428]: /
                          - spinbutton "year, Booking date" [ref=e429]: "2026"
                          - generic [aria-hidden] [ref=e430]: ","
                          - spinbutton "hour, Booking date" [ref=e431]: "08"
                          - generic [aria-hidden] [ref=e432]: ":"
                          - spinbutton "minute, Booking date" [ref=e433]: "00"
                          - generic [aria-hidden] [ref=e434]: ":"
                          - spinbutton "second, Booking date" [ref=e435]: "00"
                        - button "Choose Booking date" [ref=e436] [cursor=pointer]
                    - button "Save appointment" [active] [ref=e440] [cursor=pointer]
                    - status [ref=e442]: Appointment saved locally.
                - button [ref=e444] [cursor=pointer]:
                  - generic [ref=e445]:
                    - generic [aria-hidden] [ref=e446]: +
                    - text: "Show source: Date and time availability"
            - region [ref=e447]:
              - generic [ref=e448]:
                - 'heading "DatePicker: Type a date or open the calendar" [level=2] [ref=e449]'
                - paragraph [ref=e450]: Enter ISO dates, locale-ordered slash/dot dates, or a written month (for example Oct 14, 2026). Two-digit years expand within 1950–2049 (1/1/26 becomes January 1, 2026). Relative phrases such as today and in 2 weeks use the fixed host reference date 2026-10-16. Blur or Enter normalizes valid entry. Use the calendar button to choose a date instead. Impossible dates remain invalid; ambiguous numeric order follows the active locale.
                - generic [ref=e454]:
                  - generic [ref=e455]: Appointment date
                  - generic [ref=e456]:
                    - textbox "Appointment date" [ref=e457]: 10/14/2026
                    - button "Choose Appointment date" [ref=e458] [cursor=pointer]
                - button [ref=e463] [cursor=pointer]:
                  - generic [ref=e464]:
                    - generic [aria-hidden] [ref=e465]: +
                    - text: "Show source: Type a date or open the calendar"
            - region [ref=e466]:
              - generic [ref=e467]:
                - 'heading "DatePicker: Birthday with month and year jumps" [level=2] [ref=e468]'
                - paragraph [ref=e469]: Type a known birthday directly or open the optional calendar and jump by year and month. Navigation changes the view; choosing a day commits. This fixed demo permits 1900 through October 16, 2026; hosts choose their actual policy.
                - generic [ref=e473]:
                  - generic [ref=e474]: Select your birthday
                  - generic [ref=e475]:
                    - textbox "Select your birthday" [ref=e476]
                    - button "Choose Select your birthday" [ref=e477] [cursor=pointer]
                  - generic [ref=e481]: For example, May 21, 1984. The host supplies the allowed dates.
                - button [ref=e483] [cursor=pointer]:
                  - generic [ref=e484]:
                    - generic [aria-hidden] [ref=e485]: +
                    - text: "Show source: Birthday with month and year jumps"
            - region [ref=e486]:
              - generic [ref=e487]:
                - 'heading "DatePicker: Birthday by direct entry" [level=2] [ref=e488]'
                - paragraph [ref=e489]: For memorable dates, direct entry avoids navigating a calendar. Leave the birthday empty initially; valid input normalizes on blur or Enter.
                - generic [ref=e492]:
                  - generic [ref=e493]: Select your birthday
                  - textbox "Select your birthday" [ref=e494]
                  - generic [ref=e495]: For example, May 21, 1984. The host supplies the allowed dates.
                - button [ref=e497] [cursor=pointer]:
                  - generic [ref=e498]:
                    - generic [aria-hidden] [ref=e499]: +
                    - text: "Show source: Birthday by direct entry"
            - region [ref=e500]:
              - generic [ref=e501]:
                - 'heading "DatePicker: Date and time — 24-hour" [level=2] [ref=e502]'
                - paragraph [ref=e503]: Edit date and time directly, or open the calendar and type a time such as 8a or use its clock dropdown. Apply commits both together; Cancel discards popup edits. The value is a local datetime without a timezone. The host resolves it to an instant and handles daylight-saving gaps or overlaps.
                - generic [ref=e507]:
                  - generic [ref=e508]: Appointment date and time
                  - generic [ref=e509]:
                    - group [ref=e510]:
                      - spinbutton "month, Appointment date and time" [ref=e511]: "10"
                      - generic [aria-hidden] [ref=e512]: /
                      - spinbutton "day, Appointment date and time" [ref=e513]: "14"
                      - generic [aria-hidden] [ref=e514]: /
                      - spinbutton "year, Appointment date and time" [ref=e515]: "2026"
                      - generic [aria-hidden] [ref=e516]: ","
                      - spinbutton "hour, Appointment date and time" [ref=e517]: "09"
                      - generic [aria-hidden] [ref=e518]: ":"
                      - spinbutton "minute, Appointment date and time" [ref=e519]: "30"
                      - generic [aria-hidden] [ref=e520]: ":"
                      - spinbutton "second, Appointment date and time" [ref=e521]: "00"
                    - button "Choose Appointment date and time" [ref=e522] [cursor=pointer]
                  - generic [ref=e526]: Local appointment time in the host's chosen timezone.
                - button [ref=e528] [cursor=pointer]:
                  - generic [ref=e529]:
                    - generic [aria-hidden] [ref=e530]: +
                    - text: "Show source: Date and time — 24-hour"
            - region [ref=e531]:
              - generic [ref=e532]:
                - 'heading "DatePicker: Date and time — 12-hour" [level=2] [ref=e533]'
                - paragraph [ref=e534]: Edit date and time directly, or open the calendar and type a time such as 8a or use its clock dropdown. Apply commits both together; Cancel discards popup edits. The value is a local datetime without a timezone. The host resolves it to an instant and handles daylight-saving gaps or overlaps.
                - generic [ref=e538]:
                  - generic [ref=e539]: Appointment date and time
                  - generic [ref=e540]:
                    - group [ref=e541]:
                      - spinbutton "month, Appointment date and time" [ref=e542]: "10"
                      - generic [aria-hidden] [ref=e543]: /
                      - spinbutton "day, Appointment date and time" [ref=e544]: "14"
                      - generic [aria-hidden] [ref=e545]: /
                      - spinbutton "year, Appointment date and time" [ref=e546]: "2026"
                      - generic [aria-hidden] [ref=e547]: ","
                      - spinbutton "hour, Appointment date and time" [ref=e548]: "9"
                      - generic [aria-hidden] [ref=e549]: ":"
                      - spinbutton "minute, Appointment date and time" [ref=e550]: "30"
                      - generic [aria-hidden] [ref=e551]: ":"
                      - spinbutton "second, Appointment date and time" [ref=e552]: "00"
                      - spinbutton "AM/PM, Appointment date and time" [ref=e553]: AM
                    - button "Choose Appointment date and time" [ref=e554] [cursor=pointer]
                  - generic [ref=e558]: Local appointment time in the host's chosen timezone.
                - button [ref=e560] [cursor=pointer]:
                  - generic [ref=e561]:
                    - generic [aria-hidden] [ref=e562]: +
                    - text: "Show source: Date and time — 12-hour"
            - region [ref=e563]:
              - generic [ref=e564]:
                - 'heading "DatePicker: Relative dates from a fixed reference" [level=2] [ref=e565]'
                - paragraph [ref=e566]: This repeatable example pins the host reference date to October 16, 2026. Try today, a week from today, two weeks from today, in a month or a week ago. Next/last weekdays are strictly after/before the reference; next month/year preserves the day and clamps at month end. A real host supplies today's civil date in its chosen timezone and pins it for the editing session. Committed values are absolute dates and do not drift.
                - generic [ref=e570]:
                  - generic [ref=e571]: Relative appointment date
                  - generic [ref=e572]:
                    - textbox "Relative appointment date" [ref=e573]: 10/16/2026
                    - button "Choose Relative appointment date" [ref=e574] [cursor=pointer]
                - button [ref=e579] [cursor=pointer]:
                  - generic [ref=e580]:
                    - generic [aria-hidden] [ref=e581]: +
                    - text: "Show source: Relative dates from a fixed reference"
          - region "Contains" [ref=e582]:
            - generic [ref=e583]:
              - heading "Contains" [level=2] [ref=e584]
              - region "DatePicker composition" [ref=e585]:
                - generic [ref=e586]:
                  - link "Button" [ref=e587] [cursor=pointer]:
                    - /url: /docs/components/button
                  - link "Calendar" [ref=e588] [cursor=pointer]:
                    - /url: /docs/components/calendar
                  - link "CalendarTodayIcon" [ref=e589] [cursor=pointer]:
                    - /url: /docs/components/icons
                  - link "DateField" [ref=e590] [cursor=pointer]:
                    - /url: /docs/components/date-field
                  - link "Popover" [ref=e591] [cursor=pointer]:
                    - /url: /docs/components/popover
                  - link "TimeField" [ref=e592] [cursor=pointer]:
                    - /url: /docs/components/time-field
          - region "Used In" [ref=e593]:
            - generic [ref=e594]:
              - heading "Used In" [level=2] [ref=e595]
              - link "DateTimeRangePicker" [ref=e597] [cursor=pointer]:
                - /url: /docs/components/date-time-range-picker#composition-DateTimeRangePicker
      - complementary "Component tools" [ref=e598]:
        - navigation "Component tools navigation" [ref=e601]:
          - button "Demo settings" [ref=e602] [cursor=pointer]
          - button "Page documentation" [ref=e610] [cursor=pointer]
  - alert [ref=e617]
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | import {exampleName} from './example-name';
  3  | import {checkSources} from './check-sources';
  4  | for(const [mode,title] of [['text','Flexible entry availability'],['segments','Segmented entry availability'],['datetime','Date and time availability']] as const){
  5  |  test(`${mode}: host availability guards typed values and native submission`,async({page})=>{
  6  |   await page.goto('/docs/components/date-picker');
  7  |   const panel=page.getByRole('region',{name:exampleName(title),exact:true}),preview=panel.locator('[data-docs-preview]'),form=preview.getByRole('form',{name:'Booking form'});
  8  |   const accepted=()=>form.evaluate(element=>new FormData(element as HTMLFormElement).get('booking'));
  9  |   if(mode==='text'){
  10 |    const input=form.getByRole('textbox',{name:'Booking date',exact:true});await input.fill('10/16/2026');await input.press('Enter');
  11 |    await expect(input).toHaveValue('10/16/2026');await expect(input).toHaveAttribute('aria-invalid','true');expect(await accepted()).toBe('2026-10-14');
  12 |   }else{
  13 |    const day=form.getByRole('spinbutton',{name:/day/});await day.focus();await day.press('ArrowUp');await day.press('ArrowUp');
  14 |    expect(await accepted()).toBe(mode==='datetime'?'2026-10-15T08:00:00':'2026-10-15');
  15 |   }
  16 |   expect(await form.evaluate(element=>(element as HTMLFormElement).checkValidity())).toBe(false);
  17 |   await form.getByRole('button',{name:'Save appointment',exact:true}).click();await expect(form.getByRole('status')).toHaveCount(0);
  18 |   await expect(form.getByText('No appointment capacity',{exact:true})).toBeVisible();
  19 |   if(mode==='text'){
  20 |    const input=form.getByRole('textbox',{name:'Booking date',exact:true});await input.fill('10/15/2026');await input.press('Enter');
  21 |    await form.getByRole('button',{name:'Choose Booking date',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Booking date',exact:true});
  22 |    const day=dialog.getByRole('button',{name:/Friday, October 16, 2026/});await expect(day).toHaveAttribute('aria-disabled','true');
  23 |    const description=await day.getAttribute('aria-describedby');expect(description).toBeTruthy();
  24 |    expect(await day.evaluate(element=>(element.getAttribute('aria-describedby')??'').split(/\s+/).map(id=>document.getElementById(id)?.textContent).join(' '))).toContain('No appointment capacity');
  25 |    const summary=dialog.locator('summary').filter({hasText:'Unavailable dates'});await summary.focus();await summary.press('Enter');
  26 |    await expect(dialog.getByText('2026-10-16: No appointment capacity',{exact:true})).toBeVisible();await page.keyboard.press('Escape');
  27 |   }else{
  28 |    const day=form.getByRole('spinbutton',{name:/day/});await day.focus();await day.press('ArrowDown');
  29 |   }
  30 |   expect(await form.evaluate(element=>(element as HTMLFormElement).checkValidity())).toBe(true);
  31 |   await form.getByRole('button',{name:'Save appointment',exact:true}).click();await expect(form.getByRole('status')).toHaveText('Appointment saved locally.');
  32 |   if(mode==='datetime'){
> 33 |    const policy=form.getByRole('checkbox',{name:'Accept bookings on October 16',exact:true});await policy.check();
     |                                                                                                           ^ Error: locator.check: Test timeout of 30000ms exceeded.
  34 |    await form.getByRole('button',{name:'Choose Booking date',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Booking date',exact:true});
  35 |    await dialog.getByRole('button',{name:/Friday, October 16, 2026/}).click();await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toBeEnabled();
  36 |    await policy.evaluate(element=>(element as HTMLInputElement).click());await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toBeDisabled();
  37 |    const blocked=dialog.getByRole('button',{name:/Friday, October 16, 2026/});await expect(blocked).toHaveAttribute('aria-disabled','true');
  38 |    expect(await blocked.evaluate(element=>(element.getAttribute('aria-describedby')??'').split(/\s+/).map(id=>document.getElementById(id)?.textContent).join(' '))).toContain('No appointment capacity');
  39 |    await dialog.getByRole('button',{name:'Cancel',exact:true}).click();expect(await accepted()).toBe('2026-10-15T08:00:00');
  40 |   }
  41 |   await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();expect(checkSources([{slug:`availability-${mode}`,source:(await panel.getByRole('code').textContent())!}])).toEqual([]);
  42 |  });
  43 | }
  44 | 
```