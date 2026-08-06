# TechGrandHub

A portfolio website for TechGrandHub, a web development brand. Built with
React, TypeScript, Tailwind CSS, and GSAP.

---

## 1. The creative concept

**Editorial technology.** A near black canvas, warm white typography, one
cobalt accent, soft silver detail, and a faint blueprint grid. Large editorial
headings sit against generous space, with a serif italic used sparingly to
carry the emotional half of each sentence. Glass appears once, in the hero
lens, so it stays special.

**The Digital Thread** is the signature idea, and it is a real system rather
than a decoration.

The website opens as an empty blueprint. Construction lines arrive from the
edges and meet, the TechGrandHub name assembles itself from scattered
fragments, the headline rises through a mask, and the hero photograph is
uncovered by a glass lens that travels a curved motion path across it. When
the assembly finishes, one line remains.

That line then travels the entire page. Sections do not draw it themselves:
each one registers invisible **waypoints** at the places the line should pass
through, and a single component measures them all and draws one continuous
curve down the whole document, revealed as you scroll with a light riding its
leading edge. Because the route is measured rather than hard coded, adding a
new waypoint anywhere is one line of markup.

The line behaves differently in each section because of where the waypoints
are placed:

| Section | What the thread does |
| --- | --- |
| Hero | Starts at the availability line, the last surviving construction line |
| About | Passes through the statement, where drawn rectangles outline the key phrases |
| Services | Waypoints alternate side to side, so the line weaves between the service rows |
| Projects | Enters at the filters and leaves at the foot of the list, framing the work |
| Process | Every stage marker is a waypoint, so the thread literally becomes the timeline rail |
| Technology | Passes the purpose selector, where a second drawn line connects the chosen tools |
| Contact | Runs into the heading, then into the submit button, and closes a circle around the confirmation message |

### The playground

Between the process and the testimonials there is a section a visitor can
actually use. Developers get a three pane editor with a live preview, and
everybody else gets Snake, a memory game, and a reaction timer.

The preview runs inside a frame with the scripts permission and nothing else.
Without permission for the same origin the browser treats it as a separate
site, so code typed in there cannot reach this page, its storage, or its
cookies. Work in progress is kept in local storage on the visitor's own
device, and nothing is ever uploaded.

On phones the route is simplified: optional waypoints are dropped and the curve
is pulled towards a narrow rail so it never crosses the reading area. When the
visitor asks for reduced motion, the thread is simply present and still, and
every section renders its finished state immediately.

---

## 2. Project structure

```
techgrandhub/
├── index.html                     Document shell, meta tags, fonts, structured data
├── package.json
├── vite.config.ts
├── tsconfig.json                  Project references
├── tsconfig.app.json              Application compiler options
├── tsconfig.node.json             Build tooling compiler options
├── eslint.config.js
├── netlify.toml                   Netlify build and redirect rules
├── vercel.json                    Vercel build and redirect rules
├── .env.example                   Template for the contact form settings
├── .gitignore
├── README.md
│
├── scripts/
│   └── capture-projects.mjs       Screenshots every live project
│
├── public/
│   ├── favicon.svg                Favicon placeholder, replace with your mark
│   ├── robots.txt
│   └── images/
│       └── README.md              The image list and download guide
│
└── src/
    ├── main.tsx                   Application entry point
    ├── App.tsx                    Page composition and section order
    ├── index.css                  Design tokens, base styles, utilities
    ├── vite-env.d.ts              Types for the environment variables
    │
    ├── types/
    │   └── index.ts               Shared content types
    │
    ├── data/                      All editable content lives here
    │   ├── site.ts                Brand, navigation, contact details, form options
    │   ├── images.ts              Every photograph, in one registry
    │   ├── services.ts            The six services
    │   ├── projects.ts            The project showcase
    │   ├── process.ts             The seven process stages
    │   ├── technologies.ts        Tools and their purpose groups
    │   ├── testimonials.ts        Client words
    │   └── stats.ts               Statistics and strengths
    │
    ├── lib/
    │   ├── enquiry.ts             Where contact enquiries are sent
    │   ├── gsap.ts                Single GSAP entry point, plugins registered once
    │   └── utils.ts               Class names, smooth path builder, validation helpers
    │
    ├── hooks/
    │   ├── useGsapEffect.ts       Scoped GSAP context with automatic cleanup
    │   ├── useMediaQuery.ts       Reduced motion, mobile, and touch detection
    │   └── useActiveSection.ts    Navigation highlighting
    │
    └── components/
        ├── thread/
        │   ├── ThreadContext.tsx  The waypoint registry
        │   └── DigitalThread.tsx  The line itself
        │
        ├── layout/
        │   ├── Preloader.tsx      The opening blueprint
        │   ├── Navbar.tsx         Fixed navigation
        │   ├── MobileMenu.tsx     Assembling panel menu
        │   ├── Logo.tsx           The brand mark
        │   └── Footer.tsx
        │
        ├── playground/
        │   ├── CodeLab.tsx        Editor with a sandboxed live preview
        │   ├── SnakeGame.tsx
        │   ├── MemoryGame.tsx
        │   └── ReactionGame.tsx
        │
        ├── ui/
        │   ├── Button.tsx         Buttons and links, with magnetic hover
        │   ├── Figure.tsx         Every photograph goes through this
        │   ├── RevealText.tsx     Masked word and assembled character reveals
        │   ├── SectionHeading.tsx Shared editorial heading
        │   ├── OutlineWord.tsx    Drawn outline around a phrase
        │   ├── Counter.tsx        Counting statistics
        │   ├── Field.tsx          Accessible form controls
        │   └── CustomCursor.tsx   Desktop cursor with action labels
        │
        └── sections/
            ├── Hero.tsx
            ├── About.tsx
            ├── Services.tsx
            ├── Projects.tsx
            ├── Process.tsx
            ├── Technologies.tsx
            ├── Playground.tsx     Code editor and games
            ├── Testimonials.tsx
            └── Contact.tsx
```

