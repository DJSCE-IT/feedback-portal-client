import './App.css';
import './nav.css';
import UserState from "./context/User/UserState";
import FeedbackFormState from "./context/FeedbackForms/FeedbackFormState";
import Assembler from './Assembler';
import ThemeState from './context/Theme/ThemeState';

import DJSCEHeader from './components/DJSCEHeader';
import TeacherNavBar from './components/TeacherNavBar';

function App() {
  return (
    <div className="App">
      <UserState>
      <ThemeState>
        <FeedbackFormState>
          
          {/* Will contain all the routes */}
          <Assembler />
        </FeedbackFormState>
        </ThemeState>
      </UserState>


    </div>
  );
}

export default App;
