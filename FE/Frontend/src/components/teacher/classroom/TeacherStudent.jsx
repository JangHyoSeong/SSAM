import styles from "./TeacherStudent.module.scss";
import students from "./students.jsx";

const TeacherStudent = ({ onSelectStudent }) => {
  return (
    <div className={styles.studentList}>
      {students.map((student) => (
        <div
          className={styles.studentItem}
          key={student.id}
          onClick={() => onSelectStudent(student.id)}
        >
          <div className={styles.studentPhoto}>
            {/* 학생 사진이 배경으로 설정됨 */}
          </div>
          <div className={styles.studentName}>
            {student.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherStudent;
