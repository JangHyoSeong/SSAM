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
        console.log("Fetching profile data with token:", token);
        const response = await axios.get(`${apiUrl}/v1/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const data = {
          profileImage: response.data.profileImage || "",
          name: response.data.name || "",
          birth: response.data.birth || "",
          school: response.data.school || "",
          username: response.data.username || "",
          email: response.data.email || "",
          selfPhone: response.data.selfPhone || "",
          otherPhone: response.data.otherPhone || "",
        };

        setProfileData(data);
        console.log("Fetched Profile Data:", data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchData();
  }, []);

  return { profileData, setProfileData };
};

const TeacherUpdate = () => {
  const { profileData: profile, setProfileData } = useProfile();

  const handleSave = async (e) => {
    e.preventDefault();

    console.log("Current profile state before save:", profile);

    const formData = new FormData();
    formData.append("school", profile.school || "");
    formData.append("selfPhone", profile.selfPhone || "");

    if (profile.profileImage instanceof File) {
      formData.append("profileImage", profile.profileImage);
    } else if (
      typeof profile.profileImage === "string" &&
      profile.profileImage
    ) {
      console.log(
        "Profile image is a string (URL), skipping form data append."
      );
    } else {
      formData.append("profileImage", "");
    }

    console.log("FormData to be sent:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const token = localStorage.getItem("USER_TOKEN");

    try {
      const response = await axios.put(`${apiUrl}/v1/users`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Profile update failed:", error);
      console.log(
        "Error details:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleCancel = () => {
    window.location.reload(); // 페이지 새로고침
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
        <form className={styles.infoForm} onSubmit={handleSave}>
          <table className={styles.tableArray}>
            <tbody>
              <tr>
                <th>사진</th>
                <td className={styles.imgTd}>
                  <div className={styles.profileImg}>
                    {profile.profileImage && (
                      <img
                        src={
                          typeof profile.profileImage === "string"
                            ? profile.profileImage
                            : URL.createObjectURL(profile.profileImage)
                        }
                        alt="Profile"
                        className={styles.profileImage}
                      />
                    )}
                  </div>
                  <div className={styles.btn}>
                    <input
                      type="file"
                      id="file"
                      className={styles.inputBtn}
                      onChange={(e) =>
                        setProfileData({
                          ...profile,
                          profileImage: e.target.files[0],
                        })
                      }
                    />
                    <label htmlFor="file" className={styles.updateBtn}>
                      수정
                    </label>
                    <button
                      type="button"
                      className={styles.imgBtn}
                      onClick={() =>
                        setProfileData({ ...profile, profileImage: "" })
                      }
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
                    value={profile.name}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th>생년월일</th>
                <td>
                  <input
                    type="date"
                    name="birth"
                    value={profile.birth}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th>학교</th>
                <td>
                  <input
                    type="text"
                    name="school"
                    value={profile.school}
                    onChange={(e) =>
                      setProfileData({ ...profile, school: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>아이디</th>
                <td>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th>이메일</th>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th>휴대전화</th>
                <td>
                  <input
                    type="text"
                    name="phone"
                    value={profile.selfPhone}
                    onChange={(e) =>
                      setProfileData({ ...profile, selfPhone: e.target.value })
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.formBtnArray}>
            <button type="submit" className={styles.saveBtn}>
              저장
            </button>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleCancel}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherUpdate;
