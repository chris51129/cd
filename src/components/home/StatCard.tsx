/**
 * StatCard - Card for displaying statistics with count-up animation
 * 
 * OPTIMIZACIÓN: Memoizado con React.memo para evitar re-renders innecesarios
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

const StatCard = memo(({ label, value, suffix = "", delay, Icon }) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''));
    const isNumber = !isNaN(numValue);
    const count = useCountUp(isNumber ? numValue : 0);

    // Simplificación de lógica de visualización: menos fragmentación, más limpieza
    const displayValue = isNumber ? (
        `${value.includes('$') ? '$' : ''}${count.toLocaleString()}${suffix}${value.includes('M') ? 'M' : ''}${value.includes('+') ? '+' : ''}${value.includes('s') ? 's' : ''}`
    ) : value;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className="stat-card scandi-panel group"
        >
            <div className="stat-card-inner">
                {Icon && (
                    <div className="stat-icon-scandi">
                        <Icon size={28} strokeWidth={1.25} />
                    </div>
                )}

                <div className="stat-content-scandi">
                    <div className="stat-value-scandi">
                        {displayValue}
                    </div>
                    <div className="stat-label-scandi">{label}</div>
                </div>
            </div>
            <div className="scandi-border-refined" />
        </motion.div>
    );
});

StatCard.displayName = 'StatCard';

export default StatCard;
