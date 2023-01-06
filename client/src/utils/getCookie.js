import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
export default function () {
  const cookie = Cookies.get("token");
  if (cookie) {
    const decoded = jwt_decode(cookie);

    if (decoded.exp * 1000 > Date.now()) {
      return decoded;
    } else {
      window.location.href = "/";
    }
  }
}
