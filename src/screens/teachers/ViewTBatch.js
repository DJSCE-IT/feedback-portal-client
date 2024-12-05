import $ from "jquery";
import { MDBDataTableV5, MDBInput } from "mdbreact";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import CustomSpinner from "../../common/CustomSpinner";
import toastrFunc from "../../common/toastrFunc";
import RouteConstants from "../../constants/RouteConstants";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import GetStudentYear from "../../utilities/GetStudentYear";

const columnsManual = [
  {
    label: "",
    field: "delete",
    sort: "disabled",
  },
  {
    label: "Name",
    field: "name",
    sort: "disabled",
  },
  {
    label: "Sap Id",
    field: "sapId",
    sort: "disabled",
  },
  {
    label: "Email",
    field: "email",
    sort: "disabled",
  },
  {
    label: "Phone Number",
    field: "phone",
    sort: "disabled",
  },
];
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
const validateEmail = (emailID) => {
  let atpos = emailID.indexOf("@");
  let dotpos = emailID.lastIndexOf(".");
  if (atpos < 1 || dotpos - atpos < 2) {
    return false;
  }
  return true;
};
function validatePhone(gth) {
  if (gth.substring(3, 4) == "-" && gth.substring(7, 8) == "-")
    // 123-456-7890
    gth = gth.replace("-", "").replace("-", "");
  else if (
    gth.substring(0, 1) == "(" &&
    gth.substring(4, 5) == ")" &&
    gth.substring(8, 9) == "-"
  )
    // (123)456-7890
    gth = gth.replace("(", "").replace(")", "").replace("-", "");
  else if (gth.substring(0, 1) == "(" && gth.substring(4, 5) == ")")
    // (123)4567890
    gth = gth.replace("(", "").replace(")", "");

  if (!isNaN(gth) && gth.length == 10) {
    return true;
  }
  return false;
}
const TableTManual = ({ batches }) => {
  const [bac, setBac] = useState({});
  useEffect(() => {
    setBac(batches);
    return () => {};
  }, [batches]);
  return (
    <div className="d-flex flex-column gap-4 mb-5">
      {/* <h3 className="fw-900 text-center display-4">PREVIEW BATCHES</h3> */}
      {Object.entries(bac) !== 0 &&
        Object.entries(bac).map(([key, value], ind) => {
          return (
            <div className="border border-2 rounded text-center p-3" key={ind}>
              <Form.Group className="my-3">
                <Row>
                  <Col
                    xs={12}
                    sm={6}
                    md={3}
                    style={{
                      marginBottom: 0,
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <h5 style={{ marginBottom: 0 }}>Batch Name</h5>
                  </Col>
                  <Col xs={12} sm={6} md={9}>
                    <Form.Control
                      type="text"
                      placeholder="Enter batch name"
                      autoFocus
                      className="batch_name"
                      defaultValue={key}
                      id={`batch_name_${key}`}
                      name={`batch_name_${ind}`}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>
              <MDBDataTableV5
                responsive
                fixed
                striped
                bordered
                noBottomColumns
                hover
                exportToCSV={true}
                entries={10}
                entriesOptions={[5, 10, 15, 30, 50]}
                data={{ columns: columnsManual, rows: value }}
                style={{ marginTop: "5px", marginBottom: "0" }}
                fullPagination
                materialSearch
              />
            </div>
          );
        })}
    </div>
  );
};

function ViewTBatch() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [spinnerD, setSpinnerD] = useState(false);
  const { primaryColor, btnColor } = useContext(ThemeContext);
  const [allStudentsM, setAllStudentsM] = useState([]);
  const [BatchesM, setBatchesM] = useState({});
  const [div_name, set_div_name] = useState("");
  const [studentInstBatch, setStudentInstBatch] = useState();
  const [studentInst, setStudentInst] = useState({});
  const [batchNameIds, setBatchNameIds] = useState({});
  const [batchNameList, setBatchNameList] = useState(["1"]);
  const [year, setYear] = useState(0);

  const onDelete = (id, finBatch, allStud) => {
    id = id.split("checkbox-")[1];
    let flag = false;
    for (let x in batchNameList) {
      let copyCarValues = finBatch[batchNameList[parseInt(x)]];
      copyCarValues = copyCarValues.filter((obj) => {
        if (obj.id === id) {
          flag = true;
        }
        return obj.id !== id;
      });
      finBatch = {
        ...finBatch,
        [batchNameList[parseInt(x)]]: copyCarValues,
      };
      if (flag) {
        break;
      }
    }
    allStud = allStud.filter((alls) => alls.id !== id);
    return { finBatch: finBatch, allStud: allStud };
  };

  useEffect(() => {
    if (location?.state?.data?.student_list !== undefined) {
      setBatchesM(location?.state?.data?.student_list);
      setBatchNameIds(location?.state?.data?.batch_name_id);
      set_div_name(location?.state?.data?.batch_division);
      setYear(location?.state?.data?.batch_year);
      let batchnamelist = [];
      Object.entries(location?.state?.data?.student_list).forEach(
        ([key, value], ind) => {
          value.map((studlist, index) => {
            let idd = uuidv4();
            value[index] = {
              ...studlist,
              ["id"]: idd,
              ["delete"]: (
                <MDBInput
                  label=" "
                  defaultChecked={false}
                  type="checkbox"
                  name="checkboxDel"
                  className="checkboxDel"
                  id={"checkbox-" + idd}
                />
              ),
            };
          });
          batchnamelist.push(key);
        }
      );
      setBatchNameList(batchnamelist);
      setIsTableLoaded(true);
    } else {
      toastrFunc("error", "Batch not selected");
      //  alert("Batch not selected");
      navigate(-1);
    }

    return () => {};
  }, []);
  async function submit(e) {
    e.preventDefault();
    setSpinner(true);
    let finbac = {};
    let finbacNameList = [];
    let newfinbacNameId = [];
    let allbac = BatchesM;
    await Object.entries(allbac).map(([key, value]) => {
      let bacNameValue = (`#batch_name_${key}`).toUpperCase();
      newfinbacNameId.push({ [bacNameValue]: batchNameIds[key] });
      finbac[bacNameValue] = value;
      finbacNameList.push(bacNameValue);
    });
    setBatchesM(finbac);
    setBatchNameList(finbacNameList);
    const res = await axiosInstance
      .post("/bacUpdate", {
        data: {
          excelData: finbac,
          year: year,
          div_name: div_name,
          allStudents: allStudentsM,
          batchNameList: finbacNameList,
          newfinbacNameId: newfinbacNameId,
        },
      })
      .catch((err) => {
        console.log(err);
        toastrFunc("error", err);
        //alert(err);
      });

    setSpinner(false);
    if (res?.data?.status_code === 200) {
      toastrFunc("success", res.data.status_msg);
      //  alert("success");
      navigate("/tBatch");
    } else {
      toastrFunc("error", res.data.status_msg);
      //  alert(res.data.status_msg);
      if (res.data.status_code === 401) {
        toastrFunc("error", res.data.sameMail);
        //alert(res.data.sameMail);
      }
    }
  }
  return (
    <div style={{ margin: "30px 0" }}>
      <Helmet>
        <title>View Batch</title>
        <meta
          name="description"
          content="View batch uploaded for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/tviewBatch" />
      </Helmet>
      <Container>
        <Container>
          <Row className="text-left mt-5 px-2">
            <span
              style={{ color: btnColor, fontWeight: "500", cursor: "pointer" }}
              onClick={() => {
                navigate("/tBatch");
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
          <Row className="text-center my-2">
            <h1 className="display-4 fw-bold" style={{ color: btnColor }}>
              VIEW BATCH
            </h1>
          </Row>
        </Container>

        <>
          <Row>
            <Form onSubmit={submit}>
              <Row
                style={{
                  border: "3px solid grey",
                  padding: "25px 15px",
                  marginBottom: "15px",
                }}
              >
                <h4>Batch details</h4>
                <Col xs={12} sm={6} md={4} style={{ padding: "0 20px" }}>
                  <Form.Group className="my-3">
                    <h6>Batch year </h6>
                    <Form.Select
                      required
                      className=""
                      onChange={(e) => {
                        if (e.target.value !== "")
                          setYear(parseInt(e.target.value));
                      }}
                      value={year}
                    >
                      <option>Select Year</option>
                      <option value="1">
                        {" "}
                        {GetStudentYear({ year: 1, inWords: true })}{" "}
                      </option>
                      <option value="2">
                        {" "}
                        {GetStudentYear({ year: 2, inWords: true })}{" "}
                      </option>
                      <option value="3">
                        {" "}
                        {GetStudentYear({ year: 3, inWords: true })}{" "}
                      </option>
                      <option value="4">
                        {" "}
                        {GetStudentYear({ year: 4, inWords: true })}{" "}
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={4} style={{ padding: "0 20px" }}>
                  <Form.Group className="my-3">
                    <h6>Division Name</h6>
                    <Form.Control
                      type="text"
                      placeholder="Enter division"
                      autoFocus
                      name="division_name"
                      value={div_name}
                      onChange={(e) => {
                        set_div_name(e.target.value);
                        let batchnamelist = batchNameList;
                        let finallist = [];
                        for (let x = 0; x < batchnamelist.length; x++) {
                          finallist.push(`${e.target.value}${x + 1}`);
                        }
                        setBatchNameList(finallist);
                        let finalBatchesM = {};
                        Object.keys(BatchesM).forEach((key, ind) => {
                          finalBatchesM[finallist[ind]] = BatchesM[key];
                        });
                        setBatchesM(finalBatchesM);
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <Form.Group className="my-3">
                    <button
                      className="btn text-white fw-600"
                      style={{
                        backgroundColor: primaryColor,
                        marginTop: "25px",
                      }}
                      type="button"
                      onClick={(e) => {
                        if (div_name !== "") {
                          setBatchesM({
                            ...BatchesM,
                            [`${div_name}${++Object.entries(BatchesM).length}`]:
                              [],
                          });
                          setBatchNameList([
                            ...batchNameList,
                            `${div_name}${++batchNameList.length}`,
                          ]);
                          setBatchNameIds({
                            ...batchNameIds,
                            [`${div_name}${batchNameList.length}`]: null,
                          });
                        } else {
                          setBatchesM({
                            ...BatchesM,
                            [++Object.entries(BatchesM).length]: [],
                          });
                          setBatchNameList([
                            ...batchNameList,
                            ++batchNameList.length,
                          ]);
                          setBatchNameIds({
                            ...batchNameIds,
                            [batchNameList.length]: null,
                          });
                        }
                      }}
                    >
                      Add batch +
                    </button>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <div style={{ border: "3px solid grey", padding: "25px 15px" }}>
                  <h4>Add students</h4>
                  <Row>
                    <Col xs={12} sm={6} md={4} style={{ padding: "0 20px" }}>
                      <Form.Group className="my-3">
                        <h6>Name</h6>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Enter student name"
                          autoFocus
                          onChange={(e) => {
                            setStudentInst({
                              ...studentInst,
                              name: e.target.value,
                            });
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={4} style={{ padding: "0 20px" }}>
                      <Form.Group className="my-3">
                        <h6>Sap Id</h6>
                        <Form.Control
                          type="text"
                          name="sapId"
                          placeholder="Enter student sap id"
                          autoFocus
                          onChange={(e) => {
                            setStudentInst({
                              ...studentInst,
                              sapId: e.target.value,
                            });
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={4} style={{ padding: "0 20px" }}>
                      <Form.Group className="my-3">
                        <h6>Email</h6>
                        <Form.Control
                          type="text"
                          name="email"
                          placeholder="Enter student email"
                          autoFocus
                          onChange={(e) => {
                            setStudentInst({
                              ...studentInst,
                              email: e.target.value,
                            });
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={4} style={{ padding: "0 20px" }}>
                      <Form.Group className="my-3">
                        <h6>Phone number</h6>
                        <Form.Control
                          type="text"
                          name="phone"
                          placeholder="Enter student phone number"
                          autoFocus
                          onChange={(e) => {
                            setStudentInst({
                              ...studentInst,
                              phone: e.target.value,
                            });
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={4} style={{ padding: "0 20px" }}>
                      <Form.Group className="my-3">
                        <h6>Batch</h6>
                        <Form.Select
                          required
                          className=""
                          onChange={(e) => {
                            if (e.target.value !== "")
                              setStudentInstBatch(e.target.value);
                          }}
                        >
                          <option>Select Batch</option>

                          {batchNameList.length !== 0 &&
                            batchNameList.map((bac, ind) => {
                              return (
                                <option key={ind} value={bac}>
                                  {" "}
                                  {bac}
                                </option>
                              );
                            })}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={4} style={{ padding: "0 20px" }}>
                      <Form.Group className="my-3">
                        <button
                          className="btn text-white fw-600"
                          style={{
                            backgroundColor: primaryColor,
                            marginTop: "25px",
                          }}
                          type="button"
                          onClick={(e) => {
                            var validRegex =
                              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                            if (!studentInst.name) {
                              toastrFunc("error", "Enter student name");
                            } else if (!studentInst.sapId) {
                              toastrFunc("error", "Enter student sap id");
                            } else if (!studentInst.email) {
                              toastrFunc("error", "Enter student email");
                            } else if (!validateEmail(studentInst.email)) {
                              toastrFunc("error", "Enter valid email");
                            } else if (!studentInst.phone) {
                              toastrFunc("error", "Enter student phone number");
                            } else if (!validatePhone(studentInst.phone)) {
                              toastrFunc(
                                "error",
                                "Phone number must be 10 digits"
                              );
                            } else if (!studentInstBatch) {
                              toastrFunc("error", "Select batch");
                            } else {
                              let tempDic = studentInst;
                              let idd = uuidv4();
                              let finaltempDic = studentInst;
                              finaltempDic["id"] = idd;
                              tempDic = {
                                ...tempDic,
                                ["id"]: idd,
                                ["delete"]: (
                                  <MDBInput
                                    label=" "
                                    defaultChecked={false}
                                    type="checkbox"
                                    name="checkboxDel"
                                    className="checkboxDel"
                                    id={"checkbox-" + idd}
                                  />
                                ),
                              };
                              setAllStudentsM((obj) => [...obj, finaltempDic]);
                              if (BatchesM[studentInstBatch].length === 0) {
                                setBatchesM({
                                  ...BatchesM,
                                  [studentInstBatch]: [tempDic],
                                });
                              } else {
                                setBatchesM({
                                  ...BatchesM,
                                  [studentInstBatch]: [
                                    ...BatchesM[studentInstBatch],
                                    tempDic,
                                  ],
                                });
                              }

                              //setStudentInst({})
                              //setStudentInstBatch()
                            }
                          }}
                        >
                          Add student +
                        </button>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <TableTManual
                  setIsTableLoaded={setIsTableLoaded}
                  isTableLoaded={isTableLoaded}
                  div_name_={div_name}
                  batches={BatchesM}
                />
              </Row>
              <button
                className="btn text-white fw-600"
                style={{
                  backgroundColor: primaryColor,
                  margin: "10px 0",
                  width: "10%",
                }}
                type="submit"
              >
                {spinner ? <CustomSpinner inBtn={true} size="sm" /> : "Save"}
              </button>
              <button
                className="btn text-white fw-600"
                style={{
                  backgroundColor: "red",

                  margin: "10px 5px",
                  width: "15%",
                }}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  let allCheckBox = $(".checkboxDel:checkbox:checked");
                  var finBatch = BatchesM;
                  var allStud = allStudentsM;
                  for (let x = 0; x < allCheckBox.length; x++) {
                    let returndata = onDelete(
                      allCheckBox[x].id,
                      finBatch,
                      allStud
                    );
                    finBatch = returndata.finBatch;
                    allStud = returndata.allStud;
                  }
                  setBatchesM(finBatch);
                  setAllStudentsM(allStud);
                }}
              >
                Delete selected
              </button>
              <button
                className="btn text-white w-15 fw-600"
                style={{ backgroundColor: "red", margin: "0 10px" }}
                type="button"
                onClick={async (e) => {
                  setSpinnerD(true);
                  console.log(location.state.data);
                  await axiosInstance
                    .post("/delBatch", {
                      data: {
                        year: location.state.data.batch_year,
                        batch_division: location.state.data.batch_division,
                      },
                    })
                    .then((res) => {
                      setSpinnerD(false);
                      if (res.data.status_code !== 200) {
                        toastrFunc("error", res.data.status_msg);
                      } else {
                        toastrFunc("success", res.data.status_msg);
                        navigate(RouteConstants.TEACHER_BATCH);
                      }
                    })
                    .catch((err) => {
                      setSpinnerD(false);
                      toastrFunc("error", err);
                    });
                }}
              >
                {spinnerD ? (
                  <CustomSpinner inBtn={true} size="sm" />
                ) : (
                  "Delete Batch"
                )}
              </button>
            </Form>
          </Row>
        </>
      </Container>
      {/* <Container className="d-flex align-items-center justify-content-center flex-column">
        <span className="d-flex align-items-center justify-content-center flex-column gap-4">
      </span>
      </Container> */}
      {/* {console.log(location?.state?.data?.student_list)} */}
    </div>
  );
}

export default ViewTBatch;
