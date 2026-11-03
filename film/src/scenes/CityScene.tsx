import { AbsoluteFill } from "remotion";
import { Clip, Eyebrow, RiseLine } from "../components/Cinematic";
import { colors } from "../theme";

export const CityScene: React.FC = () => (
  <AbsoluteFill>
    <Clip src="clips/c3-metro-green.mp4" />
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: "0 140px 130px", textAlign: "right" }}>
      <Eyebrow delay={0.3}>Bengaluru · Curated for India</Eyebrow>
      <div style={{ height: 30 }} />
      <RiseLine delay={0.4} size={110}>Placed Where the City's</RiseLine>
      <RiseLine delay={0.55} size={110} italic color={colors.gold}>Future Is Unfolding</RiseLine>
    </AbsoluteFill>
  </AbsoluteFill>
);
