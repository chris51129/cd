/**
 * provableFairness - Utilidades para verificar la integridad del protocolo
 * 
 * Arquitectura Web3 Serverless:
 * - En producción, el hash se genera on-chain en el smart contract.
 * - Este módulo simula el flujo para la UI durante desarrollo.
 * - La verificación real ocurrirá comparando con eventos del contrato.
 */

/**
 * Genera un hash de interacción (simulación para UI)
 * En producción: Este valor vendrá del evento emitido por el smart contract.
 */
export const generateGameHash = (seed, result) => {
    const combined = `${seed}-${JSON.stringify(result)}`;

    // Función simple de hash para el ejemplo
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return '0x' + Math.abs(hash).toString(16).padStart(64, '0').slice(0, 64);
};

/**
 * Genera una semilla de servidor usando CSPRNG
 * En producción: La semilla real se generará on-chain usando blockhash + VRF.
 */
export const generateServerSeed = () => {
    const buffer = new Uint8Array(16);
    crypto.getRandomValues(buffer);
    return Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');
};
