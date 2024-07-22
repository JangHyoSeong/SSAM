import "./App.css";
import { Routes, Route, NavLink } from "react-router-dom";
import SSAM from "./assets/SSAM.png";
import MainPage from "./mainPage/MainPage";
import TeacherJoin from "./teacher/join/TeacherJoin";
import TeacherLogin from "./teacher/login/TeacherLogin";
import TeacherSubpage from "./teacher/subPage/TeacherSubpage";
import PasswordChange from './teacher/myPage/PasswordChange';
import TeacherUpdate from './teacher/myPage/TeacherUpdate';
import TeacherQuestion from './teacher/question/TeacherQuestion';

const App = () => {
  return (
    <div className="navbar-array">
      <NavLink to="/" exact="true">
        <img src={SSAM} className="logo" alt="Logo" />
      </NavLink>
      <div className="menu-array">
        <h2>학급정보</h2>
        <NavLink to="/teacherquestion" className={({ isActive }) => (isActive ? 'active' : '')}>
          <h2>문의사항</h2>
        </NavLink>
        <h2>상담예약</h2>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/teacherlogin" element={<TeacherLogin />} />
          <Route path="/teacherjoin" element={<TeacherJoin />} />
          <Route path="/teachersubpage" element={<TeacherSubpage />} />
          <Route path="/teacherupdate" element={<TeacherUpdate />} />
          <Route path="/passwordchange" element={<PasswordChange />} />
          <Route path="/teacherquestion" element={<TeacherQuestion />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
