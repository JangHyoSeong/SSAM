// // 선생님 정보 수정 페이지 컴포넌트
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useProfileStore from "../../../apis/stub/20-22 사용자정보/apiStubProfile";
import styles from "./TeacherUpdate.module.scss";

const TeacherUpdate = () => {
  const { profile, init, fetchProfileData, updateProfile } = useProfileStore();
  const [formData, setFormData] = useState({ ...profile });
  const [error, setError] = useState("");

  useEffect(() => {
    init();
    const fetchData = async () => {
      try {
        const data = await fetchProfileData("some-user-id");
        setFormData(data);
      } catch (err) {
        setError("Failed to fetch profile data.");
      }
    };
    fetchData();
  }, [init, fetchProfileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      imgUrl: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      alert("Profile updated successfully!");
      setError("");
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.menuNavbar}>
        <div className={styles.updateItem}>회원정보 수정</div>
        <NavLink to="/teacherpasswordchange" className={styles.changeItem}>
          비밀번호 변경
        </NavLink>
      </div>
      <div className={styles.infoArray}>
        <form className={styles.infoForm} onSubmit={handleSubmit}>
          <table className={styles.tableArray}>
            <tbody>
              <tr>
                <th>사진</th>
                <td className={styles.imgTd}>
                  <div className={styles.profileImg}>
                    {formData.imgUrl && (
                      <img
                        src={URL.createObjectURL(formData.imgUrl)}
                        alt="Profile"
                      />
                    )}
                  </div>
                  <div className={styles.btn}>
                    <input
                      type="file"
                      className={styles.imgBtn}
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      className={styles.imgBtn}
                      onClick={() => setFormData({ ...formData, imgUrl: "" })}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <th>이름</th>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>생년월일</th>
                <td>
                  <input
                    type="date"
                    name="birth"
                    value={formData.birth}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>학교</th>
                <td>
                  <input
                    type="text"
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>아이디</th>
                <td>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>이메일</th>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>휴대전화</th>
                <td>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.formBtnArray}>
            <button type="submit" className={styles.formBtn}>
              저장
            </button>
            <button type="button" className={styles.formBtn} onClick={init}>
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
// import useProfileStore from "../../../apis/stub/20-22 사용자정보/profile";
// import styles from "./TeacherUpdate.module.scss";

// const TeacherUpdate = () => {
//   const UserProfile = () => {
//     const { init } = useProfileStore();

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
