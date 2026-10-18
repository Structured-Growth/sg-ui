'use client';

import { useState } from 'react';
import { ThemeScope } from '@structured-growth/sg-ui/theme';
import {DateRangePicker,type DateRange} from '@structured-growth/sg-ui/experimental';

export default function AdvancedRangeExample() {
  const [range,setRange]=useState<DateRange|null>({"start":"2026-10-07","end":"2026-10-16"});
  const [endpoint,setEndpoint]=useState<"start"|"end">("end");
  return (
    <>
      <ThemeScope density="compact">
      <DateRangePicker showFields label="Travel interval" months={2} entryMode="text" defaultFocusedDate="2026-10-07" rangeDragBehavior="move-and-resize" calendarNavigation="independent" calendarEndpoints={["start","end"]} value={range} onValueChange={setRange}/>
      </ThemeScope>
    </>
  );
}
