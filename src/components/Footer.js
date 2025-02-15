import React, { useContext } from 'react';
import { Row, Col, Image, Container } from "react-bootstrap";
import { ThemeContext } from '../context/Theme/ThemeContext';
import logo from "../images/2.png";

const Footer = () => {
  const { greyDefault, btnColor } = useContext(ThemeContext);
  const email = "insertemail@gmail.com"
  const linkedIn = "linkedIN"
  return (
    <>
      <Container fluid style={{ background: greyDefault }} className='p-0'>
        <Row className="p-md-3">
          <Col>
            <div className='d-flex flex-column gap-3'>
              <div className="fw-900 display-3" style={{ color: btnColor }}>
                IT Feedback Portal
              </div>
              <div className='d-flex flex-column gap-2'>
                <div className='fs-5 d-flex align-items-center gap-3'>
                  <i className="fa-solid fa-envelope fa-lg" style={{ color: btnColor }} />
                  <div className='fw-600'>{email}</div>
                </div>
                <div className='fs-5 d-flex align-items-center gap-3'>
                  <i className="fa-brands fa-linkedin fa-xl" style={{ color: btnColor }} />
                  <div className='fw-600'>{linkedIn}</div>
                </div>
              </div>
            </div>
          </Col>

          <Col className="d-flex flex-column justify-content-end align-items-end px-2">
            <div>
              <Image
                src={logo} />
            </div>
          </Col>
        </Row>
        <div className='text-center py-2 fw-300 fs-5'>
          © All Copyrights Reserved. DJSCE
        </div>
      </Container>
    </>
  )
}

export default Footer
