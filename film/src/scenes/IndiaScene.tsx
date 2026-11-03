import { AbsoluteFill } from "remotion";
import { Clip, Eyebrow, RiseLine } from "../components/Cinematic";
import { colors } from "../theme";

export const IndiaScene: React.FC = () => (
  <AbsoluteFill>
    <Clip src="clips/c5-lake-city.mp4" />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <Eyebrow delay={0.3}>Mumbai · Delhi · Hyderabad · Dubai · London</Eyebrow>
      <div style={{ height: 36 }} />
      <RiseLine delay={0.4} size={120}>From Every Corner of India,</RiseLine>
      <RiseLine delay={0.55} size={120} italic color={colors.gold}>One Remarkable Address</RiseLine>
    </AbsoluteFill>
  </AbsoluteFill>
);
