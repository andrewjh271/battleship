# Battleship: Orchestra Edition

A symphonic twist on the classic game of naval warfare.

Players command ensembles of orchestral instruments instead of naval fleets. As instruments are lost in battle, the accompanying score evolves to reflect the ever-diminishing ensemble. The AI blends probabilistic modeling with heuristics to emulate efficient human-like play while maintaining unpredictability.

---

## Game Settings

### Ensemble

- **Chamber Orchestra**: Cello, Violin, Clarinet, Flute, Horn

- **Large Orchestra**: Cello, Violin, Bassoon, Clarinet, Flute, Piccolo, Trombone, Trumpet, Horn

- **String Orchestra**: Double Bass, Cello, Viola, Violin

- **Woodwinds**: Bassoon, Clarinet, Oboe, Flute, Piccolo

- **Brass**: Tuba, Trombone, Trumpet, Horn

- **Percussion**: Bass Drum, Cymbals, Glockenspiel, Cabasa, Snare Drum

- **Harp**: Harp

### Board Size

- **Small**: 7×7

- **Standard**: 10×10

- **Large**: 13×13

### Opponent

- Play against a **human player** or the **AI**.

### Hits Per Turn

- Choose between 1 and 5 attacks per turn.

### Game Mode

- **Standard Mode**: Ships are revealed on the board when sunk.

- **Stealth Mode**: Sunk ships are *not* revealed on the board.

Note: The AI is never explicitly given the location of ships. However, it is immediately notified when a ship has been sunk (along with the name of the ship), allowing it to infer that the most recent hit was responsible for sinking that specific hit. The AI uses additional heuristics, outlined below, to manage ambiguous scenarios.

---

## Game Setup

Players can rotate instruments and drag them onto the board. Highlighted cells indicate valid or invalid placement.

Two auto-placement modes are available:

- **Pure Random**: Fully random ship placement.

- **Refined Random**: Avoids placing ships adjacent to each other, except when the board is small or the ensemble is large enough that meaningful separation is impossible. Even with sufficient space to separate all ships, a limited number of shared borders may be permitted to prevent overly predictable layouts. This mode also adds a slight edge bias, deviating from fully random distribution. This is the placement strategy used by the AI.

When an instrument is selected during setup, players can listen to an audio sample and view fictional RPG-style stats and trivia.

---

## AI Targeting Strategy

The AI's move-selection algorithm builds on the hunt/target model described in this excellent [DataGenetics article](http://www.datagenetics.com/blog/december32011/).

### Hunt Mode

When no unsunk ships have been partially revealed, the AI enters **hunt mode**, searching for a new target. For each unsunk ship, it simulates all valid placements on the board (excluding misses and known sunk ships). It tracks how often each cell is involved in a valid placement to build a probability density map, then attacks the highest-probability cell.

### Target Mode

When at least one ship has been hit but not sunk, the AI switches to **target mode**. It recalculates probability densities, giving exponentially increasing weight to ship placements that align with known hit cells. This allows the AI to focus its attacks intelligently and efficiently around previously discovered hits.

#### Resolving Hits

In some versions of Battleship, players must identify a ship each time it is hit; in others, its name is revealed only when it has been sunk. This game uses the latter rule, which adds complexity to AI decision-making. If a ship is sunk while other hits remain unresolved, the AI must deduce which hits belong to which ships.

When a ship is reported sunk, the AI scans unresolved hit cells and attempts to match the sunken ship’s size and shape to any valid configuration of those hits. If a single valid fit is found, the corresponding cells are marked as resolved. If multiple plausible fits exist, the ship is set aside in a pending state. As future ships are sunk and more hit cells are clarified, the AI re-evaluates pending ships to determine whether a unique fit has become identifiable.

#### Edge Biasing

The probability-based strategy outlined above systematically deprioritizes edge squares, especially on larger boards where they remain unsearched for many turns. To reduce this exploitable pattern, the AI occasionally boosts edge-cell weights in hunt mode, introducing variability and reducing predictable search patterns.

---

## Dynamic Music

Each ensemble is accompanied by a synthesized score featuring its instruments. As Player 1's instruments are sunk, their corresponding parts are removed from the audio, creating an evolving, increasingly sparse soundtrack.

---

**Created by Andrew Hayhurst**

---