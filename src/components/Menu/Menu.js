import { useState } from 'react';
import styles from './Menu.module.scss';

const Menu = ({ getFilteredItems, getIds }) => {
  const [nameFilterValue, setNameFilterValue] = useState('');
  const [priceFilterValue, setPriceFilterValue] = useState('');
  const [brandFilterValue, setBrandFilterValue] = useState('');

  const paramsBuilder = () => {
    const params = {};
    if (nameFilterValue !== '') params.product = nameFilterValue;
    if (priceFilterValue !== '') params.price = Number(priceFilterValue);
    if (brandFilterValue !== '') params.brand = brandFilterValue;
    return params;
  };

  const onSubmitFilter = () => {
    if (nameFilterValue === 0 && priceFilterValue === 0 && brandFilterValue === 0) {
      getIds();
    } else getFilteredItems(paramsBuilder());
  };

  const onClearFilter = () => {
    setBrandFilterValue('');
    setNameFilterValue('');
    setPriceFilterValue('');
    getIds();
  };

  return (
    <div className={styles.filtersWrapper}>
      <div className={styles.filtersContainer}>
        <div className={styles.filterItem}>
          <div className={styles.filterName}>По названию</div>
          <input
            type="text"
            className={styles.filterInput}
            key="name"
            placeholder="Название"
            value={nameFilterValue}
            onChange={(e) => setNameFilterValue(e.target.value)}
          />
        </div>
        <div className={styles.filterItem}>
          <div className={styles.filterName}>По цене</div>
          <input
            type="text"
            className={styles.filterInput}
            key="price"
            placeholder="Цена"
            value={priceFilterValue}
            onChange={(e) => setPriceFilterValue(e.target.value)}
          />
        </div>
        <div className={styles.filterItem}>
          <div className={styles.filterName}>По бренду</div>
          <input
            type="text"
            className={styles.filterInput}
            key="brand"
            placeholder="Бренд"
            value={brandFilterValue}
            onChange={(e) => setBrandFilterValue(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.filtersSubmit} onClick={onSubmitFilter}>
          Найти
        </button>
        <button className={styles.filtersClear} onClick={onClearFilter}>
          Сбросить
        </button>
      </div>
    </div>
  );
};

export default Menu;
