"use client";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type ForwardedRef, type ReactNode} from "react";
import {Typography} from "../../experimental/Typography/Typography";
import {Progress} from "../../experimental/Progress/Progress";
import {Disclosure} from "../../experimental/Disclosure/Disclosure";
import {Select} from "../../experimental/Select/Select";
import {useTranslation} from "../../i18n";
import {allowedPosition, mergeWatchedRanges, type WatchedRange} from "./video-progress";
import styles from "./VideoPlayer.module.css";
export type {WatchedRange} from "./video-progress";
export interface VideoTrack { src: string; srcLang: string; label: string; kind?: "subtitles" | "captions" | "descriptions"; default?: boolean }
export interface VideoProgress {
  currentTime: number;
  duration: number;
  watchedRanges: readonly WatchedRange[];
  watchedSeconds: number;
  watchedPercent: number;
  /** Observed active playback time for this mounted session, excluding buffering/seeking. */
  viewingSeconds: number;
  complete: boolean;
}
export interface VideoPlayerProps {
  src: string;
  label: string;
  poster?: string;
  tracks?: readonly VideoTrack[];
  transcript?: ReactNode;
  seekPolicy?: "free" | "watched" | "none";
  /** Coverage threshold, 0–100. Completion also requires minimumViewingSeconds. */
  requiredWatchPercent?: number;
  minimumViewingSeconds?: number;
  defaultWatchedRanges?: readonly WatchedRange[];
  defaultPosition?: number;
  playbackRates?: readonly number[];
  pauseWhenHidden?: boolean;
  showProgress?: boolean;
  onProgress?: (progress: VideoProgress) => void;
  onComplete?: (progress: VideoProgress) => void;
  onPlaybackError?: () => void;
  crossOrigin?: "anonymous" | "use-credentials";
  className?: string;
  style?: CSSProperties;
}
export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(function VideoPlayer(props, ref) {
  // A different source starts a fresh playback session, including pending seek state.
  return <VideoSession key={props.src} {...props} videoRef={ref}/>;
});
function VideoSession({src, label, poster, tracks = [], transcript, seekPolicy = "free", requiredWatchPercent = 100, minimumViewingSeconds = 0, defaultWatchedRanges = [], defaultPosition = 0, playbackRates = [0.75, 1, 1.25, 1.5, 2], pauseWhenHidden = false, showProgress = false, onProgress, onComplete, onPlaybackError, crossOrigin, className, style, videoRef}: VideoPlayerProps & {videoRef: ForwardedRef<HTMLVideoElement>}) {
  const {t} = useTranslation();
  const video = useRef<HTMLVideoElement>(null);
  useImperativeHandle(videoRef, () => video.current!, []);
  const ranges = useRef<WatchedRange[]>([...defaultWatchedRanges]);
  const viewing = useRef(0);
  const anchor = useRef<{position: number; time: number} | null>(null);
  const lastPosition = useRef(0);
  const completed = useRef(false);
  const initialized = useRef(false);
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState("");
  const validRates = [...new Set(playbackRates.filter(rate => Number.isFinite(rate) && rate > 0 && rate <= 16))];
  const rates = validRates.length ? validRates : [1];
  const [rate, setRate] = useState(rates.includes(1) ? 1 : rates[0] ?? 1);
  const ratesKey = rates.join(",");
  useEffect(() => {
    const media = video.current;
    if (media && !rates.includes(media.playbackRate)) {
      const next = rates.includes(1) ? 1 : rates[0];
      setRate(next);
      media.playbackRate = next;
    }
  }, [ratesKey]);
  const capture = () => {
    const media = video.current;
    if (!media || !Number.isFinite(media.duration) || media.duration <= 0) return;
    const now = performance.now();
    const previous = anchor.current;
    if (previous && !media.seeking) {
      const elapsed = Math.max(0, (now - previous.time) / 1000);
      const delta = media.currentTime - previous.position;
      if (delta > 0 && delta <= elapsed * media.playbackRate + 0.35) {
        ranges.current = mergeWatchedRanges([...ranges.current, [previous.position, media.currentTime]], media.duration);
        viewing.current += Math.min(elapsed, delta / media.playbackRate);
      }
    }
    anchor.current = !media.paused && !media.seeking ? {position: media.currentTime, time: now} : null;
    lastPosition.current = media.currentTime;
    // Native played ranges include the first/final fractions between events and
    // preserve gaps across seeks. Timestamp checks above also serve test hosts.
    const played = Array.from({length: media.played.length}, (_, index): WatchedRange => [media.played.start(index), media.played.end(index)]);
    ranges.current = mergeWatchedRanges([...ranges.current, ...played], media.duration);
    const watchedSeconds = ranges.current.reduce((sum, [start, end]) => sum + end - start, 0);
    const watchedPercent = Math.min(100, watchedSeconds / media.duration * 100);
    const snapshot: VideoProgress = {currentTime: media.currentTime, duration: media.duration, watchedRanges: ranges.current.map(([start, end]) => [start, end]), watchedSeconds, watchedPercent, viewingSeconds: viewing.current,
      complete: watchedPercent + 0.01 >= Math.max(0, Math.min(100, requiredWatchPercent)) && viewing.current >= Math.max(0, minimumViewingSeconds)};
    setPercent(watchedPercent);
    onProgress?.(snapshot);
    if (snapshot.complete && !completed.current) { completed.current = true; onComplete?.(snapshot); }
  };
  useEffect(() => {
    if (!pauseWhenHidden) return;
    const hidden = () => { if (document.hidden) video.current?.pause(); };
    document.addEventListener("visibilitychange", hidden);
    return () => document.removeEventListener("visibilitychange", hidden);
  }, [pauseWhenHidden]);
  return <section className={[styles.root, className].filter(Boolean).join(" ")} style={style} aria-label={label} data-sgui-part="video-player">
    <video ref={video} className={styles.video} src={src} poster={poster} controls playsInline preload="metadata" aria-label={label} crossOrigin={crossOrigin}
      onLoadedMetadata={() => {
        const media = video.current!;
        if (!initialized.current) {
          initialized.current = true;
          ranges.current = mergeWatchedRanges(ranges.current, media.duration);
          const position = Math.max(0, Math.min(media.duration, Number.isFinite(defaultPosition) ? defaultPosition : 0));
          if (seekPolicy === "free" || (seekPolicy === "watched" && allowedPosition(position, ranges.current))) lastPosition.current = position;
          media.currentTime = lastPosition.current;
          media.playbackRate = rate;
        }
        capture();
      }}
      onPlaying={() => {anchor.current = {position: video.current!.currentTime, time: performance.now()};}}
      onTimeUpdate={capture} onPause={capture} onEnded={capture}
      onWaiting={() => { capture(); anchor.current = null; }}
      onSeeking={() => {
        const media = video.current!;
        anchor.current = null;
        const permitted = seekPolicy === "free" || (seekPolicy === "watched" && allowedPosition(media.currentTime, ranges.current));
        if (!permitted && Math.abs(media.currentTime - lastPosition.current) > 0.05) {
          media.currentTime = lastPosition.current;
          setNotice(t("video.seekLimited", {defaultMessage: "Seeking is limited for this video."}));
        }
      }}
      onSeeked={() => {lastPosition.current = video.current!.currentTime; anchor.current = video.current!.paused ? null : {position: lastPosition.current, time: performance.now()};}}
      onRateChange={() => {
        const media = video.current!;
        anchor.current = null;
        if (!rates.includes(media.playbackRate)) media.playbackRate = rates.includes(rate) ? rate : rates[0];
        else setRate(media.playbackRate);
        if (!media.paused) anchor.current = {position: media.currentTime, time: performance.now()};
      }}
      onError={() => {anchor.current = null; setError(true); onPlaybackError?.();}}>
      {tracks.map(track => <track key={`${track.kind ?? "captions"}-${track.srcLang}`} {...track} kind={track.kind ?? "captions"}/>)}
    </video>
    {error && <Typography role="alert" tone="danger">{t("video.error", {defaultMessage: "This video could not be loaded. Try again or use the transcript."})}</Typography>}
    {rates.length > 1 && <Select label={t("video.speed", {defaultMessage: "Playback speed"})} options={rates.map(value => ({id: String(value), label: `${value}×`}))} value={String(rate)} onValueChange={value => {if (value && video.current) video.current.playbackRate = Number(value);}}/>}
    {showProgress && <Progress label={t("video.coverage", {defaultMessage: "Video watched"})} value={percent}/>}
    <Typography role="status" variant="caption">{notice}</Typography>
    {transcript && <Disclosure label={t("video.transcript", {defaultMessage: "Transcript"})}>{transcript}</Disclosure>}
  </section>;
}
