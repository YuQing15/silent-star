// ============================================================
// Silent Star - mock data shaped for future database replacement
// ============================================================

export interface Novel {
  id: string
  slug: string
  title: string
  originalTitle: string
  synopsis: string
  coverUrl: string
  bannerUrl: string
  authorName: string
  translatorName: string
  status: 'ongoing' | 'completed' | 'hiatus'
  origin: 'chinese' | 'korean' | 'japanese' | 'english' | 'other'
  publishedChapters: number
  totalChapters: number
  averageRating: number
  totalRatings: number
  totalViews: number
  weeklyViews: number
  totalBookmarks: number
  ambientTheme: string
  primaryMood: string
  isFeatured?: boolean
  isTrending?: boolean
  isPremium?: boolean
  tags: string[]
  genres: string[]
  lastChapterAt: string
  createdAt: string
}

export interface Chapter {
  id: string
  novelId: string
  novelSlug: string
  novelTitle: string
  chapterNumber: number
  title: string
  slug: string
  content: string
  wordCount: number
  status: string
  isPremium: boolean
  translatorNote?: string
  publishedAt: string
  estimatedReadMinutes: number
  prevChapter: number | null
  nextChapter: number | null
}

export const MOCK_NOVELS: Novel[] = [
  {
    id: '1',
    slug: 'omniscient-readers-viewpoint',
    title: "Omniscient Reader's Viewpoint",
    originalTitle: 'ì „ì§€ì  ë…ìž ì‹œì ',
    synopsis: "Only I know the end of this world. One day our ordinary life turned into a clichÃ© survival drama. After three years of struggling, the scenario concluded. But then I found myself back at the starting pointâ€”the day it all began. Armed with complete knowledge of a story nobody else has read to the end, Kim Dokja must navigate an apocalypse that only he understands, protecting strangers who don't yet know they need saving.",
    coverUrl: 'https://picsum.photos/seed/orv/300/450',
    bannerUrl: 'https://picsum.photos/seed/orvbanner/1400/500',
    authorName: 'Sing Shong',
    translatorName: 'Rainbow Turtle',
    status: 'completed',
    origin: 'korean',
    publishedChapters: 551,
    totalChapters: 551,
    averageRating: 9.8,
    totalRatings: 18420,
    totalViews: 15600000,
    weeklyViews: 210000,
    totalBookmarks: 412000,
    ambientTheme: 'mystery',
    primaryMood: 'thrilling',
    isFeatured: true,
    isTrending: true,
    tags: ['apocalypse', 'regression', 'meta', 'bromance', 'system'],
    genres: ['Sci-Fi', 'Fantasy', 'Mystery', 'Action'],
    lastChapterAt: '2022-09-08T00:00:00Z',
    createdAt: '2019-09-01T00:00:00Z',
  },
  {
    id: '2',
    slug: 'the-beginning-after-the-end',
    title: 'The Beginning After the End',
    originalTitle: 'TBATE',
    synopsis: "King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power. Reincarnated into a new world filled with magic and monsters, the king has a second chance to relive his life â€” but fate will not allow him to rest.",
    coverUrl: 'https://picsum.photos/seed/tbate/300/450',
    bannerUrl: 'https://picsum.photos/seed/tbatebanner/1400/500',
    authorName: 'TurtleMe',
    translatorName: 'TurtleMe',
    status: 'ongoing',
    origin: 'korean',
    publishedChapters: 468,
    totalChapters: 520,
    averageRating: 9.4,
    totalRatings: 14200,
    totalViews: 8900000,
    weeklyViews: 98000,
    totalBookmarks: 189000,
    ambientTheme: 'fantasy',
    primaryMood: 'epic',
    isFeatured: true,
    isTrending: true,
    tags: ['reincarnation', 'magic', 'academy', 'swordsmanship', 'dual-wielding'],
    genres: ['Fantasy', 'Adventure', 'Action'],
    lastChapterAt: '2024-01-14T08:00:00Z',
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: '3',
    slug: 'solo-leveling',
    title: 'Solo Leveling',
    originalTitle: 'ë‚˜ í˜¼ìžë§Œ ë ˆë²¨ì—…',
    synopsis: "In a world where hunters with special powers battle deadly monsters, Sung Jinwoo is the weakest of them all. That is, until a chance encounter with a double dungeon gives him access to a mysterious program â€” a system only he can use. Watch as he goes from the weakest hunter alive to the strongest being in existence.",
    coverUrl: 'https://picsum.photos/seed/solo/300/450',
    bannerUrl: 'https://picsum.photos/seed/solobanner/1400/500',
    authorName: 'Chugong',
    translatorName: 'Oto',
    status: 'completed',
    origin: 'korean',
    publishedChapters: 270,
    totalChapters: 270,
    averageRating: 9.6,
    totalRatings: 22100,
    totalViews: 22000000,
    weeklyViews: 280000,
    totalBookmarks: 520000,
    ambientTheme: 'action',
    primaryMood: 'action',
    isFeatured: true,
    isTrending: true,
    isPremium: false,
    tags: ['dungeon', 'leveling', 'action', 'system', 'overpowered'],
    genres: ['Action', 'Fantasy', 'Adventure'],
    lastChapterAt: '2021-12-30T00:00:00Z',
    createdAt: '2016-03-10T00:00:00Z',
  },
  {
    id: '4',
    slug: 'father-i-dont-want-this-marriage',
    title: "Father, I Don't Want This Marriage",
    originalTitle: 'ì•„ë²„ì§€, ì´ ê²°í˜¼ì€ ì‹«ì–´ìš”',
    synopsis: "Juvelian reincarnated as the villain destined to die at eighteen in a romance novel. To avoid her fate, she decides to get close to the cold-hearted male lead â€” but the story starts going very, very off-script. A witty isekai romance about rewriting your own destiny.",
    coverUrl: 'https://picsum.photos/seed/fidwtm/300/450',
    bannerUrl: 'https://picsum.photos/seed/fidwtmbanner/1400/500',
    authorName: 'Kimgaya',
    translatorName: 'Ana_Fowl',
    status: 'ongoing',
    origin: 'korean',
    publishedChapters: 124,
    totalChapters: 200,
    averageRating: 9.1,
    totalRatings: 7880,
    totalViews: 4200000,
    weeklyViews: 67000,
    totalBookmarks: 98000,
    ambientTheme: 'romance',
    primaryMood: 'romance',
    isFeatured: true,
    tags: ['villainess', 'romance', 'regression', 'nobility', 'comedy'],
    genres: ['Romance', 'Fantasy', 'Comedy'],
    lastChapterAt: '2024-01-13T12:00:00Z',
    createdAt: '2022-04-01T00:00:00Z',
  },
  {
    id: '5',
    slug: 'martial-god-asura',
    title: 'Martial God Asura',
    originalTitle: 'ä¿®ç½—æ­¦ç¥ž',
    synopsis: "In the vast world of cultivation, Chu Feng rises from a humble background to challenge the heavens themselves. Through blood, sacrifice, and unbreakable will, he carves a path no one believed possible. A sweeping xianxia epic of power, brotherhood, and the unyielding pursuit of greatness.",
    coverUrl: 'https://picsum.photos/seed/mga/300/450',
    bannerUrl: 'https://picsum.photos/seed/mgabanner/1400/500',
    authorName: 'Kindhearted Bee',
    translatorName: 'Lungan',
    status: 'ongoing',
    origin: 'chinese',
    publishedChapters: 5891,
    totalChapters: 6000,
    averageRating: 8.7,
    totalRatings: 31200,
    totalViews: 12400000,
    weeklyViews: 145000,
    totalBookmarks: 234000,
    ambientTheme: 'action',
    primaryMood: 'action',
    isTrending: true,
    tags: ['cultivation', 'martial-arts', 'revenge', 'harem', 'xianxia'],
    genres: ['Action', 'Fantasy', 'Martial Arts'],
    lastChapterAt: '2024-01-15T10:30:00Z',
    createdAt: '2018-03-01T00:00:00Z',
  },
  {
    id: '6',
    slug: 'i-shall-seal-the-heavens',
    title: 'I Shall Seal the Heavens',
    originalTitle: 'æˆ‘æ¬²å°å¤©',
    synopsis: "What I want, the Heavens shall not lack! What I don't want, had better not exist in the Heavens! Er Gen's masterwork â€” a journey of a scholar turned cultivator who defies fate, loses love, and ultimately challenges the very nature of immortality. Considered by many to be the gold standard of xianxia.",
    coverUrl: 'https://picsum.photos/seed/issth/300/450',
    bannerUrl: 'https://picsum.photos/seed/issthbanner/1400/500',
    authorName: 'Er Gen',
    translatorName: 'Deathblade',
    status: 'completed',
    origin: 'chinese',
    publishedChapters: 1614,
    totalChapters: 1614,
    averageRating: 9.2,
    totalRatings: 19800,
    totalViews: 9800000,
    weeklyViews: 45000,
    totalBookmarks: 187000,
    ambientTheme: 'default',
    primaryMood: 'epic',
    tags: ['cultivation', 'xianxia', 'romance', 'tragedy', 'immortality'],
    genres: ['Fantasy', 'Martial Arts', 'Romance'],
    lastChapterAt: '2017-11-01T00:00:00Z',
    createdAt: '2014-05-01T00:00:00Z',
  },
  {
    id: '7',
    slug: 'a-returners-magic-should-be-special',
    title: "A Returner's Magic Should Be Special",
    originalTitle: 'ê·€í™˜ìžì˜ ë§ˆë²•ì€ íŠ¹ë³„í•´ì•¼ í•©ë‹ˆë‹¤',
    synopsis: "After surviving the Shadow Labyrinth â€” the deadliest dungeon ever to befall humanity â€” Desir Arman returns to the past with one goal: to gather the mages who will change the world and prevent the catastrophe he witnessed firsthand.",
    coverUrl: 'https://picsum.photos/seed/armsbs/300/450',
    bannerUrl: 'https://picsum.photos/seed/armsbsbanner/1400/500',
    authorName: 'Usonan',
    translatorName: 'KindapitifulReader',
    status: 'completed',
    origin: 'korean',
    publishedChapters: 262,
    totalChapters: 262,
    averageRating: 8.9,
    totalRatings: 9400,
    totalViews: 5100000,
    weeklyViews: 38000,
    totalBookmarks: 112000,
    ambientTheme: 'mystery',
    primaryMood: 'thrilling',
    tags: ['time-travel', 'magic', 'academy', 'regression', 'romance'],
    genres: ['Fantasy', 'Action', 'Romance'],
    lastChapterAt: '2023-06-01T00:00:00Z',
    createdAt: '2019-11-01T00:00:00Z',
  },
  {
    id: '8',
    slug: 'the-legendary-mechanic',
    title: 'The Legendary Mechanic',
    originalTitle: 'è¶…ç¥žæœºæ¢°å¸ˆ',
    synopsis: "Han Xiao wakes up inside a game he once played as a professional gamer â€” but as an NPC, not a player. Using his knowledge of future events, he must navigate political intrigue, intergalactic warfare, and the rising tide of players who see him as just another obstacle.",
    coverUrl: 'https://picsum.photos/seed/tlm/300/450',
    bannerUrl: 'https://picsum.photos/seed/tlmbanner/1400/500',
    authorName: 'Chocolion',
    translatorName: 'Qidian International',
    status: 'completed',
    origin: 'chinese',
    publishedChapters: 1463,
    totalChapters: 1463,
    averageRating: 9.0,
    totalRatings: 16700,
    totalViews: 7600000,
    weeklyViews: 52000,
    totalBookmarks: 143000,
    ambientTheme: 'fantasy',
    primaryMood: 'epic',
    tags: ['sci-fi', 'game-elements', 'mecha', 'overpowered', 'system'],
    genres: ['Sci-Fi', 'Action', 'Comedy'],
    lastChapterAt: '2021-03-15T00:00:00Z',
    createdAt: '2017-06-01T00:00:00Z',
  },
  {
    id: '9',
    slug: 'the-kings-avatar',
    title: "The King's Avatar",
    originalTitle: 'å…¨èŒé«˜æ‰‹',
    synopsis: "Regarded as a god in the e-sports world, Ye Xiu is forced to retire from the professional scene. Starting over at the bottom, he enters the very game he mastered, determined to reclaim his glory â€” this time with everyone watching.",
    coverUrl: 'https://picsum.photos/seed/tka/300/450',
    bannerUrl: 'https://picsum.photos/seed/tkabanner/1400/500',
    authorName: 'Butterfly Blue',
    translatorName: 'Nomyummi',
    status: 'completed',
    origin: 'chinese',
    publishedChapters: 1729,
    totalChapters: 1729,
    averageRating: 9.3,
    totalRatings: 21500,
    totalViews: 11200000,
    weeklyViews: 89000,
    totalBookmarks: 298000,
    ambientTheme: 'fantasy',
    primaryMood: 'epic',
    tags: ['gaming', 'esports', 'comeback', 'slice-of-life', 'comedy'],
    genres: ['Comedy', 'Action', 'Slice of Life'],
    lastChapterAt: '2018-05-14T00:00:00Z',
    createdAt: '2013-03-01T00:00:00Z',
  },
  {
    id: '10',
    slug: 'overgeared',
    title: 'Overgeared',
    originalTitle: 'ì˜¤ë²„ê¸°ì–´ë“œ',
    synopsis: "Shin Youngwoo had been living an unlucky life â€” until the day he picked up the legendary class 'Pagma's Descendant' in a VRMMO called Satisfy. Now he crafts legendary weapons, creates an army of NPCs, and builds a kingdom â€” all while trying not to be too much of an idiot about it.",
    coverUrl: 'https://picsum.photos/seed/ovgr/300/450',
    bannerUrl: 'https://picsum.photos/seed/ovgrbanner/1400/500',
    authorName: 'Park Saenal',
    translatorName: 'Rainbow Turtle',
    status: 'completed',
    origin: 'korean',
    publishedChapters: 1843,
    totalChapters: 1843,
    averageRating: 8.8,
    totalRatings: 17300,
    totalViews: 8400000,
    weeklyViews: 61000,
    totalBookmarks: 201000,
    ambientTheme: 'fantasy',
    primaryMood: 'comedy',
    tags: ['gaming', 'crafting', 'kingdom-building', 'comedy', 'overpowered'],
    genres: ['Fantasy', 'Comedy', 'Action'],
    lastChapterAt: '2023-09-01T00:00:00Z',
    createdAt: '2016-01-01T00:00:00Z',
  },
  {
    id: '11',
    slug: 'trash-of-the-counts-family',
    title: "Trash of the Count's Family",
    originalTitle: 'ë°±ìž‘ê°€ì˜ ë§ë‚˜ë‹ˆê°€ ë˜ì—ˆë‹¤',
    synopsis: "When Cale Henituse woke up inside a novel, his only goal was to avoid pain, gather wealth quietly, and live a peaceful life. Naturally, fate had other plans â€” and now he's stuck saving the world while insisting he just wants to be a trash noble and do nothing.",
    coverUrl: 'https://picsum.photos/seed/tcf/300/450',
    bannerUrl: 'https://picsum.photos/seed/tcfbanner/1400/500',
    authorName: 'Yoo Ryeo Han',
    translatorName: 'Eun Hye',
    status: 'completed',
    origin: 'korean',
    publishedChapters: 761,
    totalChapters: 761,
    averageRating: 9.1,
    totalRatings: 13600,
    totalViews: 6800000,
    weeklyViews: 74000,
    totalBookmarks: 178000,
    ambientTheme: 'fantasy',
    primaryMood: 'comedy',
    tags: ['isekai', 'comedy', 'found-family', 'nobility', 'clever-mc'],
    genres: ['Fantasy', 'Comedy', 'Action'],
    lastChapterAt: '2022-11-01T00:00:00Z',
    createdAt: '2018-10-01T00:00:00Z',
  },
  {
    id: '12',
    slug: 'a-man-like-none-other',
    title: 'A Man Like None Other',
    originalTitle: 'ä¹æ˜Ÿéœ¸ä½“è¯€',
    synopsis: "After being wrongly imprisoned, Chen Ping emerges with a mysterious cultivation method and an unquenchable thirst for justice. His path leads him through martial sects, hidden worlds, and ancient secrets â€” reshaping the cultivation world with every step.",
    coverUrl: 'https://picsum.photos/seed/amlo/300/450',
    bannerUrl: 'https://picsum.photos/seed/amlobanner/1400/500',
    authorName: 'Novelette',
    translatorName: 'Qidian International',
    status: 'ongoing',
    origin: 'chinese',
    publishedChapters: 3401,
    totalChapters: 4000,
    averageRating: 8.2,
    totalRatings: 9100,
    totalViews: 5400000,
    weeklyViews: 112000,
    totalBookmarks: 87000,
    ambientTheme: 'action',
    primaryMood: 'action',
    tags: ['cultivation', 'revenge', 'harem', 'martial-arts'],
    genres: ['Action', 'Martial Arts', 'Romance'],
    lastChapterAt: '2024-01-15T06:00:00Z',
    createdAt: '2019-01-01T00:00:00Z',
  },
]

