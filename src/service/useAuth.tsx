import { jwtDecode } from "jwt-decode";

function UseAuth() {
  let user = null;

  try {
    const token = localStorage.getItem("access_token");
    if (token !== null) {
      user = jwtDecode(token);
    }
  } catch (error) {}
  return { user: user };
}

export default UseAuth;
