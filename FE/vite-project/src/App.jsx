import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import SSAM from "./assets/SSAM.png";
import MainPage from "./mainpage/MainPage";
import TeacherLogin from "./teacher/login/TeacherLogin"
import TeacherJoin from "./teacher/join/TeacherJoin"

const App = () => {
  return (
    <div className="navbar-arr">
      <Link to="/"><img src={SSAM} className="logo" alt="Logo" /></Link>
      <div className="menu-arr">
        <h2>학급관리</h2>
        <h2>문의사항</h2>
        <h2>상담예약</h2>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/teacherlogin" element={<TeacherLogin />} />
          <Route path="/teacherjoin" element={<TeacherJoin />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
