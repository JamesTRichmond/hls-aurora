/** Educational artifacts. Not issued by any university. */

export type CourseRow = {
  code: string;
  title: string;
  term: string;
  credits: number;
  grade: string;
};

export const UTAH_TRANSCRIPT = {
  school: "University of Utah · Division of Games",
  degree: "Bachelor of Science in Games",
  conferred: "May 2024",
  gpa: "3.86",
  honors: "Magna cum laude · Capstone: HLS Aurora, first playable",
  disclaimer:
    "Unofficial transcript. Educational artifact recording a curriculum applied to HLS Aurora. Not issued by the University of Utah.",
  courses: [
    { code: "GAMES 1010", title: "Survey of Games", term: "F 2020", credits: 3, grade: "A" },
    { code: "GAMES 1050", title: "Digital Content Creation", term: "F 2020", credits: 3, grade: "A-" },
    { code: "COMP 1010", title: "Programming for All I", term: "F 2020", credits: 3, grade: "A" },
    { code: "COMP 1020", title: "Programming for All II", term: "S 2021", credits: 3, grade: "A" },
    { code: "GAMES 2100", title: "Intro to Game Design", term: "S 2021", credits: 3, grade: "A" },
    { code: "GAMES 2400", title: "Intro Game Scripting", term: "S 2021", credits: 3, grade: "A" },
    { code: "GAMES 3010", title: "Asset Pipeline", term: "F 2021", credits: 3, grade: "A-" },
    { code: "GAMES 3020", title: "Ethics in Videogames", term: "F 2021", credits: 3, grade: "A" },
    { code: "GAMES 3025", title: "Aesthetics & Philosophy of Play", term: "S 2022", credits: 3, grade: "A" },
    { code: "GAMES 3035", title: "Storycrafting for Games", term: "S 2022", credits: 3, grade: "A" },
    { code: "GAMES 3045", title: "Intro Game UI Design", term: "F 2022", credits: 3, grade: "A-" },
    { code: "GAMES 3050", title: "Psychology of Games", term: "F 2022", credits: 3, grade: "A" },
    { code: "GAMES 3100", title: "Level Design", term: "S 2023", credits: 3, grade: "A" },
    { code: "GAMES 3710", title: "Traditional Game Development", term: "S 2023", credits: 4, grade: "A" },
    { code: "GAMES 3720", title: "Alternative Game Development", term: "F 2023", credits: 4, grade: "A" },
    { code: "GAMES 4500", title: "Capstone I · HLS Aurora", term: "F 2023", credits: 3, grade: "A" },
    { code: "GAMES 4510", title: "Capstone II · HLS Aurora", term: "S 2024", credits: 3, grade: "A" },
  ] as CourseRow[],
  applied: [
    "Rooms are volumes: light, floor, and air change together.",
    "Unique silhouettes for every interactable. Never reuse a radio for a thermal bus.",
    "NPCs face you inside a tile and a half. Presence is cheaper than a new map.",
    "Footsteps and a curtain scrape are the juice the watch was missing.",
    "Camera looks a little where you are going. Game feel is a kindness.",
  ],
};

export const USC_TRANSCRIPT = {
  school: "University of Southern California · School of Cinematic Arts",
  program: "Interactive Media & Games Division",
  degree: "Master of Science in Game Design and Development",
  conferred: "May 2026",
  gpa: "3.91",
  honors: "Playcentric thesis studio · HLS Aurora, first hour",
  disclaimer:
    "Unofficial transcript. Educational artifact recording a curriculum applied to HLS Aurora. Not issued by the University of Southern California.",
  courses: [
    { code: "CTIN 488", title: "Game Design Workshop", term: "F 2024", credits: 4, grade: "A" },
    { code: "CTIN 541", title: "Design for Interactive Media", term: "F 2024", credits: 2, grade: "A" },
    { code: "CTCS 505", title: "Survey of Interactive Media", term: "F 2024", credits: 2, grade: "A-" },
    { code: "CTIN 534", title: "Experiments in Interactivity I", term: "F 2024", credits: 4, grade: "A" },
    { code: "CTWR 518", title: "Introduction to Interactive Writing", term: "S 2025", credits: 2, grade: "A" },
    { code: "CTIN 544", title: "Experiments in Interactivity II", term: "S 2025", credits: 2, grade: "A" },
    { code: "CTIN 532", title: "Interactive Design and Production", term: "F 2025", credits: 4, grade: "A" },
    { code: "CTIN 462", title: "Critical Theory and Analysis of Games", term: "F 2025", credits: 4, grade: "A" },
    { code: "CTPR 506", title: "Visual Expression", term: "S 2026", credits: 2, grade: "A-" },
    { code: "CTIN 594", title: "Thesis · The Watch as Dramatic Unit", term: "S 2026", credits: 4, grade: "A" },
  ] as CourseRow[],
  applied: [
    "Playcentric: design from the feeling backward. Kindness and unease, held together.",
    "First contact with a person is speech, not a biography dump on the floor.",
    "The radio logs what was said, not 'examine: Gallery window'.",
    "A watch is a short story with five kindnesses, a midpoint, and an ending you earn.",
    "The PDA remembers this watch — who you asked, what you closed — not a brochure.",
  ],
};

export const NYU_RECORD = {
  school: "New York University · Tisch Game Center / practice-based dissertation",
  degree: "Doctor of Philosophy (practice)",
  conferred: "In progress · defense copy, Cycle 12",
  disclaimer:
    "Practice-based dissertation record. Educational artifact. Not conferred by New York University.",
  committee: [
    "Frank Lantz — games as aesthetic form (Chair Emeritus, cited)",
    "Eric Zimmerman — meaningful play, magic circle, iterative research-through-design",
    "Clara Fernández-Vara — indexical storytelling, adventure as reading",
    "Naomi Clark — chair, culture of practice",
    "Jesper Juul — half-real; fiction that the rules do not settle",
  ],
  title: "Two Worlds, One Body: Dual Ontology as Play in HLS Aurora",
};
