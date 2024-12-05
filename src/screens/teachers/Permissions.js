import $ from "jquery";
import { MDBDataTableV5, MDBInput } from "mdbreact";
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
//import "../../css/Permissions.css";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import toastrFunc from "../../common/toastrFunc";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import { UserContext } from "../../context/User/UserContext";
import CustomSpinner from "../../common/CustomSpinner";

function Permissions() {
  const navigate = useNavigate();
  const [data, setTData] = useState({ columns: [], rows: [] });
  const [allId, setAllId] = useState([]);
  const { user } = useContext(UserContext);
  const { primaryColor, btnColor } = useContext(ThemeContext);
  const [spinner, setSpinner] = useState(false);

  const columns2 = [
    {
      label: "Name",
      field: "name",
      sort: "disabled",
    },
    {
      label: "Email",
      field: "email",
      sort: "disabled",
    },
    {
      label: "Create Feedback",
      field: "canCreateFeedbackForm",
      sort: "disabled",
    },
    {
      label: "Create Subject",
      field: "canCreateSubject",
      sort: "disabled",
    },
    {
      label: "Create Batch",
      field: "canCreateBatch",
      sort: "disabled",
    },
  ];

  useEffect(() => {
    const data = async () =>
      await axiosInstance
        .get("getuserslist", { params: { username: user.username } })
        .then((res) => {
          if (res.data.status_code === 200) {
            let finallid = [];

            let rowArr = res.data.data.map((v) => {
              finallid.push(v.id);
              return {
                ...v,
                canCreateFeedbackForm: (
                  <MDBInput
                    label=" "
                    defaultChecked={v.canCreateFeedbackForm}
                    style={{ height: "10px", width: "10px" }}
                    type="checkbox"
                    name="canCreateFeedbackForm"
                    className="canCreateFeedbackForm"
                    id={"canCreateFeedbackForm-" + v.id}
                  />
                ),
                canCreateSubject: (
                  <MDBInput
                    label=" "
                    defaultChecked={v.canCreateSubject}
                    style={{ height: "10px", width: "10px" }}
                    type="checkbox"
                    name="canCreateSubject"
                    className="canCreateSubject"
                    id={"canCreateSubject-" + v.id}
                  />
                ),
                canCreateBatch: (
                  <MDBInput
                    label=" "
                    defaultChecked={v.canCreateBatch}
                    style={{ height: "10px", width: "10px" }}
                    type="checkbox"
                    name="canCreateBatch"
                    className="canCreateBatch"
                    id={"canCreateBatch-" + v.id}
                  />
                ),
              };
            });
            setAllId(finallid);

            setTData({
              columns: columns2,
              rows: rowArr,
            });
          } else {
            toastrFunc("error", res.data.status_msg);
          }
        })
        .catch((e) => {
          toastrFunc("error", e);
          console.log(e);
        });
    data();
  }, []);

  return (
    <>
      <Helmet>
        <title>Permissions</title>
        <meta
          name="description"
          content="Permissions page to SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering Feedback Portal"
        />
        <link rel="canonical" href="/tpermission" />
      </Helmet>
      <div
        style={{
          fontSize: "13.6px",
          padding: "0 60px",
          marginBottom: "20px",
        }}
        className="main_permission_div"
      >
        {/*<ConfirmDialogBox
                  showConfirmDialogBox={showConfirmDialogBox}
                  setShowConfirmDialogBox={setShowConfirmDialogBox}
                  title={"No Ongoing tests"}
                  confirm_no={confirm_no_func}
                  confirm_yes={confirm_yes_func}
                  arg={argConfirmModal}
                  msg={confirm_dialog_msg}
                  onlyOk={true}
                />*/}
        <Row>
          <Col md={12}>
            <Row className="text-center mt-5">
              <h1 className="display-4 fw-bold" style={{ color: btnColor }}>
                Grant Permissions
              </h1>
            </Row>
            <MDBDataTableV5
              className="feedbackTable"
              striped
              fixed
              responsive
              bordered
              noBottomColumns
              hover
              data={data}
              entries={10}
              entriesOptions={[5, 10, 15, 30, 50]}
              noRecordsFoundLabel={"No user"}
              style={{ marginTop: "5px", fontSize: "13.6px" }}
              fullPagination
              materialSearch
            />
            <Button
              className={
                "px-3 rounded fw-bold d-flex align-items-center justify-content-center gap-1"
              }
              variant="primary"
              onClick={() => {
                setSpinner(true);

                let finCheckbox = {};
                for (let x = 0; x < allId.length; x++) {
                  let canCreateSubject = false;
                  let canCreateFeedbackForm = false;
                  let canCreateBatch = false;
                  if (
                    $(`#canCreateSubject-${allId[x]}:checkbox:checked`).length >
                    0
                  ) {
                    canCreateSubject = true;
                  }
                  if (
                    $(`#canCreateFeedbackForm-${allId[x]}:checkbox:checked`)
                      .length > 0
                  ) {
                    canCreateFeedbackForm = true;
                  }
                  if (
                    $(`#canCreateBatch-${allId[x]}:checkbox:checked`).length > 0
                  ) {
                    canCreateBatch = true;
                  }
                  finCheckbox[allId[x]] = {
                    canCreateSubject,
                    canCreateFeedbackForm,
                    canCreateBatch,
                  };
                }
                axiosInstance
                  .post("/getuserslist", {
                    data: {
                      username: user.username,
                      permission_data: finCheckbox,
                    },
                  })
                  .then((res) => {
                    if (res.data.status_code === 200) {
                      toastrFunc("success", res.data.status_msg);
                    } else {
                      toastrFunc("error", res.data.status_msg);
                    }
                    setSpinner(false);
                  })
                  .catch((err) => {
                    toastrFunc("error", err);
                    setSpinner(false);
                  });
              }}
              style={{ backgroundColor: primaryColor }}
            >
              {spinner ? (
                <CustomSpinner inBtn={true} size="sm" />
              ) : (
                <span>Save</span>
              )}
            </Button>

            {/*<Row>
                      <Col md={5} style={{ textAlign: "center" }}></Col>
                      <Col md={7}>
                        <button
                          style={{
                            margin: "10px auto 30px auto",
                            border: "none",
                            outline: "none",
                            borderRadius: "5px",
                            fontWeight: "normal",
                            backgroundColor: "#10B65C",
                            fontFamily: "Poppins",
                            padding: "5px 0px",
                            color: "#FFFFFF",
                            width: "165px",
                            textAlign: "center",
                          }}
                          onClick={(e) => {
                            setIsloading(true);
                            let x = $(".checkboxFeedback:checkbox:checked");
                            let userId = [];
                            x.map((xx) =>
                              userId.push(
                                parseInt(x[xx].id.split("checkbox")[1])
                              )
                            );
                            if (userId.length === 0) {
                              setIsloading(false);
                              setIsAlertDangerMsgLoaded(true);
                              setDangerMsg("select users to grant permission");
                            } else {
                              axiosInstance
                                .post("api/permission", {
                                  data: { users: userId },
                                })
                                .then((res) => {
                                  setIsloading(false);
                                  if (res.data.exists) {
                                    window.location.reload();
                                    setIsAlertSuccessMsgLoaded(true);
                                    setSuccessMsg("Mail sent successfully");
                                  } else {
                                    setIsAlertDangerMsgLoaded(true);
                                    setDangerMsg("Error Occured");
                                  }
                                })
                                .catch((e) => {
                                  console.log(e);
                                  setIsloading(false);
                                });
                            }
                          }}
                        >
                          Grant Permission
                        </button>
                      </Col>
                    </Row>*/}
          </Col>
        </Row>
      </div>
    </>
  );
}
export default Permissions;
