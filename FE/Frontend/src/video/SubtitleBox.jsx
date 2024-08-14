// components/SubtitleBox.jsx
import React from 'react';
import styles from './Video.module.scss';

const SubtitleBox = ({ sttMessages, profileData }) => {
  return (
    <div className={styles.subTitleArray}>
      <div className={styles.subTitle}>
        {sttMessages.map((msg, index) => (
          <div key={index}>
            <strong>
              {msg.connectionId === msg.session?.connection.connectionId
                ? profileData.name === ""
                  ? "익명"
                  : profileData.name
                : "상대방"}{" "}
              :{" "}
            </strong>
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubtitleBox;