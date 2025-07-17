import api from './api';

// Tipos
export interface Note {
  id?: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  synced: number; // 0 = false, 1 = true
  userId: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  id?: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
}

// Funciones de API
export const noteApi = {
  // Obtener todas las notas del usuario
  getNotes: async (): Promise<Note[]> => {
    const response = await api.get(`/notes`);
    return response.data;
  },

  // Obtener una nota específica
  getNote: async (noteId: number): Promise<Note> => {
    const response = await api.get(`/notes/${noteId}`);
    return response.data;
  },

  createNote: async (noteData: CreateNoteData, userId: number): Promise<Note> => {
    const response = await api.post(`/notes/note/user/${userId}`, {
      title: noteData.title,
      content: noteData.content,
      id: noteData.id,
    });
    return response.data;
  },

  // Actualizar nota
  updateNote: async (noteId: string, noteData: UpdateNoteData): Promise<Note> => {
    const response = await api.patch(`/notes/${noteId}`, noteData);
    return response.data;
  },

  // Eliminar nota
  deleteNote: async (noteId: string): Promise<void> => {
    await api.delete(`/notes/${noteId}`);
  },

};

export const syncNote = async (note: Note, userId: number) => {
  if (!note.id) return;
  try {
    // Si tiene un ID remoto, actualiza. Si no, crea.
    if (note.synced === 0) {
      await noteApi.createNote(note, userId);
    } else {
      await noteApi.updateNote(note.id, note);
    }
  } catch (e) {
    console.error('Sync error:', e);
    throw e;
  }
};