import React from 'react';

export const SketchButton = ({ children, primary = false, secondary = false, onClick, type = "button", style, className = "" }) => {
  let btnClass = "sketch-button " + className;
  if (primary) btnClass += " primary";
  if (secondary) btnClass += " secondary";
  
  return (
    <button className={btnClass.trim()} onClick={onClick} type={type} style={style}>
      {children}
    </button>
  );
};

export const SketchCard = ({ children, decoration = null, style, className = "" }) => {
  let decorClass = "";
  if (decoration === "tape") decorClass = "sketch-card-tape";
  if (decoration === "tack") decorClass = "sketch-card-tack";
  if (decoration === "clip") decorClass = "sketch-card-clip";
  
  return (
    <div className={`sketch-card ${decorClass} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};
