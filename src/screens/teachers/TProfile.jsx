import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import CustomSpinner from "../../common/CustomSpinner";
import toastrFunc from "../../common/toastrFunc";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import { UserContext } from "../../context/User/UserContext";

function TProfile() {
  const navigate = useNavigate();
  const { primaryColor, btnColor } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [profileSpinner, setProfileSpinner] = useState(false);
  const [saveSpinner, setSaveSpinner] = useState(false);

  useEffect(() => {
    (async () => {
      setProfileSpinner(true);
      try {
        const res = await axiosInstance.get("/getProfile", {
          params: { user_id: user.username },
        });
        if (res.status === 200) {
          // console.log(res);
          setUserData(res.data.data);
        }
      } catch (err) {
        toastrFunc("error", err);
        //alert(err);
      }
      setProfileSpinner(false);
    })();
    // axiosInstance.get("/getProfile", { params: { user_id: user.username } })
    //   .then((res) => {
    //     setUserData(res.data.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

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
          navigate("/tdashboard");
        } else {
          toastrFunc("error", res.data.status_msg);
        }
      }
    } catch (err) {
      toastrFunc("error", err);
      //  alert(err);
    }
    setSaveSpinner(false);

    // axiosInstance
    //   .post("/saveProfile", { data: { user: userData } })
    //   .then((res) => {
    //     if (res.data.data === "Success") {
    //       alert("Saved Successfully");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }
  return (
    <>
      <Helmet>
        <title>Your Profile</title>
        <meta
          name="description"
          content="Teacher's Profile for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/tProfile" />
      </Helmet>
      {profileSpinner ? (
        <div className="text-center mt-5">
          <CustomSpinner color={btnColor} size="lg" />
        </div>
      ) : (
        <div className="my-5" style={{ width: "100%" }}>
          <div
            className="d-flex justify-content-center align-items-center"
            // style={{ height: "100vh" }}
          >
            <Card
              className="rounded mx-auto shadow-sm mt-3"
              // style={{ maxWidth: "26rem" }}
            >
              <Card.Header
                className="text-white text-center fs-2"
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
                        if (parseInt(e.target.value) === 1) {
                          setUserData((usrd) => ({ ...usrd, gender: "Male" }));
                        } else if (parseInt(e.target.value) === 2) {
                          setUserData((usrd) => ({
                            ...usrd,
                            gender: "Female",
                          }));
                        } else if (parseInt(e.target.value) === 3) {
                          setUserData((usrd) => ({ ...usrd, gender: "Other" }));
                        }
                      }}
                    >
                      {/* set the text inside of the option tag be the color # */}
                      <option value="">Select Gender</option>
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

                    <Button
                      type="submit"
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
        </div>
      )}
    </>
  );
}

export default TProfile;
