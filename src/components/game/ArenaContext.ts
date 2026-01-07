/**
 * ArenaContext - Contexto para el patrón Compound Components en GameArena
 */
import React, { createContext, useContext } from 'react';

const ArenaContext = createContext();

export const useArena = () => {
    const context = useContext(ArenaContext);
    if (!context) {
        throw new Error('useArena debe usarse dentro de un GameArena');
    }
    return context;
};

export default ArenaContext;
