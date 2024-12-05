import React from 'react'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RouteConstants from '../constants/RouteConstants'
import { UserContext } from '../context/User/UserContext'

export default function TeacherNavBar() {
  const { logOut } = useContext(UserContext);
  let navigate = useNavigate();
  return (

    <div>
      <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav justify-content-between w-100">
              <Link to={RouteConstants.TEACHER_DASHBOARD} className="nav-item  nav-link col align-items-center">
                <div className="nav-link active d-flex justify-content-center" ><i className="fa-solid fa-house-chimney"></i></div>
                <div className="nav-link text-center" aria-current="page" >Home</div>

              </Link>
              <Link to={RouteConstants.TEACHER_BATCH} className="nav-item nav-link  col">
                <div className="nav-link active d-flex justify-content-center" ><i className="fas fa-folder"></i></div>
                <div className="nav-link text-center" aria-current="page" >Batch</div>
              </Link>
              <Link to={RouteConstants.TEACHER_FEEDBACK} className="nav-item nav-link  col">
                <div className="nav-link active d-flex justify-content-center" ><i className="far fa-file"></i></div>
                <div className="nav-link text-center" aria-current="page" >Feedback</div>
              </Link>
              {/* <Link to={RouteConstants.TEACHER_STUDENT} className="nav-item nav-link  col">
                <div className="nav-link active d-flex justify-content-center" ><i className="fa-solid fa-users"></i></div>
                <div className="nav-link text-center" aria-current="page" >Users</div>
              </Link>
              <Link to={RouteConstants.TEACHER_SUBJECTS} className="nav-item nav-link  col">
                <div className="nav-link active d-flex justify-content-center" ><i className="fa-solid fa-book"></i></div>
                <div className="nav-link text-center" aria-current="page" >Subjects</div>
              </Link>
              <Link to={RouteConstants.TEACHER_QUERIES} className="nav-item nav-link  col">
                <div className="nav-link active d-flex justify-content-center" ><i className="fa-regular fa-question"></i></div>
                <div className="nav-link text-center" aria-current="page" >Queries</div>
              </Link>
              <Link to={RouteConstants.TEACHER_PROFILE} className="nav-item nav-link  nav-link col">
                <div className="nav-link active d-flex justify-content-center" ><i className="fa-solid fa-user"></i></div>
                <div className="nav-link text-center" aria-current="page" >Profile</div>
              </Link> */}

              {/* <li onClick={async () => {
                await logOut();
                navigate(RouteConstants.LOGIN);

              }} className="nav-item col btn">
                <div className="nav-link active d-flex justify-content-center" ><i className="fa-solid fa-right-from-bracket"></i></div>
                <div className="nav-link text-center" aria-current="page" >Log Out</div>
              </li> */}


            </ul>
          </div>
        </div>

      </nav>

    </div>
  )
}
