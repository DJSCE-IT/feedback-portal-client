import { useContext } from "react";
import { Col, Container, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "../App.css";
import RouteConstants from "../constants/RouteConstants";
import { ThemeContext } from "../context/Theme/ThemeContext";

function Login() {
  const { primaryColor } = useContext(ThemeContext);
  const { btnColor } = useContext(ThemeContext);

  let navigate = useNavigate();
  let goToLogin = () => {
    navigate(RouteConstants.LOGIN);
  };

  return (
    <div className="mt-5" style={{ width: "100%" }}>
      <Helmet>
        <title>Register</title>
        <meta
          name="description"
          content="Registration for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/signup" />
      </Helmet>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Card className="rounded mx-auto" style={{ width: "26rem" }}>
          <Card.Header
            className="text-white text-center fs-2"
            style={{ backgroundColor: primaryColor }}
          >
            DJSCE Feedback Portal
          </Card.Header>
          <Card.Body>
            <Card.Title className="text-center fs-1 fw-bold">
              SIGN UP
            </Card.Title>

            <Container className="mt-3">
              <Form className="d-flex flex-column gap-3">
                <Form.Group className="" controlId="Fname">
                  <Form.Control type="text" placeholder="First Name*" />
                </Form.Group>
                <Form.Group className="" controlId="Lname">
                  <Form.Control type="text" placeholder="Last Name*" />
                </Form.Group>
                <Form.Group className="" controlId="Sapid">
                  <Form.Control type="text" placeholder="SAP ID*" />
                </Form.Group>
                <Form.Group className="" controlId="Contactnum">
                  <Form.Control type="text" placeholder="Contact number*" />
                </Form.Group>
                <Form.Group className="" controlId="Email">
                  <Form.Control type="email" placeholder="Email*" />
                </Form.Group>
                <Container fluid className="p-0">
                  <Row className="gap-3">
                    <Col>
                      <Form.Select className="" aria-label="Year">
                        {/* set the text inside of the option tag be the color # */}
                        <option style={{ textColor: "#707980" }}>Year*</option>
                        <option value="FE">FE</option>
                        <option value="SE">SE</option>
                        <option value="TE">TE</option>
                        <option value="BE">BE</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Select className="" aria-label="Div">
                        <option>Div*</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Container>
                <Container fluid className="p-0">
                  <Form.Group
                    className="d-flex flex-column gap-3"
                    controlId="formBasicPassword"
                  >
                    <Form.Control type="password" placeholder="Password*" />
                    <Form.Group
                      className=""
                      controlId="formBasicconfirmPassword"
                    >
                      <Form.Control
                        type="password"
                        placeholder="ConfirmPassword*"
                      />
                    </Form.Group>
                  </Form.Group>
                </Container>
              </Form>
              <p className="text-center mt-3">
                Already have an account?
                <span
                  className="ms-2 text-primary btn mx-0 border border-primary border-2 fw-bold"
                  onClick={() => goToLogin()}
                >
                  Login
                </span>
              </p>
              <div className="mt-2 d-grid col-7 mx-auto">
                <Button
                  className="fs-5 fw-bold"
                  variant="primary"
                  style={{ backgroundColor: btnColor }}
                >
                  Register
                </Button>
              </div>
            </Container>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Login;
