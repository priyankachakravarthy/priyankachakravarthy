export const data = {
  name: 'Priyanka Chakravarthy',
  role: 'Senior Software Consultant',
  company: 'Mercedes-Benz R&D India',
  location: 'Bangalore, India',
  email: 'priyankac.work@gmail.com',
  linkedin: 'https://www.linkedin.com/in/priyankac-work/',
  bio: 'Backend engineer with 3+ years building scalable microservices, cloud infrastructure, and AI-powered systems. I care about clean architecture, measurable impact, and engineering that actually ships.',

  experience: [
    {
      role: 'Senior Software Consultant',
      company: 'Mercedes-Benz Research and Development India',
      location: 'Bangalore',
      period: 'Aug 2022 – Present',
      highlights: [
        'Architected backend microservices for a financial services orchestrator and digital contracting platform — 98% uptime, 30% lower P95 latency.',
        'Led Azure cloud migration (AKS, Docker, Terraform) — cut provisioning from days to under an hour, 40% faster deployments, zero unplanned downtime.',
        'Decoupled a monolith into event-driven microservices with Kafka + Redis — eliminated the team\'s top incident cause, 50% faster query times.',
        'Rebuilt CI/CD pipelines across Jenkins, TeamCity, and GitHub Actions — 60% less manual intervention, releases went from weekly to daily.',
        'Set Java and Azure standards adopted across 3 squads; ran internal sessions on distributed systems, cloud cost, and observability.',
      ],
    },
  ],

  education: {
    degree: 'Bachelor of Engineering — Electronics & Communication',
    institution: 'Visvesvaraya Technological University',
    period: '2018 – 2022',
    location: 'Bangalore',
  },

  projects: [
    {
      title: 'Subscription Tracker',
      period: 'Jul 2025',
      stack: ['Java', 'Spring Boot', 'OpenAI API', 'Docker', 'Azure'],
      description: 'Backend system to track subscriptions and billing cycles. Integrated OpenAI APIs for natural language queries ("How much did I spend on streaming this month?") and AI-powered payment reminders.',
    },
    {
      title: 'Salesforce AI Assistant',
      period: 'Sep 2025',
      stack: ['Salesforce', 'GPT', 'Service Cloud', 'Apex'],
      description: 'GPT-powered assistant embedded in Salesforce Service Cloud to summarise support cases, draft email responses, and surface knowledge articles — improving agent productivity.',
    },
    {
      title: 'Restaurant Recommendation System',
      period: 'Dec 2025',
      stack: ['Python', 'ML', 'Context-aware Algorithms'],
      description: 'Intelligent recommendation engine personalising suggestions based on user preferences, occasion type, weather, and location across Bangalore.',
    },
  ],

  skills: [
    { label: 'Languages', items: ['Java', 'Python', 'JavaScript'] },
    { label: 'Cloud & Infra', items: ['Microsoft Azure', 'AKS', 'Docker', 'Kubernetes', 'Terraform', 'Git'] },
    { label: 'Databases', items: ['PostgreSQL', 'Azure Cosmos DB', 'MS-SQL', 'Redis'] },
    { label: 'DevOps & CI/CD', items: ['Jenkins', 'TeamCity', 'GitHub Actions', 'Grafana'] },
    { label: 'Messaging', items: ['Apache Kafka'] },
    { label: 'Frontend', items: ['React.js'] },
    { label: 'AI Tools', items: ['Claude Code', 'OpenAI Codex'] },
  ],

  certifications: [
    { name: 'Microsoft Azure Administrator Associate', year: '2024' },
    { name: 'Microsoft Azure Solution Architect', year: '2025' },
    { name: 'Salesforce Certified Platform Developer', year: '2025' },
    { name: 'Salesforce Certified Agentforce Specialist', year: '2025' },
  ],
}