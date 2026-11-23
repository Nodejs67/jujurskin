export { analyzeRoast, formatRupiah } from "@/lib/roast/engine";
export { matchProduct, matchAll, findDbProduct } from "@/lib/roast/match";
export { GROUPS, GROUP_BY_ID, GROUP_CONFLICTS } from "@/lib/roast/groups";
export { DISCLAIMER, scoreLabel } from "@/lib/roast/copy";
export type {
  RoastInput,
  RoastResult,
  RoastFinding,
  RoastProductInput,
  MatchedProduct,
  DetectedGroup,
} from "@/lib/roast/types";
