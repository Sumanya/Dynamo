import React from 'react';

const WhiteCards = ({ children, className = "", ...props }) => {
    return <div className={`white-card ${className}`} { ...props }>{ children }</div>
}
export default WhiteCards
