import { Composition, Folder } from "remotion";
import { BrandFilm } from "./BrandFilm";
import { HeroLoop } from "./HeroLoop";
import { SKYLINE_DURATION, SkylineFilm } from "./SkylineFilm";
import { CityScene } from "./scenes/CityScene";
import { ClosingScene } from "./scenes/ClosingScene";
import { ElevatedScene } from "./scenes/ElevatedScene";
import { IndiaScene } from "./scenes/IndiaScene";
import { OpeningScene } from "./scenes/OpeningScene";
import { VillasScene } from "./scenes/VillasScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="BrandFilm" component={BrandFilm} durationInFrames={815} fps={30} width={1920} height={1080} />
      <Composition id="HeroLoop" component={HeroLoop} durationInFrames={750} fps={30} width={1920} height={1080} />
      <Composition id="SkylineFilm" component={SkylineFilm} durationInFrames={SKYLINE_DURATION} fps={30} width={1920} height={1080} />
      <Folder name="Scenes">
        <Composition id="Opening" component={OpeningScene} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Elevated" component={ElevatedScene} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="City" component={CityScene} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Villas" component={VillasScene} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="India" component={IndiaScene} durationInFrames={135} fps={30} width={1920} height={1080} />
        <Composition id="Closing" component={ClosingScene} durationInFrames={180} fps={30} width={1920} height={1080} />
      </Folder>
    </>
  );
};
