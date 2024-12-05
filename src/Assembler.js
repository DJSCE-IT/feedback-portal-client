import React, { useContext } from "react";
import { Col, Row } from "react-bootstrap";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import TeacherNavBar from "./components/TeacherNavBar";
import RoleConstants from "./constants/RoleConstants";
import RouteConstants from "./constants/RouteConstants";
import { UserContext } from "./context/User/UserContext";
import Login from "./screens/Login";
import Dashboard from "./screens/students/Dashboard.js";
import FeedBackForm from "./screens/students/FeedBackForm";
import FormDashboard from "./screens/teachers/FormDashboard.js";
import TBatch from "./screens/teachers/TBatch.js";
import TProfile from "./screens/teachers/TProfile";
import TSubjects from "./screens/teachers/TSubjects";

import DJSCEHeader from "./components/DJSCEHeader";
import LandingPage from "./screens/LandingPage";
import OTP from "./screens/OTP";
import ResetPass from "./screens/ResetPass";
import StudentNavBar from "./screens/students/StudentNavBar";
import StudentProfile from "./screens/students/StudentProfile";
import FeedbackData from "./screens/teachers/FeedbackData";
import Permissions from "./screens/teachers/Permissions";
import TSettings from "./screens/teachers/TSettings";
import TSignup from "./screens/teachers/TSignup";
import ViewTBatch from "./screens/teachers/ViewTBatch";
import XLSTOJSON from "./screens/teachers/XLSTOJSON";

const Assembler = () => {
  const { user } = useContext(UserContext);

  let routes = [
    {
      route: RouteConstants.LOGIN,
      component: <Login />,
      access: RoleConstants.ALL,
    },
    {
      route: RouteConstants.TEACHER_PERMISSION,
      component: <Permissions />,
      access: RoleConstants.ADMIN,
    },
    {
      route: RouteConstants.LANDING_PAGE,
      component: <LandingPage />,
      access: RoleConstants.ALL,
    },

    {
      route: RouteConstants.RESET_PASS,
      component: <ResetPass />,
      access: RoleConstants.NONE,
    },
    {
      route: RouteConstants.STUDENT_DASHBOARD,
      component: <Dashboard />,
      access: RoleConstants.STUDENT,
    },
    {
      route: RouteConstants.STUDENT_FEEDBACKFORM,
      component: <FeedBackForm />,
      access: RoleConstants.STUDENT,
    },
    {
      route: RouteConstants.TEACHER_BATCH,
      component: <TBatch />,
      access: RoleConstants.TEACHER,
    },
    {
      route: RouteConstants.TEACHER_FEEDBACK_DATA,
      component: <FeedbackData />,
      access: RoleConstants.TEACHER,
    },
    {
      route: RouteConstants.TEACHER_DASHBOARD,
      component: <FormDashboard />,
      access: RoleConstants.TEACHER,
    },
    {
      route: RouteConstants.TEACHER_VIEW_BATCH,
      component: <ViewTBatch />,
      access: RoleConstants.TEACHER,
    },
    {
      route: RouteConstants.TEACHER_SETTINGS,
      component: <TSettings />,
      access: RoleConstants.TEACHER,
    },
    {
      route: RouteConstants.OTP_PAGE,
      component: <OTP />,
      access: RoleConstants.ALL,
    },

    {
      route: RouteConstants.STUDENT_PROFILE,
      component: <StudentProfile />,
      access: RoleConstants.STUDENT,
    },
    {
      route: RouteConstants.TEACHER_SUBJECTS,
      component: <TSubjects />,
      access: RoleConstants.TEACHER,
    },
    {
      route: RouteConstants.TEACHER_PROFILE,
      component: <TProfile />,
      access: RoleConstants.TEACHER,
    },

    {
      route: RouteConstants.TEACHER_ADD_BATCH,
      component: <XLSTOJSON />,
      access: RoleConstants.TEACHER,
    },
    {
      route: RouteConstants.TEACHER_SIGNUP,
      component: <TSignup />,
      access: RoleConstants.NONE,
    },
  ];

  return (
    <div>
      <Router>
        <DJSCEHeader />
        {user.userRole === RoleConstants.TEACHER ||
        user.userRole === RoleConstants.ADMIN ? (
          <TeacherNavBar />
        ) : user.userRole == RoleConstants.STUDENT ? (
          <StudentNavBar />
        ) : (
          <></>
        )}
        <Routes>
          {routes.map((route, key) => (
            <Route
              path={route.route}
              exact
              key={key}
              element={
                <Row>
                  <Col>
                    <ValidationComponent
                      access={route.access}
                      component={route.component}
                    />
                  </Col>
                </Row>
              }
            />
          ))}

          {/* do not change */}
          <Route
            path="*"
            element={
              <Row style={{ margin: "20px 0 0 0" }}>
                <Col style={{ padding: "10px 90px" }}>
                  <>
                    <h1>404 not found</h1>
                  </>
                </Col>
              </Row>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

let ValidationComponent = (props) => {
  const { user } = useContext(UserContext);

  if (
    user.auth ||
    (props.access === RoleConstants.NONE &&
      user.userRole === RoleConstants.NONE) ||
    props.access === RoleConstants.ALL
  ) {
    if (
      user.userRole === props.access ||
      user.userRole === RoleConstants.ADMIN ||
      props.access === RoleConstants.ALL
    ) {
      return props.component;
    } else if (props.access !== "" && user.userRole !== props.access) {
      return <div>401 :Access Denied</div>;
    }
  } else {
    return (
      <Navigate
        to={RouteConstants.LOGIN + `?nextPage=${window.location.pathname}`}
      />
    );
  }
};

export default Assembler;
