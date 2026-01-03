// src/constants/index.js

export const projects = [
  {
    name: "Staywise.lk",
    description: "Full-stack property booking platform with real-time availability, secure payment processing, and admin dashboard. Features JWT authentication and responsive design.",
    tags: [
      { name: "react" },
      { name: "node" },
      { name: "express" },
      { name: "tailwind" },
    ],
    source_code_link: "https://github.com/LoneWolf092701",
    live_link: null
  },
  {
    name: "VRoxel",
    description: "Advanced procedural generation algorithm for Unity using Wave Function Collapse. Optimized with Burst Compiler for real-time 3D environment generation with context-aware patterns.",
    tags: [
      { name: "unity" },
      { name: "csharp" },
      { name: "procedural" },
      { name: "burst" },
    ],
    source_code_link: "https://github.com/LoneWolf092701",
    live_link: null
  },
  {
    name: "JobArmer CRM",
    description: "Enterprise CRM platform for service management with client tracking, job scheduling, financial reporting, and team collaboration features. Built for scalability and performance.",
    tags: [
      { name: "react" },
      { name: "dotnet" },
      { name: "mssql" },
      { name: "azure" },
    ],
    source_code_link: "https://github.com/LoneWolf092701",
    live_link: null
  },
  {
    name: "AIRentoSoft",
    description: "Vehicle rental management system with complex tax calculations, booking engine, fleet management, and automated invoicing for international markets.",
    tags: [
      { name: "typescript" },
      { name: "react" },
      { name: "dotnet" },
      { name: "api" },
    ],
    source_code_link: "https://github.com/LoneWolf092701",
    live_link: null
  },
];

export const navLinks = [
  { id: "about", title: "About" },
  { id: "work", title: "Work" },
  { id: "skills", title: "Skills" },
  { id: "contact", title: "Contact" },
];

export const experiences = [
  {
    title: "Full Stack Developer (Freelance)",
    company_name: "Staywise.lk",
    date: "Mar 2025 - Sep 2025",
    points: [
      "Architected and deployed 'Staywise.lk', a property booking platform using React JS and Node.js/Express.",
      "Designed the complete system lifecycle from requirement gathering to deployment, achieving 100% adherence to client specifications.",
      "Implemented secure JWT authentication and RESTful APIs to handle real-time booking data.",
      "Integrated payment processing and developed responsive UI with Tailwind CSS."
    ],
  },
  {
    title: "Researcher (Game Development)",
    company_name: "Informatics Institute of Technology (IIT)",
    date: "Sep 2024 - Apr 2025",
    points: [
      "Developed 'VRoxel', an adaptive context-aware WFC algorithm framework for procedural game environment generation.",
      "Built high-performance systems using Unity Engine and C#, utilizing the Burst Compiler to optimize real-time rendering.",
      "Conducted extensive testing and technical documentation to validate algorithmic accuracy.",
      "Achieved 40% improvement in generation speed compared to traditional WFC implementations."
    ],
  },
  {
    title: "Software Engineer Intern",
    company_name: "Creo 360",
    date: "Jul 2023 - Jul 2024",
    points: [
      "Engineered 'JobArmer' CRM service platform using React JS and .NET, streamlining operations for enterprise clients.",
      "Developed 'AIRentoSoft' vehicle rental system for Western markets, architecting complex tax and booking logic using React TypeScript.",
      "Optimized MSSQL database queries, improving data retrieval speeds for financial records by 35%.",
      "Collaborated with cross-functional teams using Agile methodology and Azure DevOps."
    ],
  },
];