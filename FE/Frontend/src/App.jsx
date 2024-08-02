<<<<<<< HEAD
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.scss";
import MainPage from "./components/mainPage/MainPage";
import Chatbot from "./common/chatbot/Chatbot.jsx";
import SubNavbar from "./common/navigation/SubNavbar.jsx";
import MainNavbar from "./common/navigation/MainNavbar.jsx";
import Video from "./video/Video.jsx";
import { QuestionProvider } from "./store/QuestionContext";
// 선생님
import TeacherJoin from "./components/teacher/join/TeacherJoin";
import TeacherLogin from "./components/teacher/login/TeacherLogin";
import TeacherUpdate from "./components/teacher/myPage/TeacherUpdate";
import TeacherSubpage from "./components/teacher/subPage/TeacherSubpage";
import TeacherPasswordChange from "./components/teacher/myPage/TeacherPasswordChange";
import TeacherQuestion from "./components/teacher/question/TeacherQuestion";
import TeacherReservationManagement from "./components/teacher/appointment/TeacherReservationManagement";
import TeacherConsultationList from "./components/teacher/appointment/TeacherConsultationList";
import TeacherClassroom from "./components/teacher/classroom/TeacherClassroom";
import TeacherAuthorization from "./components/teacher/classroom/TeacherAuthorization";
import TeacherStudentDetail from "./components/teacher/classroom/TeacherStudentDetail";
// 학부모
import ParentsJoin from "./components/parents/join/ParentsJoin";
import ParentsLogin from "./components/parents/login/ParentsLogin";
import ParentsUpdate from "./components/parents/myPage/ParentsUpdate";
import ParentsSubpage from "./components/parents/subPage/ParentsSubpage";
import ParentsPasswordChange from "./components/parents/myPage/ParentsPasswordChange";
import ParentsQuestion from "./components/parents/question/ParentsQuestion";
import ParentsClassroom from "./components/parents/classroom/ParentsClassroom";
import ParentsReservationPage from "./components/parents/appointment/ParentsReservationPage";

const App = () => {
  const location = useLocation();

  const hideChatbotOnRoutes = [
    "/",
    "/teacherlogin",
    "/teacherjoin",
    "/parentslogin",
    "/parentsjoin",
    "/video",
  ];
  const showChatbot = !hideChatbotOnRoutes.includes(location.pathname);

  const hideNavbarOnRoutes = ["/video"];
  const showNavbar = !hideNavbarOnRoutes.includes(location.pathname);

  return (
    <QuestionProvider>
      <div>
        {showNavbar && (
          <div className="navbarArray">
            <MainNavbar />
            <SubNavbar />
          </div>
        )}
        <div>
          <Routes>
            <Route path="/" element={<MainPage />} />
            {/* 선생님 링크 */}
            <Route path="/teacherlogin" element={<TeacherLogin />} />
            <Route path="/teacherjoin" element={<TeacherJoin />} />
            <Route path="/teachersubpage" element={<TeacherSubpage />} />
            <Route path="/teacherupdate" element={<TeacherUpdate />} />
            <Route
              path="/teacherpasswordchange"
              element={<TeacherPasswordChange />}
            />
            <Route path="/teacherquestion" element={<TeacherQuestion />} />
            <Route path="/teacherclassroom" element={<TeacherClassroom />} />
            <Route
              path="/teacherauthorization"
              element={<TeacherAuthorization />}
            />
            <Route
              path="/teacherreservationmanagement"
              element={<TeacherReservationManagement />}
            />
            <Route
              path="/teacherconsultationlist"
              element={<TeacherConsultationList />}
            />
            <Route
              path="/teacherclassroom/student/:id"
              element={<TeacherStudentDetail />}
            />
            {/* 학부모 링크 */}
            <Route path="/parentslogin" element={<ParentsLogin />} />
            <Route path="/parentsjoin" element={<ParentsJoin />} />
            <Route path="/parentssubpage" element={<ParentsSubpage />} />
            <Route path="/parentsupdate" element={<ParentsUpdate />} />
            <Route
              path="/parentspasswordchange"
              element={<ParentsPasswordChange />}
            />
            <Route path="/parentsquestion" element={<ParentsQuestion />} />
            <Route path="/parentsclassroom" element={<ParentsClassroom />} />
            <Route
              path="/parentsreservationpage"
              element={<ParentsReservationPage />}
            />
            {/* 비디오 링크 */}
            <Route path="/video" element={<Video />} />
          </Routes>
        </div>
        {/* 챗봇 링크 */}
        {showChatbot && <Chatbot />}
      </div>
    </QuestionProvider>
=======
import AppRouter from "./router/AppRouter";
import "./App.scss";

const App = () => {
  return (
    <>
      <AppRouter />
    </>
>>>>>>> master
  );
};

export default App;
