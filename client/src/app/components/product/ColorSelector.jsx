import React from 'react';
import './ColorSelector.css';

const ColorSelector = ({ colors, selectedColor, onColorChange }) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="color-selector">
      <span className="color-selector__label">Color: <span className="color-selector__selected">{selectedColor?.name || 'Select a color'}</span></span>
      
      <div className="color-selector__options">
        {colors.map((color, index) => (
          <button
            key={index}
            className={`color-selector__option ${
              selectedColor?.name === color.name ? 'color-selector__option--selected' : ''
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