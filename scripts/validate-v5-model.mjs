import { EMOTIONS, PART_IDS, STATES, numberCount } from "../src/v5-model.js";

if (EMOTIONS.length !== 16) throw new Error(`Expected 16 emotions, got ${EMOTIONS.length}`);
const reference = STATES.neutral;
for (const emotion of EMOTIONS) {
  const state = STATES[emotion.key];
  for (const id of PART_IDS) {
    if (!state[id]) throw new Error(`${emotion.key}: missing ${id}`);
    if (state[id].tag !== reference[id].tag) throw new Error(`${emotion.key}/${id}: tag mismatch`);
    if (state[id].tag === "path" && numberCount(state[id].d) !== numberCount(reference[id].d)) {
      throw new Error(`${emotion.key}/${id}: path numeric topology mismatch`);
    }
  }
  if (state.mouth.fill !== "none") throw new Error(`${emotion.key}: mouth must remain fill=none`);
  if (state.mouth.strokeWidth !== 3) throw new Error(`${emotion.key}: mouth stroke must remain 3px`);
}
console.log(`V5 model OK: ${EMOTIONS.length} emotions, ${PART_IDS.length} shared parts, compatible topology, unfilled mouth.`);
