---
id: instructor-create-course
title: Create Your First Course
roles: [instructor]
# TODO: confirm the instructor course-creation route in eduwe-app. Placeholder until then.
route: /instructor/courses/new
trigger: manual
version: 1
steps:
  # TODO: section 5 of the spec defines no instructor targets. Add them to the contract (form fields, module list,
  # publish button) and to the app before writing the real steps. Until then this tour only orients the instructor.
  - target: '[data-tour="nav-home"]'
    title: Back To The Catalog
    body: "Select the EduWe logo to return to the catalog and see how learners will find your course."
  - target: '[data-tour="help-btn"]'
    title: Step-By-Step Help
    # TODO: link to the instructor course-creation guide once it is written and published (see drafts/instructor).
    body: "Select **?** for help on this screen."
---

Writer notes (not shipped to the app): placeholder tour, manual trigger, until instructor targets exist. The
instructor help pages are drafted but not yet published (see drafts/instructor), so this tour does not link to one.
