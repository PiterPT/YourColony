# Prompt — YourColony: Império dos Insetos

## Role

Act as a Senior Front-End Game Engineer specialized in browser-based strategy games, simulation systems, emergent AI, resource management and colony simulation.

---

## Context

- **Project Name:** YourColony — Império dos Insetos
- **Platform:** Web Browser / Desktop
- **Tech Stack:** HTML5, CSS3, Vanilla JavaScript ES6+
- **Rendering:** HTML5 Canvas 2D
- **Architecture:** Modular JavaScript, data-driven game systems, separation between simulation, rendering, input and UI
- **External Dependencies:** Zero
- **Frameworks:** None
- **Game Engine:** None
- **Persistence:** localStorage
- **Language:** Portuguese (Portugal)
- **Visual Direction:** dark underground ant-farm aesthetic, organic biological shapes, earthy colors, subtle animations and readable strategy-game UI
- **Performance Target:** stable gameplay with hundreds of simulated insects
- **Browser Compatibility:** modern Chrome, Firefox, Edge and Safari

### Security Constraints

- No external network requests.
- No `eval()`.
- No dynamic script injection.
- No arbitrary HTML injection.
- Validate all `localStorage` data before loading it.
- Use `textContent` instead of `innerHTML` for dynamic game data.
- Do not trust persisted state.
- Avoid unnecessary global variables.

### Code Quality

- Use strict JavaScript practices.
- Use descriptive naming.
- Avoid unnecessary abstractions.
- Avoid premature optimization.
- Keep systems modular.
- Keep simulation state independent from DOM state.
- Prefer composition and small systems.
- Use classes only where they genuinely improve the architecture.

---

# Objective

Create a **complete, playable browser game MVP** based on the concept of **YourColony — Império dos Insetos**.

The game is a colony simulation and real-time strategy game about insects, evolution and biological organization.

The player starts with a primitive underground ant colony and must manage:

- Biomass / Protein
- Sugars / Carbohydrates
- Structural Materials
- Water / Humidity
- Temperature
- Population
- Queen health
- Reproduction
- Pheromone networks
- Territory

The long-term objective is to evolve from a primitive ant colony into a biological empire capable of controlling multiple insect species.

---

# Core Game Fantasy

The player should **NOT directly control individual insects**.

Instead, the player controls the colony through:

- Pheromone trails
- Construction priorities
- Resource priorities
- Caste allocation
- Evolutionary adaptations
- Territory management

The insects should appear to make decisions autonomously based on colony priorities and environmental conditions.

The game should feel like a **colony simulation**, not a traditional RTS.

The player gives strategic instructions.

The colony executes them autonomously.

---

# MVP Scope

The first playable version must focus exclusively on the **Ant Colony**.

Do not attempt to fully implement Bees, Termites or Wasps in the MVP.

However, the architecture must make it possible to add them later without rewriting the core simulation.

The MVP must include:

1. Underground destructible grid.
2. Ant colony.
3. Queen.
4. Worker ants.
5. Soldier ants.
6. Eggs → larvae → pupae → workers lifecycle.
7. Food/resource nodes on the surface.
8. Resource transportation.
9. Pheromone trails.
10. Basic construction and excavation.
11. Basic predators.
12. Colony population management.
13. Temperature simulation.
14. Humidity simulation.
15. Basic evolution tree.
16. Day/night cycle.
17. Pause/resume.
18. Game speed controls.
19. Save/load using `localStorage`.
20. Victory condition.
21. Defeat condition.
22. Responsive game UI.

---

# Game View

Use a Canvas-based **ant-farm side/cutaway perspective**.

The interface should contain:

- Main simulation canvas
- Top resource bar
- Colony population indicator
- Queen health indicator
- Current day/time
- Game speed controls
- Pause button
- Build menu
- Pheromone tools
- Evolution button
- Event/notification panel
- Selected entity information panel

Suggested layout:

```text
┌──────────────────────────────────────────────────────┐
│ Resources │ Population │ Queen │ Day │ Speed │ Pause │
├──────────────────────────────────────────────────────┤
│                                                      │
│                                                      │
│                  GAME CANVAS                         │
│                                                      │
│                                                      │
├──────────────────────────────────────────────────────┤
│ Build │ Pheromones │ Evolution │ Colony Information │
└──────────────────────────────────────────────────────┘