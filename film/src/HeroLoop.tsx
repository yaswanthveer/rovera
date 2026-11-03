import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { useVideoConfig } from "remotion";
import { Clip } from "./components/Cinematic";

// Textless cinematic loop for the website hero (text lives in HTML on top).
// 4 x 210 frames - 3 x 30-frame fades = 750 frames (25s @ 30fps)
export const HeroLoop: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Golden haze" durationInFrames={210} premountFor={fps}>
        <Clip src="clips/c1-golden-haze.mp4" push={0.1} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
      <TransitionSeries.Sequence name="Metro through green" durationInFrames={210} premountFor={fps}>
        <Clip src="clips/c3-metro-green.mp4" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
      <TransitionSeries.Sequence name="Lake city" durationInFrames={210} premountFor={fps}>
        <Clip src="clips/c5-lake-city.mp4" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
      <TransitionSeries.Sequence name="Golden tower" durationInFrames={210} premountFor={fps}>
        <Clip src="clips/c4-golden-tower.mp4" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
