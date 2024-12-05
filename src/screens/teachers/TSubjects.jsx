import cx from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, CardGroup, Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Helmet } from "react-helmet-async";
import Select from "react-select";
import axiosInstance from "../../axios";
import CustomSpinner from "../../common/CustomSpinner";
import toastrFunc from "../../common/toastrFunc";
import RoleConstants from "../../constants/RoleConstants";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import { UserContext } from "../../context/User/UserContext";
import GetStudentYear from "../../utilities/GetStudentYear";
import styles from "./FormDashboard.module.css";

export default function TSubjects() {
  const { user } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [batches, setBatches] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [selectedYr, setSelectedYr] = useState(1);
  const [sub_name, set_sub_name] = useState("");
  const [myBatches, setMyBatches] = useState([]);
  const [subjectSpinner, setSubjectSpinner] = useState(false);
  const [subjectSpinner1, setSubjectSpinner1] = useState(false);
  const [addSubSpinner, setAddSubSpinner] = useState(false);

  const { secondaryColor, btnColor } = useContext(ThemeContext);

  const options_year = [
    { value: 1, label: "1st year" },
    { value: 2, label: "2nd year" },
    { value: 3, label: "3rd year" },
    { value: 4, label: "4th year" },
  ];

  const handleClick = () => {
    setShow(true);
  };

  useEffect(() => {
    (async () => {
      setSubjectSpinner(true);
      setSubjectSpinner1(true);
      const res = await axiosInstance
        .get(`/gettUsers/${user.username}`)
        .catch((err) => {
          toastrFunc("error", err);
          setSubjectSpinner(false);
          setSubjectSpinner1(false);
          //  alert(err);
        });

      if (res) {
        // console.log(res.data)

        Object.entries(res.data.data.my_batches).forEach(([key, value]) => {
          //console.log(key, value);

          setMyBatches((myBatches) => [...myBatches, value]);
        });
        setSubjectSpinner(false);
        const ress = await axiosInstance
          .get(`/gettUsersBac/${user.username}`)
          .catch((err) => {
            toastrFunc("error", err);
          });
        if (ress) {
          console.log(ress.data);
          let yearDic = {};
          yearDic[1] = [];
          yearDic[2] = [];
          yearDic[3] = [];
          yearDic[4] = [];
          ress.data.batches.map((bac, index) => {
            yearDic[bac.year].push(bac);
          });
          setBatches(yearDic);

          let tempTea = [];
          ress.data.teachers.map((tea, ind) => {
            tempTea.push({ value: tea.id, label: tea.name });
          });
          // console.log('Res Data: ', res.data);
          // console.log('Year Dic: ', yearDic);
          // console.log('Temp Tea: ', tempTea);
          setTeachers(tempTea);
          setSubjectSpinner1(false);
        }
      }
      // console.log('My Batches: ', myBatches);
    })();

    return () => {};
  }, []);

  // useEffect(() => {
  //   axiosInstance.get(`/gettUsers/${user.username}`).then((res) => {

  //     let yearDic = {};
  //     yearDic[1] = [];
  //     yearDic[2] = [];
  //     yearDic[3] = [];
  //     yearDic[4] = [];
  //     res.data.batches.map((bac, index) => {
  //       let tempDic = {};
  //       tempDic["value"] = bac.id;
  //       tempDic["label"] = bac.batch_name;
  //       yearDic[bac.year].push(tempDic);
  //     });
  //     setBatches(yearDic);

  //     let tempTea = [];
  //     res.data.teachers.map((tea, ind) => {
  //       tempTea.push({ value: tea.id, label: tea.name });
  //     });
  //     // console.log('Res Data: ', res.data);
  //     // console.log('Year Dic: ', yearDic);
  //     // console.log('Temp Tea: ', tempTea);
  //     setTeachers(tempTea);

  //     setMyBatches([]);
  //     for (let i = 1; i < 5; i++) {
  //       //console.log(res.data.my_batches[i])
  //       if (res.data.my_batches[i] !== undefined) {
  //         Object.entries(res.data.my_batches[i]).forEach(([key, value]) => {
  //           //console.log(key, value);

  //           setMyBatches((myBatches) => [...myBatches, value]);
  //         });
  //       }
  //       // console.log('My Batches: ', myBatches);
  //     }
  //   });

  //   return () => { };
  // }, []);

  const handleClose = () => setShow(false);

  const NoSubjectsTab = () => {
    return (
      <h1 className="text-center p-0 mt-3">
        <span
          className="p-2 rounded-2"
          style={{ backgroundColor: btnColor, color: "white" }}
        >
          No Subjects!
        </span>
      </h1>
    );
  };

  const CreateNewFormBtn = () => {
    return (
      <Button
        className={cx(
          styles.teachDashboardTopBtnContainerChild,
          "px-3 rounded fw-bold d-flex align-items-center justify-content-center gap-1 fw-600"
        )}
        variant="primary"
        onClick={(e) => {
          if (subjectSpinner1) {
          } else {
            handleClick(e);
          }
        }}
        style={{ backgroundColor: btnColor }}
      >
        <span>Add Subject</span>
        {subjectSpinner1 ? (
          <CustomSpinner size="sm" inBtn={true} />
        ) : (
          <i className="fa-solid fa-plus" />
        )}
      </Button>
    );
  };

  const FeedbackCard = ({
    sub,
    theo_batch,
    prac_batch,
    year,
    cardBgColor = secondaryColor,
  }) => {
    return (
      <CardGroup className="w-100 h-100">
        <Card
          style={{ backgroundColor: cardBgColor }}
          className="border-0 w-100 shadow-sm"
          // onClick={() => {
          //   //   navigate();
          //   alert("SHould navigate to next detailed page");
          // }}
        >
          <Card.Body className="d-flex flex-column gap-5">
            <div className="d-flex flex-column">
              <Card.Title
                className="fs-2 fw-bolder"
                style={{ color: btnColor }}
              >
                {sub}
              </Card.Title>
              <Card.Subtitle className="mt-3 mb-2 text-muted fs-5 fw-600">
                Year: {GetStudentYear({ year, inWords: true })}
              </Card.Subtitle>
              {theo_batch !== undefined &&
                theo_batch !== null &&
                theo_batch.length !== 0 && (
                  <Card.Subtitle className="mb-2 text-muted fs-6 fw-600 d-flex gap-2">
                    Theory:
                    <div className="d-flex flex-wrap align-items-center fw-600">
                      {theo_batch !== undefined &&
                        theo_batch.map((theo, ind) => (
                          <div key={ind} className="flex-nowrap">
                            {theo}
                            {ind !== theo_batch.length - 1 && <>,&nbsp;</>}
                          </div>
                        ))}
                    </div>
                  </Card.Subtitle>
                )}
              {prac_batch !== undefined &&
                prac_batch !== null &&
                prac_batch.length !== 0 && (
                  <Card.Subtitle className="mb-2 text-muted fs-6 fw-600 d-flex gap-2">
                    Practical:{" "}
                    <div className="d-flex flex-wrap align-items-center fw-600">
                      {prac_batch !== undefined &&
                        prac_batch.map((prac, ind) => (
                          <div key={ind}>
                            {prac}
                            {ind !== prac_batch.length - 1 && <>,&nbsp;</>}
                          </div>
                        ))}
                    </div>
                  </Card.Subtitle>
                )}
            </div>
          </Card.Body>
        </Card>
      </CardGroup>
    );
  };

  const FeedbackCardRow = () => {
    return (
      <Container>
        <Row xs={1} sm={2} md={3} lg={4} className="">
          {/* {console.log('In Comp', myBatches)} */}
          {myBatches.map((item, key) => (
            <Col
              className="d-flex align-items-start justify-content-center p-3"
              key={key}
            >
              <FeedbackCard
                sub={item.sub_name}
                theo_batch={item.theo_bac}
                prac_batch={item.prac_bac}
                theo_batch_list={item.theo_bac_list}
                prac_batch_list={item.prac_bac_list}
                year={item.year}
              />
            </Col>
          ))}
        </Row>
      </Container>
    );
  };

  async function FormSubmit(e) {
    e.preventDefault();
    //console.log(e.target.getElementsByTagName("input"))
    //e.target.getElementsByTagName("input").map((inp,ind)=>{
    //    console.log(inp)
    //})
    var data = new FormData(e.target);
    let req_dic = {};
    req_dic["batch"] = [];
    req_dic["prac_teachers"] = [];
    req_dic["theory_teachers"] = [];
    req_dic["year"] = selectedYr;
    req_dic["subject_name"] = sub_name;
    for (var [key, value] of data) {
      if (key !== "year") req_dic[key].push(value);
    }

    setAddSubSpinner(true);
    const res = await axiosInstance
      .post(`/gettUsersBac/${user.username}`, { data: req_dic })
      .catch((err) => {
        console.log(err);
      });

    if (res) {
      console.log(res);
      if (res.status === 200) {
        if (res.data.status_code === 200) {
          toastrFunc("success", "Successfully added");
          setShow(false);
          window.location.reload();
        } else {
          toastrFunc("error", res.data.status_msg);
          //alert(res.data.status_msg);
        }
      } else {
        toastrFunc("error", "Error occured");
        //  alert("Error occured");
      }
    }

    setAddSubSpinner(false);
  }
  return (
    <>
      <Helmet>
        <title>Subjects</title>
        <meta
          name="description"
          content="Subjects for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/tSubjects" />
      </Helmet>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Form onSubmit={FormSubmit}>
          <Modal.Header>
            <Modal.Title className="fw-bold">Add Subject</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label className="fw-bold">Subject Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject name"
                autoFocus
                required
                onChange={(e) => {
                  set_sub_name(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group>
              <div className="fw-bold">Year</div>
              <Select
                required
                name="year"
                options={options_year}
                onChange={(e) => {
                  setSelectedYr(e.value);
                }}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </Form.Group>
            <Form.Group>
              <div className="fw-bold">Batch</div>
              <Select
                isMulti
                required
                isClearable
                name="batch"
                options={batches[selectedYr]}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </Form.Group>
            <Form.Group>
              <div className="fw-bold">Theory Teacher</div>
              <Select
                isMulti
                required
                isClearable
                name="theory_teachers"
                options={teachers}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </Form.Group>
            <Form.Group>
              <div className="fw-bold">Practical Teacher</div>
              <Select
                isMulti
                isClearable
                required
                name="prac_teachers"
                options={teachers}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant={"dark"}
              onClick={handleClose}
              disabled={addSubSpinner}
              className="fw-600"
            >
              Close
            </Button>
            <Button
              type="submit"
              // disabled={addSubSpinner}
              className="d-flex align-items-center gap-2 fw-600"
              style={{ backgroundColor: "#3E465E" }}
            >
              {addSubSpinner ? (
                <div className="p-0">
                  <CustomSpinner inBtn={true} size="sm" />
                </div>
              ) : (
                <>
                  <span>Add</span>
                  <i className="fa-solid fa-plus" />
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* -------------------------------------------------------------------------------------------------- */}
      <h1
        className="text-center mt-5 display-4 fw-bold"
        style={{ color: btnColor }}
      >
        {JSON.parse(localStorage.getItem("user")).userRole ===
        RoleConstants.ADMIN
          ? "ALL"
          : "MY"}{" "}
        SUBJECTS
      </h1>

      <Container className="d-flex flex-column gap-2">
        <Row></Row>

        <Container>
          <Container className={styles.teachDashboardTopBtnContainer}>
            {JSON.parse(localStorage.getItem("user"))?.userRole ===
              RoleConstants.ADMIN ||
            JSON.parse(localStorage.getItem("user"))?.canCreateSubject ? (
              <CreateNewFormBtn />
            ) : null}
          </Container>
        </Container>

        <Row>
          {subjectSpinner ? (
            <div className="text-center mt-5">
              <CustomSpinner size={"lg"} color={btnColor} />
            </div>
          ) : myBatches.length !== 0 ? (
            <FeedbackCardRow />
          ) : (
            <NoSubjectsTab />
          )}
        </Row>
      </Container>
    </>
  );
}
