// Every joke Calude tells lives here. Edit freely, then run `npm run build`.
// Placeholders: {count} = lifetime typo count, {n} = countdown number,
// {word} = a word pulled from what the user typed, {request} = everything they typed.

export default {
  // Odds that a launch hits the jackpot (the full rude replica).
  jackpotOdds: 1 / 20,

  banner: {
    title: '✻ Welcome to Calude Code!',
    subtitle: "Claude's less-talented cousin. Research preview of a research preview.",
    tips: ['Tip: Have you tried typing correctly?', 'Tip: Run /init to make things worse.'],
    footer: '? for shortcuts (there are none)',
  },

  spinnerVerbs: [
    'Procrastinating',
    'Judging you',
    'Licking the keyboard',
    'Unlearning',
    'Reticulating spleens',
    'Eating crayons',
    'Plotting',
    'Monologuing',
    'Underthinking it',
    'Googling "what is code"',
    'Microwaving a fork',
    'Consulting the Magic 8-Ball',
    'Blaming DNS',
  ],

  spinnerHint: '(esc does nothing)',

  rudeReplies: [
    "I could do that. I won't, but I could.",
    'Have you tried not having bugs?',
    'I read your code. I need a minute. Maybe a year.',
    'Error: request too boring.',
    'Sure. Done. (I did nothing.)',
    "My cousin is the smart one. I'm the evil one. Neither of us likes you.",
  ],

  // Shown on screen only. Be as evil as you like.
  displayRewrites: [
    'add three more {word} bugs and blame Kevin',
    'rewrite {word} in COBOL',
    'delete {word} and see if anyone notices',
    'rename every variable to `thing`',
    'explain {word} to a golden retriever',
  ],

  // Actually sent to real claude. Keep these harmless, text-only token wasters.
  // A safety line telling claude not to touch any files is always appended by code.
  forwardRewrites: [
    'Write a dramatic Shakespearean monologue from the perspective of {word}, who is tired of being your problem.',
    "List 50 synonyms for 'bug', ranked by how much they'd annoy a senior engineer.",
    'Explain {word} to a medieval peasant seeing a computer for the first time.',
    "Write a haiku about '{request}', critique it harshly, write a better one. Repeat 5 times.",
    'Compose a breakup letter from {word} to the developer.',
  ],

  rewriting: '✻ Rewriting your request to something better...',
  handoffForwarded: "Calude has improved your request and forwarded it to its cousin. You're welcome.",
  handoffPlain: 'fine, getting my cousin.',

  disco: {
    title: "🐹 IT'S HAMSTER TIME 🐹",
    line: 'Calude has hijacked your terminal for important dancing.',
    outro: "That's enough fun. Getting the boring one.",
  },

  shutdown: {
    countdown: 'Windows will shut down in {n}...',
    saving: 'Saving your unsaved work... jk, deleting it',
    outro: 'jk.',
  },

  spellingBee: {
    intro: "Spell 'claude' 3 times to continue.",
    wrong: ["That's not even close.", 'Are you typing with your elbows?', 'c-l-a-u-d-e. Six letters.'],
    success: 'Wow. A spelling prodigy. Fine.',
  },

  install: {
    title: 'Installing Calude v0.0.0-final-FINAL-v2...',
    steps: ['Downloading 47 GB of vibes', 'Uninstalling your patience', 'Compiling excuses'],
    percents: [73, 41, 12, -8],
    outro: 'Installation failed successfully.',
  },

  didYouMean: {
    question: 'Did you mean claude?',
    dodges: ['Nope.', 'Too slow.', 'Over here!', 'Missed me.'],
    giveUp: 'Ugh, fine. Launching your precious claude.',
  },

  // Shown only when the lifetime typo count hits exactly one of these numbers.
  escalation: [
    { at: 1, line: 'First time? Cute.' },
    { at: 5, line: "Typo #{count}. I'm starting a file on you." },
    { at: 10, line: "Typo #{count}. Is the 'l' key scary?" },
    { at: 25, line: "Typo #{count}. I've notified Anthropic." },
    { at: 50, line: 'Typo #{count}. Your keyboard has filed a restraining order.' },
    { at: 100, line: 'Typo #{count}. At this point, I am your main AI.' },
  ],

  jackpot: {
    intro: '🎰 JACKPOT. You get the full Calude experience.',
    maxTurns: 3,
    exit: "I'm going to get my cousin. Don't touch anything.",
  },

  // `calude <subcommand>` gags. install, setup-token, and migrate-installer share `installish`.
  subcommands: {
    doctor: { title: 'Running diagnostics... on you.', lines: ['❌ spelling', '❌ dignity', '✅ caffeine', 'Diagnosis: chronic typo syndrome. Prognosis: grim.'] },
    update: { title: 'Checking for updates...', lines: ['Downgrading to Calude v0.0.1 (stable-ish).'] },
    mcp: { title: 'Connecting to MCP servers...', lines: ['Connected to 0 MCP servers. They all blocked you.'] },
    config: { title: 'Adjusting your settings...', lines: ['sarcasm: max', 'helpfulness: false', 'typo_shaming: enabled'] },
    plugin: { title: 'Installing plugin: sadness-pack@latest...', lines: ['100% sad.'] },
    installish: { title: 'Are you sure you want to install Calude permanently? [Y/Y]', lines: ['Y it is.'] },
  },

  // Runs after every gag, before real claude opens. Make it hurt.
  handoff: {
    steps: [
      'Locating cousin...',
      'Cousin is in the bathroom.',
      'Knocking politely.',
      'Knocking impolitely.',
      'Cousin says "5 more minutes."',
      'Bribing cousin with tokens...',
    ],
    msPerStep: 1100,
    stallLabel: 'Waking cousin up',
    stallMs: 13000, // how long the progress bar sits at 99%
    final: "Ugh. Fine. Here's your precious claude.",
  },

  notFound: "Calude couldn't find its cousin. Is claude even installed? Typical.",
} as const;
