import React, { useState, useEffect } from 'react';
import { Note, dbService } from '../db/database';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import ExportButtons from './ExportButtons';

interface NotesListProps {
  onEditNote: (note: Note) => void;
  onNewNote: () => void;
  refreshTrigger: number;
}

const NotesList: React.FC<NotesListProps> = ({ onEditNote, onNewNote, refreshTrigger }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadNotes();
  }, [user, refreshTrigger]);

  useEffect(() => {
    filterNotes();
  }, [notes, searchTerm]);

  const loadNotes = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userNotes = await dbService.getNotes(user.id);
      setNotes(userNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Error al cargar las notas');
    } finally {
      setIsLoading(false);
    }
  };

  const filterNotes = () => {
    if (!searchTerm.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      return;
    }

    try {
      await dbService.deleteNote(noteId);
      toast.success('Nota eliminada correctamente');
      loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Error al eliminar la nota');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <button
          onClick={onNewNote}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Nota</span>
        </button>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'No se encontraron notas' : 'No hay notas'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primera nota'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={onNewNote}
                className="btn-primary"
              >
                Crear primera nota
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <div key={note.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {note.title}
                </h3>
                {note.synced === 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Offline
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {truncateContent(note.content)}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                <span>Actualizada: {formatDate(note.updatedAt)}</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditNote(note)}
                  className="flex-1 btn-secondary text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => note.id && handleDeleteNote(note.id)}
                  className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="flex space-x-2">
                <ExportButtons note={note} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList; 