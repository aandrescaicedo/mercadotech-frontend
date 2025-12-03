import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para Tests End-to-End
 * 
 * Propósito:
 * Definir cómo se ejecutan los tests E2E en el frontend de MercadoTech
 * 
 * Features:
 * - Tests en múltiples navegadores (Chromium, Firefox, WebKit)
 * - Screenshots en failures
    command: 'npm run dev',
        url: 'http://localhost:5173',
            reuseExistingServer: !process.env.CI,
    },
});
