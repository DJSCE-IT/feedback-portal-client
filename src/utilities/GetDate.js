const GetDate = (userDate) => {
  try {
    const ts = new Date(userDate);
    const tsArr = ts.toLocaleString().split(", ");
    const getTime = tsArr[1];
    const dateArr = tsArr[0].split('/');
    if (dateArr[1].length === 1) dateArr[1] = '0' + dateArr[1];
    if (dateArr[0].length === 1) dateArr[0] = '0' + dateArr[0];
    const fndate = dateArr[0] + '/' + dateArr[1] + '/' + dateArr[2] + ", " + getTime;
    return fndate;
  } catch (error) {
    console.log(error);
    return userDate;
  }

}

export default GetDate;