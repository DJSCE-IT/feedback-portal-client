import toastr from "toastr";

const toastrFunc = (type, msg) => {
  toastr.options = {
    positionClass: "toast-top-right",
    hideDuration: 300,
    timeOut: 10000,
    closeMethod: "fadeOut",
    closeDuration: 300,
    closeEasing: "swing",
    progressBar: true,
  };
  toastr.clear();
  if (`${type}` === "success") {
    setTimeout(() => toastr.success(`${msg}`), 300);
  } else if (`${type}` === "warning") {
    setTimeout(() => toastr.warning(`${msg}`), 300);
  } else if (`${type}` === "info") {
    setTimeout(() => toastr.info(`${msg}`), 300);
  } else if (`${type}` === "error") {
    setTimeout(() => toastr.error(`${msg}`), 300);
  }
};
export default toastrFunc;
