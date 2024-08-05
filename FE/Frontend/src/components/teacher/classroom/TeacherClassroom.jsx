import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Ensure Axios is imported
import styles from "./TeacherClassroom.module.scss";
import TeacherStudent from "./TeacherStudent";
import TeacherStudentDetail from "./TeacherStudentDetail";
import ClassImage from "../../../assets/background.png"; 
import whiteshare from '../../../assets/whiteshare.png';

const TeacherClassroom = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [noticeContent, setNoticeContent] = useState('');
  
  const textareaRef = useRef(null);
  const maxHeight = 100;

  useEffect(() => {
    const handleInput = (e) => {
      if (textareaRef.current && textareaRef.current.scrollHeight > maxHeight) {
        e.preventDefault();
        textareaRef.current.value = textareaRef.current.value.slice(0, -1);
      }
    };

    if (textareaRef.current) {
      textareaRef.current.addEventListener('input', handleInput);
    }
    
    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener('input', handleInput);
      }
    };
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      await axios.put('http://localhost:8081/v1/classrooms/teachers/notice/1', {
        notice: noticeContent,
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save banner content:", error);
    }
  };

  const handleContentChange = (e) => {
    setNoticeContent(e.target.value);
  };

  return (
    <div className={styles.classInfoContainer}>
      <div className={styles.classNavbar}>
        <NavLink
          to="/teacherclassroom"
          className={`${styles.navItem} ${
            selectedStudentId === null ? styles.active : styles.altActive
          }`}
          onClick={() => setSelectedStudentId(null)}
        >
          학급 관리
        </NavLink>
        <NavLink to="/teacherauthorization" className={styles.navItem}>
          승인 관리
        </NavLink>
      </div>
      <div className={styles.imageContainer}>
        <input type="file" id="file" className={styles.inputFileForm} />
        <label htmlFor="file">
          <img src={whiteshare} className={styles.inputFile} />
        </label>
        <img
          src={ClassImage}
          alt="Class Management"
          className={styles.classImage}
        />
      </div>
      <div className={styles.infoBoxes}>
        <div className={styles.noticeBox}>
          <h2>알림 사항</h2>
          {isEditing ? (
            <FontAwesomeIcon icon={faSave} onClick={handleSaveClick} className={styles.editIcon} />
          ) : (
            <FontAwesomeIcon icon={faEdit} onClick={handleEditClick} className={styles.editIcon} />
          )}
          {isEditing ? (
            <div className={styles.editBox}>
              <textarea
                ref={textareaRef}
                value={noticeContent}
                onChange={handleContentChange}
                className={styles.editTextarea}
              />
            </div>
          ) : (
            <p>{noticeContent}</p>
          )}
        </div>
        <div className={styles.classInfoBox}>
          <h2>자라나는 새싹, 돋아나는 희망</h2>
          <p>삼성초등학교 1학년 2반</p>
        </div>
        <div className={styles.inquiryBox}>
          <h2>문의사항</h2>
          <div className={styles.inquiryItem}>
            <div className={styles.inquiryQuestion}>점심메뉴가 뭔가요</div>
          </div>
          <div className={styles.inquiryItem}>
            <div className={styles.inquiryQuestion}>교무실 전화번호가 뭔가요</div>
          </div>
          <div className={styles.inquiryItem}>
            <div className={styles.inquiryQuestion}>소풍 날짜 언제죠</div>
          </div>
          <div className={styles.inquiryItem}>
            <div className={styles.inquiryQuestion}>소풍 장소가 어디죠</div>
          </div>
        </div>
      </div>
      {selectedStudentId === null ? (
        <TeacherStudent onSelectStudent={setSelectedStudentId} />
      ) : (
        <TeacherStudentDetail
          studentId={selectedStudentId}
          onBack={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
};

export default TeacherClassroom;
