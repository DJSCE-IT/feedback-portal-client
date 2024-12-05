import cx from "classnames";
import React, { useContext, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import CustomSpinner from "../../common/CustomSpinner";
import toastrFunc from "../../common/toastrFunc";
import RouteConstants from "../../constants/RouteConstants";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import tSignUpImg from "../../images/SignUp1.gif";
import styles from "./TSignup.module.css";

const TSignup = () => {
  const { primaryColor, btnColor } = useContext(ThemeContext);
  let navigate = useNavigate();
  const [viewPass, setViewPass] = useState(false);
  const [formData, setFormData] = useState({});
  const [teacherSpinner, setTeacherSpinner] = useState(false);

  let goToLogin = () => {
    navigate(RouteConstants.LOGIN);
  };
  function handleChange(e) {
    console.log(e.target.name);
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setTeacherSpinner(true);
    if (formData["password"] === formData["confirm_password"]) {
      await axiosInstance
        .post("/createTeacher", { data: formData })
        .then((res) => {
          console.log(res.data);
          if (res.data.status === 200) {
            navigate("/");
          } else {
            toastrFunc("error", res.data.status_msg);
            //alert(res.data.status_msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toastrFunc("error", "Password and confirm password dosnt match");
      //  alert("Password and confirm password dosnt match");
    }
    setTeacherSpinner(false);
  }
  return (
    <>
      <Helmet>
        <title>Signup for Teacher</title>
        <meta
          name="description"
          content="Teacher's signup for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/tSignup" />
      </Helmet>
      <Container fluid className="px-md-5">
        <Row className="my-5">
          <Col xs={12} sm={12} md={5} lg={6}>
            <div className="d-flex justify-content-center align-items-center">
              <Card className="rounded mb-5 shadow border-0">
                <Card.Header
                  className="d-md-none d-lg-block text-white text-center fs-2 fw-600"
                  style={{ backgroundColor: primaryColor }}
                >
                  DJSCE Feedback Portal
                </Card.Header>
                <Card.Body>
                  <Card.Title className="text-center fs-1 fw-bold">
                    SIGN UP
                  </Card.Title>

                  <Container className="mt-3">
                    <Form
                      className="d-flex flex-column gap-3"
                      onSubmit={handleSubmit}
                    >
                      <Form.Group className="" controlId="Fname">
                        <Form.Control
                          required
                          type="text"
                          name="first_name"
                          placeholder="First Name*"
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group className="" controlId="Lname">
                        <Form.Control
                          required
                          type="text"
                          name="last_name"
                          placeholder="Last Name*"
                          onChange={handleChange}
                        />
                      </Form.Group>
                      {/* <Form.Group className="" controlId="Sapid">
                          <Form.Control required type="text" placeholder="SAP ID*" />
                        </Form.Group> */}
                      {/* <Form.Group className="" controlId="Contactnum">
                          <Form.Control required type="text" placeholder="Contact number*" />
                        </Form.Group> */}
                      <Form.Group className="" controlId="Email">
                        <Form.Control
                          required
                          type="email"
                          name="email"
                          placeholder="Email*"
                          onChange={handleChange}
                        />
                      </Form.Group>

                      {/* 
                        <Container fluid className='p-0'>
                          <Row className='gap-3'>
                            <Col>
                              <Form.Select className='' aria-label="Year">                            
                                <option style={{ textColor: "#707980" }} >Year*</option>
                                <option value="FE">FE</option>
                                <option value="SE">SE</option>
                                <option value="TE">TE</option>
                                <option value="BE">BE</option>
                              </Form.Select>
                            </Col>
                            <Col>
                              <Form.Select className='' aria-label="Div">
                                <option>Div*</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                              </Form.Select>
                            </Col>

                          </Row>
                        </Container> 
                        */}

                      <Container fluid className="p-0">
                        <Form.Group
                          className="d-flex flex-column gap-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Control
                            required
                            type="password"
                            name="password"
                            placeholder="Password*"
                            onChange={handleChange}
                          />
                          <Form.Group
                            className=""
                            controlId="formBasicconfirmPassword"
                          >
                            <Form.Control
                              required
                              type="password"
                              name="confirm_password"
                              placeholder="Confirm Password*"
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Form.Group>
                      </Container>

                      <div className="w-100 p-0 d-flex align-items-center">
                        <div
                          className={styles.signUpBorderDiv}
                          style={{ backgroundColor: btnColor }}
                        ></div>
                        <div
                          className={cx(
                            styles.signUpTextDiv,
                            "w-100 px-2 m-0 text-center text-nowrap fw-600 fs-5"
                          )}
                        >
                          Admin Provided
                        </div>
                        <div
                          className={styles.signUpBorderDiv}
                          style={{ backgroundColor: btnColor }}
                        ></div>
                      </div>

                      <Form.Group
                        controlId="formAdminConfirmPassword"
                        className={cx(styles.adminPassForm, "")}
                      >
                        <div className={styles.wrapperDiv}>
                          <Form.Control
                            required
                            type={viewPass ? "text" : "password"}
                            name="secret_key"
                            placeholder="Secret Key*"
                            onChange={handleChange}
                          ></Form.Control>
                          <i
                            style={{ cursor: "pointer", color: btnColor }}
                            className={cx(
                              styles.icon,
                              "fa-regular fa-lg",
                              viewPass === false ? "fa-eye" : "fa-eye-slash"
                            )}
                            onClick={() => setViewPass(!viewPass)}
                          />
                        </div>
                      </Form.Group>

                      <div className="">
                        <Button
                          className="fs-5 fw-bold w-100"
                          type="submit"
                          variant="primary"
                          style={{ backgroundColor: btnColor }}
                        >
                          {teacherSpinner ? (
                            <>
                              <CustomSpinner inBtn={true} size="sm" />
                            </>
                          ) : (
                            "Register"
                          )}
                        </Button>
                      </div>
                    </Form>

                    <div className="text-center mt-4">
                      Already have an account?
                      <span
                        className="ms-2 text-primary btn mx-0 border border-primary border-2 fw-bold"
                        onClick={() => {
                          goToLogin();
                        }}
                      >
                        Login
                      </span>
                    </div>
                  </Container>
                </Card.Body>
              </Card>
            </div>
          </Col>

          <Col className="d-flex justify-content-center align-items-center">
            <img
              src={tSignUpImg}
              className="img-fluid"
              alt="signup"
              srcSet=""
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TSignup;
