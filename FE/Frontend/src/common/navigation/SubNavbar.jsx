import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AlramModal from "./AlramModal";

// style, image
import styles from "./SubNavbar.module.scss";
import alram from "../../assets/alram.png";

const SubNavbar = () => {
  // 상태관리
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    // 로컬 저장소에 저장된 "USER_TOKEN"키 값이 있는지 확인하고
    // 그 결과를 boolean으로 변환한다.
    !!localStorage.getItem("USER_TOKEN")
  );
  const navigate = useNavigate();

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // 로그아웃되면 hom으로 redirection
  // 백에서 role 속성을 추가해준다면 role에 따라 선생 or 학생 로그인 페이지로 렌더링 하면 됨
  const handleLogout = () => {
    localStorage.removeItem("USER_TOKEN");
    setIsLoggedIn(false);
    navigate("/");
  };

  // useEffect가 실행되는 시점은 컴포넌트가 렌더링된 이후이다.
  // 왜 그럴까? -> 렌더링이 다 이루어지 전에 useEffect가 동작한다면
  // 해당 DOM을 찾지 못하는 상황이 발생하기 때문이다.
  useEffect(() => {
    if (!localStorage.getItem("USER_TOKEN")) {
      setIsLoggedIn(false);
    }
  }, []);

  if (!isLoggedIn) {
    return null; // 토큰이 없으면 nav 우측상단 없앰
  }

  return (
    <div className={styles.navArray}>
      <img src={alram} className={styles.alram} onClick={toggleModal} />
      <NavLink to="/teacherupdate" className={styles.nav}>
        회원정보
      </NavLink>
      |
      <p onClick={handleLogout} style={{ cursor: "pointer" }}>
        로그아웃
      </p>
      {isModalOpen && <AlramModal />}
    </div>
  );
};

export default SubNavbar;
