import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import SSAM from "./assets/SSAM.png";
import MainPage from "./mainpage/MainPage";
import TeacherLogin from "./teacher/login/TeacherLogin";
import TeacherJoin from "./teacher/join/TeacherJoin";
import TeacherSubpage from "./teacher/subpage/TeacherSubpage";

const App = () => {
  return (
    <div className="navbar-array">
      <Link to="/">
        <img src={SSAM} className="logo" alt="Logo" />
      </Link>
      <div className="menu-array">
        <h2>학급정보</h2>
        <h2>문의사항</h2>
        <h2>상담예약</h2>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/teacherlogin" element={<TeacherLogin />} />
          <Route path="/teacherjoin" element={<TeacherJoin />} />
          <Route path="/teachersubpage" element={<TeacherSubpage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
