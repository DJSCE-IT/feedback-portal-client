import cx from "classnames";
import React, { useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import "./FeedBackForm.css";
import styles from "./FeedbackForm.module.css";

import $ from "jquery";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../axios";
import CustomSpinner from "../../common/CustomSpinner";
import toastrFunc from "../../common/toastrFunc";

import { UserContext } from "../../context/User/UserContext";
import RouteConstants from "../../constants/RouteConstants";

let questions = [
  "Ability to understand student's difficulties and willingness to help them",
  "Commitment to academic work in the class",
  "Regularity and Punctuality",
  "Interaction in the class",
  "Coverage of syllabus",
  "Commitment to academic work in the class",
  "Effective communication of subject matter",
  "Management of lecture & class control",
  "Overall ability to maintain sanctity of Teaching - Learning process",
];

const pracQn = [
  "Planned Laboratory instructions including management of practicals",
  "Uniform coverage of work and guidance for writing journals",
  "Checking of journals and making continuous assessment of term work",
  "Preparation and display of instructional material, charts, models, etc.",
  "Discussion on latest and relevant applications in the field",
]

export default function FeedBackForm() {
  const { bgColor, primaryColor, btnColor, secondaryColor } =
    useContext(ThemeContext);
  const [feedback_form, set_feedback_form] = useState([]);
  const [facultyTeacher, setFacultyTeacher] = useState("");
  const [subject, setSubject] = useState("");
  const [isTheory, setIsTheory] = useState(false);
  const [locationData, setLocationData] = useState({});
  const [qnData, setQnData] = useState([]);
  const [mySugg, setMySugg] = useState("");
  const [formSubmitSpinner, setFormSubmitSpinner] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useContext(UserContext);
  useEffect(() => {
    // console.log(location.state?.data)
    if (location?.state?.data != null) {
      setLocationData(location.state.data);
    } else if (params !== undefined && params?.id !== null) {
      var paramss = new URLSearchParams();
      paramss.append("form_id", params.id);
      paramss.append("user_id", user.username);
      axiosInstance
        .get("/getSDashDataForm", {
          params: paramss,
        })
        .then((res) => {
          if (res.data.status !== 200) {
            toastrFunc("error", res.data.status_msg);
            //alert(res.data.status_msg);
            navigate(RouteConstants.STUDENT_DASHBOARD);
          }
          let resData = {};
          resData = res.data.data;
          resData["form_id"] = params.id;
          resData["username"] = user.username;
          // console.log(resData)
          setLocationData(resData);
        })
        .catch((err) => {
          
          toastrFunc("error", "Error Occured");
          navigate(RouteConstants.STUDENT_DASHBOARD);
          // console.log(err);
        });
    } else {
      toastrFunc("error", "Error Occured");
      //  alert("Error Occured");
      navigate(-1);
      navigate(RouteConstants.STUDENT_DASHBOARD);
    }

    return () => { };
  }, []);


  useEffect(() => {
    if(locationData===null || locationData==={} ){
      setQnData([])
      return;
    }

    if ( locationData.is_theory === false) {
      setQnData(pracQn);
    }
    else if(locationData.is_theory === true) {
      setQnData(questions)
    } else{
      setQnData([])
    }
    return () => { }
  }, [locationData])


  async function formSubmit(e) {
    e.preventDefault();
    var selected = $("input[type='radio']:checked");
    let set_feedback_form_result = [];
    for (let x = 0; x < selected.length; x++) {
      if (selected[x].value.toLowerCase() === "poor") {
        set_feedback_form_result.push(1);
      } else if (selected[x].value.toLowerCase() === "barely acceptable") {
        set_feedback_form_result.push(2);
      } else if (selected[x].value.toLowerCase() === "acceptable") {
        set_feedback_form_result.push(3);
      } else if (selected[x].value.toLowerCase() === "good") {
        set_feedback_form_result.push(4);
      } else if (selected[x].value.toLowerCase() === "very good") {
        set_feedback_form_result.push(5);
      }
    }

    setFormSubmitSpinner(true);
    // console.log(set_feedback_form_result)
    const res = await axiosInstance
      .post("/saveFeedbackFormResult", {
        data: {
          form_field: {
            feedback_form_result: set_feedback_form_result,
            suggestion: mySugg,
          },
          teacher_username: locationData.teacher_email, //teacher email
          subject_id: locationData.subject_id,
          student_username: locationData.username, //student email
          year: locationData.year,
          isTheory: locationData.is_theory,
          form_id: locationData.form_id,
        },
      })
      .catch((err) => {
        console.log(err);
      });

    if (res) {
      if (res.data.status_code === 200) {
        navigate("/dashboard");
      } else {
        toastrFunc("error", res.data.status_msg);
        //  alert(res.data.status_msg);
      }
    }
    setFormSubmitSpinner(false);
  }

  //  useEffect(() => {
  //    axiosInstance
  //      .get("/getFeedbackForm")
  //      .then((res) => {
  //        set_feedback_form(res.data.res_data.feedback_arr);
  //        setFacultyTeacher(res.data.res_data.faculty_teacher);
  //        setSubject(res.data.res_data.subject);
  //      })
  //      .catch((err) => {
  //        console.log(err.data);
  //      });

  //    return () => {};
  //  }, []);

  const TeacherDataDisplayComp = ({ teacher = null, subject = null }) => {
    return (
      <>
        <div
          className={cx(
            styles.teacherDispDiv,
            "col-lg-6 col-md-12 col-sm-12 mt-3"
          )}
        >
          <div
            className="display-5 text-break fw-bold"
            style={{ color: "#235EB7" }}
          >
            {locationData.teacher}
          </div>
          <div className="fs-3 fw-bolder text-break">{locationData.sub} ({locationData.is_theory ? "Theory" : "Practicals"})</div>
        </div>
      </>
    );
  };

  const ParamDataDisplayComp = () => {
    return (
      <>
        <div
          className={cx(
            styles.mainParamDiv,
            "col-lg-6 col-md-12 col-sm-12 mt-3 card text-white fw-bold rounded-4"
          )}
          style={{ backgroundColor: btnColor }}
        >
          <div
            className={cx(
              styles.completeDescDiv,
              "d-flex justify-content-around align-items-center text-center h-100"
            )}
          >
            {[
              "Poor",
              "Barely Acceptable",
              "Acceptable",
              "Good",
              "Very Good",
            ].map((item, key) => (
              <div className={cx("col-2 text-break py-3")} key={key}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          className={cx(styles.mainHalfDescDiv, "row")}
          id={styles.mainHalfDescDiv}
        >
          {["Poor", "Barely Acceptable", "Acceptable", "Good", "Very Good"].map(
            (item, key) => (
              <div
                key={key}
                style={{ backgroundColor: btnColor }}
                className={cx(
                  styles.halfDescDiv,
                  "col-12 d-flex align-items-center justify-content-center gap-1 text-white p-1 border border-1 border-light rounded-3 mt-1 fw-bold"
                )}
              >
                <div>{item}:</div>
                <div>{key + 1}</div>
              </div>
            )
          )}
        </div>
      </>
    );
  };

  return (
    <div
      className={cx(
        styles.mainFbDiv,
        "card border border-3 rounded-4 d-flex flex-column gap-4"
      )}
    >
      <Helmet>
        <title>Feedback Form</title>
        <meta
          name="description"
          content="Feedback form for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/feedBackForm/" />
      </Helmet>
      {/* Header */}
      <div className="row">
        <TeacherDataDisplayComp />
        <ParamDataDisplayComp />
      </div>

      <form onSubmit={formSubmit}>
        <div className="d-flex flex-column gap-4">
          {qnData.map((q, i) => {
            return (
              <div className="row" key={i}>
                {/* Left Question */}
                <div
                  className={cx(
                    styles.leftQnDiv,
                    "col-lg-6 col-md-12 col-sm-12 mt-3"
                  )}
                >
                  <div className={cx(styles.leftQnRow, "row")}>
                    <div
                      className={cx(
                        styles.leftQnNum,
                        "col-lg-1 col-md-1 col-sm-12 text-white text-center rounded-circle d-flex justify-content-center align-items-center mt-2"
                      )}
                      style={{
                        height: "2.2rem",
                        width: "2.2rem",
                        backgroundColor: btnColor,
                      }}
                    >
                      {i + 1}
                    </div>

                    <div className={cx(styles.leftQnGap, "col mt-2")}></div>
                    <div
                      className={cx(
                        styles.leftQn,
                        "col-lg-11 col-md-11 col-sm-12 fs-6 mt-2 ps-1"
                      )}
                    >
                      {" "}
                      {q}
                    </div>
                  </div>
                </div>

                {/* Right Feedback radios */}
                <div className="col-lg-6 col-md-12 col-sm-12 mt-3">
                  <div className="row justify-content-around">
                    {[
                      "Poor",
                      "Barely Acceptable",
                      "Acceptable",
                      "Good",
                      "Very Good",
                    ].map((item, key) => (
                      <div
                        key={key}
                        className="col d-flex flex-column justify-content-center align-items-center gap-2"
                      >
                        <Form.Check
                          type="radio"
                          name={q + i}
                          key={key}
                          value={item}
                          aria-label="Radio button for following text input"
                          required
                        />
                        <div
                          style={{ color: btnColor }}
                          className={cx(styles.rankNum, "fw-bold")}
                        >
                          {key + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 mt-3">
              <div className="row">
                {/* <div className="col-1">
                  </div> */}
                <div
                  className="col-lg-1 col-md-1 col-sm-12 text-white text-center rounded-circle d-flex justify-content-center align-items-center mt-2"
                  style={{
                    height: "2.2rem",
                    width: "2.2rem",
                    backgroundColor: btnColor,
                  }}
                >
                  {qnData.length + 1}
                </div>
                <div className={cx("col mt-2")}></div>
                <div className="col-lg-11 col-md-11 col-sm-12 fs-6 mt-2 ps-1">
                  {" "}
                  {"Any Suggestions"}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 mt-3">
              <div className="form-group">
                <textarea
                  rows="2"
                  type="text"
                  className="form-control me-6"
                  id="exampleInputPassword1"
                  placeholder="Additional Suggestion"
                  onChange={(e) => {
                    setMySugg(e.target.value);
                  }}
                  value={mySugg}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div
          className={cx(
            styles.subBtn,
            "d-flex justify-content-end align-items-center gap-2 mt-4"
          )}
        >
          <button
            className="btn btn-danger"
            // style={{ backgroundColor: primaryColor }}
            onClick={() => navigate("/dashboard")}
          >
            CANCEL
          </button>
          {(qnData!=undefined &&qnData.length>0)&&
            <button
            className="btn btn-primary"
            style={{ backgroundColor: primaryColor }}
            type="submit"
          >
            {formSubmitSpinner ? (
              <>
                <CustomSpinner inBtn={true} size="sm" />
              </>
            ) : (
              <>SUBMIT</>
            )}
          </button>
          }
        </div>
      </form>
    </div>
  );
}
