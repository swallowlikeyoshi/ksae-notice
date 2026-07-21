'use client';

import { useState, useEffect } from 'react';
import PostTable from '@/components/PostTable';
import { COMPETITIONS, type CompetitionId } from '@/lib/constants';

interface Stats {
  activeSubscribers: number;
  maxSubscribers: number;
  registrationOpen: boolean;
  lastCrawl: { finishedAt: string; boardType: string; newPostsCount: number } | null;
}

function getRelativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

function getTickInterval(dateStr: string): number {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 1000;
  if (diff < 3600) return 60_000;
  if (diff < 86400) return 3600_000;
  return 86400_000;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tick, setTick] = useState(0);
  const [competition, setCompetition] = useState<CompetitionId>('ksae');

  useEffect(() => {
    const saved = localStorage.getItem('competition');
    if (saved === 'ksae' || saved === 'hwaseong') setCompetition(saved);
  }, []);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const finishedAt = stats?.lastCrawl?.finishedAt;
    if (!finishedAt) return;
    const id = setTimeout(() => setTick((t) => t + 1), getTickInterval(finishedAt));
    return () => clearTimeout(id);
  }, [stats, tick]);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-8">
      {/* Stats banner */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-2 sm:hidden">
        <div className="mb-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">구독자</div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
            {stats ? `${stats.activeSubscribers} / ${stats.maxSubscribers}` : '-'}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">최근 새로고침</div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
            {stats?.lastCrawl?.finishedAt
              ? getRelativeTime(stats.lastCrawl.finishedAt)
              : '-'}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {stats?.lastCrawl?.finishedAt
              ? `${new Date(stats.lastCrawl.finishedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} (오전 7시 ~ 오후 7시 / 5분 간격)`
              : '오전 7시 ~ 오후 7시 / 5분 간격'}
          </div>
        </div>
      </div>
      <div className="hidden sm:grid grid-cols-2 gap-4 mb-2">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">구독자</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {stats ? `${stats.activeSubscribers} / ${stats.maxSubscribers}` : '-'}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">최근 새로고침</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {stats?.lastCrawl?.finishedAt
              ? getRelativeTime(stats.lastCrawl.finishedAt)
              : '-'}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {stats?.lastCrawl?.finishedAt
              ? `${new Date(stats.lastCrawl.finishedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} (오전 7시 ~ 오후 7시 / 5분 간격)`
              : '오전 7시 ~ 오후 7시 / 5분 간격'}
          </div>
        </div>
      </div>

      {/* Competition tabs */}
      <div className="flex gap-1 mt-2 mb-1 border-b border-gray-200 dark:border-gray-800">
        {COMPETITIONS.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setCompetition(c.id);
              localStorage.setItem('competition', c.id);
            }}
            className={`px-4 py-2.5 -mb-px text-sm font-medium border-b-2 transition cursor-pointer focus-visible:outline-none ${
              competition === c.id
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Post list */}
      <PostTable competition={competition} />
    </div>
  );
}
