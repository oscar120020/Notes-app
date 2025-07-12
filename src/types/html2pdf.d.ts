declare module 'html2pdf.js' {
  export interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    enableLinks?: boolean;
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      allowTaint?: boolean;
      backgroundColor?: string;
      width?: number;
      height?: number;
      scrollX?: number;
      scrollY?: number;
      windowWidth?: number;
      windowHeight?: number;
    };
    jsPDF?: {
      orientation?: 'portrait' | 'landscape';
      unit?: 'pt' | 'mm' | 'cm' | 'in';
      format?: string | [number, number];
      compress?: boolean;
      precision?: number;
      putOnlyUsedFonts?: boolean;
      floatPrecision?: number | 'smart';
    };
    pagebreak?: {
      mode?: 'avoid-all' | 'css' | 'legacy';
      before?: string;
      after?: string;
      avoid?: string;
    };
  }

  export interface Html2PdfInstance {
    set(options: Html2PdfOptions): Html2PdfInstance;
    from(element: HTMLElement | string): Html2PdfInstance;
    toContainer(): Promise<Html2PdfInstance>;
    toPdf(): Promise<Html2PdfInstance>;
    toImg(): Promise<Html2PdfInstance>;
    toCanvas(): Promise<Html2PdfInstance>;
    outputPdf(type?: string): Promise<Blob>;
    outputImg(type?: string): Promise<string>;
    save(): Html2PdfInstance;
    then(callback: (instance: Html2PdfInstance) => void): Html2PdfInstance;
    catch(callback: (error: Error) => void): Html2PdfInstance;
  }

  export interface Html2PdfStatic {
    (element: HTMLElement | string, options?: Html2PdfOptions): Html2PdfInstance;
    new (element: HTMLElement | string, options?: Html2PdfOptions): Html2PdfInstance;
    set(options: Html2PdfOptions): Html2PdfStatic;
  }

  const html2pdf: Html2PdfStatic;
  export default html2pdf;
} 