import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";

export const serif = loadSerif("normal", { weights: ["300", "400"], subsets: ["latin"] }).fontFamily;
loadSerif("italic", { weights: ["300", "400"], subsets: ["latin"] });
export const sans = loadSans("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;

export const colors = {
  espresso: "#1c1613",
  cream: "#f3ede4",
  gold: "#d8c08a",
  goldDeep: "#b8995a",
};

export const ease = [0.16, 1, 0.3, 1] as const;
