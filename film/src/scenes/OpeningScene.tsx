import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Clip, Eyebrow } from "../components/Cinematic";
import { colors, ease, serif } from "../theme";

export const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Clip src="clips/c1-golden-haze.mp4" push={0.1} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
        <div
          style={{
            fontFamily: serif,
            fontWeight: 300,
            fontSize: 150,
            color: colors.cream,
            letterSpacing: interpolate(frame, [0, 3 * fps], ["0.9em", "0.42em"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...ease),
            }),
            paddingLeft: "0.42em",
            opacity:
              interpolate(frame, [0.2 * fps, 1.8 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
              interpolate(frame, [durationInFrames - 0.8 * fps, durationInFrames], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            filter: `blur(${interpolate(frame, [0, 1.8 * fps], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}
        >
          ROVERA
        </div>
        <Eyebrow delay={1.6}>Ventures · Bengaluru</Eyebrow>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