---

## 3. Installation

You need Node.js version 20 or newer.

```bash
npm install
```

That is the whole setup. No other services are required to run the website.

---

## 4. Running the project locally

```bash
npm run dev        # start the development server at http://localhost:5173
npm run build      # type check, then build into dist/
npm run preview    # serve the built site locally
npm run lint       # check the code
npm run typecheck  # types only, no build
npm run capture    # screenshot every live project, see below
```

### Screenshotting the projects

The project images are screenshots of your own live websites. Take them with:

```bash
npm install --no-save playwright
npx playwright install chromium
npm run capture
```

The images land in `public/images/projects/`. Commit them and they appear on
the website. Playwright is deliberately not a dependency, so this never slows
a deployment down. Full detail is in `public/images/README.md`.

The development server is exposed on your network as well, so you can open the
address it prints on a real phone and test the mobile experience properly.

---

## 5. Changing the content

Everything you are likely to edit lives in `src/data`. None of it requires
touching a component.

### Brand, navigation, and contact details

`src/data/site.ts`

- `brand` holds the name, the role, the tagline, the availability line, and the
  founding year.
- `navLinks` controls the navigation. The `target` value must match the `id` of
  a section in `src/App.tsx`.
- `contactDetails` holds your email address, your WhatsApp number, and your
  GitHub and LinkedIn addresses. **Replace all four before launch.** The
  WhatsApp number must be digits only, in full international format, with no
  plus sign and no spaces.
- `socialLinks` is built from `contactDetails`, so changing the details there
  updates the contact section, the footer, and every link at once.
- `projectTypeOptions` and `budgetOptions` fill the two menus in the form.

### Projects

`src/data/projects.ts`

Each entry needs a name, category, year, short description, longer detail,
technologies, image, live address, and three result lines. The category filter
buttons are generated from the categories you use, so adding a new category is
automatic. Set `liveUrl` to the real website address.

### Services, process, technology, testimonials, statistics

`src/data/services.ts`, `process.ts`, `technologies.ts`, `testimonials.ts`,
and `stats.ts`. Each file is a plain, typed list. Add or remove entries freely,
the layouts adapt.

The statistics in `stats.ts` are realistic placeholders. Change them to your
real numbers before launch.

### Images

`src/data/images.ts` is the single registry for every photograph. See
`public/images/README.md` for the full download list, the recommended export
sizes, and the one line change that switches the site from the remote image
service to files you host yourself.

To swap a single photograph, change its `id` (remote) or its `local` file name,
and update the `alt` text to describe the new picture.

### Text

Section headings, paragraphs, and labels live in the section components under
`src/components/sections`. They are ordinary readable JSX.

### Colours and typography