// â”€â”€ Chapter data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const CHAPTER_TITLES = [
  "Three Ways to Survive in a Ruined World",
  "The Weakest Reader",
  "[Scenario #1 Has Begun]",
  "The First Constellation",
  "Yoo Joonghyuk",
  "What the Reader Knows",
  "Survival of the Fittest",
  "The Price of Foresight",
  "Into the Labyrinth",
  "A Reader's Burden",
  "Constellations and Stars",
  "The Shadow That Follows",
  "Where Stories Begin",
  "The Next Turn",
  "Probability and Will",
]

const CHAPTER_CONTENT_SAMPLES = [
  `There are three ways to survive in a ruined world.

The first: become strong enough that the world's ruin doesn't matter to you.

The second: find someone strong and stay near them.

The thirdâ€”the method I had relied on for three years, in a life that no longer existsâ€”know the story.

My name is Kim Dokja. Until three weeks ago, I was a twenty-eight-year-old office worker in Seoul who read web novels on the subway. I was, objectively, unremarkable. Medium height, average face, the kind of person who exists in peripheral vision and vanishes the moment you look away.

The one thing I had that no one else did: I had read *Three Ways to Survive in a Ruined World* to its conclusion.

All 3,149 chapters. Every arc, every death, every twist that the author buried in chapter 2,800 that only made sense if you'd memorized a throwaway line from chapter 40. I knew this story the way surgeons know anatomyâ€”not just the major landmarks but the capillaries, the places where things could go wrong.

I knew it so well that when the notifications began appearing in midair on the subway one ordinary Tuesday morning, I recognized them before I'd finished reading the first line.

*[A new scenario has arrived.]*

The other passengers were looking up from their phones. Some were pressing themselves against the walls. The child in the yellow raincoat near the doors had started to cry, very quietly, which was somehow worse than screaming would have been.

I closed my web novel appâ€”the last chapter of a story I'd been rereading, not this oneâ€”and took a slow breath.

"Okay," I said to no one in particular.

The woman next to me turned. She had the look of someone who had decided that addressing the stranger next to her was better than addressing the impossible text floating in the air. "Do youâ€”do you know what's happening?"

I did. I knew exactly what was happening, and what would happen next, and what would happen after that, for approximately the next three years of subjective time.

I also knew how many of the people currently on this train would still be alive in a month.

"Yes," I said. "I know what's happening. I need everyone to listen to me."

Nobody listened at first. That was fine. I'd read this part too.

*[Scenario #1: Emergency Training has begun. All survivors must reach the surface within 1 hour. Survivors who fail will be eliminated.]*

The lights went out. In the darkness, someone started screamingâ€”the real kind this time, the kind that strips pretense away and leaves only animal fear.

I was already moving.`,

  `The notifications had a texture I hadn't expected.

In the novel, they were described as "blue-white text hanging in the air." I'd read that phrase perhaps fifty times across different rereads, and I had imagined something like subtitles, or a holographic display, or the kind of HUD you see in gaming movies.

The reality was different. The text wasn't exactly in the airâ€”it was more like it existed slightly in front of everything else, occupying a layer of reality that the eye couldn't quite resolve. When I moved my head, it didn't move with me. When I blinked, it persisted.

It was the most disturbing thing I had ever seen, and I had seen a man get eaten by a scenario monster twenty minutes ago.

I was on the surface now. Around me: nine people I'd pulled from the subway car, most of them shaking, one of themâ€”an older man in a delivery uniformâ€”eerily calm in a way that told me he was in shock. The sky above Seoul was the color of a healing bruise, the horizon flickering where something I couldn't name was moving through the clouds.

I knew what it was. I wasn't going to say.

*[Scenario #1 complete. Survivors: 9. Evaluation: C.]*

*[You have gained the skill: 'Way of Survival (Lowest).]*

C. In the novel, Kim Dokja's first scenario had been ranked S. The protagonist had saved forty people from that subway car.

I had saved nine.

I stood with that for a moment.

The woman who had spoken to me on the trainâ€”early thirties, pragmatic, the kind of person who carried four different chargers in her bagâ€”was watching me with an expression I couldn't read. "You knew that was going to happen," she said. Not an accusation. An observation.

"Yes."

"How?"

I considered the various ways to answer this question. *I read it in a novel* was technically true and also the kind of statement that, in a just-collapsed world, might get me killed or followed or both. *I have future knowledge* was more alarming than helpful. *I'm the only person who knows how this ends* was the truest thing I could say, and also the most terrifying.

"I've been preparing," I said instead.

She stared at me for another three seconds. Then: "Okay. What do we do next?"

Her name, I would later learn, was Jung Heewon. In the novel, she had died in chapter 40.

I was going to make sure that didn't happen.`,
]

