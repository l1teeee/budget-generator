"use client";

import * as React from "react";

type DateValue = {
  month: string;
  day: string;
  year: string;
  era?: string;
  display?: string;
  iso?: string;
};

type DatePickerProps = {
  label?: React.ReactNode;
  value?: DateValue | null;
  defaultValue?: DateValue | null;
  description?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  minWidth?: string;
  customIndicator?: React.ReactNode;
  showTime?: boolean;
  international?: boolean;
  onChange?: (value: DateValue | null) => void;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function CalendarIcon() {
  return (
    <svg aria-hidden="true" aria-label="Calendar icon" fill="none" height="1em" role="presentation" viewBox="0 0 13 14" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path clipRule="evenodd" d="M3.75 4.5A.75.75 0 0 1 3 3.75v-.748a1.5 1.5 0 0 0-1.5 1.5v1h10v-1a1.5 1.5 0 0 0-1.5-1.5v.75a.75.75 0 1 1-1.5 0v-.75h-4v.747a.75.75 0 0 1-.75.75ZM8.5 1.501h-4V.75a.75.75 0 0 0-1.5 0v.752a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3v-.75a.75.75 0 0 0-1.5 0v.75Zm-7 5.5v3.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-3.5h-10Z" fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" role="img" className="iconify iconify--gravity-ui size-4" width="1em" height="1em" viewBox="0 0 16 16">
      <path fill="currentColor" fillRule="evenodd" d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06" clipRule="evenodd" />
    </svg>
  );
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toIso(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromIso(iso?: string) {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function dateToValue(date: Date): DateValue {
  return {
    month: String(date.getMonth() + 1),
    day: String(date.getDate()),
    year: String(date.getFullYear()),
    iso: toIso(date),
  };
}

function formatValue(value: DateValue | null | undefined, showTime?: boolean, international?: boolean) {
  if (!value) return ["mm", "/", "dd", "/", "yyyy"];
  if (value.display) return value.display.split("|");
  if (international) return [value.day, "/", value.month, "/", value.year, " ", value.era || "CE"];
  if (showTime) return [value.month, "/", value.day, "/", value.year, ", ", "8:45", " AM GMT+4"];
  return [value.month, "/", value.day, "/", value.year];
}

function sameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function monthGrid(viewDate: Date) {
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function DatePicker({
  label = "Date",
  value,
  defaultValue = null,
  description,
  disabled = false,
  invalid = false,
  required = false,
  minWidth = "w-64",
  customIndicator,
  showTime = false,
  international = false,
  onChange,
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = React.useState<DateValue | null>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [focusedSegment, setFocusedSegment] = React.useState<string | null>(null);
  const currentValue = isControlled ? value : innerValue;
  const selectedDate = fromIso(currentValue?.iso);
  const [viewDate, setViewDate] = React.useState(() => selectedDate || new Date());
  const segments = formatValue(currentValue, showTime, international);

  React.useEffect(() => {
    if (selectedDate) setViewDate(selectedDate);
  }, [currentValue?.iso]);

  const setDate = React.useCallback(
    (next: DateValue | null) => {
      if (!isControlled) setInnerValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const handleTrigger = () => {
    if (!disabled) setOpen((next) => !next);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((next) => !next);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const base = selectedDate || new Date();
      const next = new Date(base);
      next.setDate(base.getDate() + (event.key === "ArrowUp" ? 1 : -1));
      setDate(dateToValue(next));
    }
  };

  const selectDay = (date: Date) => {
    setDate(dateToValue(date));
    setOpen(false);
  };

  const heading = `${MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

  return (
    <div data-slot="date-picker" className={`date-picker ${minWidth}`} data-rac="" data-disabled={disabled || undefined} data-invalid={invalid || undefined} data-open={open || undefined}>
      <HeroUIStyles />
      <span className="label" data-slot="label">{label}{required ? <span className="required-mark" aria-hidden="true"> *</span> : null}</span>
      <div
        data-react-aria-pressable="true"
        role="group"
        aria-invalid={invalid || undefined}
        aria-disabled={disabled || undefined}
        className="date-input-group date-input-group--full-width date-input-group--primary"
        data-slot="date-input-group"
        data-rac=""
        onClick={() => !open && handleTrigger()}
        onKeyDown={handleKeyDown}
      >
        <div role="presentation" data-react-aria-pressable="true" className="date-input-group__input" data-slot="date-input-group-input" data-rac="">
          {segments.map((segment, index) => {
            const isLiteral = ["/", ", ", " ", " AM GMT+4"].includes(segment);
            return (
              <span
                key={`${segment}-${index}`}
                data-slot="date-input-group-segment"
                role={isLiteral ? undefined : "spinbutton"}
                aria-label={isLiteral ? undefined : index === 0 ? "month, " : index === 2 ? "day, " : "year, "}
                aria-disabled={disabled || undefined}
                data-placeholder={!currentValue && !isLiteral ? "true" : undefined}
                tabIndex={disabled || isLiteral ? undefined : 0}
                className="date-input-group__segment"
                data-focused={focusedSegment === `${index}` || undefined}
                data-rac=""
                onFocus={() => setFocusedSegment(`${index}`)}
                onBlur={() => setFocusedSegment(null)}
              >
                {segment}
              </span>
            );
          })}
        </div>
        <input type="text" hidden name="date" value={currentValue?.iso || ""} readOnly />
        <div className="date-input-group__suffix" data-slot="date-input-group-suffix">
          <button
            data-slot="date-picker-trigger"
            className="date-picker__trigger"
            data-rac=""
            type="button"
            aria-label="Calendar"
            aria-haspopup="dialog"
            aria-expanded={open}
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              handleTrigger();
            }}
          >
            <span aria-hidden="true" className="date-picker__trigger-indicator" data-slot="date-picker-trigger-indicator">
              {customIndicator || <CalendarIcon />}
            </span>
          </button>
        </div>
      </div>
      {description ? <span className="description" data-slot="description" slot="description">{description}</span> : null}
      {open ? (
        <div data-slot="date-picker-popover" className="date-picker__popover" role="dialog" aria-label={`${label}, ${heading}`}>
          <CalendarView
            heading={heading}
            selectedDate={selectedDate}
            viewDate={viewDate}
            onViewDateChange={setViewDate}
            onSelect={selectDay}
          />
        </div>
      ) : null}
    </div>
  );
}

function CalendarView({
  heading,
  selectedDate,
  viewDate,
  onViewDateChange,
  onSelect,
}: {
  heading: string;
  selectedDate: Date | null;
  viewDate: Date;
  onViewDateChange: (date: Date) => void;
  onSelect: (date: Date) => void;
}) {
  const [yearMode, setYearMode] = React.useState(false);
  const cells = monthGrid(viewDate);
  const years = Array.from({ length: 25 }, (_, index) => viewDate.getFullYear() - 12 + index);

  const shiftMonth = (delta: number) => {
    const next = new Date(viewDate);
    next.setMonth(viewDate.getMonth() + delta);
    onViewDateChange(next);
  };

  return (
    <div role="application" data-slot="calendar" className="calendar" aria-label={heading}>
      <header data-slot="calendar-header" className="calendar__header">
        <button type="button" data-slot="calendar-year-picker-trigger" className="calendar-year-picker__trigger" onClick={() => setYearMode((next) => !next)}>
          <span data-slot="calendar-year-picker-trigger-heading" className="calendar-year-picker__trigger-heading">{heading}</span>
          <span data-slot="calendar-year-picker-trigger-indicator" className="calendar-year-picker__trigger-indicator"><ChevronDownIcon /></span>
        </button>
        <button type="button" data-slot="calendar-nav-button" className="calendar__nav-button" aria-label="Previous month" onClick={() => shiftMonth(-1)}>‹</button>
        <button type="button" data-slot="calendar-nav-button" className="calendar__nav-button" aria-label="Next month" onClick={() => shiftMonth(1)}>›</button>
      </header>
      <table role="grid" data-slot="calendar-grid" className="calendar__grid" aria-label={heading}>
        <thead data-slot="calendar-grid-header" className="calendar__grid-header">
          <tr>{WEEK_DAYS.map((day) => <th key={day} data-slot="calendar-header-cell" className="calendar__header-cell">{day}</th>)}</tr>
        </thead>
        <tbody data-slot="calendar-grid-body" className="calendar__grid-body">
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <tr key={row}>
              {cells.slice(row * 7, row * 7 + 7).map((date) => {
                const outside = date.getMonth() !== viewDate.getMonth();
                const selected = sameDay(selectedDate, date);
                return (
                  <td key={toIso(date)}>
                    <button
                      type="button"
                      role="button"
                      data-slot="calendar-cell"
                      className="calendar__cell"
                      data-outside-month={outside || undefined}
                      data-selected={selected || undefined}
                      onClick={() => onSelect(date)}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {yearMode ? (
        <div role="listbox" data-slot="calendar-year-picker-grid" className="calendar-year-picker__year-grid">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              data-slot="calendar-year-picker-year-cell"
              className="calendar-year-picker__year-cell"
              data-selected={year === viewDate.getFullYear() || undefined}
              onClick={() => {
                onViewDateChange(new Date(year, viewDate.getMonth(), 1));
                setYearMode(false);
              }}
            >
              {year}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Button({ children, onClick, variant = "primary" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" }) {
  return <button data-slot="button" className={`button button--md button--${variant}`} type="button" onClick={onClick}>{children}</button>;
}

export function HeroUIStyles() {
  return (
    <style>{`
      .date-picker,.date-picker *{box-sizing:border-box}
      .date-picker{position:relative;display:inline-flex;flex-direction:column;gap:.5rem;color:#16161D;font-family:'Hanken Grotesk',Inter,ui-sans-serif,system-ui,sans-serif;overflow:visible}
      .date-picker[data-open=true]{z-index:80}
      .date-picker.w-64{width:16rem}.date-picker.min-w-72{min-width:18rem;width:fit-content}.date-picker.wiz-date-field{width:100%}.date-picker[data-disabled=true]{opacity:.6}
      .label{font-size:.78rem;line-height:1.25rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#565563}
      .required-mark{color:#B4564F}
      .description{font-size:.9rem;line-height:1.35;color:#565563;font-weight:650}
      .date-input-group{display:inline-flex;align-items:center;height:4.25rem;overflow:hidden;border-radius:8px;border:1.5px solid rgba(92,99,122,.24);background:#FCFBF8;box-shadow:0 1px 0 rgba(255,255,255,.78) inset,0 14px 28px -24px rgba(22,22,29,.32);outline:none;transition:border-color .16s cubic-bezier(.23,1,.32,1),box-shadow .18s cubic-bezier(.23,1,.32,1),background-color .16s ease}
      .date-input-group:hover{border-color:rgba(92,99,122,.34)}
      .date-input-group:focus-within{border-color:#7E98F2;box-shadow:0 0 0 5px rgba(174,194,255,.36),0 1px 0 rgba(255,255,255,.9) inset,0 18px 32px -24px rgba(22,22,29,.38)}
      .date-input-group[aria-invalid=true]{border-color:#B4564F;box-shadow:0 0 0 5px rgba(180,86,79,.14),0 1px 0 rgba(255,255,255,.78) inset}
      .date-input-group[aria-disabled=true]{pointer-events:none;background:#E9E6DE;color:#8A8794}
      .date-input-group__input{display:flex;flex:1;align-items:center;gap:1px;min-width:0;padding:.5rem .5rem .5rem 1rem;border:0;background:transparent;font-size:1.28rem;font-weight:750;line-height:1.25;unicode-bidi:isolate}
      .date-input-group__segment{display:inline-block;outline:none;border-radius:.375rem;padding:0 .125rem;color:inherit;text-align:end;text-wrap:nowrap;caret-color:transparent}
      .date-input-group__segment[data-placeholder=true]{color:#6E6B76}
      .date-input-group__segment:focus,.date-input-group__segment[data-focused=true]{background:rgba(174,194,255,.28);color:#16161D}
      .date-input-group__suffix{pointer-events:none;display:flex;align-items:center;flex-shrink:0;margin-right:.9rem;color:#565563}
      .date-picker__trigger{pointer-events:auto;display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;padding:.25rem;border:0;border-radius:999px;background:transparent;color:#565563;cursor:pointer;transition:background-color .16s ease,color .16s ease,transform .12s cubic-bezier(.23,1,.32,1)}
      .date-picker__trigger:hover{background:#EAEEFB;color:#16161D}
      .date-picker__trigger:active{transform:scale(.96)}
      .date-picker__trigger:focus-visible{outline:2px solid #6F86D9;outline-offset:2px}
      .date-picker__trigger-indicator{display:inline-flex;align-items:center;justify-content:center;font-size:1rem}
      .date-picker__popover{position:absolute;z-index:100;top:calc(100% + .625rem);left:0;width:19rem;max-width:min(19rem,calc(100vw - 32px));overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;border-radius:12px;border:1.5px solid rgba(92,99,122,.24);background:#FCFBF8;box-shadow:0 22px 46px -26px rgba(22,22,29,.4),0 6px 16px -10px rgba(22,22,29,.16);padding:.85rem;transform-origin:top left;animation:datePickerPopover .18s cubic-bezier(.23,1,.32,1)}
      .calendar{display:flex;flex-direction:column;gap:.5rem;min-width:0}
      .calendar__header{display:flex;align-items:center;gap:.25rem;height:2rem}
      .calendar-year-picker__trigger{display:flex;align-items:center;gap:.375rem;height:2rem;padding:0 .5rem;border:0;border-radius:.5rem;background:transparent;color:inherit;font-weight:800;cursor:pointer}
      .calendar-year-picker__trigger:hover,.calendar__nav-button:hover{background:#EAEEFB}
      .calendar-year-picker__trigger-heading{font-size:.875rem}.calendar-year-picker__trigger-indicator{display:inline-flex;color:#565563}
      .calendar__nav-button{margin-left:auto;display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border:0;border-radius:.5rem;background:transparent;color:inherit;font-size:1.125rem;cursor:pointer}.calendar__nav-button + .calendar__nav-button{margin-left:0}
      .calendar__grid{width:100%;border-collapse:separate;border-spacing:0 .125rem;table-layout:fixed}
      .calendar__grid th,.calendar__grid td{padding:0;text-align:center;vertical-align:middle}
      .calendar__header-cell{height:2rem;text-align:center;font-size:.75rem;font-weight:800;color:#565563}
      .calendar__cell{display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border:0;border-radius:999px;background:transparent;color:inherit;font-size:.875rem;font-weight:700;cursor:pointer;transition:background-color .14s ease,color .14s ease,transform .12s cubic-bezier(.23,1,.32,1)}
      .calendar__cell:hover{background:#EAEEFB}
      .calendar__cell:focus-visible{outline:2px solid #6F86D9;outline-offset:1px}
      .calendar__cell:active{transform:scale(.96)}
      .calendar__cell[data-outside-month=true]{color:rgba(86,85,99,.55)}
      .calendar__cell[data-selected=true]{background:#16161D;color:#AEC2FF;font-weight:850}
      .calendar-year-picker__year-grid{max-height:9rem;overflow:auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.25rem;border-top:1px solid rgba(22,22,29,.12);padding-top:.5rem}
      .calendar-year-picker__year-cell{height:2rem;border:0;border-radius:.5rem;background:transparent;color:inherit;font-size:.8125rem;font-weight:750;cursor:pointer}
      .calendar-year-picker__year-cell[data-selected=true]{background:#16161D;color:#AEC2FF}
      .button{display:inline-flex;align-items:center;justify-content:center;height:2.5rem;border-radius:999px;border:1px solid transparent;padding:0 .875rem;font-size:.875rem;font-weight:800;transition:background-color .16s ease,transform .12s ease;cursor:pointer}.button:active{transform:scale(.98)}
      .button--primary{background:#16161D;color:#F1EFE9}.button--primary:hover{background:#252532}
      .button--secondary{background:#FCFBF8;color:#16161D;border-color:rgba(92,99,122,.24)}
      @keyframes datePickerPopover{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
      @media (prefers-reduced-motion: reduce){.date-picker *{animation:none!important;transition-duration:0ms!important}.date-picker__popover{animation:none!important}}
    `}</style>
  );
}

export type { DateValue };
