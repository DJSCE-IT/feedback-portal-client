import axios from "axios";

const baseURL = "http://localhost:8000/api/";
// const baseURL = "https://djsce-project-feedback-portal-server.onrender.com/api";

// const baseURL = "https://feedback-portal.onrender.com/api/";
const access_token = localStorage.getItem("access_token");

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: access_token ? "JWT " + access_token : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (typeof error.response === "undefined") {
      console.log(
        "A server/network error occurred. " +
          "Looks like CORS might be the problem. " +
          "Sorry about this - we will get it fixed shortly."
      );
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + "token/refresh/"
    ) {
      window.location.href = "/";
      localStorage.clear();
      return Promise.reject(error);
    }
    console.log(error.response);
    if (error.response.status === 400) {
      window.location.href = "/";
      localStorage.clear();
    }
    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          return axiosInstance
            .post("/token/refresh/", { refresh: refreshToken })
            .then((response) => {
              localStorage.setItem("access_token", response.data.access);
              localStorage.setItem("refresh_token", response.data.refresh);

              axiosInstance.defaults.headers["Authorization"] =
                "JWT " + response.data.access;
              originalRequest.headers["Authorization"] =
                "JWT " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log(`Refresh token is expired ${tokenParts.exp}, ${now}`);
          window.location.href = "/";
          localStorage.clear();
        }
      } else {
        console.log("Refresh token not available.");
        window.location.href = "/";
        localStorage.clear();
      }
    }
    if (
      error.response.data.detail ===
      "No active account found with the given credentials"
    ) {
      //  alert("username/password invalid");
      localStorage.clear();
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export default axiosInstance;
