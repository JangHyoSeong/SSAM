const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          animation: "spin 1s linear infinite",
          marginBottom: "10px", // 스피너와 텍스트 사이의 간격
        }}
      ></div>
      <span
        style={{
          fontSize: "16px",
          color: "#3498db",
          fontWeight: "bold",
        }}
      >
        Loading...
      </span>
      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
