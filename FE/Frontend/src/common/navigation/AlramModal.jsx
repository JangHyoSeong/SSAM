import style from "./AlramModal.module.scss";

const AlramModal = () => {
  return (
    <div className={style.alramArray}>
      <div className={style.triangle} />
      <div className={style.titleArray}>알림</div>
      <hr />
    </div>
  );
};

export default AlramModal;
