const statsPanel = document.querySelector('.stats-panel');
const statsButton = document.querySelector('.inst-stats');
const statsButtonIcon = statsButton.querySelector('span')

function bass() {
  const instTitle = 'Bass';
  const instLink = 'https://www.youtube.com/watch?v=nUUVSxZ4ohI';

  const statsData = [
    { label: 'Strength', value: 90 },
    { label: 'Dexterity', value: 45 },
    { label: 'Intellect', value: 79 },
    { label: 'Charisma', value: 88 },
    { label: 'Vitality', value: 94 },
  ];

  const notesData = [
    'Tuned in fourths, unlike the other members of the string section, which are tuned in fifths',
    'Known as the contrabass, string bass, or double bass',
    'The term "double bass" comes from its original role of doubling the cello part an octave lower',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function cello() {
  const instTitle = 'Cello';
  const instLink = 'https://www.youtube.com/watch?v=RcqzPoMza7c';

  const statsData = [
    { label: 'Dexterity', value: 90 },
    { label: 'Intellect', value: 93 },
    { label: 'Charisma', value: 95 },
    { label: 'Stamina', value: 97 },
    { label: 'Balance', value: 94 },
  ];

  const notesData = [
    'Range closely mirrors that of the human voice, spanning bass to soprano',
    'Full name is violoncello, which translates to “little violone"',
    "Most people's favorite instrument",
    'The oldest surviving cello was crafted by Andrea Amati between 1538 and 1560'
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function viola() {
  const instTitle = 'Viola';
  const instLink = 'https://www.youtube.com/watch?v=XierDLeUiYg';

  const statsData = [
    { label: 'Properity', value: 82 },
    { label: 'Dexterity', value: 84 },
    { label: 'Intellect', value: 94 },
    { label: 'Charisma', value: 92 },
    { label: 'Stamina', value: 90 },
  ];

  const notesData = [
    'Often confused with the violin, but is a bit bigger and possesses a deeper, mellower sound',
    'Reads alto clef, unique among string instruments',
    'Unlike the standardized size of violins, violas lack a uniform full size. They typically range from 15 to 18 inches in body length',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function violin() {
  const instTitle = 'Violin';
  const instLink = 'https://www.youtube.com/watch?v=zgaQFLUdUL0';

  const statsData = [
    { label: 'Strength', value: 95 },
    { label: 'Dexterity', value: 97 },
    { label: 'Intellect', value: 87 },
    { label: 'Charisma', value: 77 },
    { label: 'Stamina', value: 90 },
  ];

  const notesData = [
    'The modern violin emerged in early 16th-century northern Italy.',
    'Plays the most notes of any instrument in the orchestra',
    'The most expensive violin is a 1715 Stradivarius, sold for $23 million in 2025',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function bassoon() {
  const instTitle = 'Bassoon';
  const instLink = 'https://www.youtube.com/watch?v=-kmy-hm3ai4';

  const statsData = [
    { label: 'Strength', value: 86 },
    { label: 'Guile', value: 84 },
    { label: 'Vitality', value: 80 },
    { label: 'Charisma', value: 91 },
    { label: 'Stamina', value: 72 },
  ];

  const notesData = [
    'Evolved from the dulcian in the 16th century, with its modern form developing in the early 18th century.',
    'Features a conical bore that doubles back on itself, contributing to its rich, warm tone and extensive range',
    'Traditionally made from maple wood',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function clarinet() {
  const instTitle = 'Clarinet';
  const instLink = 'https://www.youtube.com/watch?v=nENXs6n_ITI';
  const statsData = [
    { label: 'Prosperity', value: 82 },
    { label: 'Dexterity', value: 92 },
    { label: 'Intellect', value: 82 },
    { label: 'Charisma', value: 88 },
    { label: 'Luck', value: 91 },
  ];

  const notesData = [
    'The modern clarinet was developed around 1700 in Nuremberg, Germany',
    'Prominent in jazz, klezmer, and various folk traditions',
    'The clarinet family ranges from the high-pitched E♭ clarinet to the deep contrabass clarinet.',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function oboe() {
  const instTitle = 'Oboe';
  const instLink = 'https://www.youtube.com/watch?v=QNBsgfh4UMY';

  const statsData = [
    { label: 'Willpower', value: 90 },
    { label: 'Dexterity', value: 80 },
    { label: 'Intellect', value: 87 },
    { label: 'Charisma', value: 84 },
    { label: 'Quirkiness', value: 95 },
  ];

  const notesData = [
    'A professional oboist will spend approxiimately 30% of their life making reeds',
    'An orchestra tunes to an A played by the principal oboist',
    'The term "oboe" is derived from the French word "hautbois," meaning "high wood," reflecting its pitch and wooden construction',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function flute() {
  const instTitle = 'Flute';
  const instLink = 'https://www.youtube.com/watch?v=MTqOckjkkeE';

  const statsData = [
    { label: 'Strength', value: 85 },
    { label: 'Dexterity', value: 98 },
    { label: 'Intellect', value: 89 },
    { label: 'Balance', value: 92 },
    { label: 'Stealth', value: 90 },
  ];

  const notesData = [
    'Archaeological discoveries indicate flutes made from bird bones and mammoth ivory dating back over 30,000 years',
    'Throughout history, flutes have also been crafted from materials such as wood, bamboo, jade, glass, silver, and gold',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function piccolo() {
  const instTitle = 'Piccolo';
  const instLink = 'https://www.youtube.com/watch?v=ivQpiJos1Sw';

  const statsData = [
    { label: 'Strength', value: 82 },
    { label: 'Dexterity', value: 92 },
    { label: 'Intellect', value: 84 },
    { label: 'Charisma', value: 90 },
    { label: 'Stealth', value: 100 },
  ];

  const notesData = [
    'Highest-pitched instrument of the orchestra',
    'Evolved from military transverse flutes used during the Middle Ages',
    'Due to its piercing sound, the piccolo is a staple in military and marching bands',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function tuba() {
  const instTitle = 'Tuba';
  const instLink = 'https://www.youtube.com/watch?v=PzH4XAv9ZCQ';

  const statsData = [
    { label: 'Strength', value: 88 },
    { label: 'Dexterity', value: 51 },
    { label: 'Luck', value: 87 },
    { label: 'Prosperity', value: 90 },
    { label: 'Balance', value: 93 },
  ];

  const notesData = [
    'First appeared in the mid-19th century',
    'Largest and lowest-pitched instrument in the brass family',
    'Used in orchestras, marching bands, drum and bugle corps, and jazz bands ',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function trombone() {
  const instTitle = 'Trombone';
  const instLink = 'https://www.youtube.com/watch?v=9MNS9LKcDII';
  const statsData = [
    { label: 'Strength', value: 92 },
    { label: 'Dexterity', value: 64 },
    { label: 'Willpower', value: 85 },
    { label: 'Charisma', value: 88 },
    { label: 'Slidy-ness', value: 100 },
  ];
  const notesData = [
    'Employs a telescoping slide to change pitch, allowing for smooth glissandos and microtonal variations',
    'Used in a wide range of musical genres, including classical, jazz, funk, ska, and salsa',
  ];
  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function trumpet() {
  const instTitle = 'Trumpet';
  const instLink = 'https://www.youtube.com/watch?v=QcIp7K2UFgE';

  const statsData = [
    { label: 'Strength', value: 94 },
    { label: 'Volume', value: 97 },
    { label: 'Stamina', value: 70 },
    { label: 'Charisma', value: 88 },
    { label: 'Luck', value: 86 },
  ];

  const notesData = [
    'Dates back to at least 1500 BC — notably, a pair of trumpets was found in the tomb of Egyptian Pharaoh Tutankhamun.',
    'Modern trumpets are typically made of brass and may be finished with lacquer or silver plating',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function horn() {
  const instTitle = 'French Horn';
  const instLink = 'https://www.youtube.com/watch?v=cK0UFgnrIqY';

  const statsData = [
    { label: 'Strength', value: 83 },
    { label: 'Intellect', value: 89 },
    { label: 'Charisma', value: 92 },
    { label: 'Stamina', value: 65 },
    { label: 'Properity', value: 87 },
  ];

  const notesData = [
    "The horn's ancestors were used in hunting to signal and communicate",
    'If you were to uncoil a standard horn, it would reach halfway to the moon!',
    'Why is it called the French Horn? Nobody knows!',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function bassdrum() {
  const instTitle = 'Bass Drum';
  const instLink = 'https://youtu.be/-lJctvybAJ8?si=PeagTj475s9LsQU4&t=354';
  const statsData = [
    { label: 'Strength', value: 96 },
    { label: 'Dexterity', value: 40 },
    { label: 'Willpower', value: 94 },
    { label: 'Charisma', value: 70 },
    { label: 'Stealth', value: 25 },
  ];
  const notesData = [
    'Its low, booming sound serves as a rhythmic for the orchestra',
    'Traces its roots to the Turkish davul, used as early as the 14th century',
    'Became a central component of the modern drum kit in the early 1900s',
    'Comes in various sizes',
  ];
  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function cymbals() {
  const instTitle = 'Cymbals';
  const instLink = 'https://youtu.be/-lJctvybAJ8?si=G8lMEujNxs-7x1jf&t=649';

  const statsData = [
    { label: 'Strength', value: 98 },
    { label: 'Vitality', value: 93 },
    { label: 'Intellect', value: 81 },
    { label: 'Stamina', value: 90 },
    { label: 'Charisma', value: 84 },
  ];

  const notesData = [
    'Evidence has been discovered of cymbals in Assyrian military bands around 1100 BCE',
    'Come in various types, including crash, ride, hi-hat, splash, and china',
    'Most are made from bronze alloys, typically 80-90% copper and 10-20% tin',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function glockenspiel() {
  const instTitle = 'Glockenspiel';
  const instLink = 'https://youtu.be/-lJctvybAJ8?si=dTdxtj1MA-l9Qc3K&t=293';
  const statsData = [
    { label: 'Charisma', value: 94 },
    { label: 'Dexterity', value: 88 },
    { label: 'Intellect', value: 91 },
    { label: 'Finesse', value: 90 },
    { label: 'Silly name', value: 100 },
  ];

  const notesData = [
    'The term "glockenspiel" comes from German, meaning "bell play,"',
    'While similar to the xylophone, the glockenspiel uses metal bars, producing a bright, bell-like sound, whereas the xylophone has wooden bars, yielding a warmer tone',
  ];
  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function cabasa() {
  const instTitle = 'Cabasa';
  const instLink = 'https://www.youtube.com/watch?v=weMXR0xtEXA';

  const statsData = [
    { label: 'Charisma', value: 94 },
    { label: 'Stamina', value: 92 },
    { label: 'Intellect', value: 82 },
    { label: 'Prosperity', value: 87 },
    { label: 'Balance', value: 85 },
  ];

  const notesData = [
    'Invented in the 1960s by Martin Cohen, drawing inspiration from the traditional African shekere',
    'Commonly used in Latin jazz and bossa nova',
    'Consists of a cylindrical wooden or plastic body wrapped with loops of steel ball chains, creating a distinctive metallic, rattling sound',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function snare() {
  const instTitle = 'Snare Drum';
  const instLink = 'https://youtu.be/-lJctvybAJ8?si=0djRp8gH7EWfwSwf&t=537';

  const statsData = [
    { label: 'Strength', value: 90 },
    { label: 'Dexterity', value: 89 },
    { label: 'Willpower', value: 94 },
    { label: 'Charisma', value: 81 },
    { label: 'Stamina', value: 92 },
  ];

  const notesData = [
    'Evolved from the medieval tabor, a drum used in the 14th century to signal troops in battle',
    'Its sharp, staccato sound comes from metal or nylon wires — called snares — stretched across the bottom head',
    'A core component of modern drum kits',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}
function harp() {
  const instTitle = 'Harp';
  const instLink = 'https://www.youtube.com/watch?v=P2Xdb1ljd3g';

  const statsData = [
    { label: 'Dexterity', value: 84 },
    { label: 'Intellect', value: 88 },
    { label: 'Charisma', value: 94 },
    { label: 'Etherealness', value: 100 },
    { label: 'Luck', value: 95 },
  ];

  const notesData = [
    'Dates back to around 3000 BCE in ancient Mesopotamia, Egypt, and Persia',
    'Modern concert harps typically have 47 strings, while smaller folk harps may have between 22 and 38 strings',
    'National symbol of Ireland',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function populateStatsPanel(instTitle, instLink, statsData, notesData) {
  clearStatsPanel();

  // Create and populate the title section
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('title');

  const titleHeading = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = instLink;
  titleLink.target = '_blank';
  titleLink.textContent = instTitle;

  titleHeading.appendChild(titleLink);
  titleDiv.appendChild(titleHeading);
  statsPanel.appendChild(titleDiv);

  // Create and populate the stats panel
  const stats = document.createElement('div');
  stats.classList.add('stats', 'inst-details');

  const statsHeading = document.createElement('h6');
  statsHeading.textContent = 'Stats';
  stats.appendChild(statsHeading);

  const statsList = document.createElement('ul');

  statsData.forEach((stat) => {
    const listItem = document.createElement('li');

    const statsLabel = document.createElement('div');
    statsLabel.classList.add('stats-label');

    const labelSpan = document.createElement('span');
    labelSpan.textContent = `${stat.label}:`;
    statsLabel.appendChild(labelSpan);

    const valueSpan = document.createElement('span');
    valueSpan.textContent = stat.value;
    statsLabel.appendChild(valueSpan);

    listItem.appendChild(statsLabel);

    const statsBar = document.createElement('div');
    statsBar.classList.add('stats-bar');

    const statsBarInner = document.createElement('div');
    statsBarInner.classList.add('stats-bar-inner');
    statsBarInner.style.width = `${stat.value}%`;
    statsBar.appendChild(statsBarInner);

    listItem.appendChild(statsBar);
    statsList.appendChild(listItem);
  });

  stats.appendChild(statsList);
  statsPanel.appendChild(stats);

  // Create and populate the notes panel
  const notesPanel = document.createElement('div');
  notesPanel.classList.add('notes', 'inst-details');

  const notesHeading = document.createElement('h6');
  notesHeading.textContent = 'Notes';
  notesPanel.appendChild(notesHeading);

  const notesList = document.createElement('ul');

  notesData.forEach((note) => {
    const listItem = document.createElement('li');
    const noteMarker = document.createElement('span');
    noteMarker.textContent = '▴';
    listItem.appendChild(noteMarker);
    const noteText = document.createTextNode(` ${note}`);
    listItem.appendChild(noteText);
    notesList.appendChild(listItem);
  });

  notesPanel.appendChild(notesList);
  statsPanel.appendChild(notesPanel);
}

function clearStatsPanel() {
  statsPanel.innerHTML = '';
}

function enableStatsButton() {
  statsButton.disabled = false;
}

function resetStatsPanel() {
  clearStatsPanel();
  statsButton.disabled = true;
  statsButtonIcon.textContent = 'info';
  statsPanel.classList.remove('active');
}

statsButton.addEventListener('click', () => {
  if (statsButtonIcon.textContent === 'info') {
    statsButtonIcon.textContent = 'cancel';
    statsPanel.classList.add('active');
  } else {
    statsButtonIcon.textContent = 'info';
    statsPanel.classList.remove('active');
  }
});

export {
  bass,
  cello,
  viola,
  violin,
  bassoon,
  clarinet,
  oboe,
  flute,
  piccolo,
  tuba,
  trombone,
  trumpet,
  horn,
  bassdrum,
  cymbals,
  glockenspiel,
  cabasa,
  snare,
  harp,
  resetStatsPanel,
  enableStatsButton,
};
