/**
 * securityProxy - Patrón Proxy para validación de acciones críticas
 * 
 * Intercepta llamadas a funciones sensibles para realizar validaciones
 * de seguridad y logging antes de la ejecución real.
 */
import { secureLog } from './security';

/**
 * Crea un proxy que valida los argumentos antes de llamar a la función original
 * @param {Function} targetFn - Función a proteger
 * @param {Object} rules - Reglas de validación
 * @returns {Proxy} Función protegida
 */
export const createSecureActionProxy = (targetFn, rules = {}) => {
    return new Proxy(targetFn, {
        apply(target, thisArg, args) {
            const { minAmount = 0, requiredFields = [] } = rules;

            // 1. Log de intento (Mantra RSA/SHA - Auditoría)
            secureLog.info(`[SecurityProxy] Action attempt: ${target.name || 'anonymous'}`, { args });

            // 2. Validación de Inyección / Tipos
            const data = args[0];
            if (requiredFields.length > 0 && (!data || typeof data !== 'object')) {
                secureLog.error('[SecurityProxy] Invalid data format');
                return null;
            }

            // 3. Validación de Reglas de Negocio
            for (const field of requiredFields) {
                if (!(field in data)) {
                    secureLog.error(`[SecurityProxy] Missing required field: ${field}`);
                    return null;
                }
            }

            if (data.amount !== undefined && data.amount < minAmount) {
                secureLog.error(`[SecurityProxy] Amount below minimum: ${data.amount} < ${minAmount}`);
                return null;
            }

            // 4. Ejecución si todo es correcto
            secureLog.info(`[SecurityProxy] Checks passed for ${target.name || 'anonymous'}`);
            return Reflect.apply(target, thisArg, args);
        }
    });
};
