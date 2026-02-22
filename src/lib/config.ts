// Environment configuration and validation
// This file ensures required environment variables are present

export interface EnvConfig {
  OPENAI_API_KEY: string;
  NEXT_PUBLIC_APP_URL: string;
}

// Required environment variables
const REQUIRED_ENV_VARS = ['OPENAI_API_KEY'] as const;

export function getEnvConfig(): EnvConfig {
  return {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  };
}

export function validateEnvVars(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

export function getOpenAIApiKey(): string {
  // Check NEXT_PUBLIC_ variable (exposed by next.config.js)
  if (typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_OPENAI_API_KEY) {
    return (window as any).NEXT_PUBLIC_OPENAI_API_KEY;
  }
  
  // Fallback to localStorage (for dev mode without env var)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('openai_api_key') || '';
  }
  
  return '';
}

export function setOpenAIApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('openai_api_key', key);
  }
}

export function clearOpenAIApiKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('openai_api_key');
  }
}

export function isEnvValid(): boolean {
  const { valid } = validateEnvVars();
  return valid;
}

// Developer Mode functions
const DEV_MODE_KEY = 'devModeEnabled';

export function isDevMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DEV_MODE_KEY) === 'true';
}

export function setDevMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  if (enabled) {
    localStorage.setItem(DEV_MODE_KEY, 'true');
  } else {
    localStorage.removeItem(DEV_MODE_KEY);
  }
}
