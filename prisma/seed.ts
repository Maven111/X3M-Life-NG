import { PrismaClient, DepartmentCode, CareerTrack, BriefCategory, BriefFormat, EvaluationMethod } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding X3M Ideas foundational agency database...');

  // 1. Departments (BU1, BU2, BU3, Finance, HR)
  const departmentsData = [
    { code: DepartmentCode.BU1, name: 'Business Unit 1 (Creative & FMCG)', description: 'FMCG, beverage, and retail creative accounts.' },
    { code: DepartmentCode.BU2, name: 'Business Unit 2 (Telco & Tech)', description: 'Telecommunications, fintech, and digital transformation accounts.' },
    { code: DepartmentCode.BU3, name: 'Business Unit 3 (Banking & Corporate)', description: 'Commercial banking, public sector, and conglomerate brands.' },
    { code: DepartmentCode.FINANCE, name: 'Finance & Accounts', description: 'Agency budget allocation, salary disbursements, and financial operations.' },
    { code: DepartmentCode.HR, name: 'People & Culture (HR)', description: 'Recruitment, talent development, performance reviews, and queries.' }
  ];

  for (const dept of departmentsData) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept
    });
  }

  // 2. Salary Bands & Initial Career Tracks (Entry Level 1 to Director Level 5)
  const salaryBands = [
    { minSalary: 150000, maxSalary: 250000 },  // Level 1: Entry
    { minSalary: 300000, maxSalary: 550000 },  // Level 2: Mid
    { minSalary: 600000, maxSalary: 1100000 }, // Level 3: Senior
    { minSalary: 1200000, maxSalary: 2000000 },// Level 4: Lead
    { minSalary: 2200000, maxSalary: 3800000 } // Level 5: Director
  ];

  const createdBands = [];
  for (const b of salaryBands) {
    const band = await prisma.salaryBand.create({
      data: { minSalary: b.minSalary, maxSalary: b.maxSalary }
    });
    createdBands.push(band);
  }

  // Define Job Roles for each of the 5 Tracks
  const tracks = [
    { track: CareerTrack.COPYWRITING, titles: ['Junior Copywriter', 'Copywriter', 'Senior Copywriter', 'Creative Lead (Copy)', 'Deputy Creative Director'] },
    { track: CareerTrack.ART_DIRECTION, titles: ['Junior Visualizer', 'Art Director', 'Senior Art Director', 'Creative Group Head (Art)', 'Creative Director'] },
    { track: CareerTrack.BRAND_STRATEGY, titles: ['Junior Strategist', 'Brand Strategist', 'Senior Strategic Planner', 'Strategy Lead', 'Head of Strategy'] },
    { track: CareerTrack.DIGITAL_STRATEGY, titles: ['Digital Executive', 'Digital Strategist', 'Senior Digital Specialist', 'Digital Group Lead', 'Head of Digital'] },
    { track: CareerTrack.BRAND_MANAGEMENT, titles: ['Account Executive', 'Account Manager', 'Senior Account Manager', 'Account Director', 'Client Service Director'] }
  ];

  for (const t of tracks) {
    for (let lvl = 1; lvl <= 5; lvl++) {
      await prisma.jobRole.upsert({
        where: {
          track_level: {
            track: t.track,
            level: lvl
          }
        },
        update: {},
        create: {
          track: t.track,
          level: lvl,
          title: t.titles[lvl - 1],
          description: `${t.titles[lvl - 1]} at X3M Ideas.`,
          salaryBandId: createdBands[lvl - 1].id
        }
      });
    }
  }

  // 3. Initial Seed Briefs (General & Role-Specific)
  const bu1 = await prisma.department.findUnique({ where: { code: DepartmentCode.BU1 } });

  await prisma.brief.create({
    data: {
      title: 'Gen Z Brand Activation Challenge',
      description: 'Develop a bold, youth-centric campaign slogan and activation concept for an upcoming instant noodle product launch in Lagos.',
      category: BriefCategory.ROLE_SPECIFIC,
      careerTrack: CareerTrack.COPYWRITING,
      format: BriefFormat.SUBJECTIVE_PROPOSAL,
      evaluationMethod: EvaluationMethod.GEMINI_RUBRIC,
      departmentId: bu1?.id,
      difficulty: 1,
      rewardAmount: 35000,
      deadlineDuration: 120, // 120 in-game minutes
      rubricSnapshot: {
        insight_clarity: 'Does the concept address Nigerian youth street culture?',
        originality: 'Is the tagline catchy, memorable, and distinct from competitors?',
        brand_alignment: 'Does it convey energy and quick satisfaction?'
      }
    }
  });

  await prisma.brief.create({
    data: {
      title: 'Advertising Industry Standards 101',
      description: 'Which regulatory body in Nigeria is primarily responsible for vetting and approving advertising materials before broadcast?',
      category: BriefCategory.GENERAL,
      format: BriefFormat.MULTIPLE_CHOICE,
      evaluationMethod: EvaluationMethod.DETERMINISTIC,
      difficulty: 1,
      rewardAmount: 15000,
      deadlineDuration: 60,
      correctAnswer: 'ARCON (Advertising Regulatory Council of Nigeria)'
    }
  });

  // 4. Initial Lifestyle Marketplace Catalog
  const lifestyleCatalog = [
    { name: 'Ergonomic Standing Desk & Chair', category: 'OFFICE_GEAR', price: 180000, prestige: 15 },
    { name: 'Flagship Smartphone Pro', category: 'GADGET', price: 950000, prestige: 35 },
    { name: 'Bespoke Corporate Attire', category: 'CLOTHING', price: 85000, prestige: 20 },
    { name: 'Lekki Phase 1 Studio Apartment', category: 'APARTMENT', price: 3500000, prestige: 120 }
  ];

  for (const item of lifestyleCatalog) {
    await prisma.lifestyleItem.create({ data: item });
  }

  console.log('Database successfully seeded with foundational agency data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

