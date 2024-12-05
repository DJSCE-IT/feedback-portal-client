import React from 'react'
import { useContext } from 'react'
import { FeedbackFormContext } from '../context/FeedbackForms/FeedbackFormContext';
import { ThemeContext } from '../context/Theme/ThemeContext';
import { UserContext } from '../context/User/UserContext'

function Home() {
  const [userData] = useContext(UserContext);
  const [feedbackData] = useContext(FeedbackFormContext);
  const {bgColor}=useContext(ThemeContext);
  // console.log(x)
  return (
    <div style={{"backgroundColor":bgColor}}>{userData.name} & {feedbackData.fb1[0]}</div>
  )
}

export default Home