import styles from './TeacherStudent.module.scss';

const students = [
  { id: 1, name: '정종화' },
  { id: 2, name: '권혜경' },
  { id: 3, name: '김동현' },
  { id: 4, name: '장효승' },
  { id: 5, name: '정유진' },
  { id: 6, name: '박범준' },
  { id: 6, name: '박범준' },
  { id: 6, name: '박범준' },



  // 더 많은 학생들을 추가할 수 있습니다
];

// 학생 이름을 한글 오름차순으로 정렬하고, 정렬된 순서대로 id를 다시 부여합니다.
const sortedStudents = students
  .sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'))
  .map((student, index) => ({ ...student, id: index + 1 }));

const TeacherStudent = () => {
  return (
    <div className={styles.studentList}>
      {sortedStudents.map(student => (
        <div className={styles.studentItem} key={student.id}>
          <div className={styles.studentPhoto}>
            {/* 학생 사진이 배경으로 설정됨 */}
          </div>
          <div className={styles.studentName}>{student.id}. {student.name}</div>
        </div>
      ))}
    </div>
  );
};

export default TeacherStudent;
