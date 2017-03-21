import React from 'react';

export default ({checked, onChange, children}) => {

  return (
    <label className="custom-control custom-checkbox">
      <input
        type="checkbox"
        className="custom-control-input"
        checked={ checked }
        onChange={ onChange } />
      <span className="custom-control-indicator"></span>
      <span className="custom-control-description">
        { children }
      </span>
    </label>
  )
}
