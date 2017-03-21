import React from 'react';

const VacanciesProgressBar = (props) => {
  const animatedClass = (props.animated) ? 'progress-bar-animated' : '';
  const progress = props.progress;

  return(
    <div className="progress mt-3">
      <div  className={`progress-bar progress-bar-striped ${ animatedClass }`}
            role="progressbar" aria-valuenow={{ progress }} aria-valuemin="0" aria-valuemax="100"
            style={{ width: progress + '%' }}>
      </div>
    </div>
  )
}

export default VacanciesProgressBar;