`src/index.css`, in the `@theme` block at the top. Change `--color-cobalt` and
the entire accent of the website follows, including the thread, the buttons,
and the focus rings.

---

## 6. Connecting the contact form

Enquiries go through **Web3Forms**. The form validates, shows loading,
success, and error states, and traps spam. Until a key is set it writes the
enquiry to the browser console so you can confirm it works.

### Switching it on, about a minute

1. Go to https://web3forms.com and enter your email address. No account is
   needed. The access key is emailed to you straight away.
2. Create a file named `.env` in the project root:

   ```
   VITE_WEB3FORMS_KEY=your-access-key
   ```

3. Add the same name and value to your host, then redeploy, because the value
   is read when the site is built.
   - **Vercel**: Settings, then Environment Variables
   - **Netlify**: Site configuration, then Environment variables
4. Send yourself a test message from the live website.

That is the whole setup. There is no confirmation step and no monthly limit.

### What arrives in your inbox

| Field on the page | Name in the message |
| --- | --- |
| Full Name | name |
| Email Address | email |
| Business or Brand Name | business |
| Project Type | projectType |
| Estimated Budget | budget |
| Project Details | message |

The subject reads "New website enquiry from" and then the sender name, and
replying to the notification replies straight to the person who wrote in.

### Notes

- The access key appears in the built JavaScript. That is normal and expected
  for Web3Forms, which is why it is a submission key rather than a password.
  Never put a private key or an account password in a `VITE_` variable,
  because every one of them reaches the browser.
- The form has a hidden field that real people never fill in. Anything that
  fills it is discarded silently, which stops most automated spam.
- If Web3Forms refuses a submission it explains why in its reply, and the form
  shows that explanation rather than a status code.

### Moving to another service later

The sending lives in `src/lib/enquiry.ts` and two alternatives are already
built in. Set a different variable and the form follows, with no code change:

| Service | Variable |
| --- | --- |
| Formspree | `VITE_FORMSPREE_ID` |
| Your own server | `VITE_FORM_ENDPOINT` |

Set more than one and `VITE_FORM_PROVIDER` decides the winner. Its value is
one of `web3forms`, `formspree`, or `custom`.

Formspree has one extra step worth knowing about: the first submission
triggers a confirmation email, and the link in it has to be clicked once
before anything is delivered.

## 7. Deployment

Both platforms are already configured in this repository.

### Vercel

1. Push the project to GitHub.
2. Open vercel.com, choose New Project, and import the repository.
3. Vercel reads `vercel.json`, so the framework, build command, and output
   folder are already correct.
4. Add your environment variables under Settings, then Environment Variables.
   Add `VITE_FORM_ENDPOINT` and, if you use Web3Forms, `VITE_WEB3FORMS_KEY`.
5. Deploy. Add your domain under Settings, then Domains.

Or from your terminal:

```bash
npm install -g vercel
vercel
vercel --prod
```

### Netlify

1. Push the project to GitHub.
2. Open netlify.com, choose Add new site, then Import an existing project.
3. Netlify reads `netlify.toml`, so the build command (`npm run build`) and the
   publish folder (`dist`) are already correct.
4. Add your environment variables under Site configuration, then Environment
   variables.
5. Deploy. Add your domain under Domain management.

Or from your terminal:

```bash
npm install -g netlify-cli
netlify deploy
netlify deploy --prod
```

### If the deployment fails

**"Command npm exited with 1", or the build fails immediately.**

Work through these in order.

1. **Check which branch is being built.** This is the most common cause.
   Vercel and Netlify build your production branch, which is usually `main`.
   If the website lives on a feature branch, the platform is building
   different code. Either merge the branch into `main`, or change the branch
   the platform builds: on Vercel under Settings, then Git, then Production
   Branch. On Netlify under Site configuration, then Build and deploy, then
   Branches.

2. **Check the Node version.** This project needs Node 20.19 or newer, or
   Node 22 or newer. Older versions fail with an error mentioning
   `crypto.hash is not a function`. The version is pinned in `.nvmrc`, in
   `netlify.toml`, and in the `engines` field of `package.json`. On Vercel you
   can also set it under Settings, then Build and Deployment, then Node.js
   Version.

3. **Read the first error, not the last line.** `Command npm exited with 1`
   is only the summary. Scroll up in the deploy log to the first red line,
   which names the real problem.

