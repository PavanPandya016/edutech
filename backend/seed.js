const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User, Course, Event, BlogPost, Category, Tag } = require('./models');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({ email: { $ne: process.env.ADMIN_EMAIL } });
    await Course.deleteMany({});
    await Event.deleteMany({});
    await BlogPost.deleteMany({});
    await Category.deleteMany({});
    await Tag.deleteMany({});
    console.log('🗑️  Cleared existing sample data (except admin if exists)...');

    // 1. Create Admin User if not exists
    let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!admin) {
      admin = await User.create({
        username: 'admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin'
      });
      console.log('👤 Admin user created');
    }

    // 2. Create Categories & Tags
    const designCat    = await Category.create({ name: 'Design' });
    const devCat       = await Category.create({ name: 'Development' });
    const businessCat  = await Category.create({ name: 'Business' });
    const dataCat      = await Category.create({ name: 'Data Science' });
    const marketingCat = await Category.create({ name: 'Marketing' });

    const reactTag  = await Tag.create({ name: 'React' });
    const nodeTag   = await Tag.create({ name: 'Node.js' });
    const uiTag     = await Tag.create({ name: 'UI/UX' });
    const pythonTag = await Tag.create({ name: 'Python' });
    const aiTag     = await Tag.create({ name: 'AI' });
    const jsTag     = await Tag.create({ name: 'JavaScript' });
    const cssTag    = await Tag.create({ name: 'CSS' });
    const seoTag    = await Tag.create({ name: 'SEO' });

    console.log('📂 5 Categories and 8 Tags created');

    // ─────────────────────────────────────────────
    // 3. Create 15 Courses (each linked to a Category)
    // ─────────────────────────────────────────────
    const now = new Date();

    await Course.create([
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Master HTML, CSS, JavaScript, React, and Node.js from the ground up. Build real-world projects and land your first developer job.',
        excerpt: 'Become a full-stack developer in 12 weeks.',
        thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600',
        category: devCat._id,
        courseType: 'paid', price: 99.99, level: 'beginner', isFeatured: true, enrollmentCount: 1240
      },
      {
        title: 'Mastering UI/UX Design with Figma',
        description: 'Design beautiful, accessible interfaces using Figma. Learn user research, wireframing, prototyping, and handoff workflows.',
        excerpt: 'Learn the principles of modern design with Figma.',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
        category: designCat._id,
        courseType: 'paid', price: 49.99, level: 'intermediate', isFeatured: true, enrollmentCount: 876
      },
      {
        title: 'Introduction to JavaScript',
        description: 'Understand the fundamentals of JavaScript — variables, functions, loops, DOM manipulation, and modern ES6+ features.',
        excerpt: 'Start your coding journey with JavaScript.',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600',
        category: devCat._id,
        courseType: 'free', price: 0, level: 'beginner', isFeatured: true, enrollmentCount: 3200
      },
      {
        title: 'React.js — The Complete Guide',
        description: 'Build powerful, dynamic web apps with React. Covers hooks, context, Redux Toolkit, React Router, and performance optimization.',
        excerpt: 'Go from beginner to advanced React developer.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
        category: devCat._id,
        courseType: 'paid', price: 79.99, level: 'intermediate', isFeatured: true, enrollmentCount: 2100
      },
      {
        title: 'Python for Data Science & Machine Learning',
        description: 'Use pandas, NumPy, Matplotlib, and scikit-learn to analyze data and build ML models. Includes real datasets and Kaggle projects.',
        excerpt: 'Break into data science with Python.',
        thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600',
        category: dataCat._id,
        courseType: 'paid', price: 89.99, level: 'intermediate', isFeatured: true, enrollmentCount: 1580
      },
      {
        title: 'Node.js & Express — Backend Development',
        description: 'Build scalable REST APIs with Node.js and Express. Covers authentication, MongoDB integration, file uploads, and deployment.',
        excerpt: 'Master back-end development with Node.js.',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
        category: devCat._id,
        courseType: 'paid', price: 69.99, level: 'intermediate', enrollmentCount: 940
      },
      {
        title: 'Digital Marketing Masterclass',
        description: 'Learn SEO, Google Ads, social media marketing, email campaigns, and analytics to grow any business online.',
        excerpt: 'Drive traffic and conversions with digital marketing.',
        thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=600',
        category: marketingCat._id,
        courseType: 'paid', price: 59.99, level: 'beginner', enrollmentCount: 1100
      },
      {
        title: 'Advanced CSS & Animations',
        description: 'Take your CSS skills to the next level. Master Flexbox, Grid, custom properties, keyframes, and modern animation techniques.',
        excerpt: 'Build stunning UIs with advanced CSS.',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
        category: designCat._id,
        courseType: 'free', price: 0, level: 'intermediate', enrollmentCount: 720
      },
      {
        title: 'Business Analytics with Excel & Power BI',
        description: 'Turn raw data into actionable insights. Learn Excel formulas, pivot tables, Power Query, and Power BI dashboards.',
        excerpt: 'Make smarter decisions with data analytics.',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
        category: businessCat._id,
        courseType: 'paid', price: 44.99, level: 'beginner', enrollmentCount: 630
      },
      {
        title: 'TypeScript for React Developers',
        description: 'Add type safety to your React projects. Covers TypeScript fundamentals, generics, interfaces, and integration with React & Next.js.',
        excerpt: 'Write safer, more maintainable React code.',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600',
        category: devCat._id,
        courseType: 'paid', price: 54.99, level: 'intermediate', enrollmentCount: 480
      },
      {
        title: 'Introduction to Artificial Intelligence',
        description: 'Understand AI concepts, machine learning algorithms, neural networks, and how AI is reshaping every industry.',
        excerpt: 'Demystify AI — no math background needed.',
        thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600',
        category: dataCat._id,
        courseType: 'free', price: 0, level: 'beginner', isFeatured: true, enrollmentCount: 2800
      },
      {
        title: 'Entrepreneurship: Build & Launch Your Startup',
        description: 'Learn how to validate ideas, build an MVP, find customers, raise funding, and scale a startup from zero to revenue.',
        excerpt: 'Turn your idea into a thriving business.',
        thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600',
        category: businessCat._id,
        courseType: 'paid', price: 74.99, level: 'all', enrollmentCount: 390
      },
      {
        title: 'MongoDB — The Complete Developer Guide',
        description: 'Master MongoDB — schema design, aggregation pipelines, indexing, transactions, and production deployment with Atlas.',
        excerpt: 'Build robust databases with MongoDB.',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600',
        category: devCat._id,
        courseType: 'paid', price: 49.99, level: 'intermediate', enrollmentCount: 510
      },
      {
        title: 'Graphic Design Fundamentals',
        description: 'Learn the core principles of graphic design — typography, color theory, layout, and branding — using Adobe Illustrator and Canva.',
        excerpt: 'Bring your visual ideas to life.',
        thumbnail: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=600',
        category: designCat._id,
        courseType: 'free', price: 0, level: 'beginner', enrollmentCount: 1400
      },
      {
        title: 'Docker & Kubernetes for Developers',
        description: 'Containerize applications with Docker, orchestrate them with Kubernetes, and deploy to cloud platforms like AWS and GCP.',
        excerpt: 'Master modern DevOps with containers.',
        thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600',
        category: devCat._id,
        courseType: 'paid', price: 84.99, level: 'advanced', enrollmentCount: 295
      }
    ]);
    console.log('📚 15 Courses created');

    // ─────────────────────────────────────────────
    // 4. Create 15 Events
    // ─────────────────────────────────────────────
    const d = (daysFromNow, hours = 0) =>
      new Date(now.getTime() + daysFromNow * 86400000 + hours * 3600000);

    await Event.create([
      {
        title: 'React 19 Launch Workshop',
        description: 'Dive deep into the new features of React 19 — server components, use() hook, and the new compiler. Hands-on coding session included.',
        eventType: 'workshop',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
        startDateTime: d(7), endDateTime: d(7, 3),
        meetingLink: 'https://meet.google.com/xyz-react19',
        maxParticipants: 100, isFeatured: true, registrationCount: 67
      },
      {
        title: 'Webinar: The Future of AI in Education',
        description: 'How AI is transforming the way we learn and teach. Expert panel from Google, OpenAI, and leading EdTech companies.',
        eventType: 'webinar',
        thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600',
        startDateTime: d(3), endDateTime: d(3, 2),
        meetingLink: 'https://zoom.us/ai-education-2026',
        maxParticipants: 500, isFeatured: true, registrationCount: 312
      },
      {
        title: 'Full-Stack Development Conference 2026',
        description: 'A full-day conference on modern full-stack development trends. Talks on Next.js 15, serverless, edge computing, and micro-frontends.',
        eventType: 'conference',
        thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
        startDateTime: d(14), endDateTime: d(14, 8),
        meetingLink: 'https://meet.google.com/fullstack-conf',
        maxParticipants: 300, isFeatured: true, registrationCount: 189
      },
      {
        title: 'UI/UX Design Sprint Workshop',
        description: 'A hands-on 3-hour sprint where you design, prototype, and test a real product feature from scratch using Design Thinking.',
        eventType: 'workshop',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
        startDateTime: d(5), endDateTime: d(5, 3),
        meetingLink: 'https://zoom.us/ux-sprint',
        maxParticipants: 50, registrationCount: 41
      },
      {
        title: 'Python for Beginners — Live Coding Session',
        description: 'Join our instructor for a free live coding session covering Python basics. Ask questions in real time and build your first Python app.',
        eventType: 'webinar',
        thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600',
        startDateTime: d(2), endDateTime: d(2, 2),
        meetingLink: 'https://meet.google.com/python-live',
        maxParticipants: 200, isFeatured: true, registrationCount: 155
      },
      {
        title: 'Career in Tech — Ask Me Anything',
        description: 'Senior engineers from top companies answer your questions about breaking into tech, switching roles, and building a software career.',
        eventType: 'seminar',
        thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600',
        startDateTime: d(10), endDateTime: d(10, 2),
        meetingLink: 'https://zoom.us/tech-career-ama',
        maxParticipants: 250, registrationCount: 98
      },
      {
        title: 'Digital Marketing Bootcamp — Day 1',
        description: 'A two-day intensive bootcamp on SEO, SEM, and social media strategy. Day 1 covers fundamentals and Google Analytics 4.',
        eventType: 'workshop',
        thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=600',
        startDateTime: d(20), endDateTime: d(20, 6),
        maxParticipants: 80, registrationCount: 34
      },
      {
        title: 'MongoDB Atlas Deep Dive',
        description: 'Explore MongoDB Atlas features — vector search, online archive, data federation, and Atlas Charts. Live demo and Q&A.',
        eventType: 'webinar',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600',
        startDateTime: d(4), endDateTime: d(4, 2),
        meetingLink: 'https://zoom.us/mongodb-atlas-deep-dive',
        maxParticipants: 300, registrationCount: 120
      },
      {
        title: 'Figma to Code — Design Handoff Workshop',
        description: 'Best practices for handing off Figma designs to developers. Covers Figma Dev Mode, variables, and auto-layout.',
        eventType: 'workshop',
        thumbnail: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=600',
        startDateTime: d(12), endDateTime: d(12, 2),
        meetingLink: 'https://meet.google.com/figma-handoff',
        maxParticipants: 75, registrationCount: 60
      },
      {
        title: 'Startup Pitch Night',
        description: 'Watch 10 early-stage startups pitch to a panel of investors. Network with founders and investors after the event.',
        eventType: 'other',
        thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600',
        startDateTime: d(18), endDateTime: d(18, 3),
        maxParticipants: 150, registrationCount: 88
      },
      {
        title: 'Docker & Kubernetes Hands-On Lab',
        description: 'Set up a production-grade Kubernetes cluster from scratch. Deploy, scale, and monitor containerized applications.',
        eventType: 'workshop',
        thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600',
        startDateTime: d(25), endDateTime: d(25, 4),
        meetingLink: 'https://zoom.us/k8s-lab',
        maxParticipants: 60, registrationCount: 25
      },
      {
        title: 'Data Visualization with Power BI',
        description: 'Build interactive dashboards that tell compelling stories with data. Covers DAX, Power Query, and report sharing.',
        eventType: 'webinar',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
        startDateTime: d(6), endDateTime: d(6, 2),
        meetingLink: 'https://meet.google.com/powerbi-dashboard',
        maxParticipants: 200, registrationCount: 76
      },
      {
        title: 'Open Source Contribution Day',
        description: 'Contribute to popular open source projects with guidance from maintainers. All skill levels welcome.',
        eventType: 'other',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600',
        startDateTime: d(30), endDateTime: d(30, 5),
        maxParticipants: 120, registrationCount: 44
      },
      {
        title: 'TypeScript Best Practices Seminar',
        description: 'Advanced TypeScript patterns for large codebases. Covers module augmentation, conditional types, and strict mode migration.',
        eventType: 'seminar',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600',
        startDateTime: d(9), endDateTime: d(9, 2),
        meetingLink: 'https://zoom.us/ts-best-practices',
        maxParticipants: 180, registrationCount: 55
      },
      {
        title: 'EduTech Annual Learning Summit',
        description: 'Our flagship annual event. Two days of keynotes, workshops, and networking with 50+ speakers and 1000+ learners from across India.',
        eventType: 'conference',
        thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
        startDateTime: d(45), endDateTime: d(46, 8),
        maxParticipants: 1000, isFeatured: true, registrationCount: 430
      }
    ]);
    console.log('📅 15 Events created');

    // ─────────────────────────────────────────────
    // 5. Create 15 Blog Posts
    // ─────────────────────────────────────────────
    const blogData = [
      {
        title: 'Top 10 Web Development Trends in 2026',
        content: `The web development landscape is evolving faster than ever. In 2026, we're seeing the rise of AI-powered development tools, Web Components becoming mainstream, and WebAssembly pushing browser capabilities beyond imagination. Server components in React and Next.js are changing how we think about rendering. Edge computing is making apps faster globally.\n\n## 1. AI-Assisted Coding\nTools like GitHub Copilot and Cursor are now used by over 70% of professional developers. They're making developers 3x more productive.\n\n## 2. React Server Components\nRSC fundamentally changes the React mental model. Components can fetch data on the server without client-side JavaScript.\n\n## 3. Edge Computing\nPlatforms like Vercel Edge and Cloudflare Workers allow JavaScript to run at CDN edge nodes, giving sub-10ms response times globally.\n\n## 4. WebAssembly Goes Mainstream\nWASM is no longer just for game engines. Frameworks like Blazor and Flutter Web use WASM for near-native browser performance.\n\n## 5. The Return of Web Standards\nFrameworks are aligning with native browser APIs — View Transitions, Navigation API, and CSS Container Queries.`,
        excerpt: 'Stay ahead of the curve with these 10 must-know web development trends for 2026.',
        featuredImage: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800',
        author: admin._id, category: devCat._id, tags: [reactTag._id, nodeTag._id, jsTag._id],
        status: 'published', isFeatured: true, viewCount: 4280
      },
      {
        title: 'How to Start a Career in UI/UX Design',
        content: `Breaking into UI/UX design can feel overwhelming, but it's more accessible than ever. You don't need a design degree — you need a portfolio, the right tools, and a deep understanding of human behaviour.\n\n## The Mindset Shift\nUX design is about solving problems, not just making things look pretty. Start by understanding user psychology, conducting interviews, and mapping user journeys.\n\n## Tools You Need to Learn\n- **Figma**: Industry standard for UI design and prototyping\n- **Maze or Useberry**: For usability testing\n- **Miro**: For collaborative workshops and journey mapping\n\n## Building Your Portfolio\nYour portfolio is your ticket to your first job. Focus on case studies that show your process.\n\n## Getting Hired\nApply to junior roles, take freelance projects on Upwork, and contribute to open source design systems.`,
        excerpt: 'Practical tips to land your first UI/UX design job — even without a design degree.',
        featuredImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        author: admin._id, category: designCat._id, tags: [uiTag._id],
        status: 'published', isFeatured: true, viewCount: 3120
      },
      {
        title: 'Understanding React Hooks — A Practical Guide',
        content: `React Hooks changed everything when they arrived in React 16.8. Now in 2026, with React 19's new hooks, there's more to learn than ever.\n\n## useState — More Powerful Than You Think\nMost developers only scratch the surface of useState. Functional updates, lazy initializers, and combining with useReducer are patterns you should master.\n\n## useEffect — The Most Misunderstood Hook\nThe dependency array is not optional. Understanding the cleanup function and avoiding infinite loops are critical skills.\n\n## The New use() Hook in React 19\nReact 19 introduces the use() hook for reading resources like Promises and Context directly inside render.\n\n## Custom Hooks — Your Real Superpower\nEvery time you repeat a stateful logic pattern, extract it into a custom hook.`,
        excerpt: 'Master React Hooks with real-world patterns and the new React 19 additions.',
        featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        author: admin._id, category: devCat._id, tags: [reactTag._id, jsTag._id],
        status: 'published', isFeatured: true, viewCount: 5600
      },
      {
        title: 'Python vs JavaScript: Which Should You Learn First?',
        content: `One of the most common questions from beginners: "Should I learn Python or JavaScript first?" Here's a comprehensive breakdown.\n\n## Python: The Beginner-Friendly Option\nPython was designed to be readable. Its clean syntax makes it ideal for absolute beginners. It's the language of data science, AI, and automation.\n\n## JavaScript: Learn Once, Build Everywhere\nJavaScript is the only language that runs in the browser. If you want to build websites, web apps, mobile apps (React Native), or backend services (Node.js), JS covers all bases.\n\n## The Verdict\n- Want to do **data science, AI, or automation**? → Python\n- Want to build **websites and web apps**? → JavaScript\n- Not sure? → JavaScript, because you'll need it eventually regardless.`,
        excerpt: 'An honest, unbiased comparison to help beginners pick their first programming language.',
        featuredImage: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800',
        author: admin._id, category: devCat._id, tags: [pythonTag._id, jsTag._id],
        status: 'published', viewCount: 2900
      },
      {
        title: 'The Ultimate Guide to CSS Grid',
        content: `CSS Grid is the most powerful layout system available in CSS. It's a 2D system, meaning it can handle both columns and rows.\n\n## Grid vs Flexbox\nUse Grid for page-level layouts. Use Flexbox for smaller, one-dimensional components.\n\n## Core Concepts\n- grid-template-columns and grid-template-rows define track sizes\n- grid-column and grid-row position items\n- grid-area lets you name and place items with template areas\n\n## Responsive Grids Without Media Queries\nThe repeat(auto-fill, minmax(250px, 1fr)) pattern creates fully responsive grids without a single media query.`,
        excerpt: 'Everything you need to know about CSS Grid to build any layout imaginable.',
        featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        author: admin._id, category: devCat._id, tags: [cssTag._id],
        status: 'published', viewCount: 1870
      },
      {
        title: "SEO in 2026: What Still Works and What Doesn't",
        content: `Search engine optimization has never been more dynamic. With Google's AI Overviews changing search results, what actually works in 2026?\n\n## Core Web Vitals Update Is Not Going Away\nLCP, FID, and CLS are still ranking factors. INP has replaced FID and is more strictly enforced.\n\n## Content Quality Over Quantity\nGoogle's Helpful Content updates have penalized thin, AI-generated content. Depth, expertise, and originality matter now.\n\n## E-E-A-T Is Everything\nExperience, Expertise, Authoritativeness, and Trust move the needle more than technical SEO alone.\n\n## What Doesn't Work Anymore\n- Keyword stuffing\n- Buying backlinks\n- Thin affiliate pages`,
        excerpt: 'A no-nonsense look at what SEO strategies actually drive results in 2026.',
        featuredImage: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800',
        author: admin._id, category: marketingCat._id, tags: [seoTag._id],
        status: 'published', viewCount: 2340
      },
      {
        title: 'Building Your First REST API with Node.js and Express',
        content: `REST APIs are the backbone of modern web applications. In this tutorial, we build a complete REST API with Node.js, Express, and MongoDB.\n\n## Project Setup\nInitialize with npm init -y, install Express, Mongoose, dotenv, and nodemon. Structure with controllers, routes, models, and middleware folders.\n\n## Defining Routes\nUse Express Router to organize routes by resource. Follow REST conventions.\n\n## Connecting to MongoDB\nUse Mongoose to connect. Define schemas with validation, add pre-save hooks for slug generation.\n\n## Authentication with JWT\nProtect routes with JWT middleware. Store tokens in HTTP-only cookies. Always hash passwords with bcrypt.`,
        excerpt: 'A step-by-step tutorial to build a production-ready REST API with Node.js, Express, and MongoDB.',
        featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
        author: admin._id, category: devCat._id, tags: [nodeTag._id, jsTag._id],
        status: 'published', viewCount: 3780
      },
      {
        title: '10 Figma Tips That Will 10x Your Design Speed',
        content: `Figma is packed with features most designers never discover. Here are 10 time-saving tips professionals use every day.\n\n## 1. Components + Variants\nUse Variants to manage all states of a component in one place.\n\n## 2. Auto Layout Is Your Best Friend\nAuto Layout makes your designs responsive by default — it works like CSS Flexbox.\n\n## 3. Variables for Design Tokens\nFigma Variables let you define colors, spacing, and typography tokens that update across your entire design.\n\n## 4. Quick Insert with '/'\nName your components with '/' to create folders for easy navigation.\n\n## 5. Bulk Rename Layers\nSelect multiple layers and use Ctrl+R to bulk rename with sequential numbers.`,
        excerpt: '10 underrated Figma features that professional designers use to work 10x faster.',
        featuredImage: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800',
        author: admin._id, category: designCat._id, tags: [uiTag._id],
        status: 'published', viewCount: 2150
      },
      {
        title: "Understanding Machine Learning: A Beginner's Guide",
        content: `Machine learning seems intimidating, but the core concepts are surprisingly approachable.\n\n## What Is Machine Learning?\nML is a subset of AI where systems learn from data to make predictions or decisions without being explicitly programmed.\n\n## The Three Types of ML\n1. **Supervised Learning** — Learning from labeled examples\n2. **Unsupervised Learning** — Finding patterns in unlabeled data\n3. **Reinforcement Learning** — Learning through trial and error with rewards\n\n## Your First ML Model\nUse scikit-learn in Python to build a linear regression model in under 20 lines of code. Load a dataset, split into train/test, fit the model, and evaluate accuracy.`,
        excerpt: 'A clear, jargon-free introduction to machine learning for complete beginners.',
        featuredImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800',
        author: admin._id, category: dataCat._id, tags: [pythonTag._id, aiTag._id],
        status: 'published', isFeatured: true, viewCount: 4100
      },
      {
        title: "The Startup Founder's Guide to MVP Development",
        content: `An MVP is not a half-baked product — it's the smallest version that delivers real value and tests your core hypothesis.\n\n## What Goes Into an MVP\nList every feature you think your product needs. Now cut 70% of them. Your MVP is the remaining 30%.\n\n## No-Code MVP vs Coded MVP\nIn 2026, you can build a functional MVP with Webflow, Bubble, Glide, or Softr — no engineers needed.\n\n## When to Code Your MVP\nIf your product's core value is the technology itself, then you need engineers from day one.\n\n## The Metrics That Matter\nTrack activation rate, retention, and NPS — signals that show whether people actually get value from your product.`,
        excerpt: 'How to build and launch an MVP that validates your business idea without wasting 6 months.',
        featuredImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
        author: admin._id, category: businessCat._id, tags: [],
        status: 'published', viewCount: 1650
      },
      {
        title: "TypeScript in 2026 — Why It's Non-Negotiable",
        content: `TypeScript adoption has crossed 80% among professional JavaScript developers. If you're still writing plain JavaScript for production apps, here's why 2026 is the year to switch.\n\n## The Case for TypeScript\nTypeScript catches errors at compile time. IDEs give you better autocomplete, refactoring tools, and inline documentation.\n\n## Getting Started Is Easier Than Ever\nVite, Next.js, and Create React App all have TypeScript templates. Migrate gradually — you don't need to convert everything at once.\n\n## Generics Are Not Scary\nOnce you understand generics, you'll wonder how you wrote reusable code without them.\n\n## Strict Mode Is Worth The Pain\nEnable "strict": true in your tsconfig from day one.`,
        excerpt: 'Why TypeScript is now a must-have skill and how to adopt it in your existing projects.',
        featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
        author: admin._id, category: devCat._id, tags: [jsTag._id, reactTag._id],
        status: 'published', viewCount: 2870
      },
      {
        title: 'Designing for Accessibility: A Practical Checklist',
        content: `Accessibility is not a feature — it's a baseline requirement. 15% of the world's population has some form of disability.\n\n## Color Contrast\nAll text must meet WCAG 2.1 AA contrast ratios — 4.5:1 for normal text. Use tools like Stark or WebAIM's Contrast Checker.\n\n## Keyboard Navigation\nEvery interactive element must be reachable and operable via keyboard alone.\n\n## Screen Reader Support\nUse semantic HTML. Add aria-labels to icon buttons. Ensure dynamic content updates are announced with aria-live regions.\n\n## Forms Done Right\nEvery input needs a visible label. Error messages must be associated with their fields via aria-describedby.`,
        excerpt: 'A practical accessibility checklist every designer and developer should implement.',
        featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        author: admin._id, category: designCat._id, tags: [uiTag._id, cssTag._id],
        status: 'published', viewCount: 1420
      },
      {
        title: 'Docker for Developers: From Zero to Production',
        content: `Docker has gone from a niche DevOps tool to a fundamental developer skill.\n\n## What Problem Does Docker Solve?\n"It works on my machine" — Docker eliminates this by packaging your app with all its dependencies into a container.\n\n## Core Concepts\n- **Image**: A blueprint for a container\n- **Container**: A running instance of an image\n- **Docker Compose**: Define multi-container apps in one YAML file\n\n## Your First Dockerfile\nA Node.js Dockerfile is just 8 lines: base image, copy package files, run npm install, copy source, expose port, start command.\n\n## Docker Compose for Development\nSpin up your entire development environment with a single docker-compose up command.`,
        excerpt: 'A practical Docker guide for developers — from your first container to production deployment.',
        featuredImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
        author: admin._id, category: devCat._id, tags: [nodeTag._id],
        status: 'published', viewCount: 1990
      },
      {
        title: 'Growth Hacking 101: How Startups Grow Fast',
        content: `Growth hacking is the discipline of finding unconventional, scalable ways to grow a product's user base.\n\n## The Growth Loop Framework\nSustainable growth comes from loops, not funnels. A growth loop is a self-reinforcing cycle where users bring in more users.\n\n## Classic Growth Hacks\n- **Dropbox**: Gave free storage for referrals. Grew from 100K to 4M users in 15 months.\n- **Airbnb**: Posted listings to Craigslist to tap into existing demand.\n- **Hotmail**: Added "Get your free email at Hotmail" to every sent email.\n\n## Data-Driven Experimentation\nGrowth hackers run dozens of A/B tests per week. Every headline, button color, and onboarding step is a hypothesis to be tested.`,
        excerpt: 'The growth hacking playbook that helped Dropbox and Airbnb scale fast.',
        featuredImage: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800',
        author: admin._id, category: businessCat._id, tags: [seoTag._id],
        status: 'published', viewCount: 2210
      },
      {
        title: 'The Power of Data Visualization in Business Decisions',
        content: `Data without visualization is just numbers. The ability to present data clearly is one of the highest-value skills in any organization.\n\n## Why Visualization Matters\nThe human brain processes visuals 60,000 times faster than text. A well-designed chart communicates in seconds what a data table takes minutes to convey.\n\n## Choosing the Right Chart Type\n- **Bar chart**: Comparing categories\n- **Line chart**: Showing trends over time\n- **Scatter plot**: Showing correlations\n- **Heatmap**: Showing density across two dimensions\n\n## Tools of the Trade\n- **Power BI**: Enterprise BI\n- **Tableau**: Powerful and flexible\n- **D3.js**: Custom web visualizations\n- **Looker Studio**: Free, Google ecosystem`,
        excerpt: 'How to turn raw data into powerful visual stories that drive better business decisions.',
        featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        author: admin._id, category: dataCat._id, tags: [pythonTag._id, aiTag._id],
        status: 'published', viewCount: 1730
      }
    ];

    // Insert one at a time to trigger pre-save hooks (slug + publishedAt)
    for (const post of blogData) {
      await new BlogPost(post).save();
    }
    console.log('✍️  15 Blog posts created');

    console.log('\n✨ Seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('   • 15 Courses (linked to categories)');
    console.log('   • 15 Events');
    console.log('   • 15 Blog posts');
    console.log('   • 5 Categories: Design, Development, Business, Data Science, Marketing');
    console.log('   • 8 Tags');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedData();
