# X3M Ideas: Agency Life Simulation

## Game Design Document (GDD)

**Product:** X3M Ideas: Agency Life Simulation
**Genre:** Corporate life simulation
**Platform:** Responsive web game
**Visual style:** Stylised low-poly 3D
**Experience:** Hybrid 3D environment and UI-based gameplay

---

## 1. Game Concept

The player enters X3M Ideas as a new employee and experiences the journey of building a career in a Nigerian creative advertising agency.

The player creates a character, chooses a career track, navigates the office, completes briefs, interacts with colleagues, earns money, receives promotions and builds a lifestyle.

The game should balance workplace simulation, career progression, social interaction and aspirational life simulation.

The experience should be recognisably Nigerian, entertaining and accessible to people who do not work in advertising.

---

## 2. Core Gameplay Loop

**Explore the office → receive briefs → complete challenges → earn rewards → improve performance → progress in your career → earn more → build your lifestyle → participate in office activities → repeat.**

The loop should give players both short-term activities and longer-term goals.

### Short-term goals

- Complete a brief.
- Earn a reward.
- Interact with a colleague.
- Visit an office location.
- Participate in an activity.

### Medium-term goals

- Improve performance.
- Receive a salary payment.
- Qualify for promotion.
- Purchase a lifestyle item.
- Build workplace relationships.

### Long-term goals

- Advance through career levels.
- Build financial assets.
- Unlock lifestyle opportunities.
- Establish a reputation within the simulated agency.

---

## 3. Player Character

### 3.1 Character Creation

Players create an employee character before entering the agency.

Character creation should support:

- Character name.
- Gender presentation options.
- Skin tone options.
- Hairstyle options.
- Clothing options.
- Other manageable appearance customisation.

The initial character editor should remain simple. It should not become a complex avatar-building project.

### 3.2 Player Identity

The player's identity includes:

- Character appearance.
- Employee name.
- Career track.
- Current role.
- Office unit.
- Career level.
- Performance status.
- Virtual wallet.
- Owned lifestyle items.

### 3.3 Character Animation

The player character should support the following core animation states:

- Idle.
- Walking.
- Sitting.
- Typing.
- Talking.
- Other interaction animations as the game expands.

Animations should be reusable across compatible character rigs.

---

## 4. Career Tracks and Progression

### 4.1 Available Career Tracks

The game starts with five career tracks:

1. Copywriting
2. Art Direction
3. Brand Strategy
4. Digital Strategy
5. Brand Management

Each career track has distinct briefs and professional scenarios.

### 4.2 Entry-Level Recruitment

Every player starts at entry level.

The recruitment experience should introduce:

- The selected career track.
- The employee's initial role.
- The starting salary range.
- The player's first general brief.
- The player's first role-specific brief.

### 4.3 Promotion

Promotion is based on configurable gameplay requirements, including:

- Performance.
- Completed briefs.
- Experience.
- Other defined progression conditions.

Promotion should trigger a visible game event.

The player receives:

- Updated career title.
- New salary range.
- Salary negotiation interaction.
- Updated career history.
- Access to any newly unlocked content.

### 4.4 Salary Negotiation

Salary negotiation should feel conversational.

The AI acts as the simulated recruiter or manager.

The player can make a salary request and respond to negotiation prompts.

The backend must enforce the salary band for the relevant role and level.

AI cannot approve a salary outside the configured range or directly update the player's wallet.

---

## 5. Brief and Challenge Mechanics

### 5.1 Brief Categories

**General Briefs**

These are available to all players. They test general knowledge of:

- Advertising.
- Marketing.
- Communication.
- Consumer behaviour.
- Media.
- Workplace situations.
- Industry knowledge.

**Role-Specific Briefs**

These are tied to the player's career track.

Examples:

| Career track     | Example challenge areas                                       |
| ---------------- | ------------------------------------------------------------- |
| Copywriting      | Headlines, messaging, copy choices, tone of voice             |
| Art Direction    | Visual direction, creative interpretation, design decisions   |
| Brand Strategy   | Consumer insight, positioning, brand decisions                |
| Digital Strategy | Audience selection, channels, digital measurement             |
| Brand Management | Brand coordination, campaign decisions, stakeholder scenarios |