export function getChaptersByNovelSlug(novelSlug: string): Chapter[] {
  const novel = MOCK_NOVELS.find(n => n.slug === novelSlug)
  if (!novel) return []

  return Array.from({ length: Math.min(20, novel.publishedChapters) }, (_, i) => ({
    id: `${novelSlug}-ch-${i + 1}`,
    novelId: novel.id,
    novelSlug: novel.slug,
    novelTitle: novel.title,
    chapterNumber: i + 1,
    title: CHAPTER_TITLES[i % CHAPTER_TITLES.length],
    slug: `chapter-${i + 1}`,
    content: CHAPTER_CONTENT_SAMPLES[i % CHAPTER_CONTENT_SAMPLES.length],
    wordCount: 1400 + Math.floor(Math.random() * 800),
    status: 'published',
    isPremium: i > 12 && i % 3 === 0,
    translatorNote: i === 0
      ? "Translation note: 'Star Stream' (ë³„ìžë¦¬ ìŠ¤íŠ¸ë¦¼) is the literal translation and refers to the constellation-based system governing scenarios. The term 'scenario' throughout is used exactly as in the original Korean."
      : undefined,
    publishedAt: new Date(Date.now() - (novel.publishedChapters - i) * 24 * 3600 * 1000).toISOString(),
    estimatedReadMinutes: 5 + Math.floor(Math.random() * 4),
    prevChapter: i > 0 ? i : null,
    nextChapter: i < 19 ? i + 2 : null,
  }))
}

