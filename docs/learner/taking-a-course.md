---
title: Taking A Course
role: learner
app_route: null # TODO: confirm the course home / course player routes in eduwe-app
summary: What you get inside a course, including notes, videos, online compilers and AI help.
---

# Taking A Course

Courses run in your browser, so you do not need to install anything. A modern browser and a stable internet connection are recommended.

## Opening A Course

On your [dashboard](../getting-started/dashboard.md), click any course row (or its picture) to open that course's home page.

<figure markdown>
  ![The learner dashboard with the Cloud Computing course row highlighted and an arrow pointing at its course picture](../assets/images/course-home/course-home-01-open-from-dashboard.png){ loading=lazy }
  <figcaption>Click a course row on your dashboard to open it.</figcaption>
</figure>

## The Course Home Page

The course home page is what opens. It has two fixed parts and a main area that changes with the tab you pick:

- A **sidebar** on the left showing the course code (for example `CLT 1115`) and its chapter list. Each chapter expands to show its topics.
- A **tab bar** across the top: **Videos**, **Notes**, **Tutorials**, **MCQs**, **CBSQs**, **SEQs**, **Labs**, **Projects** and **My Notes**. Videos is selected by default.

<figure markdown>
  ![The Cloud Computing course home page, with the top tab bar and the chapter sidebar highlighted](../assets/images/course-home/course-home-02-overview.png){ loading=lazy }
  <figcaption>The course home page for Cloud Computing (course code CLT 1115).</figcaption>
</figure>

<!-- Source: eduwe-app screenshots of the Cloud Computing course home page and dashboard. -->

## Course Tabs

Each tab shows a different kind of content for the chapter, topic and subtopic you pick in the sidebar.

### Videos

All of a course's videos are here. Select the **Videos** tab (1), then pick a **Chapter** (2) and its **Topic** (3) in the sidebar to open the video player and press play (4).

