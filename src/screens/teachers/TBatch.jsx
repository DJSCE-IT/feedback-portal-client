import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from '../../context/Theme/ThemeContext'
import { useNavigate } from 'react-router-dom';
import RouteConstants from '../../constants/RouteConstants';

export default function TBatch() {
  const navigate = useNavigate()
  const { secondaryColor, primaryColor } = useContext(ThemeContext);

  let ListItem = (props) => {

    return <div className='container col px-2 py-1 rounded'>
      <div className='container rounded p-1 text-start justify-content-between' style={{ "backgroundColor": secondaryColor }}>
        <div className='row m-2 no-gutters'>
          {props.year} Year

        </div>
        <div className='row mx-0 my-2 no-gutters'>
          <div className='col mx-0 fw-bold'>
            Div:{props.division}

          </div>
          <div className='col mx-0 fst-italic'>
            Students : {props.numberOfStudents}

          </div>
        </div>
      </div>
    </div>
  }

  return (


    <div className='container w-100 no-gutters fs-6 text-start'>
      <div className='row rows-cols-2 text-center'>
        <div className='col-6 fs-5 p-2 my-3'>Batches</div>
        <select
          required
          onChange={(e) => { }}
        >
          <option>Select Year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <div className='btn col fs-5 p-2 text-white m-3 rounded ' style={{ "backgroundColor": primaryColor }} onClick={() => navigate(RouteConstants.TEACHER_ADD_BATCH)}>New +</div>
      </div>


      <div className='row row-cols-1 row-cols-md-2 align-items-around mx-2 my-6'>
        <div className='col'>

          <ListItem division="A" year="Fourth" numberOfStudents="10"></ListItem>
          <ListItem division="A" year="Fourth" numberOfStudents="10"></ListItem>
        </div>

        <div className='col'>
          <ListItem division="A" year="Fourth" numberOfStudents="10"></ListItem>
          <ListItem division="A" year="Fourth" numberOfStudents="10"></ListItem>
        </div>
      </div>


    </div>
  )
}


