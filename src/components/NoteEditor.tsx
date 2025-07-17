import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-hot-toast';
import { dbService, Note } from '../db/database';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface NoteEditorProps {
  note?: Note;
  onSave?: () => void;
  onCancel?: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }

    setIsSaving(true);

    try {
      if (note?.id) {
        // Actualizar nota existente
        await dbService.updateNote(note.id, {
          title: title.trim(),
          content,
          userId: user.id
        });
        toast.success('Nota actualizada correctamente');
      } else {
        // Crear nueva nota
        await dbService.addNote({
          id: uuidv4(),
          title: title.trim(),
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id
        });
        toast.success('Nota creada correctamente');
      }

      onSave?.();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Error al guardar la nota');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (window.confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios.')) {
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {note ? 'Editar Nota' : 'Nueva Nota'}
        </h2>
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Título de la nota..."
            maxLength={100}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido
          </label>
          <div className="border border-gray-300 rounded-lg">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Escribe tu nota aquí..."
              style={{ height: '300px' }}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-5 pt-10">
          <button
            onClick={handleCancel}
            className="btn-secondary"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              'Guardar Nota'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor; 