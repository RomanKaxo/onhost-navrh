# ONhost illustration handoff

Created with the built-in image_gen tool. No commits or pushes; assets remain in the img/codex worktree for the coordinator.

## Deliverables

- `public/planets/<key>.webp`: all 24 requested keys, 1024 × 1024.
- `public/planets/<key>-md.webp`: all 24 keys, 512 × 512.
- `public/planets/<key>-sm.webp`: all 24 keys, 256 × 256.
- `public/planets/manifest.json`: key to short Czech alternative text.
- `public/bg/bg-nebula.webp`: 1664 × 936, 61,730 bytes.
- `public/bg/bg-horizon.webp`: 1664 × 936, 25,150 bytes.
- `public/bg/bg-deep.webp`: 1664 × 936, 30,038 bytes.
- `docs/illustration-prompts.json`: shared style and individual subjects for future matching assets.

All WebP files use Pillow quality 84 and method 6. Every planet preserves actual transparency, including soft glow. Backgrounds are opaque. Generated planet canvases were uniformly reduced and centered on transparent 1024px canvases to provide margins without cropping props.

## Review

The client reference was found at `/tmp/claude-1000/-home-roman/0769163a-bb85-4963-bd8a-0534bc2582b6/scratchpad/codex-img/style-reference.png` (the initially supplied location did not exist). Game was generated first, visually compared to that reference, and used as the image style reference for each subsequent asset. The same planet style description was reused verbatim.

Every generated result was visually inspected. Full family and 120px previews were inspected against a #12001E background. No text, letters, numbers, real logos, recognizable game characters, Earth-like terrain, or visibly off-palette props were found. No regeneration was needed. The force-field planet intentionally has a smaller visible sphere to keep its surrounding shield and meteor impacts inside the frame.

Contact sheet: `/tmp/claude-1000/-home-roman/0769163a-bb85-4963-bd8a-0534bc2582b6/scratchpad/codex-img/contact-sheet.png`.

Additional 120px review: same directory, `contact-sheet-120.png`.

## Limits

The generator returned backgrounds at 1672 × 941 despite the prompt requesting the largest possible 3840 × 2160 output. The built-in tool exposes no size parameter. Finals use a minimal crop to exact 16:9 at 1664 × 936; they were not artificially upscaled. Product illustrations are conceptual proposal art and do not assert actual company facilities or equipment.
