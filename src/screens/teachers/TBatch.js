import cx from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import CustomSpinner from "../../common/CustomSpinner";
import toastrFunc from "../../common/toastrFunc";
import RoleConstants from "../../constants/RoleConstants";
import RouteConstants from "../../constants/RouteConstants";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import styles from "./TBatch.module.css";

const TBatch = () => {
  const navigate = useNavigate();
  const { secondaryColor, primaryColor, btnColor } = useContext(ThemeContext);
  const [batchData, setBatchData] = useState([]);
  const [batchSpinner, setBatchSpinner] = useState(false);

  useEffect(() => {
    (async () => {
      setBatchSpinner(true);
      const res = await axiosInstance.get("/getBatches").catch((err) => {
        toastrFunc("error", err);
        //alert(err);
        setBatchSpinner(false);
      });

      if (res) {
        if (res.data.status_code === 200) {
          setBatchData(res.data.batchData);
        } else {
          toastrFunc("error", "Error Occured");
          //  alert("Error Occured");
        }
        setBatchSpinner(false);
      }
    })();

    return () => {};
  }, []);

  // useEffect(() => {
  //   axiosInstance
  //     .get("/getBatches")
  //     .then((res) => {
  //       setBatchData(res.data.batchData);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   return () => { };
  // }, []);

  //  const batchData = [
  //    { year: "Fourth", classDiv: "D", totalStudents: "32" },
  //    { year: "Third", classDiv: "A", totalStudents: "60" },
  //    { year: "Second", classDiv: "C", totalStudents: "75" },
  //  ]

  const NewBatchBtn = () => {
    return (
      <Button
        className={
          "px-3 rounded fw-bold d-flex align-items-center justify-content-center gap-1"
        }
        variant="primary"
        onClick={() => navigate(RouteConstants.TEACHER_ADD_BATCH)}
        style={{ backgroundColor: primaryColor }}
      >
        <span>Add New Batch</span>
        <i className="fa-solid fa-plus"></i>
      </Button>
    );
  };

  const BatchCard = ({
    year,
    classDiv,
    totalStudents,
    student_list,
    batch_name_id,
  }) => {
    return (
      <Container
        fluid
        className="d-flex flex-column p-4 rounded-4"
        style={{ backgroundColor: secondaryColor, cursor: "pointer" }}
        onClick={(e) => {
          //console.log(student_list)
          navigate("/tviewBatch", {
            state: {
              data: {
                student_list: student_list,
                batch_year: year,
                batch_name_id: batch_name_id,
                batch_division: classDiv,
              },
            },
          });
        }}
      >
        <h4 className="text-muted fw-bold">{year} Year</h4>
        <div className={cx(styles.BatchCardInnerDivFlex, "")}>
          <div className="fw-bolder">Div: {classDiv}</div>
          <div className="text-muted fw-bolder">
            Total Students: {totalStudents}
          </div>
        </div>
      </Container>
    );
  };

  const MapBatch = () => {
    return (
      <>
        {batchData.map((item, key) => (
          <Col key={key} lg={6} md={6} sm={12} xs={12} className="mt-3">
            <Container fluid>
              <BatchCard
                year={item.year}
                classDiv={item.batch_div}
                totalStudents={item.total_student_count}
                student_list={item.students_list}
                batch_name_id={item.batch_name_id}
              />
            </Container>
          </Col>
        ))}
      </>
    );
  };

  const BatchPageMain = () => {
    return (
      <Container className="d-flex flex-column gap-4">
        <Row className="text-center mt-5">
          <h1 className="display-4 fw-bold" style={{ color: btnColor }}>
            {JSON.parse(localStorage.getItem("user")).userRole ===
            RoleConstants.ADMIN
              ? "ALL"
              : "MY"}{" "}
            BATCHES
          </h1>
        </Row>
        {/* <Row>
          <Form.Select aria-label="Default select example"
            required
            onChange={(e) => { }}
          >
            <option>Select Year to Filter</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </Form.Select>
        </Row> */}
        <Row>
          <span className="d-flex align-items-center justify-content-center">
            <NewBatchBtn />
          </span>
        </Row>

        <Row>
          {/* <Col className="d-flex flex-column align-items-center justify-content-center gap-3">
          </Col> */}
          {batchSpinner ? (
            <div className="text-center mt-3">
              <CustomSpinner size="lg" color={btnColor} />
            </div>
          ) : (
            <MapBatch />
          )}
        </Row>
      </Container>
    );
  };

  return (
    <>
      <Helmet>
        <title>Batch Creation</title>
        <meta
          name="description"
          content="Batch creation for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/tBatch" />
      </Helmet>
      <BatchPageMain />
    </>
  );
};

export default TBatch;
