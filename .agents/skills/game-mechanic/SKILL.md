
description: Defines and implements the gameplay rules, systems, progression, rewards and player interactions for X3M Ideas Agency Life Simulation. Use when building, modifying or reviewing any game mechanic.
---

# Game Mechanics Skill

## 1. Project Context

Build gameplay around the X3M Ideas agency-life simulation.

The game combines:
- Career and employment progression.
- General and department-specific briefs.
- Performance evaluation and rewards.
- Salary negotiation and financial management.
- Workplace interactions and relationships.
- HR processes and disciplinary outcomes.
- Office events and lifestyle progression.

Use the PRD and GDD as the primary references. Do not introduce mechanics that conflict with them.

## 2. Core Gameplay Rules

- Every player starts at entry level.
- Players select one of the available career tracks.
- Players progress by completing challenges and meeting career requirements.
- General briefs are available to all employees.
- Department-specific briefs are assigned according to the player's career track.
- Completed activities must produce clear outcomes.
- Career progression must be earned through defined requirements.
- Missing a game session must not automatically result in severe penalties.

## 3. Briefs and Challenges

Every brief must have:
- Title and instructions.
- Brief category.
- Applicable department, where relevant.
- Difficulty level.
- Assignment time.
- Submission deadline.
- Expected answer format.
- Evaluation method.
- Scoring rubric or correct answers.
- Completion status.
- Configured rewards and consequences.

Support objective and subjective evaluation:

**Objective questions**
- Use predefined correct answers.
- Calculate scores deterministically.
- Do not use AI to determine multiple-choice correctness.

**Subjective questions**
- Use Gemini API to evaluate responses against an approved rubric.
- Return a score, feedback and explanation.
- Validate the evaluation output before recording it.
- Do not allow AI to independently change player performance or employment records.

Each brief version must retain its evaluation criteria to ensure consistent scoring.

## 4. Performance and Rewards

Track player performance through completed briefs and other approved game activities.

Performance records may include:
- Brief scores.
- Completion rates.
- Submission timeliness.
- Experience points.
- Performance bonuses.
- Recognition and achievements.

Rewards must be configurable and awarded through backend game services.

Do not award points, bonuses or achievements solely because an AI response suggests doing so.

## 5. Career Progression

Each department must have a configurable career hierarchy.

Career progression should consider:
- Current designation.
- Experience.
- Performance history.
- Completed challenges.
- Promotion requirements.
- Promotion assessment, where applicable.

Players must meet the configured requirements before becoming eligible for promotion.

Promotion should:
1. Confirm eligibility.
2. Present the promotion opportunity.
3. Allow salary negotiation within the new level's salary band.
4. Update the player's employment record.
5. Record the new designation and salary.
6. Apply any associated rewards or unlocks.

Use Deputy Creative Director where that designation is required.

Do not hardcode career titles or salary bands into individual UI components.

## 6. Recruitment and Salary Negotiation

Recruitment follows this sequence:

1. Character creation.
2. Department selection.
3. Recruitment interaction.
4. Initial salary offer.
5. Salary negotiation.
6. Employment confirmation.
7. Onboarding.

Salary negotiation may use conversational AI.

However:
- Each role and level must have a configured salary range.
- The final salary must remain within that range.
- The server validates and records the agreed salary.
- AI cannot directly modify salary records.

Apply the same rules to promotion-related salary negotiations.

## 7. Game Time and Scheduling

Use the server-controlled game clock.

The initial time acceleration is:

- One real minute equals two in-game minutes.
- Eight in-game working hours equal four real hours.
- A complete in-game calendar day equals twelve real hours.
- Thirty in-game days equal fifteen real days.

The game clock must determine:
- Brief assignment times.
- Submission deadlines.
- Salary payment dates.
- Office schedules.
- NPC routines.
- TGIT events.
- Recurring expenses.

Do not use the player's browser clock as the authoritative game clock.

Support offline progression and configurable absence protection.

Deadline behaviour outside working hours, on weekends and during holidays must follow the configured game calendar.

## 8. Deadlines and HR Consequences

Missing a deadline may trigger:
- Performance deductions.
- Informal warnings.
- HR queries.
- Probation.
- Termination.

Consequences must follow explicit, configurable rules.

Before applying a penalty:
- Check the brief's deadline.
- Check any applicable grace period.
- Check absence protection.
- Confirm the brief was properly assigned.
- Verify the player's submission status.

Do not automatically terminate a player for a single missed brief.

Termination must preserve the player's historical progress and allow for possible re-employment.

## 9. Virtual Economy

All financial activities must be processed through backend game services.

Support:
- Salary payments.
- Performance bonuses.
- Recurring expenses.
- Purchases.
- Savings.
- Asset ownership.
- Net worth calculations.

Every transaction must:
- Validate the player's available balance.
- Record the transaction type and amount.
- Update the relevant financial records.
- Prevent duplicate payments or purchases.
- Maintain a transaction history.

Never allow the client interface or AI to directly modify a player's balance.

## 10. NPC and Workplace Interactions

NPCs should initially operate through predefined schedules, behaviours and dialogue libraries.

Support:
- Office movement.
- Department visits.
- Desk interactions.
- Contextual conversations.
- Speech bubbles.
- Office announcements.
- Selected relationship interactions.

Use AI only for selected contextual conversations.

Do not use AI calls for routine movement, basic animations or predefined dialogue.

NPC interactions must not expose confidential agency information or private employee data.

## 11. Relationships and Office Events

Players may build relationships with colleagues through interactions and participation.

Keep relationship tracking simple in the initial implementation.

Relationships may influence:
- Available conversations.
- Social invitations.
- Selected workplace interactions.
- Recognition and optional rewards.

TGIT must occur every in-game Thursday.

Participation is optional. Activities may include trivia, games, departmental competitions and social interactions.

Rewards may include relationship points, engagement points, badges or small virtual rewards.

## 12. Achievements and Unlocks

Achievements should be triggered by clearly defined game conditions.

Examples:
- First Day at X3M.
- First Brief Completed.
- First Salary Received.
- First Promotion.
- Department Star.
- TGIT Regular.
- Financial Milestone.
- Office Socialite.

Record achievement completion to prevent duplicate rewards.

## 13. Implementation Rules

When implementing a mechanic:

1. Identify the relevant PRD and GDD requirement.
2. Define the player action and expected outcome.
3. Define the rules, conditions and restrictions.
4. Identify the required data.
5. Implement authoritative logic on the server.
6. Connect the mechanic to the relevant interface or 3D interaction.
7. Test normal, invalid and edge-case scenarios.

Keep game rules separate from UI components.

Make configurable values editable without changing application logic wherever practical.

Do not implement mechanics that have not been defined or approved.

## 14. Testing Requirements

Test each mechanic for:
- Valid player actions.
- Invalid actions.
- Boundary conditions.
- Duplicate submissions or transactions.
- Deadline handling.
- Offline progression.
- Correct rewards and penalties.
- Consistent saved game state.

Prioritise testing salary, purchases, deadlines, promotions and employment status because they directly affect player progression.

**Primary rule:** Every game mechanic must have clear rules, predictable outcomes and server-validated results. The game should reward engagement and progression without becoming unnecessarily punitive or complicated.

## Office Units and Department Interactions

The office environment must include:
- BU1
- BU2
- BU3
- Finance
- HR
Each office unit should have:
- A designated office area.
- Assigned employees and NPCs.
- Relevant workplace interactions.
- Access to applicable office activities and conversations.

Players should be able to navigate between office units and interact with colleagues based on their role, location and permissions.
