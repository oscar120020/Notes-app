import TurndownService from 'turndown';
import html2pdf from 'html2pdf.js';

// Configuración de Turndown para convertir HTML a Markdown
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  strongDelimiter: '**',
  bulletListMarker: '-',
  linkStyle: 'inlined'
});

export interface ExportOptions {
  filename?: string;
  format?: 'pdf' | 'markdown';
  includeMetadata?: boolean;
}

export interface NoteExportData {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ExportService {
  /**
   * Exporta una nota a Markdown
   */
  static exportToMarkdown(note: NoteExportData, options: ExportOptions = {}): string {
    const { includeMetadata = true } = options;
    
    let markdown = '';
    
    // Agregar metadatos si se solicitan
    if (includeMetadata) {
      markdown += `# ${note.title}\n\n`;
      markdown += `**Creado:** ${note?.createdAt}\n`;
      markdown += `**Actualizado:** ${note?.updatedAt}\n\n`;
      markdown += `---\n\n`;
    }
    
    // Convertir contenido HTML a Markdown
    const contentMarkdown = turndownService.turndown(note.content);
    markdown += contentMarkdown;
    
    return markdown;
  }

  /**
   * Exporta una nota a PDF
   */
  static exportToPDF(note: NoteExportData, options: ExportOptions = {}): void {
    const { filename = `${note.title}.pdf`, includeMetadata = true } = options;
    
    // Crear elemento HTML temporal
    const tempDiv = document.createElement('div');
    tempDiv.style.padding = '20px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.lineHeight = '1.6';
    
    // Agregar título
    const titleElement = document.createElement('h1');
    titleElement.textContent = note.title;
    titleElement.style.color = '#2c3e50';
    titleElement.style.borderBottom = '2px solid #3498db';
    titleElement.style.paddingBottom = '10px';
    tempDiv.appendChild(titleElement);
    
    // Agregar metadatos si se solicitan
    if (includeMetadata) {
      const metadataDiv = document.createElement('div');
      metadataDiv.style.marginBottom = '20px';
      metadataDiv.style.fontSize = '12px';
      metadataDiv.style.color = '#7f8c8d';
      console.log(note?.createdAt);
      
      metadataDiv.innerHTML = `
        <p><strong>Creado:</strong> ${note?.createdAt}</p>
        <p><strong>Actualizado:</strong> ${note?.updatedAt}</p>
      `;
      
      tempDiv.appendChild(metadataDiv);
    }
    
    // Agregar contenido
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = note.content;
    tempDiv.appendChild(contentDiv);
    
    // Configurar opciones de PDF
    const pdfOptions = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true
      },
      jsPDF: { 
        unit: 'mm' as const, 
        format: 'a4', 
        orientation: 'portrait' as const
      }
    };
    
    try {
      // Generar y descargar PDF
      html2pdf(tempDiv, pdfOptions);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      throw new Error('No se pudo generar el PDF');
    }
  }

  /**
   * Exporta múltiples notas a un solo archivo
   */
  static exportMultipleToMarkdown(notes: NoteExportData[], options: ExportOptions = {}): string {
    const { filename = 'notas.md', includeMetadata = true } = options;
    
    let markdown = `# Mis Notas\n\n`;
    markdown += `**Total de notas:** ${notes.length}\n`;
    markdown += `**Exportado:** ${new Date().toLocaleDateString('es-ES')}\n\n`;
    markdown += `---\n\n`;
    
    notes.forEach((note, index) => {
      markdown += `## ${index + 1}. ${note.title}\n\n`;
      
      if (includeMetadata) {
        markdown += `**Creado:** ${note?.createdAt}\n`;
        markdown += `**Actualizado:** ${note?.updatedAt}\n\n`;
      }
      
      const contentMarkdown = turndownService.turndown(note.content);
      markdown += contentMarkdown;
      markdown += `\n\n---\n\n`;
    });
    
    return markdown;
  }

  /**
   * Descarga un archivo de texto
   */
  static downloadText(content: string, filename: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Exporta una nota en el formato especificado
   */
  static exportNote(note: NoteExportData, format: 'pdf' | 'markdown', options: ExportOptions = {}): void {
    const { filename, includeMetadata = true } = options;
    
    const defaultFilename = filename || `${note.title}.${format}`;
    
    try {
      if (format === 'markdown') {
        const markdown = this.exportToMarkdown(note, { includeMetadata });
        this.downloadText(markdown, defaultFilename, 'text/markdown');
      } else if (format === 'pdf') {
        this.exportToPDF(note, { filename: defaultFilename, includeMetadata });
      }
    } catch (error) {
      console.error(`Error al exportar nota a ${format}:`, error);
      throw error;
    }
  }
} 