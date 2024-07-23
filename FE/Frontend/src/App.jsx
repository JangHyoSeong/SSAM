import "./App.scss";
import { Routes, Route, NavLink } from "react-router-dom";
import SSAM from "./assets/SSAM.png";
import MainPage from "./mainPage/MainPage";
// 선생님
import TeacherJoin from "./teacher/join/TeacherJoin";
import TeacherLogin from "./teacher/login/TeacherLogin";
import TeacherUpdate from "./teacher/myPage/TeacherUpdate";
import TeacherSubpage from "./teacher/subPage/TeacherSubpage";
import TeacherPasswordChange from "./teacher/myPage/TeacherPasswordChange";
import TeacherQuestion from "./teacher/question/TeacherQuestion";
import TeacherAppointment from "./teacher/appointment/TeacherAppointment";
// 학부모
import ParentsJoin from "./parents/join/ParentsJoin";
import ParentsLogin from "./parents/login/ParentsLogin";
import ParentsUpdate from "./parents/myPage/ParentsUpdate";
import ParentsSubpage from "./parents/subPage/ParentsSubpage";
import ParentsPasswordChange from "./parents/myPage/ParentsPasswordChange";
import ParentsQuestion from "./parents/question/ParentsQuestion"; // ParentsQuestion 컴포넌트 import

const App = () => {
  return (
    <div className="navbar-array">
      <NavLink to="/">
        <img src={SSAM} className="logo" alt="Logo" />
      </NavLink>
      <div className="menu-array">
        <NavLink to="/teacherclassroom" className="navtxt">
          <h2>학급정보</h2>
        </NavLink>

        <NavLink to="/teacherquestion" className="navtxt">
          <h2>문의사항</h2>
        </NavLink>

        <NavLink to="/teacherappointment" className="navtxt">
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
          <Route
            path="/teacherpasswordchange"
            element={<TeacherPasswordChange />}
          />
          <Route path="/teacherquestion" element={<TeacherQuestion />} />
          <Route path="/teacherappointment" element={<TeacherAppointment />} />
          {/* 학부모 링크 */}
          <Route path="/parentslogin" element={<ParentsLogin />} />
          <Route path="/parentsjoin" element={<ParentsJoin />} />
          <Route path="/parentssubpage" element={<ParentsSubpage />} />
          <Route path="/parentsupdate" element={<ParentsUpdate />} />
          <Route
            path="/parentspasswordchange"
            element={<ParentsPasswordChange />}
          />
          <Route path="/parentsquestion" element={<ParentsQuestion />} />{" "}
          {/* ParentsQuestion 라우트 추가 */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
