// Definición de tipos para Unlayer Email Editor

declare module 'react-email-editor' {
    import React from 'react';

    export interface UnlayerDesign {
        counters?: {
            u_column?: number;
            u_row?: number;
            [key: string]: any;
        };
        body?: {
            rows: Array<{
                cells: Array<{
                    elements: Array<{
                        content: {
                            text?: string;
                            [key: string]: any;
                        };
                        [key: string]: any;
                    }>;
                    [key: string]: any;
                }>;
                [key: string]: any;
            }>;
            [key: string]: any;
        };
        [key: string]: any;
    }

    export interface ExportData {
        design: UnlayerDesign;
        html: string;
    }

    export interface EditorRef {
        editor: {
            loadDesign: (design: UnlayerDesign) => void;
            saveDesign: (callback: (design: UnlayerDesign) => void) => void;
            exportHtml: (callback: (data: ExportData) => void) => void;
            addEventListener: (event: string, callback: (...args: any[]) => void) => void;
            [key: string]: any;
        };
        [key: string]: any;
    }

    export interface ThemeConfig {
        name?: string;
        extends?: string;
        isDark?: boolean;
        isClassic?: boolean;
        mapping?: Record<string, any>;
        components?: Record<string, any>;
    }

    export type ThemeName = 'dark' | 'light' | 'classic' | string;
    export type ThemeNamePlusLightDark = 'dark' | 'light' | ThemeName;

    export interface AppearanceConfig {
        theme?: ThemeNamePlusLightDark | ThemeConfig;
        panels?: {
            tools?: {
                dock?: 'left' | 'right';
            };
        };
    }

    export interface Config {
        projectId?: number;
        tools?: Record<string, any>;
        appearance?: AppearanceConfig;
        customCSS?: string[];
        [key: string]: any;
    }

    export interface EmailEditorProps {
        ref?: React.RefObject<EditorRef>;
        onReady?: (unlayer: EditorRef['editor']) => void;
        onDesignLoad?: (data: UnlayerDesign) => void;
        onDesignSave?: (data: UnlayerDesign) => void;
        onDesignExport?: (data: ExportData) => void;
        minHeight?: string | number;
        options?: Config;
        [key: string]: any;
    }

    const EmailEditor: React.FC<EmailEditorProps>;
    export default EmailEditor;
} 