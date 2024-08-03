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
