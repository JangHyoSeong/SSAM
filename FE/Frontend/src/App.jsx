import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import "./App.scss";
import MainPage from "./mainPage/MainPage";
import Chatbot from "./chatbot/Chatbot.jsx";
import SubNavbar from "./navigation/SubNavbar.jsx";
import MainNavbar from "./navigation/MainNavbar.jsx";
import { QuestionProvider } from "./store/QuestionContext";

// 선생님
import TeacherJoin from "./teacher/join/TeacherJoin";
import TeacherLogin from "./teacher/login/TeacherLogin";
import TeacherUpdate from "./teacher/myPage/TeacherUpdate";
import TeacherSubpage from "./teacher/subPage/TeacherSubpage";
import TeacherPasswordChange from "./teacher/myPage/TeacherPasswordChange";
import TeacherQuestion from "./teacher/question/TeacherQuestion";
import TeacherReservationManagement from "./teacher/appointment/TeacherReservationManagement";
import TeacherConsultationList from "./teacher/appointment/TeacherConsultationList";
import TeacherClassroom from "./teacher/classroom/TeacherClassroom";
import TeacherAuthorization from "./teacher/classroom/TeacherAuthorization";
import TeacherStudentDetail from "./teacher/classroom/TeacherStudentDetail";

// 학부모
import ParentsJoin from "./parents/join/ParentsJoin";
import ParentsLogin from "./parents/login/ParentsLogin";
import ParentsUpdate from "./parents/myPage/ParentsUpdate";
import ParentsSubpage from "./parents/subPage/ParentsSubpage";
import ParentsPasswordChange from "./parents/myPage/ParentsPasswordChange";
import ParentsQuestion from "./parents/question/ParentsQuestion";
import ParentsClassroom from "./parents/classroom/ParentsClassroom";
import ParentsReservationPage from "./parents/appointment/ParentsReservationPage";

const App = () => {
  const location = useLocation();
  const hideChatbotOnRoutes = ["/", "/teacherlogin", "/teacherjoin", "/parentslogin", "/parentsjoin",];
  const showChatbot = !hideChatbotOnRoutes.includes(location.pathname);

  return (
    <QuestionProvider>
      <div>
        <div className="navbarArray">
          <MainNavbar />
          <SubNavbar />
        </div>
        <div>
          <Routes>
            <Route path="/" element={<MainPage />} />
            {/* 선생님 링크 */}
            <Route path="/teacherlogin" element={<TeacherLogin />} />
            <Route path="/teacherjoin" element={<TeacherJoin />} />
            <Route path="/teachersubpage" element={<TeacherSubpage />} />
            <Route path="/teacherupdate" element={<TeacherUpdate />} />
            <Route path="/teacherpasswordchange" element={<TeacherPasswordChange />} />
            <Route path="/teacherquestion" element={<TeacherQuestion />} />
            <Route path="/teacherclassroom" element={<TeacherClassroom />} />
            <Route path="/teacherauthorization" element={<TeacherAuthorization />} />
            <Route path="/teacherreservationmanagement" element={<TeacherReservationManagement />} />
            <Route path="/teacherconsultationlist" element={<TeacherConsultationList />} />
            <Route path="/teacherclassroom/student/:id" element={<TeacherStudentDetail />} />
            {/* 학부모 링크 */}
            <Route path="/parentslogin" element={<ParentsLogin />} />
            <Route path="/parentsjoin" element={<ParentsJoin />} />
            <Route path="/parentssubpage" element={<ParentsSubpage />} />
            <Route path="/parentsupdate" element={<ParentsUpdate />} />
            <Route path="/parentspasswordchange" element={<ParentsPasswordChange />}/>
            <Route path="/parentsquestion" element={<ParentsQuestion />} />
            <Route path="/parentsclassroom" element={<ParentsClassroom />} />
            <Route path="/parentsreservationpage" element={<ParentsReservationPage />} />
          </Routes>
        </div>
        {showChatbot && <Chatbot />}
      </div>
    </QuestionProvider>
  );
};

export default App;
