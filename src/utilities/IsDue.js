const IsDue = (date) => {
  if (new Date(date).getTime() > new Date().getTime()) {
    return false;
  }
  else {
    return true;
  }
}

export default IsDue