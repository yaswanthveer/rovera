import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { useVideoConfig } from "remotion";
import { CityScene } from "./scenes/CityScene";
import { ClosingScene } from "./scenes/ClosingScene";
import { ElevatedScene } from "./scenes/ElevatedScene";
import { IndiaScene } from "./scenes/IndiaScene";
import { OpeningScene } from "./scenes/OpeningScene";
import { VillasScene } from "./scenes/VillasScene";

// 150+150+150+150+135+180 = 915, minus 5 x 20-frame fades = 815 frames (~27s @ 30fps)
export const BrandFilm: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Opening — ROVERA" durationInFrames={150} premountFor={fps}>
        <OpeningScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 20 })} />
      <TransitionSeries.Sequence name="Land, Elevated" durationInFrames={150} premountFor={fps}>
        <ElevatedScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 20 })} />
      <TransitionSeries.Sequence name="City's Future" durationInFrames={150} premountFor={fps}>
        <CityScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 20 })} />
      <TransitionSeries.Sequence name="Distinction — Villas" durationInFrames={150} premountFor={fps}>
        <VillasScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 20 })} />
      <TransitionSeries.Sequence name="Across India" durationInFrames={135} premountFor={fps}>
        <IndiaScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 20 })} />
      <TransitionSeries.Sequence name="Closing — Wordmark" durationInFrames={180} premountFor={fps}>
        <ClosingScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
