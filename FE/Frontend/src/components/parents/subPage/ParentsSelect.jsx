// 선생님 서브 페이지 선택 컴포넌트
import { NavLink } from "react-router-dom";
import select from "./ParentsSelect.module.scss";
import classroom from "../../../assets/classroom.png";
import question from "../../../assets/question.png";
import appointment from "../../../assets/appointment.png";
import PinStore from "../../../apis/stub/35-43 학급/apiStubPin";

const Select = () => {
  const { pin, fetchPinData } = PinStore();

  const handleButtonClick = async () => {
    try {
      await fetchPinData(); // Fetch the pin data
      console.log("board_id:", pin.board_id); // Print the board_id
    } catch (error) {
      console.error("Failed to fetch pin data:", error);
    }
  };

  return (
    <div className={select.menuArray}>
      <hr />
      <div className={select.inviteCodeBox}>
        <div className={select.inviteTxtBox}>
          <h2>학생님 환영합니다</h2>
          <h3>선생님께 받은 초대코드로 학급을 등록하세요.</h3>
        </div>
        <button onClick={handleButtonClick}>초대코드 입력하기</button>{" "}
        {/* Attach the click handler */}
      </div>
      <div className={select.menuBoxArray}>
        <NavLink
          to="/parentsclassroom"
          className={`${select.menuBox} ${select.menuBox1}`}
        >
          <div className={select.menuTxt}>
            <h1>학급 정보</h1>
            <h3>우리 학급을 보여줍니다</h3>
            <div className={select.imgArray}>
              <img
                src={classroom}
                className={select.classroomImg}
                alt="classroom"
              />
            </div>
          </div>
        </NavLink>
        <NavLink
          to="/parentsquestion"
          className={`${select.menuBox} ${select.menuBox2}`}
        >
          <div className={select.menuTxt}>
            <h1>문의 사항</h1>
            <h3>문의 사항을 남겨주세요</h3>
            <div className={select.imgArray}>
              <img
                src={question}
                className={select.questionImg}
                alt="question"
              />
            </div>
          </div>
        </NavLink>
        <NavLink
          to="/parentsreservationpage"
          className={`${select.menuBox} ${select.menuBox3}`}
        >
          <div className={select.menuTxt}>
            <h1>상담 예약</h1>
            <h3>상담 시간을 예약하세요</h3>
            <div className={select.imgArray}>
              <img
                src={appointment}
                className={select.appointmentImg}
                alt="appointment"
              />
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Select;

// // 선생님 서브 페이지 선택 컴포넌트
// import { NavLink } from "react-router-dom";
// import select from "./ParentsSelect.module.scss";
// import classroom from "../../../assets/classroom.png";
// import question from "../../../assets/question.png";
// import appointment from "../../../assets/appointment.png";
// // import defaultPin from "../../../apis/stub/35-43 학급/pin";

// const Select = () => {
//   return (
//     <div className={select.menuArray}>
//       <hr />
//       <div className={select.inviteCodeBox}>
//         <div className={select.inviteTxtBox}>
//           <h2>학생님 환영합니다</h2>
//           <h3>선생님께 받은 초대코드로 학급을 등록하세요.</h3>
//         </div>
//         <button>초대코드 입력하기</button>
//       </div>
//       <div className={select.menuBoxArray}>
//         <NavLink
//           to="/parentsclassroom"
//           className={`${select.menuBox} ${select.menuBox1}`}
//         >
//           <div className={select.menuTxt}>
//             <h1>학급 정보</h1>
//             <h3>우리 학급을 보여줍니다</h3>
//             <div className={select.imgArray}>
//               <img
//                 src={classroom}
//                 className={select.classroomImg}
//                 alt="classroom"
//               />
//             </div>
//           </div>
//         </NavLink>
//         <NavLink
//           to="/parentsquestion"
//           className={`${select.menuBox} ${select.menuBox2}`}
//         >
//           <div className={select.menuTxt}>
//             <h1>문의 사항</h1>
//             <h3>문의 사항을 남겨주세요</h3>
//             <div className={select.imgArray}>
//               <img
//                 src={question}
//                 className={select.questionImg}
//                 alt="question"
//               />
//             </div>
//           </div>
//         </NavLink>
//         <NavLink
//           to="/parentsreservationpage"
//           className={`${select.menuBox} ${select.menuBox3}`}
//         >
//           <div className={select.menuTxt}>
//             <h1>상담 예약</h1>
//             <h3>상담 시간을 예약하세요</h3>
//             <div className={select.imgArray}>
//               <img
//                 src={appointment}
//                 className={select.appointmentImg}
//                 alt="appointment"
//               />
//             </div>
//           </div>
//         </NavLink>
//       </div>
//     </div>
//   );
// };

// export default Select;
