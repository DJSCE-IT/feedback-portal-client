import cx from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import CustomSpinner from "../../common/CustomSpinner";
import toastrFunc from "../../common/toastrFunc";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import { UserContext } from "../../context/User/UserContext";
import GetDate from "../../utilities/GetDate";
import IsDue from "../../utilities/IsDue";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { secondaryColor, primaryColor } = useContext(ThemeContext);
  const { btnColor } = useContext(ThemeContext);
  const { pastdueColor } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [feedData, setFeedData] = useState([]);
  const [feedDataFilled, setFeedDataFilled] = useState([]);
  const [pastDue, setPastDue] = useState([]);
  const [spinnerTile, setSpinnerTile] = useState(false);
  const [spinnerTileFilled, setSpinnerTileFilled] = useState(false);
  const [spinnerTileDue, setSpinnerTileDue] = useState(false);

  let navigate = useNavigate();

  //  let forms = [
  //    { sub: "CNS", teacher: "Prof. Stevina Mam", date: "2022/01/12" },
  //    { sub: "ADS", teacher: "Prof. Neha Ram", date: "2022/07/12" },
  //  ];

  useEffect(() => {
    (async () => {
      setSpinnerTile(true);
      setSpinnerTileFilled(true);
      setSpinnerTileDue(true);
      const res = await axiosInstance
        .get("/getSDashData", { params: { username: user.username } })
        .catch((err) => toastrFunc("error", err));
      if (res) {
        setPastDue(res.data.feedData.filter(form => IsDue(form.due_date)))
        setSpinnerTileDue(false);
        setFeedData(res.data.feedData.filter(form => !IsDue(form.due_date)));
        setSpinnerTile(false);
        const ress = await axiosInstance
          .get("/getSDashDataFilled", { params: { username: user.username } })
          .catch((err) => toastrFunc("error", err));
        if (ress) {
          setFeedDataFilled(ress.data.feedDataFilled);
          setSpinnerTileFilled(false);
        }
      }
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  // useEffect(
  //   async () => {
  //   axiosInstance
  //     .get("/getSDashData", { params: { username: user.username } })
  //     .then((res) => {
  //       setFeedData(res.data.feedData);
  //     });
  //   return () => { };
  // }, []);

  const FeedbackCard = ({
    sub,
    teacher,
    teacher_email,
    date,
    is_alive,
    is_filled,
    is_theory,
    year,
    subject_id,
    form_id,
    cardBgColor = secondaryColor,
  }) => {
    const pendingCondition = is_alive && !is_filled && !IsDue(date);
    const thisWidColor = !is_filled ? IsDue(date) ? pastdueColor : primaryColor : primaryColor;
    return (
      <Card
        style={{
          backgroundColor: cardBgColor,
          cursor: pendingCondition ? "pointer" : "not-allowed",
        }}
        className="border-0 w-100 shadow align-self-stretch"
        onClick={() => {
          pendingCondition &&
            navigate(`/feedBackForm/${form_id}`, {
              state: {
                data: {
                  sub: sub,
                  teacher: teacher,
                  teacher_email: teacher_email,
                  date: date,
                  is_alive: is_alive,
                  is_filled: is_filled,
                  is_theory: is_theory,
                  year: year,
                  subject_id: subject_id,
                  form_id: form_id,
                  username: user.username,
                },
              },
            });
        }}
      >
        <Card.Body className="d-flex flex-column gap-4">
          <div >
            <Card.Title
              className="mb-3 fs-3 fw-bold"
              style={{ color: btnColor }}
            >
              {sub}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted fs-5 fw-600">
              {is_theory ? "Theory" : "Practical"}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted fs-6">
              Form id: {form_id}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 fs-6 fw-600">
              {teacher}
            </Card.Subtitle>
            <Card.Subtitle className="fs-6 d-flex align-items-center gap-1 fw-600">
              <span>Status:</span>
              <span>
                {is_filled ? (
                  // <i className="fa-solid fa-check-double" /> :
                  <i className="fa-solid fa-check-double" />
                ) : pendingCondition ? (
                  <i className="fa-solid fa-hourglass-start" />
                ) : (
                  <i className="fa-solid fa-circle-xmark" />
                )}
              </span>
            </Card.Subtitle>
          </div>

          <div>
            <Card.Subtitle
              className="fs-6 fw-600"
              style={{ color: thisWidColor }}
            >
              Due date:
              <div>{GetDate(date)}</div>
            </Card.Subtitle>
            {/* <p className="card-text" style={{ "color": thisWidColor }}><small>Due date: {date}</small></p> */}
          </div>
        </Card.Body>
      </Card>
    );
  };

  const FeedbackCardRowHeader = ({ header = "Feedback Forms", cardStatus }) => {
    return (
      <Container>
        <Container>
          <h6 className={""}>
            <span
              className="ms-1 p-2 px-3 rounded w-100 fw-600"
              style={{ backgroundColor: btnColor, color: "white" }}
            >
              {header}
              {cardStatus === "pending" ? (
                spinnerTile ? (
                  <CustomSpinner inBtn={true} size="sm" />
                ) : (
                  feedData.length
                )
              ) : cardStatus === "due" ? (spinnerTileDue ? (
                <CustomSpinner inBtn={true} size="sm" />
                ) : (
                  pastDue.length
                  )) : spinnerTileFilled ? (
                <CustomSpinner inBtn={true} size="sm" />
              ) : (
                feedDataFilled.length
              )}
            </span>
          </h6>
        </Container>
      </Container>
    );
  };

  //  const getCardsData = (cardStatus) => {
  //    const fdRowData =
  //      feedData !== undefined &&
  //      feedData.filter((item) =>
  //        cardStatus
  //          ? item.is_filled === false &&
  //            item.is_alive === true &&
  //            IsDue(item.due_date) === false
  //          : item.is_filled === true ||
  //            item.is_alive === false ||
  //            IsDue(item.due_date) === true
  //      );

  //    return fdRowData;
  //  };

  const FeedbackCardRow = ({ feedData }) => {
    const fdRowData = feedData;
    return (
      <Container>
        <Row xs={1} sm={2} md={3} lg={4} className="">
          {fdRowData.length !== 0 &&
            fdRowData.map((item, key) => (
              <Col
                className="d-flex align-items-start justify-content-center p-3"
                key={key}
              >
                <FeedbackCard
                  sub={item.subject}
                  teacher={item.teacher_name}
                  teacher_email={item.teacher_email}
                  date={item.due_date}
                  is_alive={item.is_alive}
                  is_filled={item.is_filled}
                  is_theory={item.is_theory}
                  year={item.year}
                  subject_id={item.subject_id}
                  form_id={item.form_id}
                />
              </Col>
            ))}
        </Row>
      </Container>
    );
  };

  const DashboardBody = () => {
    return (
      <Container className="d-flex flex-column gap-4">  
        <Row className="text-center mt-5">
          <h1 className="display-4 fw-bold" style={{ color: btnColor }}>
            DASHBOARD
          </h1>
        </Row>

        <Row className={styles.nameHeader}>
          <FeedbackCardRowHeader header={`Pending Feedback Forms: `} cardStatus={"pending"}/>
        </Row>

        <Row>
          <FeedbackCardRow feedData={feedData} />
        </Row>

        <Row className={cx(styles.nameHeader, "mt-5")}>
          <FeedbackCardRowHeader
            header={`Due Feedback Forms: `}
            cardStatus={"due"}
          />
        </Row>
        

        <Row>
          <FeedbackCardRow feedData={pastDue} />
        </Row>
        
        <Row className={cx(styles.nameHeader, "mt-5")}>
          <FeedbackCardRowHeader
            header={`Filled Feedback Forms: `}
            cardStatus={"filled"}
          />
        </Row>

        <Row>
          <FeedbackCardRow feedData={feedDataFilled} />
        </Row>

      </Container>
    );
  };

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta
          name="description"
          content="Student's Dashboard for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/dashboard" />
      </Helmet>
      <DashboardBody />
    </>
  );
};

export default Dashboard;