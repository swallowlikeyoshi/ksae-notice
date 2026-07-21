import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';

export interface ParsedPost {
  postNumber: number;
  title: string;
  category: string | null;
  date: string;
  isPinned: boolean;
  url: string;
}

// Minimal board shape the parsers need (structurally compatible with BOARDS entries)
export interface ParseBoard {
  source: string;
  type: string;
  code: string;
  label?: string;
}

export function parseBoardPage(html: string, board: ParseBoard): ParsedPost[] {
  if (board.source === 'carsa') return parseCarsaBoard(html, board);
  return parseKsaeBoard(html, board);
}

// ---------------------------------------------------------------------------
// KSAE (www.ksae.org/jajak) — table rows with number= links
// ---------------------------------------------------------------------------
const KSAE_BASE = 'https://www.ksae.org';

function parseKsaeBoard(html: string, board: ParseBoard): ParsedPost[] {
  const $ = cheerio.load(html);
  const posts: ParsedPost[] = [];
  const rows = $('table tr').toArray();

  for (const row of rows) {
    const tds = $(row).find('td');
    if (tds.length < 5) continue;

    const firstTd = tds.eq(0);
    const isPinned = firstTd.find('img[src*="notice"]').length > 0;

    let titleTd: cheerio.Cheerio<AnyNode>;
    let category: string | null = null;

    if (board.type === 'notice') {
      if (tds.length < 6) continue;
      category = tds.eq(1).text().trim() || null;
      titleTd = tds.eq(2);
    } else {
      titleTd = tds.eq(1);
    }

    const link = titleTd.find('a').first();
    if (!link.length) continue;

    const href = link.attr('href');
    if (!href) continue;

    const numberMatch = href.match(/number=(\d+)/);
    if (!numberMatch) continue;

    const postNumber = parseInt(numberMatch[1], 10);

    const titleSpan = link.find('span').first();
    const title = (titleSpan.length ? titleSpan.text() : link.text()).trim();
    if (!title) continue;

    const dateTd = tds.eq(tds.length - 1);
    const date = dateTd.text().trim();

    const url = `${KSAE_BASE}/jajak/bbs/?number=${postNumber}&mode=view&code=${board.code}`;

    posts.push({ postNumber, title, category, date, isPinned, url });
  }

  return posts;
}

// ---------------------------------------------------------------------------
// carsa.kr (gnuboard) — table with td.num / td.subject / td.date
// ---------------------------------------------------------------------------
const CARSA_BASE = 'https://carsa.kr';

// gnuboard shows: "HH:MM" (today), "MM-DD" (this year), "YY-MM-DD" (older).
// Normalize to YYYY-MM-DD for consistent sorting and recency checks.
function normalizeCarsaDate(raw: string): string {
  const s = raw.trim();
  const now = new Date();
  if (/^\d{1,2}:\d{2}$/.test(s)) {
    return now.toISOString().slice(0, 10); // today
  }
  if (/^\d{2}-\d{2}$/.test(s)) {
    return `${now.getFullYear()}-${s}`;
  }
  if (/^\d{2}-\d{2}-\d{2}$/.test(s)) {
    return `20${s}`;
  }
  const ymd = s.match(/(\d{4})[-.](\d{2})[-.](\d{2})/);
  if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`;
  return s;
}

function parseCarsaBoard(html: string, board: ParseBoard): ParsedPost[] {
  const $ = cheerio.load(html);
  const posts: ParsedPost[] = [];
  const rows = $('table tr').toArray();

  for (const row of rows) {
    const $row = $(row);
    const link = $row.find('td.subject a[href*="wr_id="]').first();
    if (!link.length) continue;

    const href = link.attr('href');
    if (!href) continue;
    const idMatch = href.match(/wr_id=(\d+)/);
    if (!idMatch) continue;
    const postNumber = parseInt(idMatch[1], 10);

    // Title: anchor text, stripped of trailing comment-count like " +12"
    const title = link.text().replace(/\s+/g, ' ').trim().replace(/\s*\+\d+\s*$/, '').trim();
    if (!title) continue;

    const numText = $row.find('td.num').first().text().trim();
    const isPinned = numText !== '' && !/^\d+$/.test(numText); // "공지사항" etc.

    const dateText = $row.find('td.date').first().text().trim();
    const date = normalizeCarsaDate(dateText);

    const url = `${CARSA_BASE}/bbs/board.php?bo_table=${board.code}&wr_id=${postNumber}`;

    posts.push({ postNumber, title, category: board.label ?? null, date, isPinned, url });
  }

  return posts;
}
