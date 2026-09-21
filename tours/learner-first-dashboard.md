---
id: learner-first-dashboard
title: Your First Visit
roles: [learner]
route: /auth/dashboard
trigger: first-visit
version: 1
steps:
  # TODO: section 5 of the spec defines data-tour targets only for the header and the catalog, and the dashboard header does
  # not have the Courses link, so the old nav-courses step was removed. Proposed new targets for the app developers to add
  # (literal values, first course row only): nav-recharge (Recharge link), dash-summary (the date and counters strip),
  # dash-course-row (the first course row). Then add steps for them.
  - target: '[data-tour="cart-icon"]'
    title: Your Cart
    body: "Courses you add appear in your cart. The badge shows how many are in it."
  - target: '[data-tour="theme-toggle"]'
    title: Light Or Dark
    body: "Switch between the light and dark themes here."
  - target: '[data-tour="help-btn"]'
    title: Help Is One Click Away
    body: "Select **?** for help on the screen you are on."
---

Writer notes (not shipped to the app): a short orientation for learners on their first login, built only from the
global header targets until dashboard targets exist. The route is confirmed from the address bar (eduwe.io/auth/dashboard).
