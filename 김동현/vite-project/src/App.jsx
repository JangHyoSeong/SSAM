import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import SSAM from "./assets/SSAM.png";
import MainPage from "./pages/MainPage";
import ClassRoom from "./pages/Classroom";
import Question from "./pages/Question";
import Appointment from "./pages/Appointment";
import TeacherLogin from "./teacher/TeacherLogin";
import TeacherSignup from "./teacher/TeacherSignup";

const App = () => {
  return (
    <div className="navbar-arr">
      <Link to="/"><img src={SSAM} className="logo" alt="Logo" /></Link>
      <div className="menu-arr">
        <h2><Link to="/classroom" className="menu-txt">학급 관리</Link></h2>
        <h2><Link to="/question" className="menu-txt">문의 사항</Link></h2>
        <h2><Link to="/appointment" className="menu-txt">상담 예약</Link></h2>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/classroom" element={<ClassRoom />} />
          <Route path="/question" element={<Question />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/teacherlogin" element={<TeacherLogin />} />
          <Route path="/teachersignup" element={<TeacherSignup />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