<figure markdown>
  ![The Videos tab playing a Cloud Computing lecture, with the Videos tab, the Introduction to Cloud Computing chapter, its Overview of Cloud Computing topic, and the player's play button numbered 1 to 4. Below the player, the text "Click below to switch to Topic Notes" sits above three buttons: a blue book icon, a yellow robot icon and a red list icon](../assets/images/course-home/course-home-03-video-player.png){ loading=lazy }
  <figcaption>Playing a topic's video. Below the player, three buttons switch to other views for the same topic.</figcaption>
</figure>

Below the player, three buttons let you switch views without leaving the topic:

- The **blue book icon** opens that topic's notes right there, so you do not need to switch to the separate **Notes** tab to read them.
- The **yellow robot icon** opens EduWeAi in a panel beside the video, scoped to whatever topic is currently open:
    - **Tutor** explains the topic out loud. Pick the language (Hindi or English) and a voice.
    - **Chat** lets you chat with EduWeAi about the current topic.
    - **Notes** lets you ask EduWeAi about the notes, and view a summary of the paused video frame.

  Everything in this panel stays restricted to the video you have open; it does not answer outside that topic.
- The **red script icon** opens the topic's full lecture script as text, so you can read along with (or instead of) watching the video.

<figure markdown>
  ![The Videos tab with the EduWeAi panel open beside the player. The panel has a language dropdown set to Hindi, a Voice dropdown set to Adi, and the Tutor, Chat and Notes buttons, above a note reading "Use Tutor for quick interaction (speech and text), Use Chat for detailed conversation (speech or text input), Use Note to view a summary of the paused image"](../assets/images/course-home/course-home-04-video-eduweai-panel.png){ loading=lazy }
  <figcaption>EduWeAi opened from the Videos tab, scoped to the topic currently playing.</figcaption>
</figure>

<figure markdown>
  ![The topic script view, opened with the red script icon. It shows the "Introduction to Cloud Computing" heading, the lecture's opening lines, and a chapter roadmap listing what the chapter will cover](../assets/images/course-home/course-home-05-topic-script.png){ loading=lazy }
  <figcaption>The full lecture script for a topic, opened with the red script icon.</figcaption>
</figure>

Videos is also the tab selected by default when you open a course, so its main area additionally shows:

- **The course header.** Title, a short description, and badges for the course type (Fully Paid or On Demand), its total duration in hours, and its access period (for example 365 Days Access).
- **Instructor.** Name and a short line of qualification and experience.
- **Continue Learning.** Where you left off, as Chapter → Topic → Subtopic, with the time watched out of the video's total length, a progress bar, and the time remaining. A reminder banner also appears here.
- **Certification Path.** A summary of how you earn a certificate for this course: the gate opens once you reach a qualifying performance in TYS and the course MCQs, and the weighting between that and the certification test. See [Certificates](certificates.md) for the full breakdown.

<!-- TODO: confirm the exact wording and behaviour of the "Reminder: Resume this video..." banner (cut off in the source screenshot). -->
<!-- TODO: confirm whether the course header's badges (course type, hours, access period) match the pricing model exactly for On Demand courses too. -->
<!-- TODO: confirm whether the course header/instructor/Continue Learning/Certification Path block stays visible once you switch away from Videos to another tab. -->

### Notes

Select the **Notes** tab, then pick a **Chapter**, **Topic** and **Subtopic** in the sidebar to read its notes. Notes include diagrams wherever the topic needs one.

<figure markdown>
  ![The Notes tab, showing section 1.1 Overview of Cloud Computing under chapter 1 Introduction to Cloud Computing, with the sidebar's matching chapter and topic highlighted](../assets/images/course-home/course-home-06-notes-tab.png){ loading=lazy }
  <figcaption>The Notes tab, open on the Overview of Cloud Computing topic.</figcaption>
</figure>

<!-- TODO: confirm whether these are written course notes, distinct from the AI-generated notes under EduWeAi's Notes tool. -->

#### TYS

Some chapters end with a **TYS** button in their notes, below the chapter summary. Instructors add TYS to a chapter as needed, so not every chapter has one.

<figure markdown>
  ![The end of a chapter's notes, with a chapter summary and a highlighted TYS 1 button below it](../assets/images/course-home/course-home-07-notes-chapter-summary-tys.png){ loading=lazy }
  <figcaption>A TYS button at the end of a chapter's notes.</figcaption>
</figure>

TYS opens a set of MCQ-style questions for that chapter. Submit your answers, and your result feeds the **TYS** progress circle for the course on your [dashboard](../getting-started/dashboard.md#tys-and-mcq-what-you-have-attempted).

<figure markdown>
  ![A course row on the dashboard with the TYS circle highlighted](../assets/images/course-home/course-home-08-dashboard-tys-circle.png){ loading=lazy }
  <figcaption>TYS results show up as this progress circle on your dashboard.</figcaption>
</figure>

Your TYS performance also counts toward earning the course's certificate. See [Certificates](certificates.md).

<!-- TODO: confirm TYS attempt rules: one attempt or retakes, time limit, and whether the dashboard circle shows percentage attempted or percentage correct. -->
<!-- TODO: confirm whether TYS also appears under other tabs (for example Tutorials) or only at the end of chapter notes. -->

### Tutorials

Select the **Tutorials** tab, then pick a **Chapter**, **Topic** and **Subtopic** in the sidebar. Tutorials mix a few formats: tutorial notes, tutorial videos, and questions and answers.

<!-- TODO: confirm how the tutorial notes/videos/Q&A formats are presented together or switched between on this tab. -->
<!-- TODO: screenshot pending. -->

### MCQs

<!-- TODO: walkthrough pending. -->

### CBSQs

<!-- TODO: walkthrough pending. Confirm what CBSQ stands for. -->

### SEQs

<!-- TODO: walkthrough pending. Confirm what SEQ stands for. -->

### Labs

<!-- TODO: walkthrough pending. -->

### Projects

<!-- TODO: walkthrough pending. Likely where the capstone project (below) appears. -->

### My Notes

<!-- TODO: walkthrough pending. Confirm how this relates to the My Notes tool under EduWeAi on the dashboard. -->

## Capstone Project

Courses are mapped to a guided, portfolio-ready capstone project.

<!-- Source: eduwe.io FAQ "What is the capstone project?" -->
<!-- TODO: confirm where the capstone appears in a course (likely the Projects tab) and whether it is graded. -->

## AI Assistance

Inside a course you also have access to AI assistance to generate notes and MCQs and to get help on a topic. See [EduWeAi](../getting-started/dashboard.md#eduweai).

Related: [Quizzes and assignments](quizzes-and-assignments.md), [Certificates](certificates.md).
