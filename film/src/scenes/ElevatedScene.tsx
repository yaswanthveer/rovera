import { AbsoluteFill } from "remotion";
import { Clip, Eyebrow, RiseLine } from "../components/Cinematic";
import { colors } from "../theme";

export const ElevatedScene: React.FC = () => (
  <AbsoluteFill>
    <Clip src="clips/c6-metro-forest.mp4" />
    <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 140px 130px" }}>
      <Eyebrow delay={0.3}>Private Plotted Estates</Eyebrow>
      <div style={{ height: 30 }} />
      <RiseLine delay={0.4} size={190}>Land,</RiseLine>
      <RiseLine delay={0.6} size={190} italic color={colors.gold}>Elevated.</RiseLine>
    </AbsoluteFill>
  </AbsoluteFill>
);
