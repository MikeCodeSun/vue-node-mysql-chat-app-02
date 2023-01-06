// after  login or register  successfully 1 seconde then redirect to other page. hide success message
export default function (showMessage, showLoading, pageAddress) {
  let timeOut;
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    showMessage = false;
    showLoading = false;
    window.location.href = pageAddress;
  }, 500);
}
