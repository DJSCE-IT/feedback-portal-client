import React from 'react'
import { useContext } from 'react'
import { Row, Button, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import RouteConstants from '../../constants/RouteConstants';
import { ThemeContext } from '../../context/Theme/ThemeContext'
import IsDue from '../../utilities/IsDue';



export default function Dashboard() {
    const { secondaryColor, primaryColor } = useContext(ThemeContext);
    const { btnColor } = useContext(ThemeContext);
    const { pastdueColor } = useContext(ThemeContext);
    const { bgColor } = useContext(ThemeContext);
    let forms = [
        { sub: 'CNS', teacher: 'Prof. Stevina Mam', date: "2022/01/12" },
        { sub: 'ADS', teacher: 'Prof. Neha Ram', date: "2022/07/12" },
        { sub: 'ADS', teacher: 'Prof. ARJ sir', date: "2023/01/12" },
        { sub: 'SA', teacher: 'Prof. Neha Katre', date: "2023/01/12" },
        { sub: 'CNS', teacher: 'Prof. Stevina Mam', date: "2023/01/12" },
        { sub: 'ADS', teacher: 'Prof. Neha Ram', date: "2023/01/12" },
        { sub: 'ADS', teacher: 'Prof. ARJ sir', date: "2023/01/12" },
        { sub: 'SA', teacher: 'Prof. Neha Katre', date: "2022/01/12" },
        { sub: 'CNS', teacher: 'Prof. Stevina Mam', date: "2023/01/12" },
        { sub: 'ADS', teacher: 'Prof. Neha Ram', date: "2023/01/12" },
        { sub: 'ADS', teacher: 'Prof. ARJ sir', date: "2023/01/12" },
        { sub: 'SA', teacher: 'Prof. Neha Katre', date: "2023/01/12" },
        { sub: 'CNS', teacher: 'Prof. Stevina Mam', date: "2023/01/12" },
        { sub: 'ADS', teacher: 'Prof. Neha Ram', date: "2023/01/12" },
        { sub: 'ADS', teacher: 'Prof. ARJ sir', date: "2023/01/12" },
        { sub: 'SA', teacher: 'Prof. Neha Katre', date: "2023/01/12" },
        { sub: 'CNS', teacher: 'Prof. Stevina Mam', date: "2023/01/12" },
        { sub: 'ADS', teacher: 'Prof. Neha Ram', date: "2023/01/12" },
        { sub: 'ADS', teacher: 'Prof. ARJ sir', date: "2023/01/12" },
        { sub: 'SA', teacher: 'Prof. Neha Katre', date: "2023/01/12" },
    ];
    let navigate = useNavigate();

    let ListItem = (sub, teacher, date) => {

        let thisWidColor = (!IsDue(date)) ? primaryColor : pastdueColor;
        return (
            <Button onClick={() => {
                navigate(RouteConstants.STUDENT_FEEDBACKFORM);
            }
            } className="row row-cols-4 row-cols-md-5 gx-5 mt-2" style={{ "backgroundColor": secondaryColor, margin: "1rem 0.75rem", padding: "0", border: "none" }}>
                <div>
                    <div className="card g-4" style={{ "backgroundColor": secondaryColor, width: "14rem", height: "200px", color: "black" }}>
                        <div className="card-header" >{teacher}</div>
                        <div className="card-body">
                            <h5 className="card-title">{sub}</h5>
                            <p className="card-text">Practical/Theory</p>
                            <p className="card-text" style={{ "color": thisWidColor, marginTop: "40px" }}><small>Due date: {date}</small></p>
                        </div>
                    </div>
                </div>
            </Button>);
    }

    return (
        <div className='p-4 my-4 mx-5 g-4 rounded overflow-auto' >

            <div>
                <h1 className='text-center mt-4'>DASHBOARD</h1>
                <div className="card text-white mb-2 mx-4 mt-2" style={{ "backgroundColor": btnColor, width: "18rem", height: "60px" }}>
                    <div className="card-body">
                        <h5 className="card-title">Pending Feedback Forms:</h5>
                    </div>
                </div>
                <Row className="lg-5">
                    <div className='ms-2'>
                        {forms.map((i) => ListItem(i.sub, i.teacher, i.date))}
                    </div>
                </Row>
            </div>
        </div>

    )
}
