'use client';

import { DayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar(props: any) {
  return (
    <DayPicker
      {...props}
      components={{
        Caption: ({ displayMonth, goToMonth }: any) => (
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="p-2"
              onClick={() =>
                goToMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1))
              }
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              {displayMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <button
              type="button"
              className="p-2"
              onClick={() =>
                goToMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1))
              }
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ),
      }}
    />
  );
}
