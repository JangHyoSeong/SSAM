import styles from "./Explan.module.scss";
import explanimg from "../../assets/explan.png";

import axios from 'axios'; // Ensure Axios is imported
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

const Explan = () => {
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
      const boardId = 1; // Replace with the actual board ID
      await axios.put(`http://localhost:8081/v1/classrooms/teachers/notice/${boardId}`, {
        notice: noticeContent
      }, {
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
    <div className={styles.explanArray}>
      <div className={styles.imgArray}>
        <img src={explanimg} className={styles.img} alt="Explanation" />
      </div>
      <div className={styles.txtArray}>
        <h3>SSAM</h3>
        <h1>새로 만나는 화상상담</h1>
        <div className={styles.txtP}>
          <p>AI를 활용한 스마트 화상상담 서비스로</p>
          <p>선생님들의 상담에 도움을 드립니다</p>
        </div>
      </div>

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
    </div>
  );
};

export default Explan;
