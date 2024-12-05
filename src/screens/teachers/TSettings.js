import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import Select from "react-select";
import axiosInstance from "../../axios";
import toastrFunc from "../../common/toastrFunc";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import { UserContext } from "../../context/User/UserContext";

function TSettings() {
  const { primaryColor, btnColor } = useContext(ThemeContext);

  const [inst, setInst] = useState([]);
  const [secret_code, set_secret_code] = useState("");
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [selectedInst, setSelectedInst] = useState({});
  const [instName, setInstName] = useState("");
  const [isSelectedInst, setIsSelectedInst] = useState(false);
  const { user } = useContext(UserContext);

  const handleClose = () => {
    setShow(false);
    setShow1(false);
  };
  //  const handleShow = () => setShow(true);
  useEffect(() => {
    if (
      user !== undefined &&
      user.userRole === "admin" &&
      user.username !== ""
    ) {
      axiosInstance
        .get("/tSettings", { params: { username: user.username } })
        .then((res) => {
          //console.log(res.data);
          if (res.data.status_code === 200) {
            setInst(res.data.inst);
            set_secret_code(res.data.secret_code);
          } else {
            toastrFunc("error", res.data.stauts_msg);
            //alert(res.data.stauts_msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toastrFunc("error", "Not authenticated user");
      //  alert("Not authenticated user");
    }

    return () => {};
  }, []);

  return (
    <div>
      <Helmet>
        <title>Settings</title>
        <meta
          name="description"
          content="Settings for SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering's Feedback Portal"
        />
        <link rel="canonical" href="/tSettings" />
      </Helmet>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Feedback Instance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Do you want to change feedback instance? </h4>
          <small style={{ color: "red" }}>
            *This can affect what other users can access
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              axiosInstance
                .post("/tSettings", {
                  data: { selectedInst: selectedInst, username: user.username },
                })
                .then((res) => {
                  console.log(res.data);
                  if (res.data.status_code === 200) {
                    toastrFunc("success", res.data.status_msg);
                    //alert(res.data.status_msg);
                  } else {
                    toastrFunc("error", res.data.status_msg);
                    //alert(res.data.status_msg);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
              handleClose();
            }}
          >
            Change
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show1} onHide={handleClose}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            //console.log({username:user.username,isSelectedInst,instName,isLatest:true})
            axiosInstance
              .post("/createNewInst", {
                data: {
                  username: user.username,
                  isSelectedInst,
                  instName,
                  isLatest: true,
                },
              })
              .then((res) => {
                if (res.data.status_code === 200) {
                  window.location.reload();
                } else {
                  toastrFunc("error", res.data.status_msg);
                  //  alert(res.data.status_msg);
                }
              });
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New Instance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter instance name</Form.Label>
              <Form.Control
                type="name"
                placeholder=""
                autoFocus
                required
                value={instName}
                onChange={(e) => {
                  setInstName(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3 row">
              <Form.Label className="col-md-10">Latest Instance</Form.Label>
              {/*<Form.Control as="checkbox"  />*/}
              <Form.Check className="col-md-2" disabled checked></Form.Check>
            </Form.Group>
            <Form.Group className="mb-3 row">
              <Form.Label className="col-md-10">Selected Instance</Form.Label>

              {/*<Form.Control as="checkbox"  />*/}
              <Form.Check
                className="col-md-2"
                value={isSelectedInst}
                onChange={(e) => {
                  setIsSelectedInst(e.target.checked);
                }}
              ></Form.Check>
              <small style={{ color: "red" }}>
                *This can affect what other users can access
              </small>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add Instance
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Container
        className="d-flex flex-column gap-4"
        style={{ marginBottom: "50px" }}
      >
        <Row className="text-center mt-5">
          <h1 className="display-4 fw-bold" style={{ color: btnColor }}>
            General Settings
          </h1>
        </Row>
        <div
          className="row"
          style={{ border: "3px solid grey", padding: "25px 15px" }}
        >
          <div className={"col-lg-12 col-md-12 col-sm-12 mt-3"}>
            <div className="row" style={{ margin: "14px 0" }}>
              <div className={"col-lg-8 col-md-6 col-sm-12 fs-6 mt-2 ps-1"}>
                Your current Instance
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                {inst.length !== 0 && (
                  <Select
                    className="w-100"
                    aria-label="Div"
                    defaultValue={inst[0]}
                    options={inst}
                    onChange={(e) => {
                      console.log(e);
                      //  if (e !== "") setSubject(e);
                      setSelectedInst(e);
                      setShow(true);
                    }}
                    required={true}
                  ></Select>
                )}
                {inst.length === 0 && (
                  <Select
                    className="w-100"
                    aria-label="Div"
                    options={inst}
                    onChange={(e) => {
                      console.log(e);
                      //  if (e !== "") setSubject(e);
                    }}
                    required={true}
                  ></Select>
                )}
              </div>
            </div>
            <div className="row" style={{ margin: "14px 0" }}>
              <div className={"col-lg-8 col-md-6 col-sm-12 fs-6 mt-2 ps-1"}>
                Start New Instance of Feedback forms?
              </div>
              <Button
                className={
                  "px-3 rounded fw-bold d-flex align-items-center justify-content-center gap-1 col-lg-4 col-md-6 col-sm-12"
                }
                variant="primary"
                onClick={() => {
                  setShow1(true);
                }}
                style={{ backgroundColor: primaryColor }}
              >
                <span>New Instance</span>
              </Button>
            </div>
          </div>
        </div>
        <div
          className="row"
          style={{ border: "3px solid grey", padding: "25px 15px" }}
        >
          <div className={"col-lg-12 col-md-12 col-sm-12 mt-3"}>
            <div className={"row"} style={{ margin: "14px 0" }}>
              <div className={"col-lg-8 col-md-6 col-sm-12 fs-6 mt-2 ps-1"}>
                Your current Secret Code
              </div>

              <input
                className="col-lg-4 col-md-6 col-sm-12"
                style={{ textAlign: "center" }}
                disabled
                value={secret_code}
              ></input>
            </div>
            <div className={"row"} style={{ margin: "14px 0" }}>
              <div className={"col-lg-8 col-md-6 col-sm-12 fs-6 mt-2 ps-1"}>
                Regenerate Secret Code for sign up?
              </div>
              <Button
                className={
                  "px-3 rounded fw-bold d-flex align-items-center justify-content-center gap-1 col-lg-4 col-md-6 col-sm-12"
                }
                variant="primary"
                onClick={() => {
                  axiosInstance
                    .post("/generateSecretCode", {
                      data: { username: user.username },
                    })
                    .then((res) => {
                      if (res.data.status_code === 200) {
                        set_secret_code(res.data.secret_code);
                        toastrFunc("success", res.data.status_msg);
                        //alert(res.data.status_msg);
                      } else {
                        toastrFunc("error", res.data.status_msg);
                        //alert(res.data.status_msg);
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
                style={{ backgroundColor: primaryColor }}
              >
                <span>Regenrate New Secret</span>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default TSettings;
