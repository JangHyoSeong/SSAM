import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import "./App.scss";
import SSAM from "./assets/SSAM.png";
import MainPage from "./mainPage/MainPage";
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
import ParentsQuestion from "./parents/question/ParentsQuestion"; // ParentsQuestion 컴포넌트 import

const App = () => {
  const location = useLocation();

  return (
    <div>
      <NavLink to="/">
        <img src={SSAM} className="logo" alt="Logo" />
      </NavLink>
      <div className="menu-array">
        <NavLink
          to="/teacherclassroom"
          className={`navtxt ${
            location.pathname.startsWith('/teacherclassroom') ||
            location.pathname.startsWith('/teacherauthorization')
              ? 'active'
              : ''
          }`}
        >
          <h2>학급정보</h2>
        </NavLink>
        <NavLink to="/teacherquestion" className="navtxt">
          <h2>문의사항</h2>
        </NavLink>
        <NavLink to="/teacherreservationmanagement" className="navtxt">
          <h2>상담예약</h2>
        </NavLink>
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
          <Route path="/teacherclassroom/*" element={<TeacherClassroom />} />
          <Route path="/teacherauthorization" element={<TeacherAuthorization />} />
          <Route path="/teacherreservationmanagement" element={<TeacherReservationManagement />} />
          <Route path="/teacherconsultationlist" element={<TeacherConsultationList />} />
          <Route path="/teacherclassroom/student/:id" element={<TeacherStudentDetail />} />
          {/* 학부모 링크 */}
          <Route path="/parentslogin" element={<ParentsLogin />} />
          <Route path="/parentsjoin" element={<ParentsJoin />} />
          <Route path="/parentssubpage" element={<ParentsSubpage />} />
          <Route path="/parentsupdate" element={<ParentsUpdate />} />
          <Route path="/parentspasswordchange" element={<ParentsPasswordChange />} />
          <Route path="/parentsquestion" element={<ParentsQuestion />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
