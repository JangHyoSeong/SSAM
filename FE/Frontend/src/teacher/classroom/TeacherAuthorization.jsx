import { NavLink } from 'react-router-dom';
import styles from './TeacherAuthorization.module.scss';

const TeacherAuthorization = () => {
  const requests = [
    { name: '정종화', id: 'JJH', date: '24.07.16' },
    { name: '권혜경', id: 'KHK', date: '24.07.13' },
    { name: '김동현', id: 'KDH', date: '24.07.11' },
    { name: '장효승', id: 'JHS', date: '24.07.11' },
    { name: '정유진', id: 'JYJ', date: '24.07.07' },
    { name: '박범준', id: 'PBJ', date: '24.06.30' },
  ];

  return (
    <div className={styles.authorizationContainer}>
      <div className={styles.classNavbar}>
        <NavLink to="/teacherclassroom" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          학급 관리
        </NavLink>
        <NavLink to="/teacherauthorization" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          승인 관리
        </NavLink>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>신청한 사람</th>
            <th>아이디</th>
            <th>신청일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={index}>
              <td>{request.name}</td>
              <td>{request.id}</td>
              <td>{request.date}</td>
              <td>
                <button className={styles.approveButton}>승인</button>
                <button className={styles.rejectButton}>거절</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherAuthorization;
