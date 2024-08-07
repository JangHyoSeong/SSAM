import { useState, useEffect } from "react";
import styles from "./TeacherStudent.module.scss";
// 아래 경로는 fetchUserData 함수가 있는 파일 경로로 수정하세요.
import { fetchUserData } from "../../../apis/stub/35-43 학급/apiStubStudents";

const TeacherStudent = ({ onSelectStudent }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchUserData();
        setStudents(data.students);
        console.log(data.students); // 학생 데이터를 콘솔에 출력
      } catch (error) {
        console.error("학생 데이터를 불러오는 데 실패했습니다.", error);
      }
    };

    loadStudents();
  }, []);

  return (
    <div className={styles.studentList}>
      {students.map((student) => (
        <div
          className={styles.studentItem}
          key={student.name}
          onClick={() => onSelectStudent(student.name)}
        >
          <div className={styles.studentPhoto}>
            {/* 학생 사진이 배경으로 설정됨 */}
          </div>
          <div className={styles.studentName}>{student.name}</div>
        </div>
      ))}
    </div>
  );
};

export default TeacherStudent;