export function getChapter(novelSlug: string, chapterNumber: number): Chapter | null {
  const chapters = getChaptersByNovelSlug(novelSlug)
  return chapters.find(c => c.chapterNumber === chapterNumber) ?? null
}


export const READING_HISTORY_MOCK = [
  { novelSlug: 'omniscient-readers-viewpoint', lastChapter: 42, totalChapters: 551, lastReadAt: '2024-01-15T22:00:00Z' },
  { novelSlug: 'solo-leveling',                lastChapter: 88, totalChapters: 270, lastReadAt: '2024-01-13T19:30:00Z' },
  { novelSlug: 'the-beginning-after-the-end', lastChapter: 15, totalChapters: 468, lastReadAt: '2024-01-10T20:00:00Z' },
]

export const MOCK_READER_PROFILE = {
  id: 'reader-1',
  displayName: 'Silent Star Reader',
  username: 'silentreader',
  email: 'mira@example.com',
  avatarUrl: '',
  memberSince: 'January 2024',
  currentMood: 'Soft fantasy, slow-burn romance, clever survival arcs',
  readingGoal: { current: 37, target: 52, unit: 'chapters this month' },
}

export const DASHBOARD_PROGRESS_MOCK = [
  { novelSlug: 'omniscient-readers-viewpoint', lastChapter: 42, minutesLeft: 18, note: 'Scenario arc, subway reread' },
  { novelSlug: 'solo-leveling', lastChapter: 88, minutesLeft: 12, note: 'Dungeon raid momentum' },
  { novelSlug: 'father-i-dont-want-this-marriage', lastChapter: 31, minutesLeft: 9, note: 'Save for a cosy evening' },
]

