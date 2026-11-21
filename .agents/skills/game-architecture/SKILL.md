
# Game Architecture Skill

## 1. Project Context

Build X3M Ideas: Agency Life Simulation as a web-first, desktop and mobile-responsive corporate life simulation game.

The experience combines:

- A low-poly 3D office environment.
- Interface-driven game activities.
- Career progression and recruitment.
- Briefs and AI evaluation.
- NPC interactions and office events.
- Salary, expenses and virtual assets.

Use the PRD and GDD as the primary product references. Do not introduce features or architectural requirements that conflict with them.

## 2. Approved Technology Stack

Use the following technologies unless a change is explicitly approved:

| Area                 | Technology        |
| -------------------- | ----------------- |
| Application          | Next.js           |
| Language             | TypeScript        |
| UI                   | React             |
| Styling              | Tailwind CSS      |
| 3D rendering         | Three.js          |
| React 3D integration | React Three Fiber |
| 3D utilities         | Drei              |
| 3D modelling         | Blender           |
| Database             | PostgreSQL        |
| ORM                  | Prisma            |
| Authentication       | Supabase Auth     |
| AI                   | Gemini API        |
| Vector search        | pgvector          |

Do not introduce alternative frameworks or libraries without a clear technical reason.

## 3. Core Architecture Principles

### 3.1 Separate the 3D Environment from Game Logic

The 3D office is responsible for:

- Rendering the office environment.
- Displaying player and NPC characters.
- Character movement and animations.
- Office navigation.
- Detecting player interactions.
- Displaying contextual visual elements.

The application and backend are responsible for:

- Player accounts and profiles.
- Recruitment and employment.
- Career progression.
- Brief assignment and evaluation records.
- Salary and financial transactions.
- HR records.
- Game time and deadlines.
- NPC schedules and persistent interactions.

Never place authoritative game rules inside 3D components.

### 3.2 Keep Game Logic Server-Controlled

The backend is the source of truth for all important game data.

Never rely on the browser to determine:

- Player salary or balance.
- Purchase validity.
- Promotion eligibility.
- Employment status.
- Brief deadlines.
- Performance records.
- Game calendar calculations.

Validate all important actions on the server before updating persistent data.

### 3.3 Keep the Architecture Modular

Organise the application around clear responsibilities.

Use separate modules for:

- Authentication and players.
- Career and recruitment.
- Briefs and evaluation.
- Economy and inventory.
- HR and employment.
- Game clock and scheduling.
- Office simulation.
- AI and knowledge retrieval.

Keep related logic together. Avoid unnecessary abstractions, excessive nesting and duplicated functionality.

### 3.4 Keep the 3D Environment Lightweight

The office must be optimised for browser performance.

Prioritise:

- Low-poly models.
- Reusable 3D assets.
- Compressed textures.
- Efficient lighting.
- Reusable animations.
- Controlled NPC counts.
- Simple navigation and collision systems.

Do not introduce complex physics, advanced rendering effects or unnecessary 3D dependencies.

## 4. Application Structure

Use the following as the initial organisational guide:

```text
src/
├── app/
│   ├── dashboard/
│   ├── office/
│   ├── career/
│   ├── briefs/
│   ├── finances/
│   └── api/
│
├── components/
│   ├── ui/
│   └── game-interface/
│
├── game/
│   ├── scene/
│   ├── characters/
│   ├── environment/
│   ├── movement/
│   ├── interactions/
│   └── npc/
│
├── services/
│   ├── career/
│   ├── briefs/
│   ├── economy/
│   ├── hr/
│   ├── game-clock/
│   └── ai/
│
└── lib/
    
prisma/
public/
├── models/
├── animations/
├── textures/
└── audio/

docs/
```

Extend this structure only when the project requires it. Do not create empty folders or modules without a clear purpose.

## 5. Hybrid Experience Architecture

The 3D office and application interface must work together.

Examples:

- Selecting a desk opens the work dashboard.
- Interacting with a colleague opens a conversation interface.
- Selecting the HR office opens HR-related activities.
- Visiting a meeting room can trigger a game activity.
- Opening the financial dashboard displays salary, expenses and assets.

Use reusable interaction components and connect them to application actions.

Do not build complex 3D versions of forms, dashboards or other structured interfaces.

## 6. Data and Database Rules

- Use Prisma for database access.
- Keep the database schema organised around the game's main entities.
- Separate player profile data from employment and career records.
- Persist important game progress.
- Use server-side validation for all data changes.
- Keep salary, purchases and other financial transactions traceable.
- Avoid duplicating data that can be derived reliably.
- Never expose database credentials or API keys in client-side code.

Use PostgreSQL with pgvector for the initial knowledge retrieval implementation.

## 7. AI Integration Rules

Gemini API may support:

- Subjective brief evaluation.
- Recruitment conversations.
- Selected HR interactions.
- Contextual NPC conversations.
- Knowledge retrieval and response generation.

AI must not independently update authoritative game records.

Use server-side services to validate AI outputs before they affect game outcomes.

Use deterministic application logic for objective questions, salary calculations, purchases, deadlines and promotion rules.

Do not call AI for routine NPC movement, animations or simple scripted dialogue.

## 8. Development Rules

When implementing a feature:

1. Check the PRD and GDD for the relevant requirement.
2. Inspect the existing project structure and code before making changes.
3. Identify the correct module for the feature.
4. Reuse existing components and services where appropriate.
5. Implement only what the current task requires.
6. Test the implementation.
7. Report files changed, tests performed and any unresolved issues.

Do not:

- Rewrite working code unnecessarily.
- Install dependencies without a clear need.
- Change the approved technology stack without approval.
- Build multiple unrelated features in one task.
- Introduce placeholder functionality and present it as complete.
- Make architectural decisions that contradict the PRD or GDD.

## 9. Testing and Quality

Every feature must be tested within its scope.

Prioritise:

- TypeScript correctness.
- Successful application builds.
- API validation.
- Database integrity.
- Authentication and access control.
- Game-state consistency.
- 3D rendering and interaction performance.
- Desktop and mobile compatibility.

Test important game transactions on the server, not just through the interface.

## 10. Architecture Decision Rule

Keep the implementation as simple as possible while meeting the product requirements.

When a technical decision is unclear:

1. Check the PRD and GDD.
2. Inspect the existing implementation.
3. Prefer the simplest solution that fits the approved architecture.
4. Explain any proposed change to the technology stack or system structure before implementing it.

Do not introduce complexity for hypothetical future requirements.

**Primary rule:** Build a maintainable game application where the 3D office creates immersion, the interface manages gameplay and the backend controls the authoritative game state.

## Office Structure

The game must represent X3M Ideas' organisational structure, including:
- Business Units: BU1, BU2 and BU3.
- Functional Departments: Finance and HR.

Each office unit must have a defined location within the 3D office environment.

The architecture must support additional office units without requiring major structural changes.