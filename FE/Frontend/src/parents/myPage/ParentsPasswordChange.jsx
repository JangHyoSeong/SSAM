import { Link } from "react-router-dom";
import change from "./ParentsPasswordChange.module.css";

const ParentsPasswordChange = () => {
  return (
    <div>
      <div className={change.menuArray}>
        <Link to="/parentsupdate" className={change.updateMenu}>
          <h2>회원정보 수정</h2>
        </Link>
        <div className={change.changeMenu}>
          <h2>비밀번호 변경</h2>
        </div>
      </div>
      <div className={change.formArray}>
        <div className={change.passwordFormArray}>
          <h2 className={change.formTxt}>
            새로 사용할 비밀번호를 입력해주세요
          </h2>
          <hr />
          <div className={change.passwordForm}>
            <div className={change.inputForm}>
              <h3>현재 비밀번호</h3>
              <input
                type="text"
                placeholder="Password"
                className={change.inputTxtForm}
              ></input>
            </div>
            <div className={change.inputForm}>
              <h3>새 비밀번호</h3>
              <input
                type="text"
                placeholder="Password"
                className={change.inputTxtForm}
              ></input>
              <h5>8~20자의 영문, 숫자, 특수문자를 사용하세요.</h5>
            </div>
            <div className={change.inputForm}>
              <h3>새 비밀번호 확인</h3>
              <input
                type="text"
                placeholder="Password"
                className={change.inputTxtForm}
              ></input>
            </div>
            <div className={change.formBtnArray}>
              <button className={change.formBtn}>저장</button>
              <button className={change.formBtn}>취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentsPasswordChange;
