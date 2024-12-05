import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const CustomSpinner = ({ size = '', animation = 'border', inBtn = false, color = undefined }) => {
  return (
    <>
      {
        inBtn ?
          (
            <Spinner
              animation={animation}
              size={size}
              as={"span"}
              role="status"
              style={{ color: color === undefined ? "" : color }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <Spinner
              animation={animation}
              size={size}
              role="status"
              style={{ color: color === undefined ? "" : color }}
              className='fs-3'
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )
      }
    </>
  )
}

export default CustomSpinner