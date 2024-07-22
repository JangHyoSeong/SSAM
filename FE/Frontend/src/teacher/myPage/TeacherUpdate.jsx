// 선생님 정보 수정 페이지 컴포넌트
import { NavLink } from 'react-router-dom';
import update from './TeacherUpdate.module.css';

const TeacherUpdate = () => {
  return (
    <div>
      <div className={update.menuArray}>
        <div className={update.updateMenu}>
          <h2>회원정보 수정</h2>
        </div>
        <NavLink to="/teacherpasswordchange" className={update.changeMenu}>
          <h2>비밀번호 변경</h2>
        </NavLink>
      </div>
      <div className={update.infoArray}>
        <div className={update.infoForm}>
          <table className={update.tableArray}>
            <tr>
              <th>사진</th>
              <td className={update.imgTd}>
                <div className={update.profileImg}></div>
                <div className={update.btn}>
                  <button className={update.imgBtn}>수정</button>
                  <button className={update.imgBtn}>삭제</button>
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
        <div className={update.formBtnArray}>
          <button className={update.formBtn}>저장</button>
          <button className={update.formBtn}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherUpdate;
