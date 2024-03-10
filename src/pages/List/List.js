import React, { useEffect, useState } from 'react';

import { getRequest } from '../../api/Api';
import ContentList from '../../components/ContentList/ContentList';
import Menu from '../../components/Menu/Menu';

import styles from './List.module.scss';

const List = () => {
  const [id, setIds] = useState([]);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const isMounted = React.useRef(false);
  const [contentItems, setContentItems] = useState([]);

  const getIds = async () => {
    const bodyPayload = { action: 'get_ids', params: { offset: 0 + 50 * page, limit: 50 } };
    await getRequest(bodyPayload).then((data) => {
      setIds(Array.from(new Set(data.result)));
    });
  };

  const getItems = async () => {
    const bodyPayload = { action: 'get_items', params: { ids: id } };
    await getRequest(bodyPayload).then((data) => {
      const newItem = data.result.reduce((acc, item) => {
        if (acc.some((el) => el.id === item.id)) {
          return acc;
        }
        return [...acc, item];
      }, []);
      setItems(newItem);
    });
  };

  const getFilteredItems = async (filterParams) => {
    const bodyPayload = {
      action: 'filter',
      params: filterParams,
    };
    await getRequest(bodyPayload).then((data) => {
      setIds(Array.from(new Set(data.result)));
    });
  };

  useEffect(() => {
    getIds();
  }, [page]);

  useEffect(() => {
    if (isMounted.current) {
      getItems(id);
    }
    isMounted.current = true;
  }, [id]);

  useEffect(() => {
    if (items) {
      setContentItems(
        items.map((values, index) => (
          <ContentList
            brand={values.brand == null ? '' : values.brand}
            id={values.id}
            price={values.price}
            product={values.product}
            key={index}
          />
        )),
      );
    }
  }, [items]);

  return (
    <div className={styles.wrapper}>
      <Menu getFilteredItems={getFilteredItems} getIds={getIds} />
      <div className={styles.contentContainer}>
        <div className={styles.namesBox}>
          <div>id</div>
          <div>product</div>
          <div>price</div>
          <div>brand</div>
        </div>
        <div className={styles.contentItem}>{Object.values(contentItems)}</div>
      </div>
      <div className={styles.paginationContainer}>
        <button
          className={styles.button}
          onClick={() => {
            page > 0 && setPage((prev) => prev - 1);
          }}>
          назад
        </button>
        <div className={styles.currentPage}>{page + 1}</div>
        <button
          className={styles.button}
          onClick={() => {
            setPage((prev) => prev + 1);
          }}>
          вперед
        </button>
      </div>
    </div>
  );
};
export default List;