These are challenge categories, not actual client assignments.

### 5.2 Brief Formats

- Multiple-choice questions.
- Knowledge quizzes.
- Scenario-based decisions.
- Short written responses.
- Constrained creative challenges.

### 5.3 Brief Structure

Each brief should contain:

- Title.
- Introduction.
- Instructions.
- Difficulty.
- Career track or general category.
- Time limit or deadline.
- Submission format.
- Reward.
- Scoring criteria.

### 5.4 Evaluation Rules

Objective questions are scored using fixed answers.

Subjective responses are evaluated by Gemini against approved rubrics.

The evaluation should provide:

- Score.
- Feedback.
- Explanation.
- Strengths.
- Improvement areas.

The AI should evaluate the response, not decide the player's authoritative game state.

### 5.5 Brief Outcomes

Possible outcomes include:

- Excellent performance.
- Successful completion.
- Partial success.
- Unsuccessful submission.
- Missed deadline.

Each outcome should have predefined effects on rewards and performance.

---

## 6. Performance and Employment Mechanics

### 6.1 Performance Status

Performance reflects how the player is doing in their simulated role.

It is influenced by:

- Brief outcomes.
- Missed deadlines.
- Successful challenges.
- Recovery activities.
- Other configured events.

### 6.2 HR Queries and Warnings

Repeated poor performance can trigger HR interactions.

The progression may include:

1. Initial query.
2. Formal warning.
3. Performance review.
4. Termination.

Exact thresholds should be configurable.

### 6.3 Performance Recovery

Players should have opportunities to recover from poor performance.

Recovery can come from:

- Completing briefs successfully.
- Completing special recovery challenges.
- Other approved game activities.

### 6.4 Termination and Re-employment

Termination changes the player's current employment status.

It does not erase:

- Character identity.
- Career history.
- Wallet history.
- Previous achievements.
- Owned items.

The game should support a re-employment or career restart mechanic.

---

## 7. Game Clock and Calendar

### 7.1 Time Model

The game runs on an accelerated clock.

The agreed conversion is:

| Real time  | In-game time         |
| ---------- | -------------------- |
| 1 minute   | 2 minutes            |
| 30 minutes | 1 hour               |
| 4 hours    | 8-hour working shift |
| 12 hours   | 24-hour calendar day |
| 3.5 days   | 7-day game week      |
| 15 days    | 30-day game month    |
| 182.5 days | 365-day game year    |

An example working day runs from 9 AM to 5 PM in-game.

### 7.2 Calendar

The calendar supports:

- Working days.
- Weekends.
- Office hours.
- Salary dates.
- Brief deadlines.
- Special events.
- TGIT.

The game clock continues outside office hours and weekends.

### 7.3 Salary Schedule

Salary is paid according to the configured in-game salary cycle.

The agreed default is a 30-day in-game month, equivalent to approximately 15 real days.

### 7.4 Time Management

The server controls the clock.

The game must support:

- Offline catch-up.
- Deadline validation.
- Salary scheduling.
- Event scheduling.
- Administrative pause controls.

Absence should not create arbitrary or unfair punishment.

---

## 8. Office Environment

### 8.1 Environment Design

The game uses a stylised low-poly 3D representation of the X3M Ideas office.

The environment should be recognisable as a creative agency while remaining optimised for web and mobile performance.

The office should not be designed as an unrestricted open world.

### 8.2 Office Layout

The environment should include:

- Reception.
- BU1.
- BU2.
- BU3.
- Finance.
- HR.
- Creative and strategy work areas.
- Digital and brand management work areas.
- Meeting rooms.
- Pantry.
- Management offices.

Final office placement and layout should be based on approved reference materials.

### 8.3 Organisational Structure

BU1, BU2 and BU3 are Business Units.

Finance and HR are functional departments.

These are office assignments, not player career tracks.

A player belongs to a career track and is assigned to an organisational unit.

The game must support different career tracks within the same Business Unit.

### 8.4 Office Navigation

Players navigate through the office using click-to-move.

The player can:

