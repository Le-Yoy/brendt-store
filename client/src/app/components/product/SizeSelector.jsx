import React, { useState } from 'react';
import './SizeSelector.css';

const SizeSelector = ({ sizes, selectedSize, onSizeChange }) => {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  if (!sizes || sizes.length === 0) {
    return null;
  }

  const toggleSizeGuide = () => {
    setSizeGuideOpen(!sizeGuideOpen);
  };

  // Check if we're using EU shoe sizes or clothing sizes
  const isShoeSize = sizes[0].hasOwnProperty('eu');

  return (
    <div className="size-selector">
      <div className="size-selector__header">
        <span className="size-selector__label">
          Size: <span className="size-selector__selected">
            {selectedSize ? (isShoeSize ? `EU ${selectedSize.eu}` : selectedSize.name) : 'Select a size'}
          </span>
        </span>
        <button 
          className="size-selector__guide-button"
          onClick={toggleSizeGuide}
          type="button"
        >
          Size Guide
        </button>
      </div>
      
      <div className="size-selector__options">
        {sizes.map((size, index) => (
          <button
            key={index}
            className={`size-selector__option ${
              selectedSize && (isShoeSize ? 
                selectedSize.eu === size.eu : 
                selectedSize.name === size.name) ? 
                'size-selector__option--selected' : ''
            } ${!size.available ? 'size-selector__option--unavailable' : ''}`}
            onClick={() => size.available && onSizeChange(size)}
            disabled={!size.available}
            aria-label={`Size ${isShoeSize ? `EU ${size.eu}` : size.name}${!size.available ? ' - Out of stock' : ''}`}
          >
            {isShoeSize ? size.eu : size.name}
          </button>
        ))}
      </div>

      {!selectedSize && (
        <p className="size-selector__message">Please select a size</p>
      )}

      {sizeGuideOpen && (
        <div className="size-guide">
          <div className="size-guide__overlay" onClick={toggleSizeGuide}></div>
          <div className="size-guide__content">
            <button className="size-guide__close" onClick={toggleSizeGuide} aria-label="Close size guide">
              ×
            </button>
            <h3 className="size-guide__title">Size Guide</h3>
            {isShoeSize ? (
              <table className="size-guide__table">
                <thead>
                  <tr>
                    <th>EU</th>
                    <th>UK</th>
                    <th>US</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((size, index) => (
                    <tr key={index}>
                      <td>{size.eu}</td>
                      <td>{size.uk}</td>
                      <td>{size.us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="size-guide__table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (cm)</th>
                    <th>Waist (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>S</td>
                    <td>92-97</td>
                    <td>78-83</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>98-103</td>
                    <td>84-89</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>104-109</td>
                    <td>90-95</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>110-115</td>
                    <td>96-101</td>
                  </tr>
                  <tr>
                    <td>XXL</td>
                    <td>116-121</td>
                    <td>102-107</td>
                  </tr>
                </tbody>
              </table>
            )}
            <p className="size-guide__note">
              {isShoeSize ? 
                'If you are between sizes, we recommend sizing up.' : 
                'For a more relaxed fit, we recommend sizing up.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeSelector;