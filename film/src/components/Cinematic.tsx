import { Video } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, ease, sans, serif } from "../theme";

/** Warm luxury colour grade + vignette laid over footage. */
export const Grade: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <>
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(28,22,19,0.55) 0%, rgba(28,22,19,0) 30%, rgba(28,22,19,0) 60%, rgba(28,22,19,0.7) 100%)",
        opacity: strength,
      }}
    />
    <AbsoluteFill
      style={{
        background: "rgba(184,153,90,0.10)",
        mixBlendMode: "soft-light",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(12,9,7,0.55) 100%)",
      }}
    />
  </>
);

/** A drone clip with a slow, continuous push-in. */
export const Clip: React.FC<{ src: string; trimBefore?: number; push?: number }> = ({
  src,
  trimBefore = 0,
  push = 0.08,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.espresso, overflow: "hidden" }}>
      <Video
        src={staticFile(src)}
        trimBefore={trimBefore}
        muted
        premountFor={fps}
        objectFit="cover"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          scale: interpolate(frame, [0, durationInFrames], [1.04, 1.04 + push], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Grade />
    </AbsoluteFill>
  );
};

/** A still image with a Ken Burns drift. */
export const Still: React.FC<{ src: string; from?: string; to?: string }> = ({
  src,
  from = "0px 0px",
  to = "-60px -20px",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.espresso, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: interpolate(frame, [0, durationInFrames], [1.08, 1.18], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0, durationInFrames], [from, to], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Grade />
    </AbsoluteFill>
  );
};

/** Masked line that rises into view — the signature Lenval-style text reveal. */
export const RiseLine: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  italic?: boolean;
  color?: string;
}> = ({ children, delay = 0, size = 120, italic = false, color = colors.cream }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <div style={{ overflow: "hidden", paddingBottom: size * 0.08 }}>
      <div
        style={{
          fontFamily: serif,
          fontWeight: 300,
          fontStyle: italic ? "italic" : "normal",
          fontSize: size,
          lineHeight: 1,
          letterSpacing: "-0.01em",
          color,
          translate: interpolate(
            frame,
            [delay * fps, (delay + 1.3) * fps],
            ["0px 110%", "0px 0%"],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...ease) },
          ),
          opacity: interpolate(
            frame,
            [durationInFrames - 0.8 * fps, durationInFrames - 0.1 * fps],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Small uppercase tracked label with a gold rule. */
export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontFamily: sans,
        fontWeight: 500,
        fontSize: 20,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: colors.gold,
        opacity:
          interpolate(frame, [delay * fps, (delay + 1) * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) *
          interpolate(frame, [durationInFrames - 0.8 * fps, durationInFrames - 0.1 * fps], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
      }}
    >
      <div
        style={{
          height: 1,
          backgroundColor: colors.gold,
          width: interpolate(frame, [delay * fps, (delay + 1.4) * fps], [0, 70], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...ease),
          }),
        }}
      />
      {children}
    </div>
  );
};
