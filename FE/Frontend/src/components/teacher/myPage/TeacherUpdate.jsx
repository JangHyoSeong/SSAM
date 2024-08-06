// // 선생님 정보 수정 페이지 컴포넌트
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./TeacherUpdate.module.scss";

export const useProfile = () => {
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
        const response = await axios.get("http://localhost:8081/v1/users", {
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
        console.error("Failed to fetch profile data:", error);
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
            <tbody>
              <tr>
                <th>사진</th>
                <td className={styles.imgTd}>
                  <div className={styles.profileImg} />
                  <div className={styles.btn}>
                    <input type="file" className={styles.imgBtn} />
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
            </tbody>
          </table>
          <div className={styles.formBtnArray}>
            <button type="submit" className={styles.formBtn}>
              저장
            </button>
            <button type="button" className={styles.formBtn}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherUpdate;
// import React from "react";
// import { NavLink } from "react-router-dom";
// import useProfile from "../../../apis/stub/20-22 사용자정보/profile";
// import styles from "./TeacherUpdate.module.scss";

// const TeacherUpdate = () => {
//   const UserProfile = () => {
//     const { init } = useProfile();

//     // Example usage of the store functions
//     React.useEffect(() => {
//       // users.jsx의 init 변수 확인
//       init();
//     }, [init]);
//   };
//   return (
//     <div className={styles.Container}>
//       <div className={styles.menuNavbar}>
//         <div className={styles.updateItem}>회원정보 수정</div>
//         <NavLink to="/teacherpasswordchange" className={styles.changeItem}>
//           비밀번호 변경
//         </NavLink>
//       </div>
//       <div className={styles.infoArray}>
//         <div className={styles.infoForm}>
//           <table className={styles.tableArray}>
//             <tbody>
//               <tr>
//                 <th>사진</th>
//                 <td className={styles.imgTd}>
//                   <div className={styles.profileImg}></div>
//                   <div className={styles.btn}>
//                     <input type="file" className={styles.imgBtn} />
//                     <button className={styles.imgBtn}>삭제</button>
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <th>이름</th>
//                 <td></td>
//               </tr>
//               <tr>
//                 <th>생년월일</th>
//                 <td></td>
//               </tr>
//               <tr>
//                 <th>학교</th>
//                 <td></td>
//               </tr>
//               <tr>
//                 <th>아이디</th>
//                 <td></td>
//               </tr>
//               <tr>
//                 <th>이메일</th>
//                 <td></td>
//               </tr>
//               <tr>
//                 <th>휴대전화</th>
//                 <td></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//         <div className={styles.formBtnArray}>
//           <button className={styles.formBtn}>저장</button>
//           <button className={styles.formBtn}>취소</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherUpdate;