export const MONTHLY_READING_LOG_MOCK = [
  { date: 'Jun 01', title: "Omniscient Reader's Viewpoint", chapters: 4, mood: 'absorbed' },
  { date: 'May 31', title: 'Solo Leveling', chapters: 6, mood: 'energized' },
  { date: 'May 30', title: "Father, I Don't Want This Marriage", chapters: 3, mood: 'comforted' },
  { date: 'May 29', title: 'The Beginning After the End', chapters: 5, mood: 'curious' },
]

export const READING_STATS_MOCK = [
  { label: 'Chapters read', value: '1,240' },
  { label: 'Hours reading', value: '186' },
  { label: 'Day streak', value: '7' },
  { label: 'Completed novels', value: '12' },
]

export const FAVOURITE_QUOTES_MOCK = [
  {
    text: 'A story only becomes yours when you return to it with a changed heart.',
    source: "Omniscient Reader's Viewpoint",
  },
  {
    text: 'The quietest resolve often survives the loudest ending.',
    source: 'The Beginning After the End',
  },
]

export const READING_NOTES_MOCK = [
  { title: 'Themes to watch', body: 'Identity, borrowed fate, and the cost of knowing too much.' },
  { title: 'Next session', body: 'Pick up ORV from chapter 42 before starting a new romance arc.' },
]

