import $ from "jquery";
import { MDBDataTableV5, MDBInput } from "mdbreact";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import { RadioButton, RadioGroup } from "react-radio-buttons";
import { useNavigate } from "react-router-dom";
import readXlsxFile, { readSheetNames } from "read-excel-file";
import axiosInstance from "../../axios";
import CustomSpinner from "../../common/CustomSpinner";
import toastrFunc from "../../common/toastrFunc";
import xlsx from "../../constants/ClassInfo.xlsx";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import GetStudentYear from "../../utilities/GetStudentYear";

import "./XLSTOJSON.css";
const schema = {
  Name: {
    // JSON object property name.
    prop: "Name",
    type: String,
    required: true,
  },
  SapId: {
    prop: "SapID",
    type: String,
    required: true,
  },
  Email: {
    prop: "Email",
    type: String,
    required: true,
  },
  Phone: {
    prop: "Phone",
    type: Number,
    required: true,
  },
};
const columns = [
  {
    label: "Name",
    field: "Name",
    sort: "disabled",
  },
  {
    label: "Sap Id",
    field: "SapID",
    sort: "disabled",
  },
  {
    label: "Email",
    field: "Email",
    sort: "disabled",
  },
  {
    label: "Phone Number",
    field: "Phone",
    sort: "disabled",
  },
];
const columnsManual = [
  {
    label: "",
    field: "delete",
    sort: "disabled",
  },
  {
    label: "Name",
    field: "Name",
    sort: "disabled",
  },
  {
    label: "Sap Id",
    field: "SapID",
    sort: "disabled",
  },
  {
    label: "Email",
    field: "Email",
    sort: "disabled",
  },
  {
    label: "Phone Number",
    field: "Phone",
    sort: "disabled",
  },
];
const TableT = ({ isTableLoaded, setIsTableLoaded, batches }) => {
  const [bac, setBac] = useState({});
  useEffect(() => {
    setBac(batches);
    setIsTableLoaded(false);
    return () => {};
  }, [isTableLoaded]);
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
                      id={key}
                      name={`batch_name_${ind}`}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>

              <MDBDataTableV5
                className="viewScdlTestTable"
                responsive
                fixed
                striped
                bordered
                noBottomColumns
                hover
                exportToCSV={true}
                entries={10}
                entriesOptions={[5, 10, 15, 30, 50]}
                data={{ columns: columns, rows: value }}
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
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
const TableTManual = ({ batches, div_name_ }) => {
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
              <p>{div_name_ + (ind + 1)}</p>
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

function XLSTOJSON() {
  const [Batches, setBatches] = useState({});
  const [BatchesM, setBatchesM] = useState({ 1: [] });
  const [allStudents, setAllStudents] = useState([]);
  const [allStudentsM, setAllStudentsM] = useState([]);
  const [batchNameList, setBatchNameList] = useState(["1"]);
  const [studentInst, setStudentInst] = useState({});
  const [studentInstBatch, setStudentInstBatch] = useState();
  const [year, setYear] = useState(0);
  const [show, setShow] = useState(false);
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const [allIds, setAllIds] = useState([]);
  const [div_name, set_div_name] = useState("");
  const { primaryColor, btnColor, secondaryColor } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [checked, setChecked] = useState(true);
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

  async function submit(e) {
    setSpinner(true);
    e.preventDefault();
    let finbac = {};
    if (checked) {
      let allbac = Batches;
      console.log(allbac);
      await Object.entries(allbac).map(([key, value]) => {
        console.log(key.toUpperCase());
        finbac[key.toUpperCase()] = value;
      });
      //  setBatches(finbac);
    }
    const res = await axiosInstance
      .post("/bac", {
        data: {
          excelData: checked ? finbac : BatchesM,
          year: year,
          div_name: div_name,
          allStudents: checked ? allStudents : allStudentsM,
        },
      })
      .catch((err) => {
        console.log(err);
        toastrFunc("error", err);
        //alert(err);
      });

    setSpinner(false);
    if (res?.data?.status_code === 200) {
      toastrFunc("success", "success");
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
  const downloadTxtFile = () => {
    const element = document.createElement("a");
    element.href = xlsx;
    element.download = "excel-sample.xlsx";
    element.click();
  };
  return (
    <>
      <Helmet>
        <title>Add Batch</title>
        <meta
          name="description"
          content="Add students batch for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/taddbatch" />
      </Helmet>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header
          style={{ paddingBottom: "20px" }}
          closeButton
        ></Modal.Header>
        <Modal.Body>
          <div
            style={{
              borderLeft: "3px solid #293E6F",
              height: "35px",
              marginTop: "20px",
              marginLeft: "10px",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                color: "#293E6F",
                fontFamily: "Poppins",
                fontWeight: "medium",
                padding: "6px 0 6px",
                marginTop: "20px",
                marginLeft: "10px",
              }}
            >
              Instructions
            </h2>
          </div>
          <ul
            style={{
              marginLeft: "2px",
              marginTop: "12px",
              fontSize: "13.6px",
            }}
          >
            <li>Each PAGE data of excel file decides the BATCH data</li>
            <li>
              NAME of each PAGE that is each BATCH is very IMPORTANT!
              (case-sensitive)
            </li>
            <li>Column Name of a PAGE must be Name only (case-sensitive)</li>
            <li>Column Name of a PAGE must be SapId only (case-sensitive)</li>
            <li>Column Name of a PAGE must be Email only (case-sensitive)</li>
            <li>Column Name of a PAGE must be Phone only (case-sensitive)</li>
            <li>All Column are case sensitive</li>
            <li>This process repeats for different batches</li>
          </ul>
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={downloadTxtFile}
            style={{ width: "224px", height: "40px" }}
          >
            Download Sample excel
          </Button>
        </Modal.Footer>
      </Modal>

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
      <Container className="d-flex flex-column gap-5">
        <Row className="text-center mt-5">
          <h1 className="display-4 fw-bold" style={{ color: btnColor }}>
            ADD BATCH
          </h1>
        </Row>
        <Row>
          <RadioGroup
            onChange={() => {
              setChecked(!checked);
            }}
            className="rdioBtn"
            horizontal
          >
            <RadioButton
              checked={checked}
              pointColor="rgb(62, 70, 94)"
              value="apple"
            >
              Add using Excel
            </RadioButton>
            <RadioButton
              checked={!checked}
              pointColor="rgb(62, 70, 94)"
              value="orange"
            >
              Add manually
            </RadioButton>
          </RadioGroup>
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
        {checked && (
          <>
            <Row>
              <Form
                onSubmit={submit}
                className="d-flex align-items-center justify-content-center flex-column gap-4"
              >
                <Container className="d-flex align-items-center justify-content-center flex-column">
                  <h4>Please insert your file here: </h4>
                  <Row
                  // style={{ width: "60%", margin: "2% 0 0 0" }}
                  >
                    <Col lg={12}>
                      <div className="text-center my-4 w-100">
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          id="csv_upload"
                          style={{
                            display: "inline-block",
                            fontSize: "16px",
                            marginBottom: "10px",
                            marginLeft: "5px",
                            color: "#293e6f",
                            marginTop: "10px",
                          }}
                          required
                          onChange={(e) => {
                            let targetfile = e.target.files[0];
                            let batch = {};
                            let allStud = [];
                            readSheetNames(targetfile).then((readSheetName) => {
                              readSheetName.map((sheetname) => {
                                readXlsxFile(targetfile, {
                                  sheet: sheetname,
                                  schema: schema,
                                }).then((obj) => {
                                  let sheetName = `${sheetname}`;
                                  batch[sheetName] = obj.rows;
                                  allStud.push(...obj.rows);
                                });
                              });
                              setBatches(batch);
                              setAllStudents(allStud);
                              const timer = setTimeout(() => {
                                setIsTableLoaded(true);
                                clearTimeout(timer);
                              }, 500);
                            });
                          }}
                        />
                      </div>
                    </Col>
                    <Col lg={12} className="text-center">
                      <Button
                        // style={{ width: "244px", height: "50px" }}
                        className="rounded-lg fw-600"
                        style={{ backgroundColor: "#3E465E" }}
                        onClick={(e) => {
                          setShow(true);
                        }}
                      >
                        Excel Uploading Guidelines
                      </Button>
                    </Col>
                  </Row>
                </Container>
                <Form.Group className="my-3">
                  <h4>Division Name(As per Excel)</h4>
                  <Form.Control
                    type="text"
                    placeholder="Enter division"
                    autoFocus
                    value={div_name}
                    name="division_name"
                    onChange={(e) => {
                      set_div_name(e.target.value);
                    }}
                    required
                  />
                </Form.Group>
                <Container className="d-flex align-items-center justify-content-center flex-column">
                  <span className="d-flex align-items-center justify-content-center flex-column gap-4">
                    <div className="d-flex align-items-center justify-content-center flex-column gap-2">
                      <h4>Select the entered batch year: </h4>
                      <Form.Select
                        required
                        className=""
                        value={year}
                        onChange={(e) => {
                          if (e.target.value !== "")
                            setYear(parseInt(e.target.value));
                        }}
                      >
                        <option></option>
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
                    </div>
                    <button
                      className="btn text-white w-100 fw-600"
                      style={{ backgroundColor: primaryColor }}
                      type="submit"
                    >
                      {spinner ? (
                        <CustomSpinner inBtn={true} size="sm" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </span>
                </Container>
                <Row>
                  <Col>
                    <TableT
                      setIsTableLoaded={setIsTableLoaded}
                      isTableLoaded={isTableLoaded}
                      batches={Batches}
                    />
                  </Col>
                </Row>
              </Form>
            </Row>
          </>
        )}
        {!checked && (
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
                        value={year}
                        onChange={(e) => {
                          if (e.target.value !== "")
                            setYear(parseInt(e.target.value));
                        }}
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
                              [`${div_name}${++Object.entries(BatchesM)
                                .length}`]: [],
                            });
                            setBatchNameList([
                              ...batchNameList,
                              `${div_name}${++batchNameList.length}`,
                            ]);
                          } else {
                            setBatchesM({
                              ...BatchesM,
                              [++Object.entries(BatchesM).length]: [],
                            });
                            setBatchNameList([
                              ...batchNameList,
                              ++batchNameList.length,
                            ]);
                          }
                        }}
                      >
                        Add batch +
                      </button>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <div
                    style={{ border: "3px solid grey", padding: "25px 15px" }}
                  >
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
                                Name: e.target.value,
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
                                SapID: e.target.value,
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
                                Email: e.target.value,
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
                                Phone: e.target.value,
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
                              if (!studentInst.Name) {
                                toastrFunc("error", "Enter student name");
                              } else if (!studentInst.SapID) {
                                toastrFunc("error", "Enter student sap id");
                              } else if (!studentInst.Email) {
                                toastrFunc("error", "Enter student email");
                              } else if (!validateEmail(studentInst.Email)) {
                                toastrFunc("error", "Enter valid email");
                              } else if (!studentInst.Phone) {
                                toastrFunc(
                                  "error",
                                  "Enter student phone number"
                                );
                              } else if (!validatePhone(studentInst.Phone)) {
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
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setAllIds((obj) => [
                                            ...obj,
                                            tempDic["id"],
                                          ]);
                                        } else {
                                          setAllIds(
                                            allIds.filter(
                                              (obj) => obj !== "checkbox-" + idd
                                            )
                                          );
                                        }
                                        document.getElementById(
                                          "checkbox-" + idd
                                        ).checked = e.target.checked;
                                      }}
                                    />
                                  ),
                                };
                                setAllStudentsM((obj) => [
                                  ...obj,
                                  finaltempDic,
                                ]);
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
                {$(".checkboxDel:checkbox:checked").length > 0 && (
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
                    {spinner ? (
                      <CustomSpinner inBtn={true} size="sm" />
                    ) : (
                      "Delete selected"
                    )}
                  </button>
                )}
              </Form>
            </Row>
          </>
        )}
      </Container>
    </>
  );
}

export default XLSTOJSON;
