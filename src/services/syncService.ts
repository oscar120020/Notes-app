import { dbService, Note } from '../db/database';
import { toast } from 'react-hot-toast';
import { noteApi, syncNote } from './noteServices';

class SyncService {
  private isOnline = navigator.onLine;
  private syncInProgress = false;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOffline();
    });
  }

  private async handleOnline() {
    console.log('Conexión restaurada, iniciando sincronización...');
    toast.success('Conexión restaurada');
    await this.syncPendingNotes();
  }

  private handleOffline() {
    console.log('Conexión perdida, entrando en modo offline...');
    toast.error('Conexión perdida - Modo offline activado');
  }

  public async syncPendingNotes(): Promise<void> {
    console.log('aaaaaaa');
    
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;

    try {
      const unsyncedNotes = await dbService.getUnsyncedNotes();
      const deletedNotes = await dbService.getNotesToDelete();
      console.log(unsyncedNotes);
      
      if (unsyncedNotes.length === 0 && deletedNotes.length === 0) {
        return;
      }

      console.log(`Sincronizando ${unsyncedNotes.length} notas...`);
      
      // Simular envío al backend
      if (unsyncedNotes.length > 0) {  
        await this.syncAllNotes(unsyncedNotes);
      }
      if (deletedNotes.length > 0) {
        await this.syncDeletedNotes(deletedNotes);
      }

      toast.success(`${unsyncedNotes.length} notas sincronizadas correctamente`);
      
    } catch (error) {
      console.error('Error durante la sincronización:', error);
      toast.error('Error al sincronizar las notas');
    } finally {
      this.syncInProgress = false;
    }
  }

  private async sendNoteToBackend(note: Note): Promise<void> {
    // Simulación de envío al backend
    // En un proyecto real, aquí harías una llamada HTTP a tu API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular éxito 95% de las veces
        if (Math.random() > 0.05) {
          console.log(`Nota "${note.title}" enviada al backend`);
          resolve();
        } else {
          reject(new Error('Error de red simulado'));
        }
      }, 500); // Simular latencia de red
    });
  }

  public async forceSync(): Promise<void> {
    if (!this.isOnline) {
      toast.error('No hay conexión a internet');
      return;
    }

    await this.syncPendingNotes();
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  public async getPendingSyncCount(): Promise<number> {
    const unsyncedNotes = await dbService.getUnsyncedNotes();
    return unsyncedNotes.length;
  }

  public async syncAllNotes(notes: Note[]): Promise<void> {
    const syncedIds: string[] = [];

    for (const note of notes) {
      try {
        await syncNote(note, +note.userId);
        await dbService.markNoteAsSynced(note.id!);
        syncedIds.push(note.id!);
      } catch (err) {
        console.error(`Error syncing note ${note.id}:`, err);
      }
    }

    console.log('Notas sincronizadas:', syncedIds);
  }

  public async syncDeletedNotes(deletedNotes: string[]): Promise<void> {
    for (const id of deletedNotes) {
      try {
        await noteApi.deleteNote(id); // llamada HTTP DELETE al backend
        await dbService.deleteDeletedNote(id); // eliminación exitosa, bórralo de Dexie
        console.log(`Nota ${id} eliminada del backend`);
      } catch (err) {
        console.error(`Error eliminando nota ${id}:`, err);
      }
    }
    
    console.log(deletedNotes);
  }
}

export const syncService = new SyncService(); 