module.exports = (userType, { name, password, email }) => {
  // console.log(name, password, email);
  const errors = {};
  // check input name
  if (!name || name.trim() === "") {
    errors.name = "User Name Must Not Be empty";
  }
  // check input password
  if (!password) {
    errors.password = "User Password Must Not Be empty";
  } else {
    if (userType === "register" && [...password].length < 6) {
      errors.password = "User Password Must More than 6";
    }
  }
  // check  register or login
  if (userType === "register") {
    // if register check email
    if (!email || email.trim() === "") {
      errors.email = "User Email Must Not Be empty";
    } else {
      // check email adress is valid
      if (
        !String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
      ) {
        errors.name = "User Email Address not valid";
      }
    }
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};
