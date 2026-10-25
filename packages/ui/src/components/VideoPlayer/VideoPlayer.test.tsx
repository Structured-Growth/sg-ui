// @vitest-environment jsdom
import {afterEach} from "vitest";
import {cleanup} from "@testing-library/react";
import {render, screen, fireEvent} from "@testing-library/react";
import {it, expect, vi} from "vitest";
import {VideoPlayer} from "./VideoPlayer";
it("counts played intervals, excludes jumps, and completes once", () => {
  const progress = vi.fn(); const complete = vi.fn(); let now = 0;
  vi.spyOn(performance,"now").mockImplementation(() => now);
  const {container} = render(<VideoPlayer src="/clip.mp4" label="Demo" onProgress={progress} onComplete={complete} requiredWatchPercent={50}/>);
  const media = container.querySelector("video")!;
  Object.defineProperty(media,"duration",{value:10, configurable:true}); Object.defineProperty(media,"paused",{value:false, configurable:true});
  fireEvent.loadedMetadata(media); fireEvent.playing(media);
  now=5000; media.currentTime=5; fireEvent.timeUpdate(media);
  expect(progress.mock.lastCall?.[0].watchedSeconds).toBe(5); expect(complete).toHaveBeenCalledOnce();
  media.currentTime=9; fireEvent.timeUpdate(media); expect(progress.mock.lastCall?.[0].watchedSeconds).toBe(5);
  expect(complete).toHaveBeenCalledOnce(); vi.restoreAllMocks();
});
it("blocks seeking to unwatched content but permits replay", () => {
  const {container} = render(<VideoPlayer src="/clip.mp4" label="Demo" seekPolicy="watched" defaultWatchedRanges={[[0,4]]}/>);
  const media=container.querySelector("video")!; Object.defineProperty(media,"duration",{value:10}); fireEvent.loadedMetadata(media);
  media.currentTime=8; fireEvent.seeking(media); expect(media.currentTime).toBe(0);
  media.currentTime=3; fireEvent.seeking(media); expect(media.currentTime).toBe(3);
});
it("resets progress on source change and exposes captions, transcript and failure", () => {
  const progress=vi.fn(); const {container,rerender}=render(<VideoPlayer src="/a.mp4" label="Demo" defaultWatchedRanges={[[0,5]]} onProgress={progress}/>);
  const old=container.querySelector("video")!; Object.defineProperty(old,"duration",{value:10}); fireEvent.loadedMetadata(old);
  expect(progress.mock.lastCall?.[0].watchedPercent).toBe(50);
  rerender(<VideoPlayer src="/b.mp4" label="Demo" onProgress={progress} transcript="A greeting." tracks={[{src:"/en.vtt",srcLang:"en",label:"English"}]}/>);
  const media=container.querySelector("video")!; Object.defineProperty(media,"duration",{value:10}); fireEvent.loadedMetadata(media);
  expect(progress.mock.lastCall?.[0].watchedPercent).toBe(0); expect(media.querySelector("track")?.getAttribute("kind")).toBe("captions");
  expect(screen.getByRole("button",{name:"Transcript"})).toBeTruthy(); fireEvent.error(media); expect(screen.getByRole("alert")).toBeTruthy();
});

afterEach(cleanup);

it("does not accept scrub timestamps from progress or pause events before seeking", () => {
  const progress = vi.fn();
  const {container} = render(<VideoPlayer src="/clip.mp4" label="No seeking" seekPolicy="none" onProgress={progress}/>);
  const media = container.querySelector("video")!;
  Object.defineProperty(media, "duration", {value: 10});
  Object.defineProperty(media, "seeking", {value: false, configurable: true});
  fireEvent.loadedMetadata(media);
  const initialUpdates = progress.mock.calls.length;
  for (const event of ["timeUpdate", "pause"] as const) {
    media.currentTime = 8;
    Object.defineProperty(media, "seeking", {value: true, configurable: true});
    fireEvent[event](media);
    fireEvent.seeking(media);
    expect(media.currentTime).toBe(0);
    Object.defineProperty(media, "seeking", {value: false, configurable: true});
    fireEvent.seeked(media);
  }
  expect(progress.mock.calls.length).toBe(initialUpdates);
  // Some native controls publish the destination before marking seeking.
  media.currentTime = 9;
  fireEvent.pause(media);
  expect(media.currentTime).toBe(0);
  Object.defineProperty(media, "seeking", {value: false, configurable: true});
  fireEvent.seeked(media);
  // A delayed seeked event must also validate the destination, not adopt it.
  media.currentTime = 7;
  fireEvent.seeked(media);
  expect(media.currentTime).toBe(0);
});
