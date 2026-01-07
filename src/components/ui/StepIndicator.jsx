/**
 * StepIndicator - Indicador de pasos del flujo de juego
 * 
 * Implementa la Ley de Hick: Reduce la carga cognitiva mostrando
 * claramente el progreso del usuario en el proceso.
 * 
 * Pasos: 1. Elige Tier → 2. Espera Oponente → 3. ¡Juega!
 */
import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import './StepIndicator.css';

import {
    AnimatedDollar,
    AnimatedHourglass,
    AnimatedGamepad,
    AnimatedShieldCheck
} from './AnimatedLucideIcons';

const STEPS = [
    { id: 1, label: 'Elige Tier', icon: AnimatedDollar },
    { id: 2, label: 'Espera Oponente', icon: AnimatedHourglass },
    { id: 3, label: '¡Juega!', icon: AnimatedGamepad },
];

const StepIndicator = ({ currentStep = 1, className = '' }) => {
    return (
        <div className={`step-indicator ${className}`}>
            <div className="step-track">
                {STEPS.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const isUpcoming = currentStep < step.id;

                    return (
                        <React.Fragment key={step.id}>
                            {/* Connector Line (before step, except first) */}
                            {index > 0 && (
                                <div className={`step-connector ${isCompleted || isCurrent ? 'active' : ''}`}>
                                    <motion.div
                                        className="step-connector-fill"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: isCompleted ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            )}

                            {/* Step Circle */}
                            <motion.div
                                className={`step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isUpcoming ? 'upcoming' : ''}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="step-circle">
                                    {isCompleted ? (
                                        <AnimatedShieldCheck size={20} color="#4ade80" />
                                    ) : (
                                        React.createElement(step.icon, {
                                            size: 20,
                                            color: isCurrent ? '#4ade80' : '#64748b'
                                        })
                                    )}
                                </div>
                                <span className="step-label">{step.label}</span>
                            </motion.div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

StepIndicator.propTypes = {
    currentStep: PropTypes.oneOf([1, 2, 3]).isRequired,
    className: PropTypes.string
};

export default StepIndicator;
