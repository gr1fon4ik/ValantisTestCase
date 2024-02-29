import styles from './ContentList.module.scss';

const ContentList = ({ brand, id, price, product }) => {
  return (
    <div className={styles.wrapperContentItem}>
      <div>{id}</div>
      <div>{product}</div>
      <div>{price}</div>
      <div>{brand}</div>
    </div>
  );
};

export default ContentList;
