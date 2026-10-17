"use client";
import { Component, createRef, type ReactNode } from "react";
import styles from "../DateRangeSelector/DateRangeSelector.module.css";

/** Keep one live grid/focus owner; the outgoing month is an inert visual snapshot. */
export function CalendarMonthTransition({ children, month, direction, enabled = true }: { children: ReactNode; month: string; direction: "ltr" | "rtl"; enabled?: boolean }) {
  return <MonthSlide month={month} direction={direction} enabled={enabled}>{children}</MonthSlide>;
}
interface Props { month: string; direction: "ltr" | "rtl"; enabled: boolean; children: ReactNode }
class MonthSlide extends Component<Props> {
  private viewport = createRef<HTMLDivElement>();
  private frame = createRef<HTMLDivElement>();
  private stop = () => {};
  getSnapshotBeforeUpdate(previous: Props) {
    if (previous.month === this.props.month || !this.props.enabled) return null;
    this.stop();
    const frame = this.frame.current;
    const view = frame?.ownerDocument.defaultView;
    if (!frame || !view || !frame.animate || view.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
    const snapshot = frame.cloneNode(true) as HTMLDivElement;
    snapshot.setAttribute("aria-hidden", "true");
    snapshot.setAttribute("inert", "");
    // The visual copy must never create duplicate IDs, form values or tab stops.
    for (const node of [snapshot, ...snapshot.querySelectorAll<HTMLElement>("*")]) {
      node.removeAttribute("id"); node.removeAttribute("name");
      node.removeAttribute("aria-labelledby"); node.removeAttribute("aria-describedby");
      node.setAttribute("tabindex", "-1");
    }
    snapshot.className = styles.outgoingMonth;
    return snapshot;
  }
  componentDidUpdate(previous: Props, _state: unknown, snapshot: HTMLDivElement | null) {
    if (!snapshot) { if (!this.props.enabled) this.stop(); return; }
    const frame = this.frame.current, viewport = this.viewport.current;
    const view = frame?.ownerDocument.defaultView;
    if (!frame || !viewport || !view) return;
    const preference = view.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const token = view.getComputedStyle(frame).getPropertyValue("--sgui-motion-duration").trim();
    const duration = Number.parseFloat(token) * (token.endsWith("ms") ? 1 : 1000);
    if (!Number.isFinite(duration) || duration <= 0) return;
    const sign = (this.props.month > previous.month ? 1 : -1) * (this.props.direction === "rtl" ? -1 : 1);
    viewport.append(snapshot);
    const options: KeyframeAnimationOptions = { duration, easing: "ease-out" };
    const incoming = frame.animate([{ transform: `translateX(${sign * 100}%)` }, { transform: "translateX(0)" }], options);
    const outgoing = snapshot.animate([{ transform: "translateX(0)" }, { transform: `translateX(${-sign * 100}%)` }], options);
    const stop = () => {
      incoming.cancel(); outgoing.cancel(); snapshot.remove();
      preference.removeEventListener("change", stop);
      if (this.stop === stop) this.stop = () => {};
    };
    this.stop = stop;
    preference.addEventListener("change", stop);
    incoming.onfinish = stop;
  }
  componentWillUnmount() { this.stop(); }
  render() {
    return <div ref={this.viewport} className={styles.monthTransition} data-sgui-part="calendar-month-transition">
      <div ref={this.frame} className={styles.monthFrame}>{this.props.children}</div>
    </div>;
  }
}
