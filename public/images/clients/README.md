# Client logos

Each testimonial shows the client's logo beside their words. Put the logo
files in this folder.

Until a logo is attached, that client's initials are shown instead, which
looks deliberate rather than unfinished. You can add them one at a time.

## Adding a logo

**1. Save the file here.**

SVG is best, because it stays sharp at every size and weighs almost nothing.
PNG with a transparent background is the next best thing, exported at about
600 pixels wide. Avoid JPG, because it cannot hold a transparent background
and the logo will sit in a visible box.

Name it after the business in lower case, for example `forge.svg`.

**2. Register it in `src/data/images.ts`.**

```ts
export const clientLogos: Record<string, ImageAsset> = {
  forge: clientLogo("forge.svg", "Forge logo"),
};
```

**3. Attach it in `src/data/testimonials.ts`.**

```ts
{
  id: "one",
  quote: "...",
  name: "Chidi Eze",
  business: "Forge",
  projectType: "Technology Platform",
  logo: clientLogos.forge,
}
```

That is all. The logo replaces the initials for that testimonial.

## Dark logos

The website has a near black background, so a logo drawn in black disappears
into it. If yours is dark artwork made for a light background, add one line:

```ts
logo: clientLogos.forge,
logoInvert: true,
```

That redraws the logo in white. Check it afterwards, because inverting a
colourful logo turns it into a flat white shape, which is usually the right
look here but is worth seeing before you settle on it.

The cleanest result of all is a white or single colour version of the logo,
which most businesses have. Ask the client for it.

## Sizing

Logos are shown at up to 32 pixels tall and 144 pixels wide, and are fitted
inside that space without being stretched. Wide wordmarks and square marks
both work. There is nothing to crop.

## Permission

A logo is the client's property. Ask before putting it on your website, and
keep a record of the answer. Most are pleased to be shown as a client, but
asking is what keeps it that way.
