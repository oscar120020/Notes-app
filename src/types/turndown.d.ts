declare module 'turndown' {
  export interface TurndownOptions {
    headingStyle?: 'setext' | 'atx';
    hr?: string;
    bulletListMarker?: '-' | '+' | '*';
    codeBlockStyle?: 'indented' | 'fenced';
    fence?: '```' | '~~~';
    emDelimiter?: '_' | '*';
    strongDelimiter?: '__' | '**';
    linkStyle?: 'inlined' | 'referenced';
    linkReferenceStyle?: 'full' | 'collapsed' | 'shortcut';
    preformattedCode?: boolean;
  }

  export interface TurndownRule {
    filter: string | string[] | ((node: HTMLElement, options: TurndownOptions) => boolean);
    replacement: (content: string, node: HTMLElement, options: TurndownOptions) => string;
  }

  export interface TurndownService {
    turndown(html: string | HTMLElement): string;
    addRule(key: string, rule: TurndownRule): this;
    keep(filter: string | string[] | ((node: HTMLElement, options: TurndownOptions) => boolean)): this;
    remove(filter: string | string[] | ((node: HTMLElement, options: TurndownOptions) => boolean)): this;
    use(plugin: (service: TurndownService) => void): this;
  }

  export default class TurndownService implements TurndownService {
    constructor(options?: TurndownOptions);
    turndown(html: string | HTMLElement): string;
    addRule(key: string, rule: TurndownRule): this;
    keep(filter: string | string[] | ((node: HTMLElement, options: TurndownOptions) => boolean)): this;
    remove(filter: string | string[] | ((node: HTMLElement, options: TurndownOptions) => boolean)): this;
    use(plugin: (service: TurndownService) => void): this;
  }
} 