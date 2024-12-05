import React from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import RouteConstants from '../../constants/RouteConstants';
import { ThemeContext } from '../../context/Theme/ThemeContext'

export default function TStudent() {
  const {primaryColor}=useContext(ThemeContext);
  let navigate=useNavigate();

  let backButton=()=>{
    navigate(RouteConstants.TEACHER_DASHBOARD)
  }
  return (
    <div className='m-4'>
      <div className='m-3 btn p-2' onClick={()=>backButton()}>
      <i className="fa-solid fa-arrow-left-long"></i> 
        {" Back"}
      </div>

<table className="table table-bordered">
  <thead>
    <tr className="text-white" style={{"backgroundColor":primaryColor}}>
      <th scope="col">#</th>
      <th scope="col">Sap</th>
      <th scope="col">Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry the Bird</td>
    </tr>
  </tbody>
</table>

    </div>
  )
}
