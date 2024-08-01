// import { useState, useEffect } from "react";
import styles from "./Explan.module.scss";
import explanimg from "../../assets/explan.png";

const Explan = () => {
  // const [username, setUsername] = useState("");
  // const [result, setResult] = useState("");
  // const [postData, setPostData] = useState({});

  // useEffect(() => {
  //   setPostData({
  //     birth: "1997-02-09",
  //     email: "asz223@naver.com",
  //     name: "JJ23",
  //     username: username,
  //     password: "1234",
  //     phone: "01085309441",
  //   });
  // }, [username]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setResult("전송 중...");

  //   try {
  //     const response = await fetch(
  //       "https://i11e201.p.ssafy.io/api/v1/auth/students",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(postData),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     setResult(JSON.stringify(data, null, 2));
  //   } catch (error) {
  //     setResult(`Error: ${error.message}`);
  //   }
  // };

  return (
    <div className={styles.explanArray}>
      <div className={styles.imgArray}>
        <img src={explanimg} className={styles.img} alt="Explanation" />
      </div>
      <div className={styles.txtArray}>
        <h3>SSAM</h3>
        <h1>새로 만나는 화상상담</h1>
        <div className={styles.txtP}>
          <p>AI를 활용한 스마트 화상상담 서비스로</p>
          <p>선생님들의 상담에 도움을 드립니다</p>
        </div>

        {/* <div className={styles.corsTest}>
          <h3>CORS 테스트 (HTTPS)</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="사용자 이름 입력"
              required
            />
            <button type="submit">데이터 전송</button>
          </form>
          <h4>전송할 데이터:</h4>
          <pre>{JSON.stringify(postData, null, 2)}</pre>
          <h4>결과:</h4>
          <pre id="result">{result}</pre>
        </div> */}
      </div> 
    </div>
  );
};

export default Explan;
