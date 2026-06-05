# KLICKWIZE Website 0.2

This version is a scalable static website built with plain HTML, CSS, and JavaScript.
It uses component-style sections without requiring a React build step, so it stays easy to host and maintain.

## Main Features

- Pill navigation with active section tracking
- Staggered mobile menu
- Split text hero animation
- Decrypted text labels
- Rotating hero text
- Circular text around the logo
- Shuffle number animation
- Metallic paint text and card styling
- Interactive process stepper
- Spark/network canvas background
- Responsive layouts for desktop, tablet, and phone
- WhatsApp contact link: `+91 70257 03968`
- Instagram link left commented in `index.html`
- Backend-ready contact form in `js/app.js`

## File Guide

- `index.html`: Page sections and readable content.
- `css/variables.css`: Main colors, fonts, spacing, shadows, and timing.
- `css/layout.css`: Page structure, containers, hero layout, and footer.
- `css/components.css`: Buttons, cards, nav, form, stepper, logo, and special components.
- `css/animations.css`: Motion effects and reduced-motion support.
- `css/responsive.css`: Mobile and tablet layout fixes.
- `js/navigation.js`: Pill nav, smooth scroll, fixed header, and mobile menu.
- `js/splitText.js`: Breaks hero words into animated letters.
- `js/decryptText.js`: Scrambles labels before revealing the real text.
- `js/spark.js`: Background canvas network animation.
- `js/stepper.js`: Interactive process stepper.
- `js/app.js`: Reveal animations, rotating text, shuffle numbers, card glow, and contact form payload.

## Backend Connection

The contact form currently prepares a clean payload and logs it in the browser console.
When the backend is ready, open `js/app.js` and connect the commented `fetch('/api/contact', ...)` block to your API endpoint.
