import React from 'react';
import { ExportService, NoteExportData } from '../services/exportService';
import { downloadMarkdown } from '../utils/exportNote';

interface Props {
  note: NoteExportData;
}

const ExportButtons: React.FC<Props> = ({ note }) => {
  const handleExportPDF = () => {
    ExportService.exportToPDF(note);
  };

  const handleExportMarkdown = () => {
    const markdown = ExportService.exportToMarkdown(note);
    downloadMarkdown(markdown, `${note.title}.md`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <button
        onClick={handleExportPDF}
        className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-400/20"
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          <span>Exportar PDF</span>
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
      
      <button
        onClick={handleExportMarkdown}
        className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-500/20"
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <span>Exportar Markdown</span>
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </div>
  );
};

export default ExportButtons;