export const WISHLIST_MOCK = [
  { novelSlug: 'trash-of-the-counts-family', reason: 'Found family and clever protagonist' },
  { novelSlug: 'the-kings-avatar', reason: 'Low-stakes comeback chapters' },
  { novelSlug: 'i-shall-seal-the-heavens', reason: 'Classic xianxia backlog' },
]

// Toggle this while real data is being wired in.
// false = empty-state preview, true = mock demo content.
export const USE_MOCK_DEMO_DATA = false

export const NOVELS_DATA = USE_MOCK_DEMO_DATA ? MOCK_NOVELS : []
export const READING_HISTORY_DATA = USE_MOCK_DEMO_DATA ? READING_HISTORY_MOCK : []
export const DASHBOARD_PROGRESS_DATA = USE_MOCK_DEMO_DATA ? DASHBOARD_PROGRESS_MOCK : []
export const MONTHLY_READING_LOG_DATA = USE_MOCK_DEMO_DATA ? MONTHLY_READING_LOG_MOCK : []
export const READING_STATS_DATA = USE_MOCK_DEMO_DATA ? READING_STATS_MOCK : [
  { label: 'Chapters read', value: '0' },
  { label: 'Hours reading', value: '0' },
  { label: 'Day streak', value: '0' },
  { label: 'Completed novels', value: '0' },
]
export const FAVOURITE_QUOTES_DATA = USE_MOCK_DEMO_DATA ? FAVOURITE_QUOTES_MOCK : []
export const READING_NOTES_DATA = USE_MOCK_DEMO_DATA ? READING_NOTES_MOCK : []
export const WISHLIST_DATA = USE_MOCK_DEMO_DATA ? WISHLIST_MOCK : []

export const WANT_TO_READ_DATA = USE_MOCK_DEMO_DATA ? WISHLIST_MOCK : []
export const DROPPED_DATA = USE_MOCK_DEMO_DATA ? [
  { novelSlug: 'overgeared', reason: 'Paused for later' },
] : []
export const CHECKMARKED_DATA = USE_MOCK_DEMO_DATA ? [
  { novelSlug: 'the-kings-avatar', note: 'Worth recommending' },
  { novelSlug: 'trash-of-the-counts-family', note: 'Cosy found-family pick' },
] : []


