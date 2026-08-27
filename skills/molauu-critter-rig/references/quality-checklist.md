# Quality Checklist

## Visual
- 200x200 viewBox or justified equivalent.
- One dominant soft body blob; no thick outer outline.
- Tiny simple eyes and a 3 px round-capped mouth.
- Simple geometric hands and feet.
- Flat 3-4 color palette.
- No unnecessary nose, muzzle, brows, inner-ear shapes, gradients, or shadows.
- Artwork is original; source-example coordinates are not reused.

## Anatomy
- Same core IDs in every emotion state.
- Ear roots overlap the body enough that motion cannot reveal a gap.
- Feet remain near the baseline.
- Face spacing remains coherent.

## Motion
- No emotion crossfade.
- Shared paths interpolate numerically.
- Rapid switching continues from current displayed geometry.
- Idle remains alive at low amplitude during morphs.
- Listening affects body and ears coherently.
- Talking opens the live mouth path instead of swapping mouth layers.

## Build/runtime
- Production build succeeds.
- Host asset base is correct.
- Deployed index points to built JS/CSS, not raw JSX.
