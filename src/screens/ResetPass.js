import cx from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../axios";
import CustomSpinner from "../common/CustomSpinner";
import toastrFunc from "../common/toastrFunc";
import RouteConstants from "../constants/RouteConstants";
import { ThemeContext } from "../context/Theme/ThemeContext";
import styles from "./ResetPass.module.css";

function ResetPass() {
  const [passw1, setPass1] = useState("");
  const [passw2, setPass2] = useState("");
  const { email, id } = useParams();
  const { btnColor } = useContext(ThemeContext);
  const [resPassSpinner, setResPassSpinner] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    console.log(id);
    console.log(email);
    if (id === undefined || email === undefined) {
      navigate(RouteConstants.LOGIN);
    }
    axiosInstance
      .get("/getPass", { params: { email: email, token: id } })
      .then((res) => {
        //console.log(res.data);
        if (res.data.status !== 200) {
          navigate(RouteConstants.LOGIN);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate(RouteConstants.LOGIN);
      });

    return () => {};
  }, []);

  async function passSubmit(e) {
    e.preventDefault();

    setResPassSpinner(true);
    if (passw1 === passw2) {
      const res = await axiosInstance
        .post("/resetPassword", { data: { email: email, newPassword: passw1 } })
        .catch((err) => {
          console.log(err);
        });
      if (res) {
        if (res.status === 200) {
          toastrFunc("success", "Successfully changed password");
          //alert("Successfully changed password");
          navigate(RouteConstants.LOGIN);
        }
      }
    } else {
      toastrFunc("error", "Password dont match");
      //  alert("Password dont match");
    }
    setResPassSpinner(false);
  }

  return (
    <div id="resetPass">
      <Helmet>
        <title>Reset Password</title>
        <meta
          name="description"
          content="Reset password for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/resetPassword/" />
      </Helmet>
      <Form onSubmit={passSubmit}>
        <h1
          className="fw-900 display-3 mt-5 mb-4 text-center"
          style={{ color: btnColor }}
        >
          Reset Password
        </h1>
        <Container
          className={cx(
            "d-flex flex-column justify-content-center gap-3",
            styles.container
          )}
        >
          <Form.Control
            type="email"
            placeholder="Email*"
            disabled
            value={email}
          />
          <Form.Group
            className="d-flex flex-column gap-3"
            controlId="formBasicPassword"
          >
            <Form.Control
              type="password"
              placeholder="Password*"
              onChange={(e) => {
                setPass1(e.target.value);
              }}
            />
            <Form.Group className="" controlId="formBasicconfirmPassword">
              <Form.Control
                type="password"
                placeholder="Confirm Password*"
                onChange={(e) => {
                  setPass2(e.target.value);
                }}
              />
            </Form.Group>
          </Form.Group>
          <Button
            type="submit"
            className="fw-600"
            style={{ backgroundColor: btnColor, width: "100px" }}
          >
            {resPassSpinner ? (
              <>
                <CustomSpinner inBtn={true} size="sm" />
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </Container>
      </Form>
    </div>
  );
}

export default ResetPass;
