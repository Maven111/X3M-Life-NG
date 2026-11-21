# X3M Ideas: Agency Life Simulation

## Product Requirements Document (PRD)

**Product:** X3M Ideas: Agency Life Simulation
**Product type:** Branded 3D corporate-life simulation game
**Platform:** Responsive web application
**Market:** Nigeria, with potential for wider audiences
**Brand context:** X3M Ideas Creative Limited
**Status:** Product specification\


---

## 1. Product Overview

### 1.1 Product Summary

X3M Ideas: Agency Life Simulation is a web-based life simulation game that allows players to create a character, join X3M Ideas as an entry-level employee, experience the realities of agency life, complete advertising and marketing briefs, earn virtual money, progress through their careers, and build an aspirational lifestyle.

The game combines a 3D representation of the X3M Ideas office with interactive gameplay interfaces. Players can move around the office, interact with colleagues and workplace objects, receive assignments, complete challenges, earn salaries and bonuses, get promoted, and purchase lifestyle items.

The experience should reflect the humour, ambition, creativity, pressure, relationships and culture of working in a Nigerian creative agency.

The game is entertainment first. It must not feel like an employee management or performance evaluation platform.

### 1.2 Product Vision

Create an entertaining simulation of agency life where players experience the journey from entry-level employee to senior agency professional, navigating briefs, office relationships, career progression and the lifestyle their earnings make possible.

### 1.3 Product Principles

1. **Entertainment first:** Gameplay must be enjoyable, not a reproduction of actual work.
2. **Career progression:** Players should see meaningful development as they advance.
3. **Agency authenticity:** The environment should reflect the character and culture of X3M Ideas.
4. **Accessible gameplay:** Players should understand the game without needing advertising-industry experience.
5. **Meaningful consequences:** Performance, deadlines and financial decisions should affect progression without making the game unnecessarily punishing.
6. **Player ownership:** Players should retain their career history and game progress, even after employment setbacks.
7. **Expandable systems:** Roles, office units, briefs, characters, events and items should be configurable.

---

## 2. Goals and Non-Goals

### 2.1 Product Goals

- Allow players to create and customise an employee character.
- Introduce players to five advertising and marketing career tracks.
- Simulate an interactive X3M Ideas office environment.
- Provide general and role-specific briefs.
- Use AI to evaluate selected subjective submissions against approved scoring rubrics.
- Introduce performance tracking, warnings, promotions and career progression.
- Support salary negotiation within predefined salary bands.
- Create a virtual economy involving salary, bonuses, purchases, expenses and assets.
- Allow players to interact with colleagues and workplace objects.
- Encourage repeat engagement through office events, activities and lifestyle goals.
- Preserve player progress between sessions.

### 2.2 Non-Goals for the Initial Release

The initial release will not:

- Evaluate actual X3M Ideas employees.
- Influence real recruitment, promotion or employment decisions.
- Use confidential client briefs, internal campaign information or private employee data.
- Process real-money transactions or offer cash withdrawals.
- Require multiplayer gameplay.
- Reproduce a complete open-world environment.
- Give AI unrestricted authority over game outcomes.
- Simulate every possible agency role or workplace activity.
- Require advanced physics or highly autonomous NPC behaviour.

---

## 3. Target Users

### Primary Audiences

**Aspiring advertising and marketing professionals**

- Interested in creative, strategy, digital and brand careers.
- Curious about how advertising agencies operate.
- Motivated by career discovery and progression.

**Young professionals**

- Familiar with Nigerian workplace culture.
- Interested in humour around office life, salary, deadlines and career growth.

**Simulation-game players**

- Interested in character development, virtual economies, collecting items and unlocking experiences.

**X3M Ideas and advertising-industry audiences**

- Interested in agency culture, creative careers and the X3M Ideas identity.

### User Needs

Players need to:

- Understand the game and its objectives quickly.
- Create a character and choose a career track.
- Understand their responsibilities and available briefs.
- Know how their performance affects their career.
- Understand salary, rewards and expenses.
- Interact with the office environment.
- Build relationships and participate in workplace activities.
- Save progress and return to the game.

---

## 4. Core User Journey

