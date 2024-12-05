import cx from "classnames";
import React, { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import RouteConstants from "../constants/RouteConstants";
import { UserContext } from "../context/User/UserContext";
import RoleConstants from "../constants/RoleConstants";
import { ThemeContext } from "../context/Theme/ThemeContext";
import tLandingImg from "../images/CustomerFeedback2.gif";
import ContactPage from "./ContactPage";
import styles from "./LandingPage.module.css";


export default function LandingPage() {
  const { user } = useContext(UserContext);
  const { btnColor } = useContext(ThemeContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (
      user?.auth &&
      user?.username !== undefined &&
      user?.userRole !== undefined
    ) {
      if (user.userRole === RoleConstants.STUDENT) {
        navigate(RouteConstants.STUDENT_DASHBOARD);
      } else {
        navigate(RouteConstants.TEACHER_DASHBOARD);
      }
    }
  }, []);

  let goToLogin = () => {
    navigate(RouteConstants.LOGIN);
  };
  let goToSignUp = () => {
    navigate(RouteConstants.TEACHER_SIGNUP);
  };
  return (
    <>
      <Helmet>
        <title>Feedback Portal DJSCE</title>
        <meta
          name="description"
          content="Description about SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/" />
      </Helmet>
      <Container fluid className="px-md-5">
        <Row className="">
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={6}
            className={cx(styles.firstCol, "my-4")}
          >
            <div
              className="flex-row justify-content-center align-items-center"
              style={{ paddingTop: "50px" }}
            >
              <h1
                className={cx(styles.itHeading, "fw-700 display-3 text-wrap")}
                style={{ color: btnColor }}
              >
                Welcome to the IT Feedback Portal
              </h1>
              <h3
                className={cx(
                  styles.description,
                  "my-5 mt-3 fs-4 fw-600 text-wrap"
                )}
              >
                Submit your feedback and help improve the learning experience
              </h3>
              <div
                className={cx(
                  styles.btnDiv,
                  "d-flex flex-column gap-3 w-75 fw-600"
                )}
              >
                <button
                  className={cx(
                    styles.loginButton,
                    "btn text-light fs-5 mt-3 shadow"
                  )}
                  style={{ backgroundColor: btnColor }}
                  onClick={goToLogin}
                >
                  {" "}
                  Login
                </button>
                <button
                  className={cx(styles.signupButton, "btn fs-5 shadow")}
                  style={{ backgroundColor: "#68B3EE", color: btnColor }}
                  onClick={goToSignUp}
                >
                  {" "}
                  Signup (Professors Only)
                </button>
              </div>
            </div>
          </Col>

          <Col className="d-flex justify-content-center align-items-start">
            <img
              src={tLandingImg}
              className="img-fluid"
              alt="signup"
              srcSet=""
            />
          </Col>
        </Row>
      </Container>
      <ContactPage />
    </>
  );
}
