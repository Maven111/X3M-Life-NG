---

# UI/UX Development Skill

## 1. Project Context

Design and build the user experience for X3M Ideas Agency Life Simulation.

The experience combines:

- A low-poly 3D office environment.
- Interactive player characters and NPCs.
- Structured interface panels for game activities.
- Career, financial and lifestyle management systems.

Use the PRD, GDD and approved design references as the primary sources of truth.

## 2. Visual Direction

The interface must feel professional, modern and intuitive, with playful elements that reinforce the simulation.

Follow these principles:

- Use X3M Ideas' existing brand identity.
- Adapt the agency's colours, typography and logo for the game.
- Maintain a consistent visual language across all screens.
- Use playful elements for achievements, interactions, animations and game feedback.
- Keep information clear and easy to understand.
- Avoid childish visuals, excessive decoration and generic dashboard templates.

Do not invent brand colours or typography when official assets or guidelines are available.

## 3. Brand Application

Use the supplied X3M Ideas logo and office references.

The visual palette should be derived from approved brand assets.

Apply:

- Primary brand colours to important interface elements.
- Orange-to-red gradient selectively for emphasis.
- Neutral surfaces for readability and information hierarchy.
- Consistent typography across headings, labels and body text.
- The official logo in appropriate branded locations.

Do not distort the logo, alter its proportions or introduce unapproved brand variations.

## 4. Interface Structure and Navigation

Use a layered navigation system rather than presenting every feature in one flat menu.

Organise the interface around:

**Primary navigation**

- Home / Overview
- Office
- Career
- Briefs
- Messages
- Wallet / Finance
- Inventory / Lifestyle
- Profile

**Contextual navigation**

Display relevant actions based on the player's current activity or selected object.

Examples:

- Selecting the player's desk opens the work dashboard.
- Selecting a colleague opens interaction options.
- Selecting HR opens HR communications and employment activities.
- Selecting Finance opens relevant financial interactions.
- Selecting the noticeboard displays office announcements.
- Selecting a meeting room opens its available activities.

Keep navigation predictable and ensure players can easily return to the office environment.

## 5. 3D Office Experience

The office is the primary game environment.

Use Three.js, React Three Fiber and Drei for the 3D experience.

The office must:

- Use a stylised low-poly visual direction.
- Reflect X3M Ideas' actual identity and approved office references.
- Represent the defined office units: BU1, BU2, BU3, Finance and HR.
- Include desks, meeting rooms, pantry, reception and other approved spaces.
- Support interactive objects and NPCs.
- Remain optimised for desktop and mobile devices.

Avoid unnecessary visual complexity that affects performance or usability.

## 6. Player Movement and Interaction

Use click-to-move as the primary movement system.

Players should be able to:

- Click a destination to move their character.
- Click interactive objects to trigger actions.
- Select colleagues to initiate conversations.
- Interact with office areas and objects.
- Receive clear visual feedback when an object is interactive.

Interactive objects must have recognisable visual cues.

Movement and interaction should feel responsive and natural. Prevent inaccessible destinations, overlapping interactions and unintended character movement.

## 7. Game Interface and HUD

Keep important player information accessible without overcrowding the 3D environment.

The interface should support:

- Player name and designation.
- Current department or business unit.
- Salary and wallet balance.
- Performance indicators.
- Active briefs and deadlines.
- Notifications and messages.
- Current game date and time.

Use expandable panels, contextual overlays and dedicated screens where appropriate.

Do not display every player statistic permanently on the screen.

## 8. Screen Design

Maintain consistent layouts and interaction patterns across:

- Login and registration.
- Character creation.
- Recruitment and salary negotiation.
- Office environment.
- Briefs and submissions.
- Career progression.
- Performance dashboard.
- HR communications.
- Wallet and financial records.
- Inventory and lifestyle.
- Player profile and settings.
- Achievements and office events.

Each screen must have a clear purpose, visual hierarchy and primary action.

## 9. Responsive Design

Desktop and mobile have equal design priority.

Desktop:

- Make effective use of screen space.
- Support clear navigation and visible information panels.
- Optimise 3D movement and interaction for mouse input.

Mobile:

- Adapt navigation for touch interaction.
- Provide accessible tap targets.
- Reorganise panels for smaller screens.
- Prevent overlapping controls.
- Optimise 3D rendering and movement for mobile performance.

Use responsive layouts rather than simply scaling desktop components down.

Test layouts at different screen widths and orientations.

## 10. Animation and Feedback

Use animation to make the experience feel alive.

Prioritise:

- Character movement.
- NPC movement and idle animations.
- Object interaction feedback.
- Panel transitions.
- Notifications.
- Achievements and rewards.
- Office events and social interactions.

Animations must communicate actions or improve immersion.

Keep transitions smooth and purposeful. Provide reduced-motion alternatives where practical.

## 11. Design System and Components

Build reusable interface components.

Maintain consistent:

- Colours.
- Typography.
- Spacing.
- Borders and radii.
- Buttons and inputs.
- Cards and panels.
- Icons.
- Notifications.
- Modal behaviour.
- Interaction states.

## 12. Usability and Accessibility

Ensure:

- Navigation is easy to understand.
- Important information is readable.
- Interactive elements have clear states.
- Text has sufficient contrast.
- Controls are accessible by keyboard where applicable.
- Touch targets are suitable for mobile.
- Loading, empty, error and success states are designed.
- Players receive feedback after important actions.

Do not rely on colour alone to communicate status.

## 13. Implementation Rules

When developing a screen or interface:

1. Review the relevant PRD and GDD requirements.
2. Inspect the approved design references and brand assets.
3. Identify the screen's purpose and user actions.
4. Follow the established design system.
5. Reuse existing components.
6. Implement responsive behaviour.
7. Connect interactions to the appropriate game systems.
8. Test on desktop and mobile.
9. Review visual consistency with existing screens.

Do not create unrelated design patterns or introduce new visual styles without justification.

## 14. Testing Requirements

Check:

- Layout consistency.
- Navigation behaviour.
- Interactive states.
- Click-to-move behaviour.
- Object interactions.
- Panel responsiveness.
- Mobile touch interactions.
- Text readability.
- Animation performance.
- 3D rendering performance.
- Loading and error states.

**Primary rule:** Every interface must make the game easier to understand and play. Maintain X3M Ideas' identity while ensuring the 3D office, game systems and interface feel like one coherent experience.
