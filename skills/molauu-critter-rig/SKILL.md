---
name: molauu-critter-rig
description: Design and implement original flat-color SVG critter mascots and multi-state React animation rigs using the visual grammar and motion architecture exemplified by molauu/svg-character-animator, without copying the example artwork. Use when asked for a molauu-like critter, a cute minimal SVG mascot, 2-16 emotion states, smooth path interpolation, listening/talking modes, or Live2D-like continuous SVG transitions with stable anatomy and no crossfade-based emotion swapping.
---

# Molauu Critter Rig

Create original SVG characters that feel visually compatible with the molauu Critters demo while keeping all artwork original. Preserve the repo's strongest animation ideas: shared anatomical IDs, render-once paths, numeric interpolation, persistent idle motion, and bottom-center body anchoring.

## Workflow

1. Read `references/design-language.md` before drawing any character.
2. Read `references/animation-architecture.md` before implementing transitions or interactive modes.
3. Define the character as a small stable anatomy set. Prefer exactly these 10 shared parts unless the request requires more: `legL`, `legR`, `earL`, `earR`, `body`, `eyeL`, `eyeR`, `mouth`, `handL`, `handR`.
4. Author every emotion/state on the same 200x200 viewBox and keep each shared part present in every state.
5. Keep each path's command topology compatible across states. Prefer coordinate interpolation over a morph library. Do not solve ordinary expression changes with opacity crossfades.
6. Render shared parts once and mutate geometry imperatively during transitions so React does not snap geometry to the destination state.
7. Run idle motion continuously. During a state morph, attenuate idle amplitude toward 0.1 over roughly 40% of the transition, then restore it after completion.
8. Add listening and talking as continuous modulation of the live geometry, not as image/state swaps. Listening should move body/ears/face coherently. Talking should reshape the existing mouth geometry while preserving the current emotion.
9. Test rapid state switching. A new transition must begin from the currently displayed geometry, not from the previous named state.
10. Check the result against `references/quality-checklist.md` before shipping.

## Non-negotiable visual rules

- Use a 200x200 canvas unless an existing project requires another size.
- Use large soft body masses, minimal anatomy, flat fills, and no decorative outline around the whole character.
- Keep eyes tiny and dark; keep the mouth a simple dark round-capped stroke or a very small filled opening when speaking.
- Use hands/feet as simple circles, ellipses, or rounded rectangles.
- Prefer one dominant body color plus one lighter secondary paw/face color and one dark facial color.
- Avoid gradients, drop shadows, glossy highlights, faux-3D shading, complex muzzles, eyebrows, inner-ear detailing, and excessive facial parts unless the user explicitly asks for them.
- Do not copy coordinates, exact silhouettes, or palettes from molauu's example artwork. Match the design grammar, not the artwork.

## Transition policy

- Default emotion transition: 600-900 ms with a symmetric ease-in-out curve.
- Use the same timeline start for tightly coupled face parts.
- Keep the feet visually anchored near the bottom of the canvas.
- Never detach ears from the body during rotation. Author ear paths that overlap the body silhouette or rotate around a pivot hidden beneath the body mass.
- Flat fill colors may interpolate continuously; gradients should not be introduced for this style.

## Listening and talking

Listening should add a subtle bottom-anchored body sway, asymmetric ear motion, and coherent face motion on top of the current emotion. Talking should reshape the same live mouth path continuously and preserve the current expression. Do not crossfade between separate mouth layers.

## Copyright boundary

The molauu repository's code is MIT-licensed, while its example artwork is separately licensed CC BY-NC 4.0. Treat the example characters as visual-study references only. Do not reuse their path coordinates, exact silhouettes, or exact character palettes in generated production artwork.
