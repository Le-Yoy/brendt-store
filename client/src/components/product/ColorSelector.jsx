import React from 'react';
import styles from './ColorSelector.module.css';

const ColorSelector = ({ colors, selectedColor, onColorChange }) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className={styles.colorSelector}>
      <span className={styles.label}>
        Color: <span className={styles.selected}>{selectedColor?.name || 'Select a color'}</span>
      </span>
      
      <div className={styles.options}>
        {colors.map((color, index) => (
          <button
            key={index}
            className={`${styles.option} ${
              selectedColor?.name === color.name ? styles.optionSelected : ''
            }`}
            style={{
              backgroundColor: color.code,
              borderColor: color.name.toLowerCase().includes('black') ? '#333' : color.code
            }}
            onClick={() => onColorChange(color)}
            aria-label={`Select ${color.name}`}
            title={color.name}
          >
            <span className="sr-only">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;