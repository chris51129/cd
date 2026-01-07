/**
 * Tooltip - Componente de tooltip moderno y accesible
 * 
 * Estética: Minimalismo escandinavo con dark elegance tech
 * 
 * Características:
 * - Position fixed para evitar cortes por overflow
 * - Posicionamiento inteligente
 * - Un solo tap/clic para mostrar en móvil
 * - Hover en desktop
 * - Accesible (ARIA, keyboard)
 * - Soporte modo claro/oscuro
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

import './Tooltip.css';

const Tooltip = ({ children, content, position = 'top', maxWidth = 300 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const isTouchDevice = useRef(false);

    const calculatePosition = useCallback(() => {
        if (!triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 12;

        let top, left;

        // Calcular posición base según position prop
        switch (position) {
            case 'bottom':
                top = triggerRect.bottom + padding;
                left = triggerRect.left + triggerRect.width / 2;
                break;
            case 'top':
            default:
                top = triggerRect.top - padding;
                left = triggerRect.left + triggerRect.width / 2;
                break;
        }

        // Ajustar para no salirse de pantalla
        const halfWidth = Math.min(maxWidth, viewportWidth - 32) / 2;

        if (left - halfWidth < 16) {
            left = halfWidth + 16;
        }
        if (left + halfWidth > viewportWidth - 16) {
            left = viewportWidth - halfWidth - 16;
        }

        // Si no cabe arriba, mostrar abajo
        if (position === 'top' && top < 80) {
            top = triggerRect.bottom + padding;
        }
        if (top > viewportHeight - 120) {
            top = triggerRect.top - padding;
        }

        setCoords({ top, left });
    }, [position, maxWidth]);

    const show = useCallback(() => {
        calculatePosition();
        setIsVisible(true);
    }, [calculatePosition]);

    const hide = useCallback(() => {
        setIsVisible(false);
    }, []);

    // Detectar dispositivo táctil
    useEffect(() => {
        isTouchDevice.current = 'ontouchstart' in window;
    }, []);

    // Cerrar al scroll/resize
    useEffect(() => {
        if (!isVisible) return;

        const handleClose = () => hide();
        window.addEventListener('scroll', handleClose, true);
        window.addEventListener('resize', handleClose);

        return () => {
            window.removeEventListener('scroll', handleClose, true);
            window.removeEventListener('resize', handleClose);
        };
    }, [isVisible, hide]);

    // Cerrar al tocar fuera
    useEffect(() => {
        if (!isVisible) return;

        const handleClickOutside = (e) => {
            if (
                triggerRef.current && !triggerRef.current.contains(e.target) &&
                tooltipRef.current && !tooltipRef.current.contains(e.target)
            ) {
                hide();
            }
        };

        // Pequeño delay para evitar cerrar inmediatamente
        const timer = setTimeout(() => {
            document.addEventListener('touchstart', handleClickOutside);
            document.addEventListener('click', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isVisible, hide]);

    const handleInteraction = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isVisible) {
            hide();
        } else {
            show();
        }
    }, [isVisible, show, hide]);

    const tooltipElement = isVisible ? createPortal(
        <div
            ref={tooltipRef}
            className={`tooltip-content tooltip-${position}`}
            style={{
                top: coords.top,
                left: coords.left,
                maxWidth: `${maxWidth}px`,
            }}
            role="tooltip"
        >
            {content}
        </div>,
        document.body
    ) : null;

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                className="tooltip-trigger"
                onMouseEnter={!isTouchDevice.current ? show : undefined}
                onMouseLeave={!isTouchDevice.current ? hide : undefined}
                onClick={handleInteraction}
                onKeyDown={(e) => e.key === 'Enter' && handleInteraction(e)}
                aria-label="Más información"
            >
                {children}
            </button>
            {tooltipElement}
        </>
    );
};
export default Tooltip;
