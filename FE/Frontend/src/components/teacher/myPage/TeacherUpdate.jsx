// // 선생님 정보 수정 페이지 컴포넌트
import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./TeacherUpdate.module.scss";
const apiUrl = import.meta.env.API_URL;

const useProfile = () => {
  const [profileData, setProfileData] = useState({
    profileImage: "",
    name: "",
    birth: "",
    school: "",
    username: "",
    email: "",
    selfPhone: "",
    otherPhone: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("USER_TOKEN");
      try {
        const response = await axios.get(`${apiUrl}/v1/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        setProfileData({
          profileImage: response.data.profileImage,
          name: response.data.name,
          birth: response.data.birth,
          school: response.data.school,
          username: response.data.username,
          email: response.data.email,
          selfPhone: response.data.selfPhone,
          otherPhone: response.data.otherPhone,
        });
      } catch (error) {
        console.error("데이터를 가져오지 못했습니다:", error);
      }
    };

    fetchData();
  }, []);

  return profileData;
};

const TeacherUpdate = () => {
  const profile = useProfile();
  return (
    <div className={styles.Container}>
      <div className={styles.menuNavbar}>
        <div className={styles.updateItem}>회원정보 수정</div>
        <NavLink to="/teacherpasswordchange" className={styles.changeItem}>
          비밀번호 변경
        </NavLink>
      </div>
      <div className={styles.infoArray}>
        <form className={styles.infoForm}>
          <table className={styles.tableArray}>
            <tr>
              <th>사진</th>
              <td className={styles.imgTd}>
                <div className={styles.profileImg} />
                <div className={styles.btn}>
                  <input type="file" id="file" className={styles.inputBtn} />
                  <label htmlFor="file" className={styles.updateBtn}>
                    수정
                  </label>
                  <button type="button" className={styles.imgBtn}>
                    삭제
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>이름</th>
              <td>
                <input type="text" name="name" value={profile.name} />
              </td>
            </tr>
            <tr>
              <th>생년월일</th>
              <td>
                <input type="date" name="birth" value={profile.birth} />
              </td>
            </tr>
            <tr>
              <th>학교</th>
              <td>
                <input type="text" name="school" value={profile.school} />
              </td>
            </tr>
            <tr>
              <th>아이디</th>
              <td>
                <input type="text" name="username" value={profile.username} />
              </td>
            </tr>
            <tr>
              <th>이메일</th>
              <td>
                <input type="email" name="email" value={profile.email} />
              </td>
            </tr>
            <tr>
              <th>휴대전화</th>
              <td>
                <input type="text" name="phone" value={profile.selfPhone} />
              </td>
            </tr>
          </table>
          <div className={styles.formBtnArray}>
            <button type="submit" className={styles.saveBtn}>
              저장
            </button>
            <button type="button" className={styles.deleteBtn}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherUpdate;
