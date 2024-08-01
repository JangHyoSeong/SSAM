// students.jsx
const students = [
  { name: '정종화', birth: '1999.12.23' },
  { name: '권혜경', birth: '2000.01.01' },
  { name: '김동현', birth: '1999.11.11' },
  { name: '장효승', birth: '2000.02.22' },
  { name: '정유진', birth: '1999.10.10' },
  { name: '박범준', birth: '2000.03.03' },
  { name: '낙동강', birth: '2000.04.04' },
  { name: '공룡알', birth: '2000.05.05' },
  { name: '마라탕', birth: '2000.06.06' },
  { name: '양꼬치', birth: '2000.07.07' },
  // 더 많은 학생들을 추가할 수 있습니다
].sort((a, b) => a.name.localeCompare(b.name, 'ko-KR')).map((student, index) => ({
  ...student,
  id: index + 1,
  number: index + 1
}));

export default students;
