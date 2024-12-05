import cx from "classnames";
import { useContext, useEffect, useMemo, useState } from "react";
import { Col, Container, Form, Image, Modal, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import axiosInstance from "../axios";
import CustomSpinner from "../common/CustomSpinner";
import toastrFunc from "../common/toastrFunc";
import RoleConstants from "../constants/RoleConstants";
import RouteConstants from "../constants/RouteConstants";
import { ThemeContext } from "../context/Theme/ThemeContext";
import { UserContext } from "../context/User/UserContext";
import feedbackImg from "../images/MobileLogin1.gif";
import styles from "./Login.styles.module.css";
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}
function Login() {
  const { primaryColor, btnColor } = useContext(ThemeContext);
  const { login } = useContext(UserContext);
  const { user } = useContext(UserContext);
  let query = useQuery();

  let navigate = useNavigate();
  const goToTeacherSignUp = () => {
    navigate(RouteConstants.TEACHER_SIGNUP);
  };
  const [sapid, setSapId] = useState("");
  const [show, setShow] = useState(false);
  const [passw, setPass] = useState("");

  const [passEmail, setPassEmail] = useState("");
  const [logSpinner, setLogSpinner] = useState(false);
  const [viewPass, setViewPass] = useState(false);
  const [sendMailSpinner, setSendMailSpinner] = useState(false);

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

  let loginUser = async (e) => {
    e.preventDefault();
    setLogSpinner(true);
    var navPage = await login(sapid.trim(), passw);
    if (navPage.isExists === 1) {
      if (
        query.get("nextPage") === undefined ||
        query.get("nextPage") === null ||
        query.get("nextPage") === ""
      ) {
        if (navPage.route !== undefined && navPage.route !== "") {
          if (navPage.isActivated === false) {
            try {
              const res = await axiosInstance.post("/sendOtp", {
                data: { email: sapid.trim() },
              });
              if (res.status === 200) {
                setLogSpinner(false);
                navigate(navPage.route);
              }
            } catch (err) {
              console.log(err);
              localStorage.clear();
              navigate(RouteConstants.LOGIN);
              toastrFunc(
                "error",
                `Error occured sending mail to ${sapid.trim()}`
              );
              setLogSpinner(false);
              //  alert(`Error occured sending mail to ${sapid}`);
            }
          } else {
            setLogSpinner(false);
            navigate(navPage.route);
          }
        } else {
          setLogSpinner(false);
          toastrFunc("error", "Error occured");
          //  alert("Error occured");
        }
      } else {
        if (navPage.isActivated === false) {
          try {
            const res = await axiosInstance.post(`/sendOtp`, {
              data: { email: sapid.trim() },
            });
            if (res.status === 200) {
              setLogSpinner(false);
              toastrFunc(
                "success",
                `OTP has been sent to your mail. Please check you mail.`
                );
                navigate(`${navPage.route}?nextPage=${query.get("nextPage")}`);
              }
            } catch (err) {
              console.log(err);
              localStorage.clear();
              setLogSpinner(false);
              navigate(RouteConstants.LOGIN);
              toastrFunc(
                "error",
                `Error occured sending mail to ${sapid.trim()}`
                );
                //  alert(`Error occured sending mail to ${sapid}`);
              }
            } else {
              setLogSpinner(false);
              navigate(query.get("nextPage"));
            }
          }
        } else {
          setLogSpinner(false)
          toastrFunc("error", "username/password invalid");
      //  alert("username/password invalid");
    }

    // navigate(RouteConstants.STUDENT_DASHBOARD);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function passSubmit(e) {
    setSendMailSpinner(true);
    e.preventDefault();

    const res = await axiosInstance
      .post("resetPasswordMail", { data: { email: passEmail } })
      .catch((err) => {
        console.log(err);
        toastrFunc("info", err);
        setSendMailSpinner(false);
      });

    if (res) {
      //alert("Please check your registered email address to change password");
      setSendMailSpinner(false);
      setShow(false);
      toastrFunc(
        "info",
        "Please check your registered email address to change password"
      );
    }
  }

  return (
    <div style={{ maxWidth: "100%" }}>
      <Helmet>
        <title>Login</title>
        <meta
          name="description"
          content="Login to SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/login" />
      </Helmet>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={passSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
                required
                onChange={(e) => {
                  setPassEmail(e.target.value);
                }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit">
              {sendMailSpinner ? (
                <>
                  <CustomSpinner inBtn={true} size="sm" />
                </>
              ) : (
                <>Send Mail</>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Container fluid>
        <Row>
          <Col
            xs={0}
            sm={0}
            md={7}
            lg={6}
            className="d-none d-md-flex justify-content-center align-items-center"
          >
            <Image src={feedbackImg} className="img-fluid" />
          </Col>
          <Col>
            <div className="d-flex justify-content-center align-items-center">
              <Card
                className="rounded border-0 my-5 shadow"
                style={{ borderColor: primaryColor }}
              >
                <Card.Header
                  className="text-white text-center fs-2 fw-600 d-md-none d-lg-block"
                  style={{ backgroundColor: primaryColor }}
                >
                  DJSCE Feedback Portal
                </Card.Header>

                <Card.Body className="d-flex flex-column gap-4">
                  <Card.Title className="text-center fs-1 fw-bold">
                    LOGIN
                  </Card.Title>

                  <Container className="">
                    <Form
                      className="d-flex flex-column gap-3"
                      onSubmit={loginUser}
                    >
                      <Form.Group className="" controlId="formBasicEmail">
                        <Form.Control
                          type="text"
                          placeholder="Email"
                          required
                          value={sapid}
                          onChange={(e) => {
                            // console.log(e);
                            setSapId(e.target.value);
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="" controlId="formBasicPassword">
                        <div className={cx(styles.wrapperDiv, "")}>
                          <Form.Control
                            type={viewPass ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={passw}
                            onChange={(e) => {
                              setPass(e.target.value);
                            }}
                          />
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

                        <div className="mt-3">
                          <div
                            onClick={handleShow}
                            style={{ cursor: "pointer" }}
                            className={cx(styles.forgotPass, "text-right fs-6")}
                          >
                            Reset Password
                          </div>
                        </div>
                      </Form.Group>
                      <div className="">
                        <Button
                          className={cx(
                            logSpinner
                              ? styles.loginBtnActive
                              : styles.loginBtn,
                            "w-100 d-flex justify-content-center align-items-center gap-1 fw-900 shadow-sm"
                          )}
                          // style={{ backgroundColor: btnColor }}

                          type="submit"
                        >
                          {logSpinner ? (
                            <div className="fw-600">
                              <CustomSpinner inBtn={true} size={"sm"} />
                            </div>
                          ) : (
                            <>
                              <div>Login</div>
                              {/* <i className="fa-solid fa-right-to-bracket"></i> */}
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Container>
                  {/* <Button onClick={handleShow}>Forgot Password</Button> */}

                  <Container fluid className="d-flex flex-column gap-4">
                    <Container fluid className="p-0">
                      <div className="w-100 mt-4 p-0 d-flex align-items-center">
                        <div
                          className={styles.profBorderDiv}
                          style={{ backgroundColor: btnColor }}
                        ></div>

                        <div
                          className={cx(
                            styles.profTextDiv,
                            "w-100 px-2 m-0 text-center text-nowrap fw-600 fs-5"
                          )}
                        >
                          For Professors
                        </div>

                        <div
                          className={styles.profBorderDiv}
                          style={{ backgroundColor: btnColor }}
                        ></div>

                        {/* <div className='ms-2 btn text-primary py-1 m-0 border border-primary border-2 fw-bold' onClick={() => goToSignUp()}>Sign Up</div> */}
                      </div>
                      <div className={"w-100 my-3 fw-900"}>
                        <Button
                          className={cx(styles.teacherSignup, "w-100")}
                          style={{ backgroundColor: btnColor }}
                          onClick={goToTeacherSignUp}
                        >
                          Sign Up
                        </Button>
                      </div>
                    </Container>
                  </Container>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
      {/* </div> */}
    </div>
  );
}

export default Login;
