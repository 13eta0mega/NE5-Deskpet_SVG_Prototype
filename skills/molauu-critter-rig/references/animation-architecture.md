# Animation Architecture

1. Keep matching anatomical IDs and compatible geometry in every state.
2. Normalize and numerically interpolate compatible path coordinates; only use true morph fallback for topology changes.
3. Render shared SVG elements once and mutate their live geometry through refs during transitions.
4. When interrupted, start the next transition from the currently displayed geometry rather than the last named state.
5. Keep one persistent idle loop. During morphs attenuate idle toward 0.1 over roughly 40% of the transition, then restore it.
6. Default whole-body scale/rotation around the feet/bottom-center.
7. Listening is a secondary motion layer: subtle body sway, asymmetric ear reaction, coherent face motion. Never translate ears freely away from their roots.
8. Talking reshapes the current mouth geometry continuously. Do not fade between separate closed/open mouth assets.
9. Emotion transitions should usually be 600-900 ms with symmetric ease-in-out timing.
