import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Note } from '../db/database';
import NotesList from './NotesList';
import NoteEditor from './NoteEditor';
import PWAStatus from './PWAStatus';
import { toast } from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'editor'>('list');
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user, logout } = useAuth();

  const handleNewNote = () => {
    setSelectedNote(undefined);
    setCurrentView('editor');
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setCurrentView('editor');
  };

  const handleSaveNote = () => {
    setCurrentView('list');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelEdit = () => {
    setCurrentView('list');
    setSelectedNote(undefined);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h1 className="text-xl font-bold text-gray-900">Bloc de Notas</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Hola, {user?.name}</span>
                {!navigator.onLine && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Sin conexión
                  </span>
                )}
              </div>
              
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'list' ? (
          <NotesList
            onEditNote={handleEditNote}
            onNewNote={handleNewNote}
            refreshTrigger={refreshTrigger}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancelEdit}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Volver a la lista</span>
              </button>
            </div>
            
            <NoteEditor
              note={selectedNote}
              onSave={handleSaveNote}
              onCancel={handleCancelEdit}
            />
          </div>
        )}
      </main>

      {/* PWA Status */}
      <PWAStatus />
    </div>
  );
};

export default Dashboard; 