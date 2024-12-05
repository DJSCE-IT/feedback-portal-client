import cx from "classnames";
import React, { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/Theme/ThemeContext";
import contactPageImg from "../images/contact.png";
import Chaitanya from "../images/team/Chaitanya.jpeg";
import Manan from "../images/team/Manan.jpg";
import anuImg from "../images/team/anu.jpg";
import pradImg from "../images/team/prad.jpg";
import shauImg from "../images/team/shau.jpg";
import tanImg from "../images/team/tan.jpg";
import yashImg from "../images/team/yash.jpg";
import anurImg from "../images/team/anurag.jpg";
import jhenilImg from "../images/team/jhenil.jpg";
import styles from "./Contact.module.css";

export default function ContactPage() {
  let seniorDevs = [
    { name: "Manan Doshi", role: "Web Developer", profileImg: Manan },
    { name: "Chaitanya Kumbhar", role: "Web Developer", profileImg: Chaitanya },
    { name: "Shaurya Magar", role: "Web Developer", profileImg: shauImg },
    { name: "Tanmai Kamat", role: "Web Developer", profileImg: tanImg },
    { name: "Yash Brahmabhatt", role: "Web Developer", profileImg: yashImg },
    { name: "Pradhyuman Pandey", role: "Web Developer", profileImg: pradImg },
    { name: "Anushka Mulik", role: "Web Developer", profileImg: anuImg },
    { name: "Jhenil Parihar", role: "Web Developer", profileImg: jhenilImg },
    { name: "Anurag Lade", role: "Web Developer", profileImg: anurImg },
  ];

  const { btnColor } = useContext(ThemeContext);
  //TODO add email
  const email = "djsceitdepartment@gmail.com";
  const socialMedia = [
    {
      url: "https://www.instagram.com/djsce.it/",
      comp: <i className="fa-brands fa-instagram fa-2xl"></i>,
    },
    { url: "", comp: <i className="fa-brands fa-linkedin-in fa-2xl"></i> },
    // { url: "", comp: <i className="fa-brands fa-instagram"></i> },
  ];
  const mob = [
    { name: "Dr. Vinaya Sawant", contact: "+91 9867248114" },
    { name: "Dr. Neha Katre", contact: "+91 9867550661" },
  ];

  return (
    <div>
      <Container fluid className="px-md-5 mb-5">
        <Row
          className="my-5 rounded-lg"
          style={{ background: btnColor, borderRadius: "15px" }}
        >
          <Col
            className={cx(
              styles.imgCol,
              "d-flex justify-content-start align-items-start"
            )}
          >
            <img
              src={contactPageImg}
              className="img-fluid"
              style={{ borderRadius: "15px" }}
              alt="signup"
              srcSet=""
            />
          </Col>
          <Col
            xs={12}
            sm={12}
            md={8}
            lg={6}
            className={cx(
              styles.contactCol,
              "d-flex flex-column gap-3 justify-content-start p-5 pt-5"
            )}
            style={{ color: "#FFF" }}
          >
            <div className={cx(styles.sizeH1, "fw-900")}>
              <u>Contact Us</u>
            </div>
            <div className={cx(styles.sizetext, "fw-600 mb-4")}>
              Need help with a problem? We’re here to solve any queries you may
              have.
            </div>

            <a
              href={`mailto:${email}`}
              className={cx(
                styles.sizeInfo,
                "fw-300 fs-4 d-flex align-items-center gap-2 text-white"
              )}
              target="_blank"
            >
              <div>
                <i className={cx(styles.emailIcon, "fa-solid fa-envelope")}></i>
              </div>
              <div className={cx(styles.deptEmail, "text-wrap")}>{email}</div>
            </a>

            <Container
              fluid
              className={cx(
                styles.sizeInfo,
                styles.contactCont,
                "fw-300 fs-5 d-flex align-items-center justify-content-end gap-3 text-end p-0"
              )}
            >
              {mob.map((item, key) => (
                <div className="p-3 pe-0" key={key}>
                  <div className="fs-4">{item.name}</div>
                  <div className="d-flex align-items-center justify-content-center gap-1 fs-6">
                    <div>
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>{item.contact}</div>
                  </div>
                </div>
              ))}
            </Container>

            <div className="d-flex align-items-center gap-4 mt-2">
              {socialMedia.map((item, key) => (
                <a
                  target="_blank"
                  href={item.url}
                  key={key}
                  className="text-light fs-3"
                >
                  {item.comp}
                </a>
              ))}
            </div>
          </Col>
        </Row>

        <div
          className={cx(
            "d-flex  justify-content-center align-items-center fw-600",
            styles.sizeH1
          )}
        >
          Meet Our Team
        </div>
        <hr />
        <Col>
          <Row>
            <div>
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-5">
                {seniorDevs.map((e, key) => {
                  return (
                    <>
                      {key < 3 && (
                        <DevProfile
                          key={key}
                          name={e.name}
                          role={e.role}
                          img={e.profileImg}
                        />
                      )}
                    </>
                  );
                })}
              </div>
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-5">
                {seniorDevs.map((e, key) => {
                  return (
                    <>
                      {key >= 3 && (
                        <DevProfile
                          key={key}
                          name={e.name}
                          role={e.role}
                          img={e.profileImg}
                        />
                      )}
                    </>
                  );
                })}
              </div>
            </div>
          </Row>
        </Col>
      </Container>
      {/* <Footer /> */}
    </div>
  );
}

let DevProfile = (props) => {
  return (
    <div
      className={cx(
        "d-flex flex-column  justify-content-center align-items-center my-4 gap-3",
        styles.sizetext
      )}
    >
      <img
        height={270}
        width={270}
        src={props.img}
        alt="profileimg"
        className="rounded-circle"
      />
      <div>
        <div className={cx("fw-600", styles.sizeName)}>{props.name}</div>
        <div className="fw-600 text-center" style={{ color: "#5A9CD0" }}>
          {props.role}{" "}
        </div>
      </div>
    </div>
  );
};
