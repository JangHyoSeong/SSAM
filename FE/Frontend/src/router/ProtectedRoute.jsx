import { Navigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

// const ProtectedRoute = ({ element: Component }) => {
//   const token = localStorage.getItem("USER_TOKEN");
//   return token ? <Component /> : <Navigate to="/" />;
// };

const isAuthenticated = () => {
  const token = localStorage.getItem("USER_TOKEN");
  return !!token; // 토큰이 존재하면 true, 그렇지 않으면 false 반환
};

const ProtectedRoute = ({ element: Component }) => {
  const params = useParams(); // URL에서 파라미터 추출

  // 파라미터를 컴포넌트에 전달
  return isAuthenticated() ? <Component {...params} /> : <Navigate to="/" />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;
