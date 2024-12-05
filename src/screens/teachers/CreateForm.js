import React from 'react'
import { useContext } from 'react'
import { Card, Row, Button, Form} from 'react-bootstrap'
import { ThemeContext } from '../../context/Theme/ThemeContext'

function CreateForm() {
  const {primaryColor}=useContext(ThemeContext);
  const {btnColor}=useContext(ThemeContext);
  return (
    <div style={{ width:"100%"}}>
    <div className="d-flex justify-content-center align-items-center" style={{ height:"100vh"}}>
    <Card className='rounded mx-auto' style={{ width: '26rem'}}>
      <Card.Header className="text-white text-center fs-2" style={{"backgroundColor":primaryColor }}>DJSCE Feedback Portal</Card.Header>
      <Card.Body>
        <Card.Title className='text-center fs-1 fw-bold'>CREATE FORM</Card.Title>
        <Form>
      <Form.Select className='mt-2 ms-2 col align-self-start' aria-label="Year">
      <option style={{textColor: "#707980"}} >Year*</option>
      <option value="FE">FE</option>
      <option value="SE">SE</option>
      <option value="TE">TE</option>
      <option value="BE">BE</option>
    </Form.Select>
    <Form.Select className='mt-2 ms-2 col align-self-end' aria-label="Div">
      <option>Div*</option>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
      <option value="D">D</option>
    </Form.Select>
    <Form.Group className="ms-2 mt-2" controlId="AllDivFlag">
        <Form.Check type="checkbox" label="Create form for the entire division?" />
    </Form.Group>
    <Form.Select className='mt-2 ms-2 col align-self-end' aria-label="Batch">
      <option>Batch*</option>
      <option value="A1">A1</option>
      <option value="B2">B2</option>
      <option value="C3">C3</option>
      <option value="D4">D4</option>
    </Form.Select>
        </Form>
        <div className="mt-2 d-grid col-7 mx-auto">
        <Button variant="primary" style={{"backgroundColor":btnColor}}>Create</Button>
        </div>
      </Card.Body>
    </Card>
    </div>
    </div>
  );
}

export default CreateForm;
