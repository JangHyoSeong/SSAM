import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import MainPage from "../components/mainPage/MainPage";
import Chatbot from "../common/chatbot/Chatbot.jsx";
import SubNavbar from "../common/navigation/SubNavbar.jsx";
import MainNavbar from "../common/navigation/MainNavbar.jsx";
import Video from "../video/Video.jsx";
import { QuestionProvider } from "../store/QuestionContext";
import ProtectedRoute from "./ProtectedRoute";

// Teacher components
import TeacherJoin from "../components/teacher/join/TeacherJoin";
import TeacherLogin from "../components/teacher/login/TeacherLogin";
import TeacherUpdate from "../components/teacher/myPage/TeacherUpdate";
import TeacherSubpage from "../components/teacher/subPage/TeacherSubpage";
import TeacherPasswordChange from "../components/teacher/myPage/TeacherPasswordChange";
import TeacherQuestion from "../components/teacher/question/TeacherQuestion";
import TeacherReservationManagement from "../components/teacher/appointment/TeacherReservationManagement";
import TeacherConsultationList from "../components/teacher/appointment/TeacherConsultationList";
import TeacherClassroom from "../components/teacher/classroom/TeacherClassroom";
import TeacherAuthorization from "../components/teacher/classroom/TeacherAuthorization";
import TeacherStudentDetail from "../components/teacher/classroom/TeacherStudentDetail";

// Parents components
import ParentsJoin from "../components/parents/join/ParentsJoin";
import ParentsLogin from "../components/parents/login/ParentsLogin";
import ParentsUpdate from "../components/parents/myPage/ParentsUpdate";
import ParentsSubpage from "../components/parents/subPage/ParentsSubpage";
import ParentsPasswordChange from "../components/parents/myPage/ParentsPasswordChange";
import ParentsQuestion from "../components/parents/question/ParentsQuestion";
import ParentsClassroom from "../components/parents/classroom/ParentsClassroom";
import ParentsReservationPage from "../components/parents/appointment/ParentsReservationPage";

const AppRouter = () => {
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
            {/* Teacher Routes */}
            <Route path="/teacherlogin" element={<TeacherLogin />} />
            <Route path="/teacherjoin" element={<TeacherJoin />} />
            <Route
              path="/teachersubpage"
              element={<ProtectedRoute element={TeacherSubpage} />}
            />
            <Route
              path="/teacherupdate"
              element={<ProtectedRoute element={TeacherUpdate} />}
            />
            <Route
              path="/teacherpasswordchange"
              element={<ProtectedRoute element={TeacherPasswordChange} />}
            />
            <Route
              path="/teacherquestion"
              element={<ProtectedRoute element={TeacherQuestion} />}
            />
            <Route
              path="/teacherclassroom"
              element={<ProtectedRoute element={TeacherClassroom} />}
            />
            <Route
              path="/teacherauthorization"
              element={<ProtectedRoute element={TeacherAuthorization} />}
            />
            <Route
              path="/teacherreservationmanagement"
              element={
                <ProtectedRoute element={TeacherReservationManagement} />
              }
            />
            <Route
              path="/teacherconsultationlist"
              element={<ProtectedRoute element={TeacherConsultationList} />}
            />
            <Route
              path="/teacherclassroom/student/:id"
              element={<ProtectedRoute element={TeacherStudentDetail} />}
            />
            {/* Parents Routes */}
            <Route path="/parentslogin" element={<ParentsLogin />} />
            <Route path="/parentsjoin" element={<ParentsJoin />} />
            <Route
              path="/parentssubpage"
              element={<ProtectedRoute element={ParentsSubpage} />}
            />
            <Route
              path="/parentsupdate"
              element={<ProtectedRoute element={ParentsUpdate} />}
            />
            <Route
              path="/parentspasswordchange"
              element={<ProtectedRoute element={ParentsPasswordChange} />}
            />
            <Route
              path="/parentsquestion"
              element={<ProtectedRoute element={ParentsQuestion} />}
            />
            <Route
              path="/parentsclassroom"
              element={<ProtectedRoute element={ParentsClassroom} />}
            />
            <Route
              path="/parentsreservationpage"
              element={<ProtectedRoute element={ParentsReservationPage} />}
            />
            {/* Video Route */}
            <Route path="/video" element={<Video />} />
          </Routes>
        </div>
        {/* Chatbot */}
        {showChatbot && <Chatbot />}
      </div>
    </QuestionProvider>
  );
};

export default AppRouter;
