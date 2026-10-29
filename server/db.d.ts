import type Database from 'better-sqlite3';

export const db: Database.Database;
export function initDatabase(): void;
