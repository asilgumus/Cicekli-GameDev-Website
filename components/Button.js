import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({
    variant = 'primary',
    icon: Icon,
    children,
    className = '',
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${className}`}
            {...props}
        >
            {Icon && <Icon size={20} className={styles.icon} />}
            {children}
        </button>
    );
};

Button.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger']),
    icon: PropTypes.elementType,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Button;
