import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import CustomSpinner from "../../common/CustomSpinner";
import toastrFunc from "../../common/toastrFunc";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import { UserContext } from "../../context/User/UserContext";

function StudentProfile() {
  const { primaryColor } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [mainSpinner, setMainSpinner] = useState(false);
  const [saveSpinner, setSaveSpinner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(user);
    (async () => {
      setMainSpinner(true);
      try {
        const res = await axiosInstance.get("/getProfile", {
          params: { user_id: user.username },
        });
        setUserData(res.data.data);
      } catch (error) {
        console.log(error);
      }
      setMainSpinner(false);
    })();

    return () => {};
  }, []);

  async function submitForm(e) {
    e.preventDefault();
    setSaveSpinner(true);
    try {
      const res = await axiosInstance.post("/saveProfile", {
        data: { user: userData },
      });
      if (res.status === 200) {
        if (res.data.status_code === 200) {
          toastrFunc("success", res.data.status_msg);
          //alert("Saved Successfully");
          navigate("/dashboard");
        } else {
          toastrFunc("error", res.data.status_msg);
        }
      }
      //alert("Saved Successfully");
    } catch (error) {
      toastrFunc("error", error);
      //  alert(error);
    }
    setSaveSpinner(false);
  }

  return (
    <div className="my-5" style={{ width: "100%" }}>
      <Helmet>
        <title>Your Profile</title>
        <meta
          name="description"
          content="Student's Profile SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/sProfile" />
      </Helmet>
      {mainSpinner ? (
        <div className="text-center">
          <CustomSpinner size="lg" />
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          // style={{ height: "100vh" }}
        >
          <Card
            className="rounded mx-auto shadow"
            // style={{ width: "26rem" }}
          >
            <Card.Header
              className="text-white text-center fs-2 fw-600"
              style={{ backgroundColor: primaryColor }}
            >
              DJSCE Feedback Portal
            </Card.Header>
            <Card.Body>
              <Card.Title className="text-center fs-1 fw-bold">
                Set your Profile
              </Card.Title>

              <Container className="mt-3">
                <Form
                  onSubmit={submitForm}
                  className="d-flex flex-column gap-3"
                >
                  <Form.Group className="" controlId="Email">
                    <Form.Control
                      type="email"
                      placeholder="Email*"
                      value={userData.email}
                      disabled
                      required
                    />
                  </Form.Group>
                  <Form.Group className="" controlId="Fname">
                    <Form.Control
                      type="text"
                      required
                      placeholder="Full Name*"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData((usrd) => ({
                          ...usrd,
                          name: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>

                  <Form.Group className="" controlId="Sapid">
                    <Form.Control
                      type="text"
                      required
                      placeholder="SAP ID*"
                      value={userData.sapId}
                      onChange={(e) =>
                        setUserData((usrd) => ({
                          ...usrd,
                          sapId: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                  <Form.Group className="" controlId="Contactnum">
                    <Form.Control
                      type="text"
                      required
                      placeholder="Contact number*"
                      value={userData.mobile}
                      onChange={(e) =>
                        setUserData((usrd) => ({
                          ...usrd,
                          mobile: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                  <Form.Group className="" controlId="age">
                    <Form.Control
                      type="number"
                      required
                      placeholder="Age*"
                      value={userData.age}
                      onChange={(e) =>
                        setUserData((usrd) => ({
                          ...usrd,
                          age: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>

                  <Form.Select
                    required
                    className=""
                    aria-label="Gender"
                    onChange={(e) => {
                      console.log(e.target.value);
                      if (parseInt(e.target.value) === 1) {
                        setUserData((usrd) => ({ ...usrd, gender: "Male" }));
                      } else if (parseInt(e.target.value) === 2) {
                        setUserData((usrd) => ({ ...usrd, gender: "Female" }));
                      } else if (parseInt(e.target.value) === 3) {
                        setUserData((usrd) => ({ ...usrd, gender: "Other" }));
                      }
                    }}
                  >
                    {/* set the text inside of the option tag be the color # */}
                    {/* <option value="">Select Gender</option> */}
                    <option
                      selected={userData.gender === "Male" ? true : false}
                      value={1}
                    >
                      Male
                    </option>
                    <option
                      selected={userData.gender === "Female" ? true : false}
                      value={2}
                    >
                      Female
                    </option>
                    <option
                      selected={userData.gender === "Other" ? true : false}
                      value={3}
                    >
                      Other
                    </option>
                  </Form.Select>
                  <Container fluid className="p-0">
                    <Row className="gap-3">
                      <Col>
                        {userData !== {} && (
                          <Form.Select
                            required
                            className=""
                            aria-label="Year"
                            disabled
                          >
                            {/* set the text inside of the option tag be the color # */}

                            <option
                              selected={userData.year === 1 ? true : false}
                              value="FE"
                            >
                              FE
                            </option>
                            <option
                              selected={userData.year === 2 ? true : false}
                              value="SE"
                            >
                              SE
                            </option>
                            <option
                              selected={userData.year === 3 ? true : false}
                              value="TE"
                            >
                              TE
                            </option>
                            <option
                              selected={userData.year === 4 ? true : false}
                              value="BE"
                            >
                              BE
                            </option>
                          </Form.Select>
                        )}
                      </Col>
                    </Row>
                  </Container>
                  <Button
                    type="submit"
                    className="fw-600"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {saveSpinner ? (
                      <CustomSpinner inBtn={true} size="sm" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </Form>
              </Container>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}

export default StudentProfile;
