import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ element: Component }) => {
  const token = localStorage.getItem("USER_TOKEN");
  return token ? <Component /> : <Navigate to="/" />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;

// import { Route, Redirect } from "react-router-dom";
// import PropTypes from "prop-types";
// import { useParams } from "react-router-dom"; // URL 파라미터를 추출하기 위해 추가

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   const { boardId } = useParams(); // URL에서 boardId 추출

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         // 로그인 또는 인증 상태를 확인하는 로직을 추가
//         true ? ( // 예를 들어, isAuthenticated() 함수를 호출하여 인증 상태를 확인
//           <Component {...props} boardId={boardId} /> // boardId를 컴포넌트에 전달
//         ) : (
//           <Redirect to="/login" />
//         )
//       }
//     />
//   );
// };

// ProtectedRoute.propTypes = {
//   component: PropTypes.elementType.isRequired,
// };

// export default ProtectedRoute;