1. **Discover:** Player lands on the game introduction screen.
2. **Start:** Player begins a new game.
3. **Create character:** Player selects a character appearance and name.
4. **Choose career:** Player selects one of the available career tracks.
5. **Join X3M:** Player enters the agency as an entry-level employee.
6. **Explore:** Player becomes familiar with the office and its departments.
7. **Receive briefs:** Player receives general and role-specific assignments.
8. **Complete tasks:** Player submits responses and receives scores or feedback.
9. **Earn:** Player receives virtual rewards and salary.
10. **Progress:** Player improves performance and qualifies for promotion.
11. **Negotiate:** Player negotiates salary within the approved range for the new level.
12. **Build lifestyle:** Player purchases clothing, gadgets, accommodation, vehicles and other assets.
13. **Socialise:** Player interacts with colleagues and participates in office activities.
14. **Continue:** Player's progress is saved and can be resumed later.

---

## 5. Career Structure

Players begin at entry level regardless of their selected career track.

### 5.1 Career Tracks

The initial game supports five career tracks:

1. Copywriting
2. Art Direction
3. Brand Strategy
4. Digital Strategy
5. Brand Management

Each track must have its own role description, relevant briefs, progression requirements and career levels.

### 5.2 Career Progression

- All players begin at entry level.
- Players advance by completing briefs, maintaining performance and meeting promotion requirements.
- Promotion requirements should be configurable.
- Each promotion updates the player's career status and salary range.
- Players can negotiate their salary during recruitment and promotion conversations.
- AI can conduct the negotiation conversation, but the backend validates the final salary against the approved salary band.
- Career titles and salary bands must be configurable rather than hard-coded.

### 5.3 Career History

The game should preserve:

- Previous roles.
- Promotions.
- Salary changes.
- Performance history.
- Warnings and HR queries.
- Employment termination.
- Re-employment history.

Termination should not erase the player's entire game history. The game should support a defined re-employment or career restart path.

---

## 6. Briefs and Gameplay Challenges

### 6.1 Brief Categories

The game supports two broad categories:

**General Briefs**

Available to all players regardless of career track. These test general advertising, marketing, communication, workplace and industry knowledge.

**Role-Specific Briefs**

Assigned according to the player's career track. These test knowledge and decision-making relevant to the player's profession.

### 6.2 Brief Formats

- Multiple-choice questions.
- Advertising and marketing trivia.
- Workplace scenarios.
- Decision-making challenges.
- Short creative exercises.
- Constrained subjective submissions.

Briefs must be fictional game content. They must not reproduce confidential client briefs or actual internal agency assignments.

### 6.3 Evaluation

Objective questions are scored deterministically using approved answers.

Subjective submissions are evaluated using Gemini API against fixed, approved rubrics.

AI evaluation should return:

- Score.
- Evaluation summary.
- Feedback.
- Strengths.
- Areas for improvement.
- Relevant supporting concepts or references, where applicable.

Each scored brief must have a defined rubric and approved reference material. The same submission criteria should produce consistent evaluations.

AI must not independently change salary, wallet balances, employment status, promotions or other authoritative game data.

### 6.4 Brief Management

Briefs should be stored as structured data.

Each brief should support:

- Title.
- Description.
- Category.
- Career track.
- Difficulty.
- Submission format.
- Correct answer or evaluation rubric.
- Reward.
- Deadline.
- Status.
- Version.
- Approved reference material.

Content should be manageable through seed data initially, with an administrative content-management interface introduced as needed.

---

## 7. Performance and Employment System

### 7.1 Performance

Players have a performance status that reflects their gameplay outcomes.

Performance can be affected by:

- Brief scores.
- Missed deadlines.
- Repeated poor submissions.
- Successful recovery activities.
- Special achievements.

The system should make performance rules understandable.

### 7.2 Warnings and HR Queries

Repeated underperformance may trigger:

1. HR query or warning.
2. Performance review.
3. Further disciplinary action.
4. Employment termination.

Thresholds and consequences must be configurable.

### 7.3 Recovery

Players should have opportunities to recover through:

- Successful future briefs.
- Recovery challenges.
- Defined performance-improvement activities.
- Other configured gameplay opportunities.

### 7.4 Re-employment

Termination should change the player's employment state, not delete the player's account or career history.

A re-employment process should allow players to return to the agency under defined conditions.

---

## 8. Salary and Virtual Economy

### 8.1 Virtual Wallet

