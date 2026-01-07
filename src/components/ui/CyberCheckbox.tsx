import React from 'react';

import { motion } from 'framer-motion';
import './CyberCheckbox.css';

/**
 * CyberCheckbox - A high-tech alternative to standard checkboxes.
 * Inspired by security-themed components on Uiverse.io.
 */
const CyberCheckbox = ({
    checked,
    onChange,
    label,
    id,
    disabled = false
}) => {
    return (
        <label className={`cyber-checkbox-container ${disabled ? 'disabled' : ''}`} htmlFor={id}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
            <motion.div
                className="cyber-checkbox-box"
                animate={checked ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
            >
                <div className="cyber-checkbox-inner">
                    <motion.div
                        className="cyber-checkbox-mark"
                        initial={false}
                        animate={{ opacity: checked ? 1 : 0 }}
                    />
                </div>
            </motion.div>
            {label && <span className="cyber-checkbox-label">{label}</span>}
            <div className="cyber-checkbox-glitch"></div>
        </label>
    );
};
export default CyberCheckbox;
