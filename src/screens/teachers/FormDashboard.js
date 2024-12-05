import cx from "classnames";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axiosInstance from "../../axios";
import CustomSpinner from "../../common/CustomSpinner";
import toastrFunc from "../../common/toastrFunc";
import RoleConstants from "../../constants/RoleConstants";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import { UserContext } from "../../context/User/UserContext";
import GetDate from "../../utilities/GetDate";
import IsDue from "../../utilities/IsDue";
import styles from "./FormDashboard.module.css";

const FormDashboard = () => {
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [currentFormUpdate, setCurrentFormUpdate] = useState({});
  const [SUB, setSUB] = useState({});
  const [updateFormData, setUpdateFormData] = useState({
    form_id: null,
    due_date: "",
  });
  const [feedbackData, setFeedbackData] = useState([]);
  const [feedbackDataOld, setFeedbackDataOld] = useState([]);
  const [valueStart, onChangeStart] = useState(new Date());
  const [spinnerState, setSpinnerState] = useState(false);
  const [spinnerStateYr, setSpinnerStateYr] = useState(false);
  const [modalSpinnerState, setModalSpinnerState] = useState(false);

  const [CurrSUB, setCurrSUB] = useState([
    {
      label: "Theory",
      options: [],
    },
    {
      label: "Practical",
      options: [],
    },
  ]);

  const sortOptions = [
    { id: 0, title: "Ascending (Class)" },
    { id: 1, title: "Descending (Class)" },
    { id: 2, title: "Ascending (Form id)" },
    { id: 3, title: "Descending (Form id)" },
    { id: 4, title: "Ascending (Due Date)" },
    { id: 5, title: "Descending (Due Date)" },
  ];

  const [Year, setYear] = useState(0);
  const [Subject, setSubject] = useState();
  const [sortBy, setSortBy] = useState(sortOptions[0].id);

  const { secondaryColor, primaryColor, pastdueColor, btnColor } =
    useContext(ThemeContext);
  let navigate = useNavigate();

  let forms = [
    { sub: "CNS", batch: "D2", classDiv: "A", date: "2022/01/12" },
    { sub: "ADS", batch: "D2", classDiv: "A", date: "2022/07/12" },
  ];
  const { user } = useContext(UserContext);
  useEffect(() => {
    (async () => {
      setSpinnerState(true);
      setSpinnerStateYr(true);
      const res = await axiosInstance
        .get("/createFeedbackForm", { params: { username: user.username } })
        .catch((err) => {
          toastrFunc("error", err);
          //  alert(err);
          setSpinnerState(false);
          setSpinnerStateYr(false);
        });
      if (res) {
        // console.log(res);
        if (res.data.status_code === 200) {
          let feedDataActive = res.data.data.feedData.filter(
            (form) => form.is_selected === true
          );
          setFeedbackData(feedDataActive);
          let feedDataActiveOld = res.data.data.feedData.filter(
            (form) => form.is_selected === false
          );
          setFeedbackDataOld(feedDataActiveOld);
          setSpinnerState(false);

          const ress = await axiosInstance
            .get("/getYearBatches")
            .catch((err) => {
              toastrFunc("error", err);
            });
          if (ress) {
            setSUB(ress.data.data.getYrBatches);
            setSpinnerStateYr(false);
          }
        } else {
          setSpinnerState(false);
          setSpinnerStateYr(false);
          setSUB({});
          setFeedbackData([]);
          toastrFunc("error", res.data.status_msg);
        }
      }
    })();

    // axiosInstance
    //   .get("/createFeedbackForm", { params: { username: user.username } })
    //   .then((res) => {
    //     setSUB(res.data.getYrBatches);
    //     setFeedbackData(res.data.feedData);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    return () => {};
  }, []);

  const handleClick = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleClickUpdate = () => setShowUpdate(true);
  const handleCloseUpdate = () => setShowUpdate(false);

  async function formSub(e) {
    e.preventDefault();

    setModalSpinnerState(true);
    // console.log(modalSpinnerState);
    if (valueStart !== undefined && Subject !== undefined) {
      const res = await axiosInstance
        .post("/createFeedbackForm", {
          data: {
            year: Year,
            subject_name: Subject.label,
            subject_id: Subject.theo
              ? Subject.value.split("Theo")[0]
              : Subject.value.split("Prac")[0],
            username: user.username,
            isTheo: Subject.theo,
            due_data: valueStart,
          },
        })
        .catch((err) => {
          setModalSpinnerState(false);
          toastrFunc("error", err);
          //  alert(err);
          console.log(err);
        });
      setModalSpinnerState(false);
      // console.log(modalSpinnerState);
      if (res) {
        if (res.data.status_code === 200) {
          setShow(false);
          window.location.reload();
        } else {
          toastrFunc("error", res.data.status_msg);
          //  alert(res.data.status_msg);
        }
      }
      // .then((res) => {
      // setShow(false);
      // window.location.reload();
      // })
    } else {
      toastrFunc("error", "Fill all the details");
      //  alert("Fill all the details");
      setModalSpinnerState(false);
    }
  }

  // Sorting useEffect
  const returnSortFn = () => {
    if (sortBy === 0) return (a, b) => a.year - b.year;
    else if (sortBy === 1) return (a, b) => -a.year + b.year;
    else if (sortBy === 2) return (a, b) => a.id - b.id;
    else if (sortBy === 3) return (a, b) => -a.id + b.id;
    else if (sortBy === 4)
      return (a, b) =>
        new Date(a.due_date).getTime() -
        new Date(b.due_date).getTime(b.due_date);
    else if (sortBy === 5)
      return (a, b) =>
        -new Date(a.due_date).getTime() +
        new Date(b.due_date).getTime(b.due_date);
    else {
      toastrFunc("error", "Sorting Error");
      //  alert("Sorting Error");
      return (a, b) => a.year - b.year;
    }
  };

  // Components

  const CreateNewFormBtn = () => {
    return (
      <Button
        className={cx(
          styles.teachDashboardTopBtnContainerChild,
          "px-3 rounded fw-600 d-flex align-items-center justify-content-center gap-1"
        )}
        variant="primary"
        style={{ backgroundColor: btnColor }}
        onClick={(e) => {
          if (spinnerStateYr) {
          } else {
            handleClick(e);
          }
        }}
      >
        <span>New Form</span>
        {spinnerStateYr ? (
          <CustomSpinner size="sm" inBtn={true} />
        ) : (
          <i className="fa-solid fa-plus"></i>
        )}
      </Button>
    );
  };

  const SortByDropDown = () => {
    return (
      <>
        <Dropdown className="fw-600">
          <Dropdown.Toggle style={{ backgroundColor: btnColor }}>
            {`Sorted: ${sortOptions[sortBy].title}`}
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark" className="w-100" align={"end"}>
            {sortOptions.map((item, key) => (
              <Dropdown.Item
                // eventKey={key}
                className="fw-600"
                key={key}
                active={sortBy === item.id ? true : false}
                onClick={() => setSortBy(item.id)}
              >
                {item.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  };

  async function formSubUpdate(e) {
    e.preventDefault();

    setModalSpinnerState(true);
    // console.log(modalSpinnerState);
    if (
      updateFormData.form_id !== undefined &&
      updateFormData.due_date !== undefined
    ) {
      const res = await axiosInstance
        .post("/updateFeedbackform", {
          data: {
            ...updateFormData,
          },
        })
        .catch((err) => {
          setModalSpinnerState(false);
          toastrFunc("error", err);
          //  alert(err);
          console.log(err);
        });
      setModalSpinnerState(false);
      // console.log(modalSpinnerState);
      if (res) {
        if (res.data.status_code === 200) {
          setShowUpdate(false);
          console.log(res.data);
          window.location.reload();
        } else {
          toastrFunc("error", res.data.status_msg);
          //  alert(res.data.status_msg);
        }
      }
      // .then((res) => {
      // setShow(false);
      // window.location.reload();
      // })
    } else {
      toastrFunc("error", "Fill all the details");
      //  alert("Fill all the details");
      setModalSpinnerState(false);
    }
  }

  const FeedbackCard = ({
    subject_name,
    id,
    year,
    isActive,
    date,
    batch_list,
    isTheory,
    cardBgColor = secondaryColor,
  }) => {
    const yearArr = (ind) => {
      return ["FE", "SE", "TE", "BE"][ind];
    };

    let thisWidColor = !IsDue(date) ? primaryColor : pastdueColor;

    return (
      <Card
        style={{ backgroundColor: cardBgColor, cursor: "pointer" }}
        className="border-0 w-100 shadow"
        onClick={() => {
          navigate(`/tfeedbackdata/${id}`, {
            state: {
              data: {
                form_id: id,
                subject_name,
                year,
                isActive,
                date,
                isTheory,
                batch_list,
              },
            },
          });
        }}
      >
        <Card.Body className="d-flex flex-column gap-4">
          <div>
            <Card.Title
              className="fs-2 fw-bolder text-break"
              style={{ color: btnColor }}
            >
              {subject_name}
            </Card.Title>
            <Card.Subtitle className="mb-2 mt-3 text-muted fs-5 fw-600">
              {isTheory ? "Theory" : "Practical"}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted fs-6">
              Form id: {id}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 fw-600 fs-6">
              Class: {yearArr(parseInt(year) - 1)}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 fw-600 fs-6">
              Batch:{" "}
              {batch_list !== null &&
                batch_list.map((bac, ind) => {
                  return bac + " ";
                })}
            </Card.Subtitle>
            <Card.Subtitle
              style={{ color: !isActive && pastdueColor }}
              className="mb-2 fw-600 fs-6"
            >
              Form Alive: {isActive ? "Yes" : "No"}
            </Card.Subtitle>
          </div>

          <div>
            <Card.Subtitle
              className="mb-2 fs-6 fw-600"
              style={{ color: thisWidColor }}
            >
              Due date:
              <div>{GetDate(date)}</div>
              <div
                className="nav-link active d-flex justify-content-end"
                onClick={(e) => {
                  e.stopPropagation();
                  if (spinnerStateYr) {
                  } else {
                    setCurrentFormUpdate({
                      form_id: id,
                      subject_name,
                      year,
                      isActive,
                      date,
                      isTheory,
                      batch_list,
                    });
                    setUpdateFormData({
                      ...updateFormData,
                      form_id: id,
                    });
                    setCurrSUB([
                      {
                        label: "Theory",
                        options: SUB[year]["theo"],
                      },
                      {
                        label: "Practical",
                        options: SUB[year]["prac"],
                      },
                    ]);
                    handleClickUpdate(e);
                  }
                }}
              >
                {spinnerStateYr ? (
                  <CustomSpinner size="sm" inBtn={true} />
                ) : (
                  <i className="fa-solid fa-pen-to-square fa-xl"></i>
                )}
              </div>
            </Card.Subtitle>
          </div>
        </Card.Body>
      </Card>
    );
  };

  //  const CardTopBtn = ({ header = "Undefined" }) => {
  //    return (
  //      <h6 className={styles.teachDashboardTopBtnContainerChild}>
  //        <span
  //          className="p-2 px-3 rounded w-100 fw-600"
  //          style={{ backgroundColor: btnColor, color: "white" }}
  //        >
  //          {header}
  //        </span>
  //      </h6>
  //    );
  //  };

  const CardRowComp = ({ feedbackData }) => {
    const year = ["FE", "SE", "TE", "BE"];

    return (
      <Container>
        <Row xs={1} sm={2} md={3} lg={4} className="mt-2 mb-5">
          {feedbackData.length !== 0 ? (
            feedbackData.sort(returnSortFn()).map((item, key) => (
              <Col
                className="d-flex align-items-start justify-content-center p-3"
                key={key}
              >
                <FeedbackCard
                  subject_name={item.subject_name}
                  id={item.id}
                  year={item.year}
                  isActive={item.is_alive}
                  isTheory={item.is_theory}
                  date={item.due_date}
                  batch_list={item.batch_list}
                />
              </Col>
            ))
          ) : (
            <Container>
              <Container className="d-flex align-items-start justify-content-center p-3">
                <h3 className={""}>
                  <span
                    className="ms-1 p-2 px-3 rounded w-100 fw-600"
                    style={{ backgroundColor: "white", color: btnColor }}
                  >
                    {"No Forms!"}
                  </span>
                </h3>
              </Container>
            </Container>
          )}
        </Row>
      </Container>
    );
  };

  const FeedbackCardRow = ({ header, feedbackData }) => {
    return (
      <>
        {spinnerState ? (
          <div className="text-center mt-5">
            <CustomSpinner size={"lg"} color={btnColor} />
          </div>
        ) : (
          <>
            <Container>
              <Container>
                <h6 className={""}>
                  <span
                    className="p-2 px-3 rounded w-100 fw-600"
                    style={{ backgroundColor: btnColor, color: "white" }}
                  >
                    {"Year " + (header + 1)}
                  </span>
                </h6>
              </Container>
            </Container>
            <CardRowComp feedbackData={feedbackData} />
          </>
        )}
      </>
    );
  };

  const TeachersDashboardBody = () => {
    return (
      <>
      <Container className="d-flex flex-column gap-4">
        <Row className="text-center mt-5">
          <h1 className="display-4 fw-bold" style={{ color: btnColor }}>
            DASHBOARD
          </h1>
        </Row>

        {forms.length !== 0 && (
          <Container>
            <Container className={styles.teachDashboardTopBtnContainer}>
              <h6 className={styles.teachDashboardTopBtnContainerChild}>
                <span
                  className="p-2 px-3 rounded w-100 fw-600"
                  style={{ backgroundColor: btnColor, color: "white" }}
                >
                  Feedback Forms:{" "}
                  {feedbackData.length !== undefined && spinnerState ? (
                    <CustomSpinner size="sm" inBtn={true} />
                  ) : (
                    feedbackData.length
                  )}
                </span>
              </h6>

              <div className="d-flex align-items-center gap-3">
                <SortByDropDown />
                {/* New form Btn */}
                {JSON.parse(localStorage.getItem("user"))?.userRole ===
                  RoleConstants.ADMIN ||
                JSON.parse(localStorage.getItem("user"))
                  ?.canCreateFeedbackForm ? (
                  <CreateNewFormBtn />
                ) : null}
              </div>
            </Container>
          </Container>
        )}
        <Row>
          {spinnerState ? (
            <div className="text-center mt-4">
              <CustomSpinner size="lg" color={btnColor} />
            </div>
          ) : feedbackData.length !== 0 || feedbackDataOld.length !== 0 ? (
            <>
              {Array(4)
                .fill(true)
                .map((item, index) => (
                  <FeedbackCardRow
                    key={index}
                    feedbackData={feedbackData.filter(
                      (feedbackForm) => feedbackForm.year === index + 1
                    )}
                    header={index}
                  />
                ))}
            </>
          ) : (
            <div className="text-center display-4 mt-4">
              <span className="fw-bolder" style={{ color: btnColor }}>
                No Forms!
              </span>
            </div>
          )}
        </Row>
      </Container>
      <Container className="d-flex flex-column gap-4">
        {forms.length !== 0 && (
          <Container>
            <Container className={styles.teachDashboardTopBtnContainer}>
              <h6 className={styles.teachDashboardTopBtnContainerChild}>
                <span
                  className="p-2 px-3 rounded w-100 fw-600"
                  style={{ backgroundColor: btnColor, color: "white" }}
                >
                  Old Feedback Forms:{" "}
                  {feedbackData.length !== undefined && spinnerState ? (
                    <CustomSpinner size="sm" inBtn={true} />
                  ) : (
                    feedbackDataOld.length
                  )}
                </span>
              </h6>
            </Container>
          </Container>
        )}
        <Row>
          {spinnerState ? (
            <div className="text-center mt-4">
              <CustomSpinner size="lg" color={btnColor} />
            </div>
          ) : feedbackData.length !== 0 || feedbackDataOld.length !== 0 ? (
            <>
              {Array(4)
                .fill(true)
                .map((item, index) => (
                  <FeedbackCardRow
                    key={index}
                    feedbackData={feedbackDataOld.filter(
                      (feedbackForm) => feedbackForm.year === index + 1
                    )}
                    header={index}
                  />
                ))}
            </>
          ) : (
            <div className="text-center display-4 mt-4">
              <span className="fw-bolder" style={{ color: btnColor }}>
                No Forms!
              </span>
            </div>
          )}
        </Row>
      </Container>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Feedback Form</title>
        <meta
          name="description"
          content="Feedback form dashboard for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/tdashboard" />
      </Helmet>
      <Modal show={show} centered onHide={handleClose} backdrop="static">
        <div className="d-flex justify-content-center align-items-center">
          <Card className="rounded w-100">
            <Card.Header
              className="text-white text-center fs-2 fw-600"
              style={{ backgroundColor: primaryColor }}
            >
              DJSCE Feedback Portal
            </Card.Header>
            <Card.Body>
              <Card.Title className="text-center fs-1 fw-bold">
                CREATE FORM
              </Card.Title>
              <Form
                onSubmit={formSub}
                className="d-flex flex-column align-items-center justify-content-center gap-3 mt-3 px-3"
              >
                <Form.Select
                  className=""
                  aria-label="Year"
                  required
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setCurrSUB([
                        {
                          label: "Theory",
                          options: SUB[e.target.value]["theo"],
                        },
                        {
                          label: "Practical",
                          options: SUB[e.target.value]["prac"],
                        },
                      ]);
                      setYear(parseInt(e.target.value));
                    } else {
                      setCurrSUB([
                        {
                          label: "Theory",
                          options: [],
                        },
                        {
                          label: "Practical",
                          options: [],
                        },
                      ]);
                      setYear(0);
                    }
                  }}
                >
                  <option style={{ textColor: "#707980" }} value="">
                    Select Year
                  </option>
                  <option value={1}>FE</option>
                  <option value={2}>SE</option>
                  <option value={3}>TE</option>
                  <option value={4}>BE</option>
                </Form.Select>

                <div className="w-100">
                  <Select
                    required
                    className="w-100"
                    aria-label="Div"
                    options={CurrSUB}
                    onChange={(e) => {
                      console.log(e);
                      if (e !== "") setSubject(e);
                    }}
                  >
                    {/*<option value=""></option>
                  {CurrSUB.length > 0 &&
                    CurrSUB.map((curr_sub, ind) => {
                      return (
                        <option key={ind} value={curr_sub.value}>
                          {curr_sub.value}
                        </option>
                      );
                    })}*/}
                  </Select>
                </div>
                <DateTimePicker
                  required
                  onChange={(e) => {
                    onChangeStart(e);
                  }}
                  format="y-MM-dd h:mm:ss a"
                  value={valueStart}
                />
                {/*
                  <Form.Group className="ms-2 mt-2" controlId="AllDivFlag">
                    <Form.Check type="checkbox" label="Create form for the entire division?" />
                  </Form.Group>
                  <Form.Select className='mt-2 ms-2 col align-self-end' aria-label="Batch">
                    <option>Batch*</option>
                    <option value="A1">A1</option>
                    <option value="B2">B2</option>
                    <option value="C3">C3</option>
                    <option value="D4">D4</option>
                  </Form.Select>
                */}
                <div className="mt-2 w-100 d-grid col-8 mx-auto">
                  <div className="d-flex justify-content-center align-items-center gap-2 fw-600 ">
                    <Button
                      variant="primary"
                      style={{ backgroundColor: btnColor }}
                      type="submit"
                      className="fw-bold d-flex align-items-center justify-content-center gap-1 fw-600"
                    >
                      {modalSpinnerState ? (
                        <CustomSpinner size="sm" inBtn={true} />
                      ) : (
                        <>
                          <div>Create Form</div>
                          <i className="fa-solid fa-plus" />
                        </>
                      )}
                    </Button>
                    <Button variant="danger" onClick={handleClose} className="">
                      Cancel
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Modal>
      <Modal
        show={showUpdate}
        centered
        onHide={handleCloseUpdate}
        backdrop="static"
      >
        <div className="d-flex justify-content-center align-items-center">
          <Card className="rounded w-100">
            <Card.Header
              className="text-white text-center fs-2 fw-600"
              style={{ backgroundColor: primaryColor }}
            >
              DJSCE Feedback Portal
            </Card.Header>
            <Card.Body>
              <Card.Title className="text-center fs-1 fw-bold">
                UPDATE FORM
              </Card.Title>
              <Form
                onSubmit={formSubUpdate}
                className="d-flex flex-column align-items-center justify-content-center gap-3 mt-3 px-3"
              >
                <Form.Select
                  className=""
                  aria-label="Year"
                  required
                  disabled
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setCurrSUB([
                        {
                          label: "Theory",
                          options: SUB[e.target.value]["theo"],
                        },
                        {
                          label: "Practical",
                          options: SUB[e.target.value]["prac"],
                        },
                      ]);
                      setYear(parseInt(e.target.value));
                    } else {
                      setCurrSUB([
                        {
                          label: "Theory",
                          options: [],
                        },
                        {
                          label: "Practical",
                          options: [],
                        },
                      ]);
                      setYear(0);
                    }
                  }}
                >
                  <option style={{ textColor: "#707980" }} value="">
                    Select Year
                  </option>
                  <option
                    selected={currentFormUpdate.year === 1 ? true : false}
                    value={1}
                  >
                    FE
                  </option>
                  <option
                    selected={currentFormUpdate.year === 2 ? true : false}
                    value={2}
                  >
                    SE
                  </option>
                  <option
                    selected={currentFormUpdate.year === 3 ? true : false}
                    value={3}
                  >
                    TE
                  </option>
                  <option
                    selected={currentFormUpdate.year === 4 ? true : false}
                    value={4}
                  >
                    BE
                  </option>
                </Form.Select>

                <div className="w-100">
                  <Select
                    required
                    className="w-100"
                    aria-label="Div"
                    options={CurrSUB}
                    isDisabled={true}
                    defaultValue={currentFormUpdate.subject_name || "Select"}
                    placeholder={currentFormUpdate.subject_name}
                    onChange={(e) => {
                      console.log(e);
                      if (e !== "") setSubject(e);
                    }}
                  >
                    {/*<option value=""></option>
                  {CurrSUB.length > 0 &&
                    CurrSUB.map((curr_sub, ind) => {
                      return (
                        <option key={ind} value={curr_sub.value}>
                          {curr_sub.value}
                        </option>
                      );
                    })}*/}
                  </Select>
                </div>
                <DateTimePicker
                  required
                  onChange={(e) => {
                    onChangeStart(e);
                    setUpdateFormData({
                      ...updateFormData,
                      due_date: e.toISOString(),
                    });
                  }}
                  format="y-MM-dd h:mm:ss a"
                  value={valueStart}
                />
                {/*
                  <Form.Group className="ms-2 mt-2" controlId="AllDivFlag">
                    <Form.Check type="checkbox" label="Create form for the entire division?" />
                  </Form.Group>
                  <Form.Select className='mt-2 ms-2 col align-self-end' aria-label="Batch">
                    <option>Batch*</option>
                    <option value="A1">A1</option>
                    <option value="B2">B2</option>
                    <option value="C3">C3</option>
                    <option value="D4">D4</option>
                  </Form.Select>
                */}
                <div className="mt-2 w-100 d-grid col-8 mx-auto">
                  <div className="d-flex justify-content-center align-items-center gap-2 fw-600 ">
                    <Button
                      variant="primary"
                      style={{ backgroundColor: btnColor }}
                      type="submit"
                      className="fw-bold d-flex align-items-center justify-content-center gap-1 fw-600"
                    >
                      {modalSpinnerState ? (
                        <CustomSpinner size="sm" inBtn={true} />
                      ) : (
                        <>
                          <div>Update Form</div>
                          <i className="fa-solid fa-plus" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleCloseUpdate}
                      className=""
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Modal>
      {/*<Modal show={show} onHide={handleClose}>
        <Form onSubmit={()=>{}}>
          <Modal.Header closeButton>
            <Modal.Title>Add Subject</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add Subject
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>*/}
      <TeachersDashboardBody />
    </>
  );
};

export default FormDashboard;
