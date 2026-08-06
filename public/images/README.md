# Image list

Every photograph on the website is declared in `src/data/images.ts`. Out of the
box the site loads them from the Unsplash image service, so it works with no
extra steps. Hosting the files yourself is faster and removes the dependency on
an outside service, and this page tells you exactly what to download and where
to put it.

## How to host the images yourself

1. Download each photograph in the table below.
2. Save it into this folder (`public/images/`) using the exact file name shown.
3. Open `src/data/images.ts` and set `USE_LOCAL_IMAGES` to `true`.
4. Restart the development server.

Nothing else needs to change. The alternative text, the reserved space, and the
lazy loading all keep working.

## Recommended export settings

| Use | Longest edge | Format | Quality |
| --- | --- | --- | --- |
| Hero and project images | 1600 px | JPG or WebP | 72 to 80 |
| Service images | 1200 px | JPG or WebP | 72 |
| Portraits | 900 px | JPG or WebP | 75 |
| Social sharing image | 1200 x 630 px | JPG | 80 |

Keep every file under 300 KB. Anything larger will slow the first view down.

## The list

Each source address below opens the photograph on Unsplash, where you can
download the full size file. All of them are free to use under the Unsplash
licence. You are free to replace any of them with your own photography, which
is always the stronger choice for a portfolio.

| File name to save | Used for | Source |
| --- | --- | --- |
| `hero-primary.jpg` | Hero photograph, a developer workspace | https://unsplash.com/photos/photo-1498050108023-c5249f4df085 |
| `hero-lens.jpg` | Second layer revealed by the hero lens, a website interface | https://unsplash.com/photos/photo-1551288049-bebda4e38f71 |
| `about-portrait.jpg` | About section portrait | https://unsplash.com/photos/photo-1507003211169-0a1dd7228f2d |
| `about-detail.jpg` | About section detail, code on screen | https://unsplash.com/photos/photo-1461749280684-dccba630e2f6 |
| `service-business.jpg` | Business Websites | https://unsplash.com/photos/photo-1497366754035-f200968a6e72 |
| `service-portfolio.jpg` | Portfolio Websites | https://unsplash.com/photos/photo-1487017159836-4e23ece2e4cf |
| `service-school.jpg` | School Websites | https://unsplash.com/photos/photo-1503676260728-1c00da094a0b |
| `service-landing.jpg` | Landing Pages | https://unsplash.com/photos/photo-1460925895917-afdab827c52f |
| `service-redesign.jpg` | Website Redesign | https://unsplash.com/photos/photo-1454165804606-c3d57bc86b40 |
| `service-frontend.jpg` | Frontend Development | https://unsplash.com/photos/photo-1555066931-4365d14bab8c |
| `project-fashion.jpg` | Project, Atelier Nova | https://unsplash.com/photos/photo-1441986300917-64674bd600d8 |
| `project-school.jpg` | Project, Northgate Academy | https://unsplash.com/photos/photo-1509062522246-3755977927d7 |
| `project-hospital.jpg` | Project, Meridian Health | https://unsplash.com/photos/photo-1519494026892-80bbd2d6fd0d |
| `project-technology.jpg` | Project, Orbit Systems | https://unsplash.com/photos/photo-1451187580459-43490279c0fa |
| `project-landing.jpg` | Project, Ledger Partners | https://unsplash.com/photos/photo-1522071820081-009f0129c71c |
| `project-portfolio.jpg` | Project, Ayo Studio | https://unsplash.com/photos/photo-1486312338219-ce68d2c6f44d |
| `client-one.jpg` | Testimonial portrait, first client | https://unsplash.com/photos/photo-1494790108377-be9c29b29330 |
| `client-two.jpg` | Testimonial portrait, second client | https://unsplash.com/photos/photo-1472099645785-5658abf4ff4e |
| `client-three.jpg` | Testimonial portrait, third client | https://unsplash.com/photos/photo-1573496359142-b8d87734a5a2 |

## Two files this folder still needs

These are referenced by `index.html` and are not created for you, because they
should carry your own branding.

| File name | Size | Purpose |
| --- | --- | --- |
| `og-cover.jpg` | 1200 x 630 px | The picture shown when the website is shared on social platforms |
| `apple-touch-icon.png` | 180 x 180 px | The icon used when the website is saved to a phone home screen |

Until you add them the website still works. Only the sharing preview and the
saved icon are affected.

## If a photograph does not appear

The website shows a quiet blueprint panel in place of any image that fails to
load, so a missing file never breaks the layout. If you see that panel, either
the file name does not match the table above, or `USE_LOCAL_IMAGES` is still set
to `false` while the file is only stored locally.
