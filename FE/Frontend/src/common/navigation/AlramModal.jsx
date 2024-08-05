import { useState, useEffect } from "react";
import axios from "axios";
import style from "./AlramModal.module.scss";

const AlramModal = () => {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className={style.alramArray}>
      <div className={style.triangle} />
      <div className={style.titleArray}>알림</div>
      <hr />
      <div className={style.contentArray}>
        {posts ? (
          <div className={style.content}>
            <p>{posts.title}</p>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default AlramModal;
