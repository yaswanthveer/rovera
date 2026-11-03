import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Eyebrow, RiseLine, Still } from "../components/Cinematic";
import { colors, ease, serif } from "../theme";

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = interpolate(frame, [2.6 * fps, 4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...ease),
  });
  return (
    <AbsoluteFill>
      <Still src="images/city-golden.jpg" from="0px 0px" to="40px -20px" />
      <AbsoluteFill style={{ backgroundColor: colors.espresso, opacity: interpolate(frame, [2.2 * fps, 3.4 * fps], [0.35, 0.82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ opacity: interpolate(frame, [2.2 * fps, 2.8 * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), position: "absolute" }}>
          <RiseLine delay={0.3} size={104}>Some addresses are bought.</RiseLine>
          <RiseLine delay={0.5} size={104} italic color={colors.gold}>Others are inherited.</RiseLine>
        </div>
        <div style={{ opacity: mark, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 300,
              fontSize: 170,
              color: colors.cream,
              letterSpacing: interpolate(mark, [0, 1], [0.7, 0.42]) + "em",
              paddingLeft: "0.42em",
            }}
          >
            ROVERA
          </div>
          <Eyebrow delay={3.4}>Private Viewings by Appointment</Eyebrow>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
