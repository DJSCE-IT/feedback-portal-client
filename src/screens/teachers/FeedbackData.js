import cx from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CSVLink } from "react-csv";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios";
import CustomSpinner from "../../common/CustomSpinner";
import toastrFunc from "../../common/toastrFunc";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import GetDate from "../../utilities/GetDate";
import GetStudentYear from "../../utilities/GetStudentYear";
import CatRatingBar from "./FeedbackCharts/CatRatingBar";
import OverallRating from "./FeedbackCharts/OverallRating";
import TopBoxPlot from "./FeedbackCharts/TopBoxPlot";
import styles from "./FeedbackData.module.css";
import { UserContext } from "../../context/User/UserContext";

let theroyQuestions = {
  "0": "Ability to understand student's difficulties and willingness to help them",
  "1": "Commitment to academic work in the class",
  "2": "Regularity and Punctuality",
  "3": "Interaction in the class",
  "4": "Coverage of syllabus",
  "5": "Commitment to academic work in the class",
  "6": "Effective communication of subject matter",
  "7": "Management of lecture & class control",
  "8": "Overall ability to maintain sanctity of Teaching - Learning process",
};

let practicalQuestions = {
  "0": "Planned Laboratory instructions including management of practicals",
  "1": "Uniform coverage of work and guidance for writing journals",
  "2": "Checking of journals and making continuous assessment of term work",
  "3": "Preparation and display of instructional material, charts, models, etc.",
  "4": "Discussion on latest and relevant applications in the field",
};
function FeedbackData() {
  const navigate = useNavigate();
  const [feedData, setFeedbackData] = useState(null);
  const { btnColor } = useContext(ThemeContext);
  const [totalFilledData, setTotalFilledData] = useState([0, 0]);
  const [averageRating, setAverageRating] = useState([0]);
  const { user } = useContext(UserContext);
  const [feedbackByCategory, setFeedbackByCategory] = useState([
    {
      id: "0",
      qn: "Ability to understand student's difficulties and willingness to help them",
      rating: [],
      distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
    {
      id: "1",
      qn: "Commitment to academic work in the class",
      rating: [],
      distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
    {
      id: "2",
      qn: "Regularity and Punctuality",
      rating: [],
      distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
    {
      id: "3",
      qn: "Interaction in the class",
      rating: [],
      distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
    {
      id: "4",
      qn: "Coverage of syllabus",
      rating: [],
      distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
    {
      id: "5",
      qn: "Commitment to academic work in the class",
      rating: [],
      distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
    {
      id: "6",
      qn: "Effective communication of subject matter",
      rating: [],
      distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
    {
      id: "7",
      qn: "Management of lecture & class control",
      rating: [],
      distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
    {
      id: "8",
      qn: "Overall ability to maintain sanctity of Teaching - Learning process",
      rating: [],
      distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
  ]);
  const params = useParams();
  const [subject_name, set_subject_name] = useState("");
  const [year, set_year] = useState(0);
  const [isActive, set_isActive] = useState(false);
  const [date, set_date] = useState(new Date());
  const [isTheory, set_isTheory] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [bacthes, setBatches] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [nonFilled, setNonFilled] = useState([]);
  const [teacher, setTeacher] = useState("");
  const [sendRemSpin, setSendRemSpin] = useState(false);

  useEffect(() => {
    (async () => {
      setSpinner(true);
      if (params.id) {
        const res = await axiosInstance
          .get("/getFeedbackData", {
            params: {
              form_id: params.id,
            },
          })
          .catch((err) => {
            toastrFunc("error", err);
            //alert(err);
            setSpinner(false);
          });

        if (res.status === 200) {
          // console.log(res.data);

          set_subject_name(res.data.subject_name);
          set_year(res.data.year);
          set_isActive(res.data.isActive);
          set_date(res.data.date);
          set_isTheory(res.data.isTheory);
          let categories = [];
          if (res.data.isTheory) {
            categories = Object.keys(theroyQuestions).map((i) => {
              return {
                id: i,
                qn: theroyQuestions[i],
                rating: [],
                distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
              };
            });
          } else {
            categories = Object.keys(practicalQuestions).map((i) => {
              return {
                id: i,
                qn: practicalQuestions[i],
                rating: [],
                distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
              };
            });
          }
          setFeedbackByCategory(categories);

          setFeedbackData(res.data);
          setTeacher(res.data.teacher);
          if (res.data?.batch_list.length > 0) {
            setBatches(res.data?.batch_list);
          }
        }
      } else {
        setSpinner(false);
        navigate("/tdashboard");
      }
      setSpinner(false);
    })();

    return () => {};
  }, []);

  // useEffect(() => {

  //   if (isTheory === false) {
  //     setFeedbackByCategory([
  //       {
  //         id: "0",
  //         qn: "Planned Laboratory instructions including management of practicals",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //       {
  //         id: "1",
  //         qn: "Uniform coverage of work and guidance for writing journals",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //       {
  //         id: "2",
  //         qn: "Checking of journals and making continuous assessment of term work",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //       {
  //         id: "3",
  //         qn: "Preparation and display of instructional material, charts, models, etc.",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //       {
  //         id: "4",
  //         qn: "Discussion on latest and relevant applications in the field",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //     ])
  //   }
  //   else {
  //     setFeedbackByCategory([
  //       {
  //         id: "0",
  //         qn: "Ability to understand student's difficulties and willingness to help them",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //       {
  //         id: "1",
  //         qn: "Commitment to academic work in the class",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //       {
  //         id: "2",
  //         qn: "Regularity and Punctuality",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //       {
  //         id: "3",
  //         qn: "Interaction in the class",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //       {
  //         id: "4",
  //         qn: "Coverage of syllabus",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //       {
  //         id: "5",
  //         qn: "Commitment to academic work in the class",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //       {
  //         id: "6",
  //         qn: "Effective communication of subject matter",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //       {
  //         id: "7",
  //         qn: "Management of lecture & class control",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //       {
  //         id: "8",
  //         qn: "Overall ability to maintain sanctity of Teaching - Learning process",
  //         rating: [],
  //         distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  //       },
  //     ])
  //   }
  //   console.log(feedbackByCategory);
  //   return () => { }
  // }, [isTheory])

  useEffect(() => {
    // if (isTheory === false) {
    //   setFeedbackByCategory([
    //     {
    //       id: "0",
    //       qn: "Planned Laboratory instructions including management of practicals",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //     {
    //       id: "1",
    //       qn: "Uniform coverage of work and guidance for writing journals",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //     {
    //       id: "2",
    //       qn: "Checking of journals and making continuous assessment of term work",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //     {
    //       id: "3",
    //       qn: "Preparation and display of instructional material, charts, models, etc.",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //     {
    //       id: "4",
    //       qn: "Discussion on latest and relevant applications in the field",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //   ])
    // }
    // else {
    //   setFeedbackByCategory([
    //     {
    //       id: "0",
    //       qn: "Ability to understand student's difficulties and willingness to help them",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //     {
    //       id: "1",
    //       qn: "Commitment to academic work in the class",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //     {
    //       id: "2",
    //       qn: "Regularity and Punctuality",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //     {
    //       id: "3",
    //       qn: "Interaction in the class",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //     {
    //       id: "4",
    //       qn: "Coverage of syllabus",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //     {
    //       id: "5",
    //       qn: "Commitment to academic work in the class",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //     {
    //       id: "6",
    //       qn: "Effective communication of subject matter",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //     {
    //       id: "7",
    //       qn: "Management of lecture & class control",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //     {
    //       id: "8",
    //       qn: "Overall ability to maintain sanctity of Teaching - Learning process",
    //       rating: [],
    //       distinctCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    //     },
    //   ])
    // }
    // console.log(feedbackByCategory);

    const countTotalFilledFeedback = () => {
      const fillArr = [0, 0];
      if (feedData !== null) {
        const dataArr = feedData.isfilled;
        for (let i = 0; i < dataArr.length; i++) {
          if (dataArr[i].isfilled === true) fillArr[0]++;
          else fillArr[1]++;
        }
        setTotalFilledData(fillArr);
        setNonFilled(
          feedData.isfilled.filter((student) => student.isfilled === false)
        );
      }
    };

    const calcBoxPlotRatingArr = () => {
      const rateArr = [];
      if (feedData !== null) {
        let dataArr = feedData.feedbacres;
        // dataArr = [[5, 5, 4, 2, 3, 1, 1, 5, 4], [3, 2, 4, 4, 2, 5, 3, 5, 4], [5, 1, 2, 2, 4, 1, 2, 5, 4], [5, 5, 4, 2, 3, 1, 1, 5, 4], [3, 2, 4, 4, 2, 5, 3, 5, 4], [5, 1, 2, 2, 4, 1, 2, 5, 4], [5, 5, 4, 2, 3, 1, 1, 5, 4], [3, 2, 4, 4, 2, 5, 3, 5, 4], [5, 1, 2, 2, 4, 1, 2, 5, 4]]
        for (let i = 0; i < dataArr.length; i++) {
          rateArr.push(
            (dataArr[i].reduce((a, b) => a + b, 0) / dataArr[i].length).toFixed(
              2
            )
          );
        }
        setAverageRating(rateArr);
      }
    };

    const setfeedbackByCatArr = async () => {
      if (feedData !== null) {
        const dataArr = feedData.feedbacres;
        for (let i = 0; i < dataArr.length; i++) {
          for (let j = 0; j < dataArr[i].length; j++) {
            setFeedbackByCategory(
              feedbackByCategory[j].rating.push(dataArr[i][j])
            );
          }
        }

        for (let i = 0; i < feedbackByCategory.length; i++) {
          let tempObj = {};
          let rateArr = feedbackByCategory[i].rating;
          for (let j = 0; j < rateArr.length; j++) {
            if (tempObj.hasOwnProperty(rateArr[j])) {
              tempObj[rateArr[j]]++;
            } else {
              tempObj[rateArr[j]] = 1;
            }
          }
          setFeedbackByCategory(
            Object.assign(feedbackByCategory[i].distinctCount, tempObj)
          );
        }
        let exlDat = [
          ["Subject", subject_name],
          ["Year", year.toString()],
          ["Teacher", teacher],
          ["Lecture", isTheory ? "Theory" : "Practical"],
        ];
        let bac = ["Batch"];
        let tempStringBac = "";
        await bacthes.map((batc) => {
          tempStringBac += batc + " ";
        });
        bac.push(tempStringBac);
        exlDat.push(bac);
        exlDat.push([""]);
        exlDat.push(["Result"]);
        if (isTheory) {
          exlDat.push([
            "",
            "Very Good",
            "Good",
            "Acceptable",
            "Barely Acceptable",
            "Poor",
          ]);
        } else {
          exlDat.push([
            "",
            "Very Frequently",
            "Frequently",
            "Occasionally",
            "Rarely",
            "Very Rarely",
          ]);
        }
        await feedbackByCategory.map((item) => {
          const arr = JSON.parse(
            JSON.stringify(Object.values(item.distinctCount))
          );
          const finnArr = [];
          for (let i = 0; i < arr.length; i++) {
            finnArr.push(arr[i]);
          }
          finnArr.push(`${item.qn}`);
          finnArr.reverse();
          exlDat.push(finnArr);
        });
        setExcelData(exlDat);
        setFeedbackByCategory(feedbackByCategory);
        // console.log(feedbackByCategory);
      }
    };

    countTotalFilledFeedback();
    calcBoxPlotRatingArr();
    setfeedbackByCatArr();

    return () => {};
  }, [feedData]);

  const getColors = () => {
    const colArr = ["#2f6690", "#3a7ca5", "#5BAAD7", "#368FAB"];
    return colArr[Math.floor(Math.random() * colArr.length)];
  };

  const Datadashboard = () => {
    return (
      <>
        <Row className="">
          <Col xs={12} sm={12} md={6} lg={6} className="my-5 mb-3 px-3">
            <div
              className="h-100 shadow-sm rounded-3"
              style={{ backgroundColor: "#E0E3EA" }}
            >
              <h1
                className="fs-4 fw-600 text-center p-3 text-light rounded-3"
                style={{ backgroundColor: btnColor }}
              >
                Percentage of student who filled feedback
              </h1>
              <div className="d-flex align-items-center justify-content-center mt-4">
                {feedData !== null && <OverallRating data={totalFilledData} />}
              </div>
            </div>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} className="my-5 mb-3 px-3">
            <div
              className="h-100 shadow-sm rounded-3"
              style={{ backgroundColor: "#E0E3EA" }}
            >
              <h1
                className="fs-4 fw-600 text-center p-3 text-light rounded-3"
                style={{ backgroundColor: btnColor }}
              >
                Average rating of each students feedback
              </h1>
              <div className="d-flex align-items-center justify-content-center w-100">
                {feedData !== null && <TopBoxPlot data={averageRating} />}
              </div>
            </div>
          </Col>
        </Row>
      </>
    );
  };

  const ParametricBarGraph = () => {
    return (
      <>
        <Row>
          {feedData !== null &&
            feedbackByCategory.length > 0 &&
            feedbackByCategory.map((item, key) => (
              <Col
                xs={12}
                sm={12}
                md={key === feedbackByCategory.length - 1 ? 12 : 6}
                lg={4}
                className="px-3 my-3"
                key={key}
              >
                <div
                  className="h-100 shadow-sm rounded-3 d-flex flex-column justify-content-between"
                  style={{ backgroundColor: "#E0E3EA" }}
                >
                  <h1
                    className="fs-5 fw-600 text-center p-2 text-light rounded-3 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: btnColor, minHeight: "85px" }}
                  >
                    {feedbackByCategory[key].qn}
                  </h1>

                  <div className="d-flex align-items-center justify-content-center w-100 p-4 pb-0 pt-2">
                    {feedData !== null && (
                      <CatRatingBar
                        data={feedbackByCategory}
                        index={key}
                        totalRes={totalFilledData[0]}
                      />
                    )}
                  </div>

                  <h3
                    className="d-flex align-items-center justify-content-center fs-5 fw-600 text-center p-2 m-3 mt-0 rounded-3 text-light"
                    style={{ backgroundColor: btnColor }}
                  >
                    Average&nbsp;
                    <i className="fa-solid fa-star fa-xs" />
                    &nbsp;:{" "}
                    {item.rating.length !== 0 &&
                      (
                        item.rating.reduce((a, b) => a + b) / item.rating.length
                      ).toFixed(2)}{" "}
                    / 5.00
                  </h3>
                </div>
              </Col>
            ))}
        </Row>

        <Row></Row>
      </>
    );
  };

  const SendMail = async () => {
    setSendRemSpin(true);
    const res = await axiosInstance
      .post("/sendReminder", {
        data: { form_id: params?.id },
      })
      .catch((err) => {
        console.log(err);
        toastrFunc("error", "Form filled by Everyone! / Internal Server Error");
        //  alert("Error occurred sending reminders")
      });
    if (res) {
      toastrFunc("success", "Mail sent successfully");
      //  alert("Mail sent successfully")
    }
    setSendRemSpin(false);
  };

  const TopDataBoard = () => {
    return (
      <div className={cx(styles.topDataBoard, "")}>
        <Row>
          <Col>
            <h1
              className={cx(styles.subNameLink, "fw-900 display-5")}
              style={{ color: btnColor }}
            >
              <u className="text-nowrap">{subject_name}</u>

              <div className={styles.copyIcon}>
                <div
                  className={cx(
                    "d-flex align-items-center justify-content-center gap-2"
                  )}
                >
                  {params?.id !== null && (
                    <div>
                      <OverlayTrigger
                        // key={key}
                        placement={"top"}
                        overlay={
                          <Tooltip id={"tooltip-top"}>
                            Copy Shareable Link
                          </Tooltip>
                        }
                      >
                        <CopyToClipboard
                          onCopy={() => {
                            toastrFunc("success", "Form Link Copied!");
                            //alert("Copied text")
                          }}
                          text={`${window.location.origin}/feedBackForm/${params?.id}`}
                        >
                          <i
                            className="fa-solid fa-link fs-3"
                            style={{ cursor: "pointer" }}
                          />
                        </CopyToClipboard>
                      </OverlayTrigger>
                    </div>
                  )}
                  {params?.id !== null && (
                    <div>
                      <OverlayTrigger
                        placement={"right"}
                        overlay={
                          <Tooltip id={"tooltip-right"}>Send Reminder</Tooltip>
                        }
                      >
                        {sendRemSpin ? (
                          <div className="d-flex justify-content-center align-items-end">
                            <CustomSpinner size="sm" />
                          </div>
                        ) : (
                          <i
                            style={{ cursor: "pointer" }}
                            onClick={SendMail}
                            className="fa-regular fa-bell fs-3"
                          />
                        )}
                      </OverlayTrigger>
                    </div>
                  )}
                  {params?.id !== null && (
                    <div>
                      <OverlayTrigger
                        placement={"right"}
                        overlay={
                          <Tooltip id={"tooltip-right"}>Delete Form</Tooltip>
                        }
                      >
                        <i
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={(e) => {
                            axiosInstance
                              .post("/deleteFeedbackform", {
                                data: { form_id: params?.id },
                              })
                              .then((res) => {
                                if (res.data.status_code === 200) {
                                  toastrFunc("success", res.data.status_msg);
                                  navigate("/tdashboard");
                                } else {
                                  toastrFunc("error", res.data.status_msg);
                                }
                              })
                              .catch((err) => {
                                console.log(err);
                                toastrFunc(
                                  "error",
                                  "Error occurred while deleting form"
                                );
                              });
                          }}
                          className="fa-regular fa-trash-can fs-3"
                        />
                      </OverlayTrigger>
                    </div>
                  )}

                  {params?.id !== null && (
                    <CSVLink
                      style={{ textDecoration: "none", color: "#FFFF" }}
                      data={excelData}
                      filename={`${teacher}_${subject_name}_${GetStudentYear({
                        year,
                        inWords: true,
                      })}_${isTheory ? "Theory" : "Practical"}.csv`}
                    >
                      <OverlayTrigger
                        placement={"right"}
                        overlay={
                          <Tooltip id={"tooltip-right"}>Download CSV</Tooltip>
                        }
                      >
                        <i
                          style={{ cursor: "pointer", color: btnColor }}
                          className="fa fa-download fs-3"
                        ></i>
                      </OverlayTrigger>
                    </CSVLink>
                  )}
                </div>
              </div>
            </h1>
          </Col>
        </Row>
        <div
          className={cx(
            styles.topDataFlex,
            "d-flex align-items-center flex-wrap gap-3 text-light fw-600 my-2"
          )}
        >
          <div
            className={"p-2 px-3 shadow rounded-pill text-nowrap"}
            style={{ backgroundColor: getColors() }}
          >
            Teacher: {teacher}
          </div>
          <div
            className={"p-2 px-3 shadow rounded-pill text-nowrap"}
            style={{ backgroundColor: getColors() }}
          >
            {GetStudentYear({ year, inWords: true })}
          </div>
          <div
            className={"p-2 px-3 shadow rounded-pill text-nowrap"}
            style={{ backgroundColor: getColors() }}
          >
            Status: {isActive ? "Active" : "Expired"}
          </div>
          <div
            className={"p-2 px-3 shadow rounded-pill text-nowrap"}
            style={{ backgroundColor: getColors() }}
          >
            Due: {GetDate(date)}
          </div>
          <div
            className={"p-2 px-3 shadow rounded-pill text-nowrap"}
            style={{ backgroundColor: getColors() }}
          >
            Lecture: {isTheory ? "Theory" : "Practical"}
          </div>

          <div
            className={"p-2 px-3 shadow rounded-pill text-nowrap"}
            style={{ backgroundColor: getColors() }}
          >
            Batch:
            {bacthes.length > 0 &&
              bacthes.map((bac, ind) => {
                if (ind !== bacthes.length - 1) {
                  return bac + " , ";
                } else {
                  return bac;
                }
              })}
          </div>
          {params?.id !== null && user.userRole === "admin" && (
            <CSVLink
              style={{ textDecoration: "none", color: "#FFFF" }}
              data={nonFilled}
              filename={`${teacher}_${subject_name}_${GetStudentYear({
                year,
                inWords: true,
              })}_${isTheory ? "Theory" : "Practical"}.csv`}
            >
              <OverlayTrigger
                placement={"right"}
                overlay={
                  <Tooltip id={"tooltip-right"}>
                    Download Non-Filled Student Data
                  </Tooltip>
                }
              >
                <div
                  className={"p-2 px-3 shadow rounded-pill text-nowrap"}
                  style={{ backgroundColor: getColors() }}
                >
                  <i
                    class="fa-solid fa-download fa-lg"
                    style={{ color: "#ffffff", cursor: "pointer" }}
                  ></i>
                  &nbsp; Download Non-Filled Student Data
                </div>
              </OverlayTrigger>
            </CSVLink>
          )}
        </div>
        {/* <Col>
            YEAR : {location?.state?.data?.year}
          </Col>
          <Col>
            STATUS : {location?.state?.data?.isActive ? "Active" : "Inactive"}
          </Col>
          <Col>
            DATE : {location?.state?.data?.date}
          </Col>
          <Col>
            TYPE : {location?.state?.data?.isTheory ? "Theory" : "Practical"}
          </Col> */}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Feedback Form Results</title>
        <meta
          name="description"
          content="Srudents Feedback form results for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/tfeedbackdata/" />
      </Helmet>
      <Container>
        <Row className="text-left mt-5 px-2">
          <span
            style={{ color: btnColor, fontWeight: "500", cursor: "pointer" }}
            onClick={() => {
              navigate("/tdashboard");
            }}
          >
            <i
              className="fa-solid fa-arrow-left fa-xl"
              style={{ color: btnColor, marginRight: "5px" }}
            ></i>
            Back
          </span>
        </Row>
      </Container>
      <Container>
        <Row className="text-center mt-1">
          <h1 className="display-3 fw-bold" style={{ color: btnColor }}>
            Data Dashboard
          </h1>
        </Row>
      </Container>
      {spinner ? (
        <div className="text-center mt-5">
          <CustomSpinner size="lg" />
        </div>
      ) : (
        <>
          <Container>
            <Row className="mt-4 px-3">
              <TopDataBoard />
            </Row>
          </Container>
          <Container>
            <Datadashboard />
          </Container>
          <Container>
            <ParametricBarGraph />
          </Container>
          <Container style={{ marginBottom: "20px" }}>
            <Row>
              <Col></Col>
              <Col></Col>
              <Col></Col>
              <Col></Col>
              <Col></Col>
              {/* {params?.id !== null && (
                    <Col>
                      <CopyToClipboard
                        onCopy={() => {
                          toastrFunc("success", "Copied text");
                          //alert("Copied text")
                        }}
                        text={`${window.location.origin}/feedBackForm/${params?.id}`}
                      >
                        <Button>Copy Form Link</Button>
                      </CopyToClipboard>
                    </Col>
                  )}

                  {params?.id !== null && (
                    <Col>
                      <Button
                        onClick={(e) => {
                          axiosInstance
                            .post("/sendReminder", { data: { form_id: params?.id } })
                            .then((res) => {
                              toastrFunc("success", "Mail sent successfully");
                              //  alert("Mail sent successfully")
                            })
                            .catch((err) => {
                              console.log(err);
                              toastrFunc("error", "Error occurred sending reminders");
                              //  alert("Error occurred sending reminders")
                            });
                        }}
                      >
                        Send Reminder
                      </Button>
                    </Col>
                  )} */}
            </Row>
          </Container>
          {/* {feedData !== null && <>{JSON.stringify(feedData)}</>} */}
        </>
      )}
    </>
  );
}

export default FeedbackData;
