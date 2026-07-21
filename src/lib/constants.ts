// Competitions (top-level grouping shown as tabs)
export const COMPETITIONS = [
  { id: 'ksae', label: '영광(KSAE)' },
  { id: 'hwaseong', label: '화성 대회' },
] as const;

export type CompetitionId = (typeof COMPETITIONS)[number]['id'];

// Board sources (each has its own fetch URL scheme + HTML parser)
export type BoardSource = 'ksae' | 'carsa';

export const BOARDS = [
  // 영광(KSAE) — https://www.ksae.org/jajak
  {
    type: 'notice',
    competition: 'ksae',
    source: 'ksae',
    code: 'J_notice',
    baseUrl: 'https://www.ksae.org/jajak/bbs/index.php',
  },
  {
    type: 'rule',
    competition: 'ksae',
    source: 'ksae',
    code: 'J_rule',
    baseUrl: 'https://www.ksae.org/jajak/bbs/index.php',
  },
  // 화성 대회 (한국자동차안전학회) — https://carsa.kr
  {
    type: 'hs_notice',
    competition: 'hwaseong',
    source: 'carsa',
    code: 's6_1',
    label: '공지사항',
    baseUrl: 'https://carsa.kr/bbs/board.php',
  },
  {
    type: 'hs_data',
    competition: 'hwaseong',
    source: 'carsa',
    code: 's6_2',
    label: '자료실',
    baseUrl: 'https://carsa.kr/bbs/board.php',
  },
  {
    type: 'hs_qna',
    competition: 'hwaseong',
    source: 'carsa',
    code: 's6_6',
    label: 'QnA',
    baseUrl: 'https://carsa.kr/bbs/board.php',
  },
] as const;

export type BoardType = (typeof BOARDS)[number]['type'];

// boardType -> competition
export const BOARDTYPE_TO_COMPETITION = Object.fromEntries(
  BOARDS.map((b) => [b.type, b.competition]),
) as Record<BoardType, CompetitionId>;

// competition -> its boardTypes
export const COMPETITION_BOARDTYPES = COMPETITIONS.reduce((acc, c) => {
  acc[c.id] = BOARDS.filter((b) => b.competition === c.id).map((b) => b.type);
  return acc;
}, {} as Record<CompetitionId, BoardType[]>);

// KSAE notice board internal category codes
export const NOTICE_CATEGORIES: Record<string, string> = {
  Z: '공통',
  A: 'Baja',
  B: 'Formula',
  C: 'EV',
  D: '자율주행',
};

// Reverse mapping: category label -> code
export const NOTICE_CATEGORY_CODES: Record<string, string> = Object.fromEntries(
  Object.entries(NOTICE_CATEGORIES).map(([code, label]) => [label, code]),
);

export const SUBSCRIPTION_CATEGORIES = [
  // 영광(KSAE)
  { id: 'notice_Z', label: '공통', competition: 'ksae' },
  { id: 'notice_A', label: 'Baja', competition: 'ksae' },
  { id: 'notice_B', label: 'Formula', competition: 'ksae' },
  { id: 'notice_C', label: 'EV', competition: 'ksae' },
  { id: 'notice_D', label: '자율주행', competition: 'ksae' },
  { id: 'rule', label: '규정', competition: 'ksae' },
  // 화성 대회
  { id: 'hs_notice', label: '공지사항', competition: 'hwaseong' },
  { id: 'hs_data', label: '자료실', competition: 'hwaseong' },
  { id: 'hs_qna', label: 'QnA', competition: 'hwaseong' },
] as const;

// Category chips available per competition on the post list
export const COMPETITION_CATEGORY_CHIPS: Record<CompetitionId, { id: string; label: string }[]> = {
  ksae: [
    { id: '공통', label: '공통' },
    { id: 'Baja', label: 'Baja' },
    { id: 'Formula', label: 'Formula' },
    { id: 'EV', label: 'EV' },
    { id: '자율주행', label: '자율주행' },
    { id: '규정', label: '규정' },
  ],
  hwaseong: [
    { id: '공지사항', label: '공지사항' },
    { id: '자료실', label: '자료실' },
    { id: 'QnA', label: 'QnA' },
  ],
};

export function getEndOfYear(): string {
  return `${new Date().getFullYear()}-12-31T23:59:59.000Z`;
}