Every player has a virtual wallet that records:

- Salary.
- Brief rewards.
- Bonuses.
- Purchases.
- Recurring expenses.
- Other configured financial transactions.

All transactions must be recorded in a transaction history.

### 8.2 Salary

Salary depends on career track, seniority and configured salary bands.

Salary is paid according to the game calendar.

Salary negotiation takes place conversationally through AI during recruitment and promotion. The backend must validate the negotiated amount against the relevant salary band.

### 8.3 Rewards and Bonuses

Players can earn money through:

- Successful briefs.
- Exceptional performance.
- Special activities.
- Office events.
- Configured bonuses.

### 8.4 Expenses

The game economy can include:

- Accommodation.
- Transport.
- Lifestyle expenses.
- Other recurring costs.

Expenses must be visible and predictable.

### 8.5 Lifestyle Marketplace

Players can spend virtual money on:

- Clothing.
- Phones and gadgets.
- Accommodation.
- Vehicles.
- Furniture.
- Other lifestyle assets.

Each item should have a price, category, image and any applicable unlock requirements.

Purchases must update the wallet and inventory consistently.

The game must not accept real-money payments or present virtual currency as having real-world monetary value.

---

## 9. Office Environment and Interaction

### 9.1 Experience Model

The game uses a hybrid experience:

- An interactive 3D office environment.
- UI panels for briefs, career, wallet, profile, notifications and other gameplay systems.

The office provides immersion. The interface provides access to deeper game functionality.

### 9.2 Office Structure

The office should represent the following organisational units:

**Business Units**

- BU1
- BU2
- BU3

**Functional Departments**

- Finance
- HR

Business Units and functional departments are organisational assignments, not career tracks.

A player's career track defines their profession. Their office unit defines their organisational placement.

For example, a Copywriter can be assigned to BU1.

The architecture must support additional office units in the future.

### 9.3 Office Spaces

The environment should accommodate:

- Reception.
- BU1, BU2 and BU3 areas.
- Creative and strategy work areas.
- Digital and brand management work areas.
- Finance.
- HR.
- Meeting rooms.
- Management offices.

The final layout should be based on approved agency references and available office assets.

### 9.4 Office Characters and NPCs

The office should contain player characters and NPC colleagues.

NPC behaviour may include:

- Walking between desks and departments.
- Moving to meeting rooms.
- Visiting the pantry.
- Sitting at workstations.
- Performing work-related animations.
- Displaying random speech bubbles.
- Participating in office events.

NPC movement and dialogue should initially use scheduled behaviours and predefined dialogue libraries.

AI-driven conversations can be introduced for selected interactions later.

### 9.5 Interactions

Players should be able to interact with:

- Desks.
- Colleagues.
- Meeting rooms.
- Pantry objects.
- HR.
- Finance.
- Other office objects and locations.

The primary movement method is click-to-move. Players should be able to select a destination or interactive object to direct their character.

### 9.6 Office Events

