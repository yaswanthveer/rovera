import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Eyebrow, RiseLine, Still } from "../components/Cinematic";
import { colors, sans } from "../theme";

const pillars = ["Impeccable Provenance", "Transparent by Design", "Locations of Lasting Worth"];

export const VillasScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Still src="images/villas-dusk.jpg" from="0px 0px" to="-80px -30px" />
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 140px 120px" }}>
        <Eyebrow delay={0.3}>The Rovera Distinction</Eyebrow>
        <div style={{ height: 30 }} />
        <RiseLine delay={0.4} size={120}>Where Certainty Is the</RiseLine>
        <RiseLine delay={0.55} size={120} italic color={colors.gold}>Ultimate Luxury</RiseLine>
        <div style={{ display: "flex", gap: 70, marginTop: 50 }}>
          {pillars.map((p, i) => (
            <div
              key={p}
              style={{
                fontFamily: sans,
                fontSize: 22,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: colors.cream,
                borderTop: `1px solid ${colors.gold}`,
                paddingTop: 18,
                opacity:
                  interpolate(frame, [(1.4 + i * 0.25) * fps, (2.2 + i * 0.25) * fps], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }) *
                  interpolate(frame, [durationInFrames - 0.8 * fps, durationInFrames - 0.1 * fps], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
              }}
            >
              <span style={{ color: colors.gold, marginRight: 14 }}>0{i + 1}</span>
              {p}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
