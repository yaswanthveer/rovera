import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Clip, Eyebrow, RiseLine, Still } from "./components/Cinematic";
import { colors, ease, sans, serif } from "./theme";

const T = 24; // cross-fade frames

/** Thin gold rule that draws across, used as a luxury accent. */
const GoldRule: React.FC<{ delay: number; width: number }> = ({ delay, width }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        height: 1,
        backgroundColor: colors.gold,
        width: interpolate(frame, [delay * fps, (delay + 1.4) * fps], [0, width], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...ease),
        }),
      }}
    />
  );
};

/** Opening letterbox: bars part like a curtain over the first shot. */
const Curtain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0.2 * fps, 1.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.77, 0, 0.18, 1),
  });
  const h = `${(1 - p) * 50}%`;
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: colors.espresso, height: h }} />
      <AbsoluteFill style={{ backgroundColor: colors.espresso, height: h, top: "auto", bottom: 0 }} />
    </>
  );
};

const KingfisherScene: React.FC = () => (
  <AbsoluteFill>
    <Clip src="clips/c7-kingfisher.mp4" push={0.06} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 15% 85%, rgba(20,15,12,0.6) 0%, rgba(20,15,12,0) 70%)" }} />
    <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 140px 130px" }}>
      <Eyebrow delay={1.4}>Bengaluru · From Above</Eyebrow>
      <div style={{ height: 30 }} />
      <RiseLine delay={1.6} size={116}>Above the Skyline,</RiseLine>
      <RiseLine delay={1.8} size={116} italic color={colors.gold}>Beyond the Ordinary</RiseLine>
    </AbsoluteFill>
    <Curtain />
  </AbsoluteFill>
);

const MGRoadScene: React.FC = () => (
  <AbsoluteFill>
    <Clip src="clips/c8-mgroad.mp4" push={0.07} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 85% 85%, rgba(20,15,12,0.82) 0%, rgba(20,15,12,0) 70%)" }} />
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: "0 140px 130px", textAlign: "right" }}>
      <Eyebrow delay={0.5}>The Heart of the Garden City</Eyebrow>
      <div style={{ height: 30 }} />
      <RiseLine delay={0.6} size={116}>Where Prestige</RiseLine>
      <RiseLine delay={0.8} size={116} italic color={colors.gold}>Meets the Green</RiseLine>
    </AbsoluteFill>
  </AbsoluteFill>
);

const ContactScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = interpolate(frame, [0.3 * fps, 1.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...ease),
  });
  const details = interpolate(frame, [1.8 * fps, 2.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Still src="images/villas-dusk.jpg" from="0px 0px" to="-40px -10px" />
      <AbsoluteFill style={{ backgroundColor: colors.espresso, opacity: 0.8 }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", gap: 44 }}>
        <div
          style={{
            opacity: mark,
            fontFamily: serif,
            fontWeight: 300,
            fontSize: 170,
            color: colors.cream,
            letterSpacing: interpolate(mark, [0, 1], [0.7, 0.42]) + "em",
            paddingLeft: "0.42em",
            lineHeight: 1,
          }}
        >
          ROVERA
        </div>
        <GoldRule delay={1.2} width={220} />
        <div style={{ opacity: details, translate: `0px ${(1 - details) * 20}px`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: sans, fontSize: 20, letterSpacing: "0.32em", textTransform: "uppercase", color: colors.gold }}>
            Private Viewings by Appointment
          </div>
          <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 300, fontSize: 64, color: colors.cream, marginTop: 10 }}>
            Varun Sudamshetty
          </div>
          <div style={{ fontFamily: sans, fontSize: 26, letterSpacing: "0.14em", color: colors.cream, opacity: 0.85 }}>
            +91 97429 58693 &nbsp;·&nbsp; svarunroyal999@gmail.com
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SKYLINE_DURATION = 205 + 240 + 165 - 2 * T;

export const SkylineFilm: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.espresso }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={205} premountFor={30}>
        <KingfisherScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={240} premountFor={30}>
        <MGRoadScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={165} premountFor={30}>
        <ContactScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