- Click a location to move there.
- Click an interactive object to approach it.
- Click a colleague to initiate an interaction.
- Select a desk or workstation to perform an activity.

Movement should respect office boundaries and basic navigation constraints.

### 8.5 Camera

The game requires a camera system that keeps the player and relevant office interactions visible.

The exact camera presentation remains an open design decision and should be tested against the 3D office prototype before being finalised.

---

## 9. NPCs and Office Behaviour

### 9.1 NPC Roles

NPCs represent colleagues and other agency personnel.

NPCs should be assigned:

- Names.
- Career tracks or functions.
- Office units.
- Work locations.
- Basic behaviour patterns.
- Dialogue libraries.

### 9.2 NPC Movement

NPCs can:

- Walk between office areas.
- Visit colleagues.
- Move to meeting rooms.
- Visit the pantry.
- Sit at desks.
- Perform work animations.

### 9.3 NPC Dialogue

NPCs should display occasional speech bubbles containing:

- Office banter.
- Work-related comments.
- General observations.
- Humorous remarks.
- Event-related dialogue.

Initial NPC dialogue should use predefined libraries and scheduled triggers.

### 9.4 NPC Interaction

Players should be able to click on colleagues to initiate interactions.

Possible interactions include:

- Greeting.
- Conversation.
- Work-related discussion.
- Relationship-building.
- Special event interaction.

More advanced contextual AI conversations can be introduced later.

### 9.5 Office Gossip and Relationships

Later versions can introduce:

- Colleague relationships.
- Office gossip.
- Personality traits.
- Event-driven conversations.
- Office politics.
- Relationship-based interactions.

These features should not be required for the first playable version.

---

## 10. Office Events: TGIT

TGIT means Thank God It's Thursday.

It takes place every in-game Thursday.

TGIT should give players an opportunity to step away from normal work activities and participate in office entertainment.

Possible activities include:

- Social interactions.
- Games.
- Office challenges.
- Special briefs.
- Group activities.
- Rewards.

The event should have its own dialogue, visual treatment and activity prompts.

The specific activities and reward structure should remain configurable.

---

## 11. Virtual Economy and Lifestyle

### 11.1 Salary

Players receive virtual salaries based on their career level and salary negotiation outcome.

### 11.2 Bonuses

Bonuses may be awarded for:

- Excellent brief performance.
- Special challenges.
- Streaks.
- Office events.
- Other configured achievements.

### 11.3 Wallet

The wallet displays:

- Available balance.
- Salary received.
- Rewards.
- Bonuses.
- Purchases.
- Expenses.
- Transaction history.

### 11.4 Expenses

The game may introduce recurring expenses such as:

- Accommodation.
- Transport.
- Other lifestyle costs.

Expenses must be predictable and visible.

### 11.5 Marketplace

The marketplace allows players to purchase:

- Clothing.
- Phones.
- Gadgets.
- Accommodation.
- Vehicles.
- Furniture.
- Other lifestyle items.

Items can be unlocked through salary, career progression or other configured conditions.

### 11.6 Ownership

The player's inventory records owned items.

Purchases must update the wallet and inventory together.

The economy uses virtual currency only.

---

## 12. Interface and Navigation

### 12.1 Experience Structure

The game combines a 3D office environment with interface panels.

The 3D environment provides immersion and physical interactions.

UI panels provide access to detailed gameplay systems.

### 12.2 Core Navigation

The game should provide access to:

- Home / Dashboard.
- Office.
- Briefs.
- Career.
- Wallet.
- Marketplace.
- Inventory.
- Profile.
- Notifications.

The interface should make important player information easy to access without overwhelming the 3D environment.

### 12.3 Player HUD

The HUD should communicate:

- Current time and date.
- Player name.
- Career role.
- Performance status.
- Virtual balance.
- Active brief or task notifications.

### 12.4 Interface Style

The interface should be professional, clear and playful.

Use X3M Ideas' existing brand identity as the foundation.

Official brand colours, typography and logo specifications must be verified against approved brand assets. Do not treat concept colours or generated brand boards as official specifications.

### 12.5 Responsive Design

Desktop and mobile have equal priority.

The interface must adapt to:

- Desktop screens.
- Tablets.
- Mobile phones.