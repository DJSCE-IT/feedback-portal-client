import cx from "classnames";
import React, { useContext, useMemo, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import CustomSpinner from "../common/CustomSpinner";
import toastrFunc from "../common/toastrFunc";
import RoleConstants from "../constants/RoleConstants";
import RouteConstants from "../constants/RouteConstants";
import { ThemeContext } from "../context/Theme/ThemeContext";
import { UserContext } from "../context/User/UserContext";
import styles from "./OTP.module.css";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}
function OTP() {
  const { primaryColor } = useContext(ThemeContext);
  const [OTP, setOTP] = useState();
  const { user, logOut, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [vOtpSpinner, setVOtpSpinner] = useState(false);

  let query = useQuery();
  async function submitForm(e) {
    e.preventDefault();

    setVOtpSpinner(true);
    const res = await axiosInstance
      .post("/verifyOtp", { data: { email: user.username, otp: OTP } })
      .catch((err) => {
        console.log(err);
      });

    if (res) {
      if (res.data.status !== 200) {
        toastrFunc("error", res.data.status_msg);
        //  alert(res.data.status_msg);
      } else {
        toastrFunc("success", "OTP verified successfully");
        setUser({
          username: user.username,
          auth: true,
          userRole: RoleConstants.STUDENT,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: user.username,
            auth: true,
            userRole: RoleConstants.STUDENT,
          })
        );
        if (
          query.get("nextPage") === undefined ||
          query.get("nextPage") === null ||
          query.get("nextPage") === ""
        ) {
          navigate("/sProfile");
        } else {
          navigate(query.get("nextPage"));
        }
      }
    }
    setVOtpSpinner(false);
  }

  let signOut = async () => {
    await logOut();
    navigate(RouteConstants.LOGIN);
  };

  return (
    <div>
      <Helmet>
        <title>OTP</title>
        <meta
          name="description"
          content="One Time Password for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/otp" />
      </Helmet>
      <Container
        className={cx(
          styles.mainContainer,
          "my-5 rounded-3 border border-1 p-3 shadow"
        )}
      >
        <h1 className="fs-3 fw-bold text-center">Please confirm OTP</h1>
        <Form onSubmit={submitForm} className="d-flex flex-column gap-3">
          <Form.Group className="">
            <Form.Control
              onChange={(e) => {
                setOTP(e.target.value);
              }}
              value={OTP}
              type="text"
              placeholder="Confirm OTP*"
              required
            />
          </Form.Group>
          <Button
            className="fw-600"
            style={{ backgroundColor: primaryColor }}
            type="submit"
          >
            {vOtpSpinner ? (
              <>
                <CustomSpinner inBtn={true} size="sm" />
              </>
            ) : (
              <>Verify OTP</>
            )}
          </Button>
          <Button
            onClick={() => {
              signOut();
            }}
            className="fw-600 bg-danger border border-0 border-dark"
            style={{ color: "white" }}
          >
            Back
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default OTP;
