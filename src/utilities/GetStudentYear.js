const GetStudentYear = ({ year, inWords = false }) => {
  const yearArrNum = ['1st', '2nd', '3rd', '4th'];
  const yearArrWrds = ['FE', 'SE', 'TE', 'BE'];
  let arr;
  if (inWords) {
    arr = yearArrWrds;
  }
  else {
    arr = yearArrNum;
  }
  try {
    return arr[parseInt(year) - 1];
  } catch (error) {
    console.log(error);
    return year;
  }
}

export default GetStudentYear