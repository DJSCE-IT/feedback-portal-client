import React, { useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from 'react-router-dom'
import RouteConstants from '../constants/RouteConstants';
import { UserContext } from '../context/User/UserContext';
import { ThemeContext } from "../context/Theme/ThemeContext";

const LogoutDropdownBtn = ({ username = "user@gmail.com" }) => {

  const { logOut } = useContext(UserContext);
  const { btnColor } = useContext(ThemeContext);

  let navigate = useNavigate();

  let signOut = async () => {
    await logOut();
    navigate(RouteConstants.LOGIN);
  }

  const SplitUsername = (name) => {
    const arr = name.split('@');
    return arr[0];
  }

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          variant='secondary'
          style={{ "backgroundColor": btnColor }}
          align="end"
          title="Dropdown end"
          id="dropdown-menu-align-end"
          className='fw-600'
        >
          {`Welcome ${SplitUsername(username)}!`}
        </Dropdown.Toggle>

        <Dropdown.Menu className="w-100" variant="dark" align={'end'}>
          <Dropdown.Item onClick={() => signOut()} className='d-flex align-items-center gap-2'>
            <i className="fa-solid fa-right-from-bracket fa-lg" />
            <div>
              Logout
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

export default LogoutDropdownBtn