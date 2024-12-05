import { useState } from "react";
import axiosInstance from "../../axios";
import RoleConstants from "../../constants/RoleConstants";
import RouteConstants from "../../constants/RouteConstants";
import { UserContext } from "./UserContext";

//Temp Solution
//let users = {
//  teacher: {
//    password: "123456",
//    auth: true,
//    userRole: RoleConstants.TEACHER,
//  },
//  student: {
//    password: "123456",
//    auth: true,
//    userRole: RoleConstants.STUDENT,
//  },
//};
const UserState = (props) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {
      auth: false,
      userRole: RoleConstants.NONE,
    }
  );

  let login = async (username, password) => {
    let route = await axiosInstance
      .post("/login", {
        data: {
          username: username,
          password: password,
        },
      })
      .then((res) => {
        // console.log(res.data);
        let isActi = false;
        let isVeri = false;
        if (res.data?.token) {
          let acc_token = "JWT " + res.data.token.access;
          axiosInstance.defaults.headers["Authorization"] = acc_token;
          localStorage.setItem("access_token", res.data.token.access);
          localStorage.setItem("refresh_token", res.data.token.refresh);
        }
        if (res.data.isActivated) {
          isActi = true;
          if (res.data.isVerified) {
            isVeri = true;
          }
        } else if (
          res.data.isActivated === false &&
          res.data.userRole === RoleConstants.STUDENT
        ) {
          setUser({
            username: username,
            auth: false,
            userRole: RoleConstants.NONE,
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: username,
              auth: false,
              userRole: RoleConstants.None,
            })
          );
          return {
            isExists: res.data.exist,
            isVerified: isVeri,
            isActivated: isActi,
            route: RouteConstants.OTP_PAGE,
          };
        }
        if (res.data.userRole === RoleConstants.TEACHER) {
          setUser({
            username: username,
            auth: true,
            canCreateBatch: res.data.canCreateBatch,
            canCreateSubject: res.data.canCreateSubject,
            canCreateFeedbackForm: res.data.canCreateFeedbackForm,
            userRole: RoleConstants.TEACHER,
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: username,
              auth: true,
              canCreateBatch: res.data.canCreateBatch,
              canCreateSubject: res.data.canCreateSubject,
              canCreateFeedbackForm: res.data.canCreateFeedbackForm,
              userRole: RoleConstants.TEACHER,
            })
          );
          if (isVeri) {
            return {
              isExists: res.data.exist,
              isVerified: res.data.isVerified,
              isActivated: res.data.isActivated,
              route: RouteConstants.TEACHER_DASHBOARD,
            };
          } else {
            return {
              isExists: res.data.exist,
              isVerified: res.data.isVerified,
              isActivated: res.data.isActivated,
              route: RouteConstants.TEACHER_PROFILE,
            };
          }
        } else if (res.data.userRole === RoleConstants.STUDENT) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: username,
              auth: true,
              userRole: RoleConstants.STUDENT,
            })
          );
          setUser({
            username: username,
            auth: true,
            userRole: RoleConstants.STUDENT,
          });
          if (isVeri) {
            return {
              isExists: res.data.exist,
              isVerified: res.data.isVerified,
              isActivated: res.data.isActivated,
              route: RouteConstants.STUDENT_DASHBOARD,
            };
          } else {
            return {
              isExists: res.data.exist,
              isVerified: res.data.isVerified,
              isActivated: res.data.isActivated,
              route: RouteConstants.STUDENT_PROFILE,
            };
          }
        } else if (res.data.userRole === RoleConstants.ADMIN) {
          setUser({
            username: username,
            auth: true,
            canCreateBatch: res.data.canCreateBatch,
            canCreateSubject: res.data.canCreateSubject,
            canCreateFeedbackForm: res.data.canCreateFeedbackForm,
            userRole: RoleConstants.ADMIN,
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: username,
              auth: true,
              canCreateBatch: res.data.canCreateBatch,
              canCreateSubject: res.data.canCreateSubject,
              canCreateFeedbackForm: res.data.canCreateFeedbackForm,
              userRole: RoleConstants.ADMIN,
            })
          );
          return {
            isExists: res.data.exist,
            isVerified: res.data.isVerified,
            isActivated: res.data.isActivated,
            route: RouteConstants.TEACHER_DASHBOARD,
          };
        } else {
          setUser({
            username: null,
            auth: false,
            userRole: RoleConstants.NONE,
          });
          return {
            isExists: res.data.exist,
            isVerified: res.data.isVerified,
            isActivated: res.data.isActivated,
            route: RouteConstants.LOGIN,
          };
        }
      })
      .catch((err) => {
        console.log(err);
        setUser({
          username: null,
          auth: false,
          userRole: RoleConstants.NONE,
        });
        return {
          isExists: 0,
          route: RouteConstants.LOGIN,
        };
      });
    return route;

    // if (users[username].password === password) {
    //     console.log(users[username]);
    //     setUser(users[username]);
    // if (users[username].userRole == RoleConstants.TEACHER) {

    //     return RouteConstants.TEACHER_DASHBOARD;
    // } else if (users[username].userRole == RoleConstants.STUDENT) {
    //     return RouteConstants.STUDENT_DASHBOARD;

    // }
    // }
    // return RouteConstants.LOGIN;
  };

  let signup = async () => {};
  let logOut = async () => {
    localStorage.clear();
    setUser({
      username: null,
      auth: false,
      userRole: RoleConstants.NONE,
    });
  };
  return (
    <UserContext.Provider value={{ user, setUser, login, signup, logOut }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
