<<<<<<< HEAD
# Snake vs Block – Internship Assignment

## 💻 Cocos Version
Cocos Creator 3.8.5

## ⚙️ Setup
1. Open project in Cocos Creator.
2. Run scene: `Game.scene`.
3. Build via: Project → Build → Web or Android.

## 🏗️ Architecture
- **SnakeController.ts** – Controls movement, growth, and trailing effect.
- **Block.ts** – Numbered bricks; reduce on hit.
- **Pickup.ts** – Adds length.
- **Spawner.ts** – Procedural generation with fairness check.
- **UIManager.ts** – Handles score, game over.
- **GameManager.ts** – Manages game states and score.
- **ObjectPool.ts** – Pools blocks and pickups for performance.

## ⚠️ Known Issues
- Rare block overlaps at high difficulty.
- Touch swipe sensitivity may vary by device.

## 🎨 Asset Credits
- Snake/Block sprites: Custom/Free Game Assets
- SFX: https://freesound.org/

## 🎯 Performance
- Uses object pooling.
- Runs at 60 FPS on mid-range devices (tested on TBD).
# snake-and-blocks
=======
# snake
>>>>>>> 77e5f84a3684dfdf1d769ab144fb4df74ceae49b
