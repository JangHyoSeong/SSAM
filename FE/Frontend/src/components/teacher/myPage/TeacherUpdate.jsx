import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import styles from "./TeacherUpdate.module.scss";

const TeacherUpdate = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users/1")
      .then((response) => setUser(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className={styles.Container}>
      <div className={styles.menuNavbar}>
        <div className={styles.updateItem}>회원정보 수정</div>
        <NavLink to="/teacherpasswordchange" className={styles.changeItem}>
          비밀번호 변경
        </NavLink>
      </div>
      {user ? (
        <div className={styles.infoArray}>
          <div className={styles.infoForm}>
            <table className={styles.tableArray}>
              <tbody>
                <tr>
                  <th>사진</th>
                  <td className={styles.imgTd}>
                    <div className={styles.profileImg}></div>
                    <div className={styles.btn}>
                      <input
                        type="file"
                        id="file"
                        className={styles.inputFileForm}
                      />
                      <label htmlFor="file" className={styles.imgBtn}>
                        수정
                      </label>
                      <button className={styles.imgBtn}>삭제</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>이름</th>
                  <td>{user.name}</td>
                </tr>
                <tr>
                  <th>생년월일</th>
                  <td>{user.address.suite}</td>
                </tr>
                <tr>
                  <th>학교</th>
                  <td>{user.address.city}</td>
                </tr>
                <tr>
                  <th>아이디</th>
                  <td>{user.username}</td>
                </tr>
                <tr>
                  <th>이메일</th>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <th>휴대전화</th>
                  <td>{user.phone}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.formBtnArray}>
            <button className={styles.formBtn}>저장</button>
            <button className={styles.formBtn}>취소</button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default TeacherUpdate;