The game should include TGIT (Thank God It's Thursday), occurring every in-game Thursday.

TGIT can introduce:

- Optional activities.
- Social interactions.
- Special challenges.
- Rewards.
- Event-specific dialogue.

---

## 10. Game Time System

The game uses a server-controlled accelerated clock.

### 10.1 Time Conversion

The agreed time model is:

- 1 real minute = 2 in-game minutes.
- 1 in-game hour = 30 real minutes.
- An 8-hour working shift, from 9 AM to 5 PM, takes 4 real hours.
- A complete 24-hour in-game calendar day takes 12 real hours.
- A 7-day in-game week takes 3.5 real days.
- A 30-day in-game month takes 15 real days.
- A 365-day in-game year takes approximately 182.5 real days.

The game clock continues outside office hours and on weekends.

### 10.2 Time Authority

- The backend controls game time.
- The browser clock must not determine authoritative deadlines or salary payments.
- The system must support offline time catch-up.
- Time calculations must remain consistent when players leave and return.
- Administrative pause controls should be supported.
- Absence and missed-session behaviour must be handled without arbitrary punishment.

Game time should be configurable without rewriting gameplay systems.

---

## 11. AI and Knowledge Architecture

### 11.1 Gemini API

Gemini API is the selected AI provider for:

- Subjective brief evaluation.
- Salary negotiation conversations.
- Selected contextual NPC interactions.
- Player learning support.

### 11.2 Retrieval-Augmented Generation

The architecture should support RAG for retrieving relevant advertising, marketing and agency knowledge.

Initial knowledge sources should include:

- Curated advertising and marketing references.
- Approved educational material.
- Approved agency knowledge.
- Trusted external sources where appropriate.

PostgreSQL with pgvector is the proposed initial vector database.

### 11.3 Evaluation Separation

The system must separate:

- Knowledge retrieval.
- Brief evaluation.
- Conversational interactions.
- Authoritative game logic.

AI outputs must never directly control:

- Wallet balances.
- Salary records.
- Purchases.
- Deadlines.
- Promotion eligibility.
- Employment status.
- Other authoritative game states.

The backend validates and processes all consequential actions.

### 11.4 Consistency

Scored briefs must use fixed approved rubrics and reference snapshots for each brief version.

Unrestricted internet retrieval must not determine the score of a fixed brief at submission time.

External knowledge can support optional learning and explanation features.

---

## 12. Technical Architecture

### 12.1 Technology Stack

| Layer                   | Technology         |
| ----------------------- | ------------------ |
| Web application         | Next.js            |
| Application language    | TypeScript         |
| UI framework            | React              |
| Styling                 | Tailwind CSS       |
| 3D rendering            | Three.js           |
| React 3D integration    | React Three Fiber  |
| 3D utilities            | Drei               |
| Database                | PostgreSQL         |
| ORM                     | Prisma             |
| Authentication          | Supabase Auth      |
| AI                      | Gemini API         |
| Vector search           | pgvector           |
| Development environment | Google Antigravity |
| Version control         | GitHub             |

Blender may be used for asset preparation when necessary, but the initial workflow should avoid making it a compulsory tool.

### 12.2 Architecture Principles

- Separate the 3D environment from core gameplay logic.
- Keep authoritative game rules on the backend.
- Use the database as the persistent source of truth.
- Keep AI integrations behind application services.
- Keep game content configurable.
- Use reusable 3D models, animation clips and UI components.
- Avoid unnecessary complexity in the first playable version.

### 12.3 Proposed Application Areas

- Authentication and player accounts.
- Character management.
- Career and employment.
- Briefs and evaluation.
- Performance and progression.
- Wallet and transactions.
- Marketplace and inventory.
- Game clock and scheduling.
- Office environment and NPCs.
- AI and knowledge retrieval.
- Administration and content management.

---

## 13. Initial Release Scope

### Must Have

- Player account and saved progress.
- Character creation.
- Five career tracks.
- Entry-level recruitment.
- Basic 3D office environment.
- Player character and basic NPCs.
- Click-to-move interaction.
- General and role-specific briefs.
- Objective scoring.
- AI-assisted subjective evaluation.
- Career progression.
- Salary and virtual wallet.
- Promotion and salary negotiation.
- Basic marketplace and inventory.
- Game clock.
- Responsive desktop and mobile interface.

### Should Have

- Office speech bubbles and scheduled NPC movement.
- HR queries and performance recovery.
- Finance interactions.
- TGIT activities.
- Bonuses.
- Recurring expenses.
- Career history.
- More office interactions.
- Expanded lifestyle catalogue.

### Later Enhancements

- Advanced NPC personalities.
- Dynamic office gossip.
- Relationship systems.
- Event-driven office politics.
- Expanded office activities.
- Multiplayer and competitions.
- More complex lifestyle and social features.

---

## 14. Non-Functional Requirements

### Performance

- The 3D environment should run smoothly on supported desktop and mobile devices.
- Models, textures and animation files should be optimised.
- Common gameplay actions should feel responsive.

### Reliability

- Player progress must persist.
- Financial transactions must be consistent.
- Duplicate rewards must be prevented.
- Game time and deadlines must remain authoritative.

### Security

- Authentication must be protected.
- Server-side validation is required for consequential actions.
- API keys must not be exposed in the browser.
- Players must not be able to manipulate balances or scores through client-side changes.

### Maintainability

- Use modular application architecture.
- Keep roles, briefs, rewards, salary bands and items configurable.
- Document important game rules and technical decisions.

### Accessibility

- Provide readable text, adequate contrast and usable controls.
- Support touch and mouse interactions.
- Provide clear feedback for important actions.
