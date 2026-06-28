export const TRACKS = [
  {
    id: "frontend",
    title: "Frontend Web Development",
    duration: "6 Weeks",
    type: "Remote",
    icon: "fa-solid fa-code",
    tech: [
      "devicon-html5-plain",
      "devicon-css3-plain",
      "devicon-javascript-plain",
    ],
    description:
      "Learn to build beautiful, responsive websites from scratch. Start with HTML/CSS fundamentals and move to interactive JavaScript.",
    responsibilities: [
      "Build static websites with HTML5 and CSS3",
      "Add interactivity using vanilla JavaScript",
      "Create responsive layouts that work on all devices",
      "Understand DOM manipulation and event handling",
    ],
  },
  // {
  //   id: 'react',
  //   title: 'React Developer',
  //   duration: '6 Weeks',
  //   type: 'Remote',
  //   icon: 'fa-brands fa-react',
  //   tech: ['devicon-react-original', 'devicon-javascript-plain', 'devicon-tailwindcss-original'],
  //   description:
  //     'Build modern web applications using React. Learn components, state management, and how to create dynamic user interfaces.',
  //   responsibilities: [
  //     'Build reusable React components',
  //     'Manage state using useState and useContext hooks',
  //     'Style applications with Tailwind CSS',
  //     'Fetch data from APIs and display it dynamically',
  //   ],
  // },
  {
    id: "backend",
    title: "Backend Development (Node.js)",
    duration: "6 Weeks",
    type: "Remote",
    icon: "fa-solid fa-server",
    tech: [
      "devicon-nodejs-plain",
      "devicon-express-original",
      "devicon-mongodb-plain",
    ],
    description:
      "Learn how the web works behind the scenes. Build REST APIs, handle databases, and create server-side applications.",
    responsibilities: [
      "Create RESTful APIs using Node.js and Express",
      "Perform CRUD operations with MongoDB",
      "Implement user authentication and password hashing",
      "Handle file uploads and environment variables",
    ],
  },
  {
    id: "fullstack",
    title: "Full Stack Web Development",
    duration: "6 Weeks",
    type: "Remote",
    icon: "fa-solid fa-layer-group",
    tech: [
      "devicon-react-original",
      "devicon-nodejs-plain",
      "devicon-mongodb-plain",
    ],
    description:
      "Combine frontend and backend skills to build complete web applications from start to finish.",
    responsibilities: [
      "Build full-stack MERN applications",
      "Connect React frontend with Node.js backend",
      "Implement authentication and user sessions",
      "Deploy complete applications to the web",
    ],
  },
  {
    id: "gen-ai",
    title: "Generative AI & Prompt Engineering",
    duration: "6 Weeks",
    type: "Remote",
    icon: "fa-solid fa-brain",
    tech: ["devicon-python-plain", "devicon-javascript-plain"],
    description:
      "Explore the world of AI tools like ChatGPT, Claude, and Gemini. Learn to write effective prompts and build simple AI-powered apps.",
    responsibilities: [
      "Master prompt engineering techniques",
      "Build chatbots using OpenAI/Claude APIs",
      "Create simple RAG applications",
      "Integrate AI features into web apps",
    ],
  },
  {
    id: "graphic-design",
    title: "Graphic Design & Visual Content",
    duration: "6 Weeks",
    type: "Remote",
    icon: "fa-solid fa-palette",
    tech: [
      "devicon-figma-plain",
      "devicon-photoshop-plain",
      "devicon-illustrator-plain",
    ],
    description:
      "Learn the fundamentals of visual design. Create logos, social media graphics, and marketing materials that stand out.",
    responsibilities: [
      "Design logos and brand identity elements",
      "Create social media posts and banner designs",
      "Edit photos and create basic illustrations",
      "Learn color theory, typography, and composition",
    ],
  },
  {
    id: "ui-ux",
    title: "UI/UX Design Basics",
    duration: "6 Weeks",
    type: "Remote",
    icon: "fa-solid fa-pen-ruler",
    tech: ["devicon-figma-plain", "devicon-css3-plain"],
    description:
      "Understand user-centered design principles. Learn to create wireframes, prototypes, and user-friendly interfaces.",
    responsibilities: [
      "Create wireframes and user flow diagrams",
      "Design high-fidelity prototypes in Figma",
      "Learn basic design principles and usability",
      "Understand user research and testing basics",
    ],
  },

  {
    id: "ml",
    title: "Machine Learning Fundamentals",
    duration: "6 Weeks",
    type: "Remote",
    icon: "fa-solid fa-robot",
    tech: ["devicon-python-plain", "devicon-jupyter-original"],
    description:
      "Get started with data science and machine learning. Learn data analysis, visualization, and build simple prediction models.",
    responsibilities: [
      "Work with datasets using Python and Pandas",
      "Create visualizations with Matplotlib",
      "Build basic ML models (Linear Regression, Classification)",
      "Understand train-test split and model evaluation",
    ],
  },
  // {
  //   id: 'devops',
  //   title: 'DevOps & Cloud Basics',
  //   duration: '6 Weeks',
  //   type: 'Remote',
  //   icon: 'fa-solid fa-cloud',
  //   tech: ['devicon-docker-plain', 'devicon-github-original', 'devicon-amazonwebservices-plain-wordmark'],
  //   description:
  //     'Learn how to deploy applications, manage servers, and automate workflows using modern DevOps tools.',
  //   responsibilities: [
  //     'Deploy applications on Vercel, Netlify, or Render',
  //     'Work with GitHub for version control',
  //     'Learn Docker basics and containerization',
  //     'Understand CI/CD and automated deployments',
  //   ],
  // },
  // {
  //   id: 'data-analytics',
  //   title: 'Data Analytics with Python',
  //   duration: '6 Weeks',
  //   type: 'Remote',
  //   icon: 'fa-solid fa-chart-line',
  //   tech: ['devicon-python-plain', 'devicon-postgresql-plain'],
  //   description:
  //     'Learn to analyze data, create visualizations, and generate insights using Python and SQL.',
  //   responsibilities: [
  //     'Write basic SQL queries for data extraction',
  //     'Analyze data using Python and Pandas',
  //     'Create charts and dashboards with Plotly/Matplotlib',
  //     'Generate reports and business insights',
  //   ],
  // },
  // {
  //   id: 'cybersecurity',
  //   title: 'Cybersecurity Essentials',
  //   duration: '6 Weeks',
  //   type: 'Remote',
  //   icon: 'fa-solid fa-shield-halved',
  //   tech: ['devicon-linux-plain', 'devicon-python-plain'],
  //   description:
  //     'Understand the basics of cybersecurity. Learn about common threats, security best practices, and how to protect applications.',
  //   responsibilities: [
  //     'Understand OWASP Top 10 security risks',
  //     'Implement basic authentication and authorization',
  //     'Learn about encryption and secure passwords',
  //     'Conduct basic security testing and vulnerability scanning',
  //   ],
  // },
  // {
  //   id: 'wordpress',
  //   title: 'WordPress Development',
  //   duration: '6 Weeks',
  //   type: 'Remote',
  //   icon: 'fa-brands fa-wordpress',
  //   tech: ['devicon-wordpress-plain', 'devicon-php-plain', 'devicon-mysql-plain'],
  //   description:
  //     'Build websites using WordPress. Learn to customize themes, add functionality with plugins, and manage content effectively.',
  //   responsibilities: [
  //     'Install and configure WordPress sites',
  //     'Customize themes using page builders',
  //     'Create custom post types and taxonomies',
  //     'Implement SEO and performance optimization',
  //   ],
  // },
  // {
  //   id: 'mobile',
  //   title: 'Mobile App Development',
  //   duration: '6 Weeks',
  //   type: 'Remote',
  //   icon: 'fa-solid fa-mobile-screen-button',
  //   tech: ['devicon-flutter-plain', 'devicon-dart-plain', 'devicon-firebase-plain'],
  //   description:
  //     'Build cross-platform mobile apps for iOS and Android using Flutter. Learn widgets, state management, and Firebase integration.',
  //   responsibilities: [
  //     'Build UI components using Flutter widgets',
  //     'Manage app state with Provider/GetX',
  //     'Integrate Firebase for authentication and database',
  //     'Deploy apps to Google Play and App Store',
  //   ],
  // },
];