Everything the build itself needs sits in `dependencies` rather than
`devDependencies`, so the build still works on hosts that install with
`NODE_ENV` set to `production`. Nothing extra reaches the browser, because
those packages only run at build time.

### Before you go live

- Replace `https://techgrandhub.com/` in `index.html` and `public/robots.txt`
  with your real address.
- Add `public/images/og-cover.jpg` at 1200 by 630 pixels for social sharing.
- Add `public/images/apple-touch-icon.png` at 180 by 180 pixels.
- Replace `public/favicon.svg` with your own mark.

---

## 8. Testing checklist

### Content

- [ ] Every contact detail in `src/data/site.ts` is yours
- [ ] WhatsApp number is digits only, in full international format
- [ ] GitHub and LinkedIn addresses open your real profiles
- [ ] Every project has a working live address
- [ ] Project screenshots have been captured with `npm run capture`
- [ ] Project descriptions read the way you would describe the work
- [ ] Testimonials are real, with permission from the client
- [ ] Statistics reflect real numbers
- [ ] No placeholder text remains anywhere

### Layout

- [ ] Small phone, 320 to 375 pixels wide
- [ ] Large phone, 390 to 430 pixels wide
- [ ] Tablet, 768 to 1024 pixels wide
- [ ] Small laptop, 1280 pixels wide
- [ ] Desktop, 1440 to 1920 pixels wide
- [ ] Large monitor, 2560 pixels wide
- [ ] The page never scrolls sideways at any width

### Behaviour

- [ ] The opening sequence plays once and clears the way to the content
- [ ] The thread draws smoothly the whole way down the page
- [ ] The hero lens follows the pointer and reveals the second layer
- [ ] Service rows open and close
- [ ] Hovering a project title shows its preview
- [ ] Opening a project expands the preview into the detailed view
- [ ] Project filters rearrange the list smoothly
- [ ] Process stages activate as they are reached
- [ ] Technology chips regroup and the connection is drawn
- [ ] Testimonials advance in both directions and the counter is correct
- [ ] The mobile menu assembles, closes, and locks background scrolling
- [ ] Every project opens its live website in a new tab
- [ ] The playground editor updates its preview as you type
- [ ] Snake responds to the arrow keys, and to swipes on a phone
- [ ] The memory game matches pairs and counts moves
- [ ] The reaction timer records a time and keeps the best one

### Form

- [ ] Submitting an empty form shows errors and moves focus to the first one
- [ ] An invalid email address is rejected
- [ ] A short project description is rejected
- [ ] A valid submission shows the loading state, then the success state
- [ ] The Web3Forms access key is set on the host, and the site redeployed
- [ ] The thread completes its circle around the confirmation
- [ ] A failed request shows the error state with a way to email you instead
- [ ] The enquiry actually arrives in your inbox

### Accessibility

- [ ] Every interactive element is reachable with the Tab key
- [ ] Focus outlines are visible everywhere
- [ ] Escape closes the mobile menu and the project detail view
- [ ] Focus returns to the button that opened each of them
- [ ] Every photograph has descriptive alternative text
- [ ] The About portrait is a picture of you, and its alt text matches it
- [ ] Headings run in order, one `h1` on the page
- [ ] With reduced motion turned on, all content is visible and still
- [ ] The custom cursor is absent on touch devices
- [ ] Colour contrast passes on body text, labels, and buttons

### Performance and search

- [ ] Lighthouse performance above 90 on desktop
- [ ] Lighthouse accessibility above 95
- [ ] No layout shift while photographs load
- [ ] Page title and description are correct
- [ ] The sharing preview shows the right image
- [ ] The favicon appears in the browser tab
- [ ] `robots.txt` points at your real address

---

## 9. Notes on the animation code

- Plugins are registered once, in `src/lib/gsap.ts`. Import GSAP from that file
  everywhere else.
- Section animations run inside `useGsapEffect`, which wraps them in a scoped
  `gsap.context` and reverts every tween and ScrollTrigger on unmount. There
  are no stray scroll instances.
- `ScrollTrigger.refresh()` is called after fonts load, after images load, and
  after any layout that opens or closes, so measurements stay correct.
- Animation is limited to `transform`, `opacity`, `clip-path`, and
  `stroke-dashoffset`, which the browser can composite cheaply.
- Every animated component checks the reduced motion preference first and
  renders its finished state when it is set.
