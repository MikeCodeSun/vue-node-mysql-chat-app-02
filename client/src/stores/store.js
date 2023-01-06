import { defineStore } from "pinia";
import axios from "axios";
import showSuccessMessage from "../utils/setTimeOutMessage";
import getCookie from "../utils/getCookie";

axios.defaults.baseURL = "http://localhost:4000/api/v1/";
axios.defaults.withCredentials = true;

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: null,
      errorMessage: null,
      loading: false,
      showSuccessMessage: false,
      isNotSendCode: true,
      verifycodeErrorMessage: "",
      verifyCodeSuccessMessage: "",
      userProfile: null,
      uploadErrorMessage: null,
      updateErrorMessage: null,
    };
  },
  actions: {
    register({ name, password, email }) {
      this.loading = true;
      axios
        .post("user/register", { name, password, email })
        .then((res) => {
          // console.log(res.data);
          this.errorMessage = null;
          this.showSuccessMessage = true;
          showSuccessMessage(this.showSuccessMessage, this.loading, "/login");
        })
        .catch((err) => {
          // console.log(err.response.data);
          this.errorMessage = err.response.data;
          this.loading = false;
        });
    },
    login({ name, password }) {
      this.loading = true;

      axios
        .post("user/login", { name, password })
        .then((res) => {
          // console.log(res.data);
          this.errorMessage = null;
          this.showSuccessMessage = true;
          showSuccessMessage(this.showSuccessMessage, this.loading, "/");
        })
        .catch((err) => {
          // console.log(err);
          if (err.response) {
            // console.log(err.response);
            this.errorMessage = err.response.data;
            this.loading = false;
          }
        });
    },
    logout() {
      axios
        .get("/user/logout")
        .then((res) => {
          console.log(res.data);
          this.user = null;
          // 0105 safari need double logout
          window.location = "http://localhost:5173/login#/login";
        })
        .then((err) => console.log(err));
    },
    getUserFromCookie() {
      this.user = getCookie();
    },
    clearErrorMessage() {
      this.errorMessage = null;
    },
    // 1218 send verify code! loading ,change status etc
    sendVerifyEmailCode() {
      this.loading = true;
      this.verifyCodeSuccessMessage = "";
      axios
        .get("/user/sendverifycode")
        .then((res) => {
          console.log(res.data);
          this.isNotSendCode = false;
          this.loading = false;
          this.verifyCodeSuccessMessage = res.data.message;
          this.verifycodeErrorMessage = "";
        })
        .catch((err) => console.log(err));
    },
    verifyEmailCode(code) {
      if (!code || code.trim() === "") {
        this.verifyCodeSuccessMessage = "";
        this.verifycodeErrorMessage = "code not should be empty";
        return;
      }
      this.loading = true;
      axios
        .get(`user/verify/${code}`)
        .then((res) => {
          console.log(res.data);
          this.loading = false;
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.verifycodeErrorMessage = err.response.data.message;
          this.verifyCodeSuccessMessage = "";
        });
    },
    getUserProfile() {
      axios
        .get("user/profile")
        .then((res) => {
          // console.log(res.data);
          this.userProfile = res.data;
        })
        .catch((err) => console.log(err));
    },
    uploadUserImage(image) {
      axios
        .post("user/uploadimage", image)
        .then((res) => {
          // console.log(res);
          this.userProfile.avatar = res.data.fileName;
          this.uploadErrorMessage = null;
          // window.location.reload();
        })
        .catch((err) => {
          // console.log(err.response.data);
          this.uploadErrorMessage = err.response.data;
        });
    },
    updateUser(name) {
      axios
        .patch("user/updateuser", { name })
        .then((res) => {
          // console.log(res);
          this.updateErrorMessage = null;
          this.userProfile.name = res.data.name;
        })
        .catch((err) => {
          // console.log(err.response.data);
          this.updateErrorMessage = err.response.data;
        });
    },
  },
});
