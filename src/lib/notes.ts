import { getCollection, type CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'notes'>;

// La plus récente d'abord.
export async function getNotes(): Promise<Note[]> {
  return (await getCollection('notes')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}

export function noteDate(date: Date, style: 'long' | 'short' = 'long'): string {
  return date.toLocaleDateString('en-GB', {
    day: style === 'long' ? 'numeric' : undefined,
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// Deux cent vingt mots à la minute : une lecture attentive, pas un survol.
export function readingTime(body: string): string {
  const words = body.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}
