# Images

There are two kinds of picture on this website, and they are handled
differently.

1. **Project screenshots.** Pictures of your own live websites. These are
   captured automatically. See part one below.
2. **People and places.** The hero, the About section, and the client
   portraits. These come from a photo service by default, and part two shows
   how to replace them with Nigerian photography.

---

## Part one: project screenshots, captured automatically

The seven project images are screenshots of your live websites, taken straight
from their real addresses. Run this once on your own computer:

```bash
npm install --no-save playwright
npx playwright install chromium
npm run capture
```

The screenshots land in `public/images/projects/` as `forge.jpg`,
`horizon.jpg`, `ocmedical.jpg`, `cabello.jpg`, `specdec.jpg`, `lcci.jpg`, and
`duryplaza.jpg`. Commit them, and they appear on the website.

Playwright is deliberately not a dependency of this project, so it never slows
a deployment down. The first two commands are needed only on the machine where
you take the screenshots, and only once.

### If a capture fails

Free hosting on Render sleeps when nobody visits, and the first request has to
wake it up, which can take almost a minute. If a site times out, open its
address in your browser, wait for it to load, then run `npm run capture` again.

### Before the screenshots exist

Any project without a screenshot shows a small browser frame with the project
name inside it. Nothing looks broken, so you can deploy first and capture
later.

### Adding a new project

Add it in three places:

1. `src/data/images.ts`, inside `projectImages`
2. `src/data/projects.ts`, in the `projects` list
3. `scripts/capture-projects.mjs`, in the `TARGETS` list

Use the same short id in all three, then run `npm run capture` again.

---

## Part two: replacing the people and places with Nigerian photography

Your own portrait is already in place in the About section. Two pictures still
load from Unsplash, both in the hero. Replacing them with
Nigerian photography is a much stronger fit for the brand, and it takes about
ten minutes.

### Step one, download two pictures

These searches return free Nigerian and West African photography. Pick one
picture for each row, and save it with the exact file name given.

| Save it as | What to look for | Where to search |
| --- | --- | --- |
| `hero-primary.jpg` | A developer at work, or a modern workspace | https://unsplash.com/s/photos/nigerian-developer |
| `hero-lens.jpg` | A website or dashboard on a screen, matching the hero crop | https://unsplash.com/s/photos/website-design-screen |

`about-portrait.jpg` is not in that list, because it is already your own
photograph. It sits in this folder and always loads from here.

There are no client portraits to download either. The testimonials show each
client's initials instead of a face, because a stock photograph of a stranger
beside a quote they never gave is a false endorsement, not a placeholder. When
you have a real client, a real quote, and their permission to use their
picture, see the note at the end of this page.

Pexels has good Nigerian photography too: https://www.pexels.com/search/nigeria/

The same reasoning applies to the hero. A real photograph of you at work beats
any stock picture, so if you have one, save it as `hero-primary.jpg`.

### Step two, save them here

Put both files directly into this folder, `public/images/`.

### Step three, switch them on

Open `src/data/images.ts` and change one line:

```ts
export const USE_LOCAL_IMAGES = true;
```

Restart the development server. That is the whole change. The project
screenshots are unaffected, because they always load from your own files.

### Step four, fix the alternative text

Alternative text describes what a picture actually shows, so screen readers
and search engines get the truth. Once you have swapped a picture, update its
`alt` line in `src/data/images.ts` to describe the new one.

### Export settings

| Use | Longest edge | Format | Quality |
| --- | --- | --- | --- |
| Hero | 1600 px | JPG or WebP | 72 to 80 |
| Portraits | 1000 px | JPG or WebP | 80 |
| Social sharing image | 1200 x 630 px | JPG | 80 |

Keep every file under 300 KB. Anything larger slows the first view down.

---

## Two files this folder still needs

These are named in `index.html` and are not created for you, because they
should carry your own branding.

| File name | Size | Purpose |
| --- | --- | --- |
| `og-cover.jpg` | 1200 x 630 px | The picture shown when the website is shared |
| `apple-touch-icon.png` | 180 x 180 px | The icon used when the website is saved to a phone |

Until you add them the website still works. Only the sharing preview and the
saved icon are affected.

---

## Adding a real client photograph

The testimonials show initials rather than faces. That is deliberate: while
the quotes are placeholders, attaching a stranger's photograph to them would
present a false endorsement.

Once a testimonial is real, and the client has agreed to their picture being
published on your website, add it in two steps.

1. Save their photograph here as, for example, `client-amara.jpg`, cropped
   square at about 400 by 400 pixels.
2. In `src/data/images.ts`, add the asset:

   ```ts
   export const clientAmara: ImageAsset = {
     id: "",
     local: "client-amara.jpg",
     alt: "Amara Okoye, owner of Atelier Nova",
     ratio: 1,
     localOnly: true,
   };
   ```

3. In `src/data/testimonials.ts`, attach it to their entry:

   ```ts
   image: clientAmara,
   ```

The photograph replaces the initials in that testimonial straight away.
Everything else, including the layout and the transitions, stays as it is.

Always ask before publishing someone's face, and keep a record of the answer.
