import React from "react";
import { useContext } from "react";
import { Row, Button, Col } from "react-bootstrap";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteConstants from "../../constants/RouteConstants";
import TeacherNavBar from "../../components/TeacherNavBar";

function CreateForm() {
  const { secondaryColor } = useContext(ThemeContext);
  const { btnColor } = useContext(ThemeContext);
  const { pastdueColor } = useContext(ThemeContext);
  const { bgColor } = useContext(ThemeContext);
  let forms = [
    { sub: "CNS", teacher: "Prof. Stevina Mam", date: "2022/01/12" },
    { sub: "ADS", teacher: "Prof. Neha Ram", date: "2022/07/12" },
    { sub: "ADS", teacher: "Prof. ARJ sir", date: "2023/01/12" },
    { sub: "SA", teacher: "Prof. Neha Katre", date: "2023/01/12" },
    { sub: "CNS", teacher: "Prof. Stevina Mam", date: "2023/01/12" },
    { sub: "ADS", teacher: "Prof. Neha Ram", date: "2023/01/12" },
    { sub: "ADS", teacher: "Prof. ARJ sir", date: "2023/01/12" },
    { sub: "SA", teacher: "Prof. Neha Katre", date: "2022/01/12" },
    { sub: "CNS", teacher: "Prof. Stevina Mam", date: "2023/01/12" },
    { sub: "ADS", teacher: "Prof. Neha Ram", date: "2023/01/12" },
    { sub: "ADS", teacher: "Prof. ARJ sir", date: "2023/01/12" },
    { sub: "SA", teacher: "Prof. Neha Katre", date: "2023/01/12" },
    { sub: "CNS", teacher: "Prof. Stevina Mam", date: "2023/01/12" },
    { sub: "ADS", teacher: "Prof. Neha Ram", date: "2023/01/12" },
    { sub: "ADS", teacher: "Prof. ARJ sir", date: "2023/01/12" },
    { sub: "SA", teacher: "Prof. Neha Katre", date: "2023/01/12" },
    { sub: "CNS", teacher: "Prof. Stevina Mam", date: "2023/01/12" },
    { sub: "ADS", teacher: "Prof. Neha Ram", date: "2023/01/12" },
    { sub: "ADS", teacher: "Prof. ARJ sir", date: "2023/01/12" },
    { sub: "SA", teacher: "Prof. Neha Katre", date: "2023/01/12" },
  ];
  let navigate = useNavigate();

  const handleClick = () => {
    navigate("/CreateForm");
  };

  let ListItem = (sub, teacher, date) => {
    let thisWidColor =
      new Date(date).getTime() > Date.now() ? secondaryColor : "#C00000";
    return (
      <Button
        onClick={() => {
          navigate(RouteConstants.TEACHER_STUDENT);
        }}
        className="row row-cols-4 row-cols-md-5 gx-5 mt-2"
        style={{
          backgroundColor: secondaryColor,
          marginTop: "1rem",
          marginBottom: "1rem",
          marginRight: "1rem",
          padding: "0",
          border: "none",
        }}
      >
        <div>
          <div
            className="card g-4"
            style={{
              backgroundColor: secondaryColor,
              width: "10rem",
              height: "230px",
              color: "black",
            }}
          >
            <div className="card-header">{teacher}</div>
            <div className="card-body">
              <h5 className="card-title">{sub}</h5>
              <p className="card-text">Practical/Theory</p>
              <p
                className="card-text"
                style={{ Color: thisWidColor, marginTop: "40px" }}
              >
                <small>Due date: {date}</small>
              </p>
            </div>
          </div>
        </div>
      </Button>
    );
  };


  return (
    <div>
      <div className="p-2 my-2 mx-2 g-4 rounded overflow-auto ">
        <h1 className="text-center mt-4">DASHBOARD</h1>
        <div className="d-flex justify-content-between mb-2 mx-2 mt-2">
          <div
            className="card text-white"
            style={{
              backgroundColor: btnColor,
              width: "16rem",
              height: "68px",
            }}
          >
            <div className="card-body">
              <h5 className="card-title">Active Feedback Forms:</h5>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleClick}
            style={{ backgroundColor: btnColor, marginRight: "1rem" }}
          >
            New <FontAwesomeIcon icon="plus" />
          </Button>
        </div>
        <div>
          <Row className="lg-5 md-10 sm-10">
            <div className="ms-2">
              {forms.map((i) => ListItem(i.sub, i.teacher, i.date))}
            </div>
          </Row>
        </div>
        <div className="d-flex justify-content-between mb-2 mx-2 mt-2">
          <div
            className="card text-white"
            style={{
              backgroundColor: btnColor,
              width: "18rem",
              height: "60px",
            }}
          >
            <div className="card-body">
              <h5 className="card-title">Closed Feedback Forms:</h5>
            </div>
          </div>
        </div>
        <div>
          <Row className="lg-5">
            <div className="ms-2">
              {forms.map((i) => ListItem(i.sub, i.teacher, i.date))}
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default CreateForm;
