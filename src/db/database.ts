import Dexie, { Table } from "dexie";
import { noteApi } from "../services/noteServices";

export interface Note {
  id?: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  synced: number; // 0 = false, 1 = true
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAuthenticated: number; // 0 = false, 1 = true
}

export class NotesDatabase extends Dexie {
  notes!: Table<Note>;
  users!: Table<User>;
  pendingSync!: Table<Note>;
  deletedNotes!: Table<{ id: string }>;
  

  constructor() {
    super("NotesDatabase");
    this.version(1).stores({
      notes: "id, title, userId, synced, createdAt",
      users: "id, email, name, isAuthenticated",
      pendingSync: "id, title, userId, synced, createdAt",
      deletedNotes: "id",
    });
  }
}

export const db = new NotesDatabase();

// Funciones de utilidad para la base de datos
export const dbService = {
  // Notas
  async addNote(note: Omit<Note, "synced">): Promise<number> {
    const newNote = {
      ...note,
      synced: navigator.onLine ? 1 : 0,
    };
    if (navigator.onLine) {
      await noteApi.createNote(newNote, +newNote.userId);
    }
    return await db.notes.add(newNote);
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<void> {
    if (navigator.onLine) {
      await noteApi.updateNote(id, updates);
    }
    await db.notes.update(id, {
      ...updates,
      updatedAt: new Date(),
      synced: navigator.onLine ? 1 : 0,
    });
  },

  async deleteNote(id: string): Promise<void> {
    if (navigator.onLine) {
      await noteApi.deleteNote(id);
    }
    await db.notes.delete(id);
    await db.deletedNotes.add({ id });
  },

  async getNotesToDelete(): Promise<string[]> {
    const deleted = await db.deletedNotes.toArray();
    return deleted.map(n => n.id);
  },

  async getNotes(userId: string): Promise<Note[]> {
    return await db.notes
      .where("userId")
      .equals(userId)
      .reverse()
      .sortBy("createdAt");
  },

  async saveServerNotes(notes: Note[]): Promise<void> {
    await db.notes.clear();
    await db.notes.bulkPut(notes);
  },

  async getUnsyncedNotes(): Promise<Note[]> {
    return await db.notes.where("synced").equals(0).toArray();
  },

  async markNoteAsSynced(id: string): Promise<void> {
    await db.notes.update(id, { synced: 1 });
  },

  // Usuarios
  async setCurrentUser(user: User): Promise<void> {
    await db.users.clear();
    await db.users.add(user);
  },

  async getCurrentUser(): Promise<User | undefined> {
    return await db.users.where("isAuthenticated").equals(1).first();
  },

  async logout(): Promise<void> {
    await db.users.clear();
  },

  async deleteDeletedNote(id: string): Promise<void> {
    await db.deletedNotes.delete(id);
  },
};
