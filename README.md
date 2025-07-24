# Battleship

Orchestra-themed battleship game.

------

#### Game Settings

##### Ensemble

- **Chamber Orchestra**: Cello, violin, clarinet, flute, horn

- **Large Orchestra**: Cello, violin, bassoon, clarinet, flute, piccolo, trombone, trumpet, horn

- **String Orchestra**: Double bass, cello, viola, violin

- **Woodwinds**: Bassoon, clarinet, oboe, flute, piccolo

- **Brass**: Tuba, trombone, trumpet, horn

- **Percussion**: Bass drum, cymbals, glockenspiel, cabasa, snare drum

- **Harp**: Harp

##### Board Size

- **Small**: 7 x 7

- **Standard**: 10 x 10

- **Large**: 13 x 13

##### Opponent

Play against computer or another player

##### **Hits per Turn**

Number of attacks on each turn (1-5)

##### Mode

**Standard**: When a player sinks a ship (i.e. instrument), it is revealed on the board

**Stealth**: Ships are not revealed when sunk

The computer operates from the same information in either mode: it is never explicitly told what squares contain what ships. It is immediately notified when a ship has been sunk, however, along with the name of that ship. Thus it is trivial to deduce that the square last hit contains the ship that was just sunk. The computer deduces more information as well, discussed in the section on engine strategies.

------

#### Game Setup

Users can rotate instruments and drag them to the board. Cells are highlighted to indicate valid and invalid placements. There are also two auto-placement options:

**Random Setup**: True random placement

**Enhanced Random Setup**: This algorithm will generally avoid placing ships adjacent to each other (sharing edges). A small number of shared edges are possible depending on the board size and ensemble.  Placing ships with shared edges has strategic disadvantages, especially on larger boards; however, some randomization is necessary to avoid becoming exploitable. This algorithm also places ships on edges more often than it would if purely random. This is the algorithm the computer uses when playing against a user.

During setup there are two additional features when an instrument is selected. An audio sample of the instrument can be played, and an information panel can be displayed which shows invented RPG-style stats along with a few instrument facts.

---

#### Move-Finding Algorithm

My starting point for writing the algorithm was this in-depth [article](http://www.datagenetics.com/blog/december32011/) from Data Genetics, particularly its distinction between the two modes "hunt" and "target" and its discussion of probability densities. A summary is as follows:

###### Hunt Mode

In this mode, there are currently no ships that have been hit but not sunk, and the algorithm is searching for a new ship. For every ship not yet sunk, the algorithm calculates every possible placement (avoiding misses and sunk ships), keeping track of how often each cell is represented. By summing this count for every ship, the algorithm creates a probability density of how likely it is that each cell contains a ship, and can choose the one with the highest value.

###### Target Mode

In this mode, there is at least one hit on a ship not yet sunk. Probability densities are again calculated, but this time heavily weighting ship placements that include hit(s) on ships not yet sunk. (I use the terminology resolved and unresolved hits.)

The article does not address how an algorithm would determine if a hit is resolved or unresolved. In some versions of the game, players call out the ship name whenever they announce it has been hit; in others, the ship is only called out when sunk. If operating with the former rules, the algorithm will always know exactly when a cell is resolved or unresolved because, for example, when a trombone is sunk it can mark all the cells that hit a trombone as sunk.

**Additional considerations:**

There are versions of the game where for every hit, the player calls out both that a ship has been hit and which ship it was; in others, the specific ship is only revealed when it has been sunk. I chose to implement the latter, which presents some additional challenges for the algorithm.

If the computer finds one ship at a time, it is trivial to determine what hit squares should be marked as sunk when a ship is announced sunk. It is possible, however, that the computer will hit a new ship while there already exists an unsunk ship that has been hit. In this case, when one of the ships is sunk, the computer cannot as easily determine which squares to mark as sunk. The algorithm resolves this by trying to fit sunk instruments whose squares are not yet determined into hit squares that are not yet resolved as sunk.

The algorithm prefers to target squares that could include the highest number of squares already marked as hits. This is intuitive for a human (i.e. seeing that a 5x2 cello is most likely being outlined by hits, rather than a cluster of smaller instruments), but not as trivial for an algorithm. It is achieved by heavily weighting potential ship placements that include hit squares. Each additional hit square adds weight on an exponential scale.

If the algorithm purely follows the probability distribution method outlined in the article, it becomes easliy exploitable because it won't search on the edges for a very long time. To address this, it will sometimes randomly weight edge squares higher when choosing moves in hunt mode.

#### Music

Each ensemble has an accompanying score that includes synthesized versions of all the instruments in that ensemble. As Player 1's instruments are sunk, they are removed from the audio.



-Andrew Hayhurst