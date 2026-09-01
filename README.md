# Monster Garden 🌱

Pixel Action RPG + Dark Fantasy + Monster Farming.

Core loop:

**Explore → Fight → Monster becomes Seed → Plant → Grow → Harvest → Eat → Gain Trait/Skill → Explore farther.**

## Current prototype controls

- `WASD` / Arrow keys: move
- `J` / `Z`: normal attack
- `Space`: dodge
- `K` / `X`: monster skill
- `E`: garden interaction
- `I`: inventory
- `Q`: eat selected monster food
- `1-3`: choose skill
- `F5`: save
- `F9`: load

## Code structure

- `index.html`: page and script loading order
- `style.css`: UI styling
- `data.js`: monsters, elements, traits, skills and kingdoms
- `game.js`: main game loop, movement and combat
- `garden.js`: planting, growth and harvesting
- `inventory.js`: seeds, food, traits and inventory UI
- `world.js`: safe areas and resting helpers
- `systems.js`: reusable player trait/stat helpers
- `storage.js`: local save/load
- `save-utils.js`: save-version migration helpers

This is an evolving prototype. Art assets and larger world content will be added separately.
