// 선생님 정보 수정 페이지 컴포넌트
import { NavLink } from 'react-router-dom';
import styles from './TeacherUpdate.module.scss';

const TeacherUpdate = () => {
  return (
    <div className={styles.Container}>
      <div className={styles.menuNavbar}>
        <div className={styles.updateItem}>
          회원정보 수정
        </div>
        <NavLink to="/teacherpasswordchange" className={styles.changeItem}>
          비밀번호 변경
        </NavLink>
      </div>
      <div className={styles.infoArray}>
        <div className={styles.infoForm}>
          <table className={styles.tableArray}>
            <tr>
              <th>사진</th>
              <td className={styles.imgTd}>
                <div className={styles.profileImg}></div>
                <div className={styles.btn}>
                  <button className={styles.imgBtn}>수정</button>
                  <button className={styles.imgBtn}>삭제</button>
                </div>
              </td>
            </tr>
            <tr><th>이름</th><td></td></tr>
            <tr><th>생년월일</th><td></td></tr>
            <tr><th>학교</th><td></td></tr>
            <tr><th>아이디</th><td></td></tr>
            <tr><th>이메일</th><td></td></tr>
            <tr><th>휴대전화</th><td></td></tr>
          </table>
        </div>
        <div className={styles.formBtnArray}>
          <button className={styles.formBtn}>저장</button>
          <button className={styles.formBtn}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherUpdate;
