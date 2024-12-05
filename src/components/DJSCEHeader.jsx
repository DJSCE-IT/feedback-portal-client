import React, { useContext } from "react";
import styles from "./DJSCEHeader.module.css";
import logo from "../logo.png";
import { Navbar } from "react-bootstrap";
import { UserContext } from "../context/User/UserContext";
import LogoutDropdownBtn from "./LogoutDropdownBtn";
import { ThemeContext } from "../context/Theme/ThemeContext";
import cx from "classnames";
import { useNavigate } from "react-router";
import RouteConstants from "../constants/RouteConstants";
// import { useNavigate } from 'react-router-dom'
// import RouteConstants from '../constants/RouteConstants';

export default function DJSCEHeader() {
  const { user, logOut } = useContext(UserContext);
  const { btnColor } = useContext(ThemeContext);
  const navigate = useNavigate();
  // let navigate = useNavigate();

  // let signOut = async () => {
  //   await logOut();
  //   navigate(RouteConstants.LOGIN);
  // }

  return (
    <Navbar
      className={cx(
        styles.navbar,
        "sticky-top justify-content-between p-0 px-4 m-0"
      )}
      style={{
        backgroundColor: "#fff",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        color: "black",
      }}
      expand="xl"
    >
      <Navbar.Brand
        className={cx(styles.navbarBrand, "navBrandMain m-0")}
        onClick={() => navigate(RouteConstants.LANDING_PAGE)}
      >
        <img
          className="logoImage"
          height="80px"
          width="80px"
          alt="logo"
          src={logo}
        />
        <div className="logoTitle mx-2" style={{ color: btnColor }}>
          <h5 className={cx(styles.navbarFirstHead, "djsce fw-bold")}>DJSCE</h5>
          <h5 className="it fw-bold">INFORMATION TECHNOLOGY</h5>
        </div>
      </Navbar.Brand>
      <div className={styles.navbarBtn}>
        {user.auth && <LogoutDropdownBtn username={user.username} />}
      </div>
    </Navbar>
  );
}
