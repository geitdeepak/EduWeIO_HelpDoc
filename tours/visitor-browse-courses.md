---
id: visitor-browse-courses
title: Find The Right Course
roles: [anonymous, learner]
route: /
trigger: first-visit # first-visit | manual | release
version: 1
steps:
  - target: '[data-tour="category-bar"]'
    title: Start With A Subject
    body: "Scroll the category strip to narrow the catalog to a subject such as CSE, Data Science or Python."
  - target: '[data-tour="catalog-tabs"]'
    title: Academic Or Applied
    body: "Switch between **Popular**, **Academic** and **Applied** courses. **Academic** courses are mapped to university curricula. **Applied** courses are industry-oriented and built around real projects."
    # TODO: describe what Popular shows once it is confirmed how it is chosen (enrolments or admin-curated).
  - target: '[data-tour="course-card"]'
    title: Read A Course Card
    body: "Each card shows what the course covers, its instructor and its price. Every card works the same way as this one."
  - target: '[data-tour="pricing-mode"]'
    title: Choose How You Get Access
    # TODO: the "Fully Paid unlocks the whole course at once" wording comes from the spec draft; confirm it. Once the recharge
    # system rules are documented (learner/pricing-models.md), add one line on what a recharge is.
    body: "**Fully Paid** and **On Demand** have their own prices. **Fully Paid** unlocks the whole course at once. With **On Demand** the recharge system applies when you buy, so you access the course as you need it. You cannot switch after you buy, so choose before you check out. [How they differ](help:learner/pricing-models)"
  - target: '[data-tour="course-price"]'
    title: Check The Price
    body: "The price and discount shown here are for the option you selected. Switch options to compare."
    # TODO: confirm whether the price includes GST.
  - target: '[data-tour="demo-btn"]'
    title: Try Before You Buy
    body: "Open **Demo** to watch a sample lesson and see the chapter list before you buy."
    # TODO: confirm whether the demo page needs an account.
  - target: '[data-tour="cart-btn"]'
    title: Add It To Your Cart
    body: "Choose **+Cart** to add the course. You can check out from the cart icon in the header."
  - target: '[data-tour="help-btn"]'
    title: Need Help Later?
    body: "Select **?** at any time for help on the screen you are on."
---

Writer notes (not shipped to the app): this is the first-visit tour on the public catalog, so it must work for
logged-out visitors. Steps whose element is missing on screen are skipped at runtime.