export const CATEGORY_COLORS: Record<string, {
  chip: string;
  chipHover: string;
  filterActive: string;
  filterInactive: string;
  email: { bg: string; text: string };
}> = {
  '공통': {
    chip: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    chipHover: 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-600',
    filterActive: 'bg-gray-600 text-white dark:bg-gray-500',
    filterInactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:active:bg-gray-700',
    email: { bg: '#e5e7eb', text: '#374151' },
  },
  'Baja': {
    chip: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
    chipHover: 'bg-orange-100 text-orange-700 hover:bg-orange-200 active:bg-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500/30 dark:active:bg-orange-500/30',
    filterActive: 'bg-orange-500 text-white',
    filterInactive: 'bg-orange-50 text-orange-600 hover:bg-orange-100 active:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 dark:active:bg-orange-500/20',
    email: { bg: '#ffedd5', text: '#c2410c' },
  },
  'Formula': {
    chip: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    chipHover: 'bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30 dark:active:bg-blue-500/30',
    filterActive: 'bg-blue-600 text-white',
    filterInactive: 'bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 dark:active:bg-blue-500/20',
    email: { bg: '#dbeafe', text: '#1d4ed8' },
  },
  'EV': {
    chip: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
    chipHover: 'bg-purple-100 text-purple-700 hover:bg-purple-200 active:bg-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:hover:bg-purple-500/30 dark:active:bg-purple-500/30',
    filterActive: 'bg-purple-600 text-white',
    filterInactive: 'bg-purple-50 text-purple-600 hover:bg-purple-100 active:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20 dark:active:bg-purple-500/20',
    email: { bg: '#f3e8ff', text: '#7e22ce' },
  },
  '자율주행': {
    chip: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
    chipHover: 'bg-rose-100 text-rose-700 hover:bg-rose-200 active:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/30 dark:active:bg-rose-500/30',
    filterActive: 'bg-rose-500 text-white',
    filterInactive: 'bg-rose-50 text-rose-500 hover:bg-rose-100 active:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 dark:active:bg-rose-500/20',
    email: { bg: '#ffe4e6', text: '#be123c' },
  },
  '규정': {
    chip: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
    chipHover: 'bg-green-100 text-green-700 hover:bg-green-200 active:bg-green-200 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30 dark:active:bg-green-500/30',
    filterActive: 'bg-green-600 text-white',
    filterInactive: 'bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 dark:active:bg-green-500/20',
    email: { bg: '#dcfce7', text: '#15803d' },
  },
  // 화성 대회 (carsa) board tags
  '공지사항': {
    chip: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
    chipHover: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:hover:bg-indigo-500/30 dark:active:bg-indigo-500/30',
    filterActive: 'bg-indigo-600 text-white',
    filterInactive: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 dark:active:bg-indigo-500/20',
    email: { bg: '#e0e7ff', text: '#4338ca' },
  },
  '자료실': {
    chip: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400',
    chipHover: 'bg-teal-100 text-teal-700 hover:bg-teal-200 active:bg-teal-200 dark:bg-teal-500/20 dark:text-teal-400 dark:hover:bg-teal-500/30 dark:active:bg-teal-500/30',
    filterActive: 'bg-teal-600 text-white',
    filterInactive: 'bg-teal-50 text-teal-600 hover:bg-teal-100 active:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:hover:bg-teal-500/20 dark:active:bg-teal-500/20',
    email: { bg: '#ccfbf1', text: '#0f766e' },
  },
  'QnA': {
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    chipHover: 'bg-amber-100 text-amber-700 hover:bg-amber-200 active:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30 dark:active:bg-amber-500/30',
    filterActive: 'bg-amber-500 text-white',
    filterInactive: 'bg-amber-50 text-amber-600 hover:bg-amber-100 active:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 dark:active:bg-amber-500/20',
    email: { bg: '#fef3c7', text: '#b45309' },
  },
};

export function getCategoryLabel(subscriptionId: string): string {
  const found = SUBSCRIPTION_CATEGORIES.find((c) => c.id === subscriptionId);
  if (found) return found.label;
  if (subscriptionId === 'rule') return '규정';
  const code = subscriptionId.replace('notice_', '');
  return NOTICE_CATEGORIES[code] || subscriptionId;
}
