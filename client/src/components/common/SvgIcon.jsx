import React from 'react';

const SvgIcon = (props) => {
  // Convert HTML-style attribute names to React camelCase
  const {
    class: className,
    'stroke-width': strokeWidth,
    'stroke-linecap': strokeLinecap,
    'stroke-linejoin': strokeLinejoin,
    'fill-rule': fillRule,
    'clip-rule': clipRule,
    ...otherProps
  } = props;

  // Compose the React-friendly attributes
  const reactProps = {
    ...otherProps,
    className: className || props.className,
    strokeWidth: strokeWidth || props.strokeWidth,
    strokeLinecap: strokeLinecap || props.strokeLinecap,
    strokeLinejoin: strokeLinejoin || props.strokeLinejoin,
    fillRule: fillRule || props.fillRule,
    clipRule: clipRule || props.clipRule,
  };

  return <svg {...reactProps}>{props.children}</svg>;
};

export default SvgIcon;