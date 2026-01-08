/// <reference types="vite/client" />

/**
 * Vite Environment Types
 * 
 * WHY: TypeScript needs type declarations for Vite's import.meta.env
 */

interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
