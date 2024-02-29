import React, { useEffect, useState } from 'react';
import { md5 } from 'js-md5';

import ContentList from '../../components/ContentList/ContentList';
import Menu from '../../components/Menu/Menu';

import styles from './List.module.scss';

const List = () => {
  const [id, setIds] = useState([]);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const isMounted = React.useRef(false);
  const [contentItems, setContentItems] = useState([]);

  const getRequest = (bodyPayload) => {
    const currentDate = new Date().toISOString().split('-').join('').slice(0, 8);
    const hash = md5('Valantis_' + currentDate);
    return fetch('http://api.valantis.store:40000/', {
      method: 'POST',
      headers: { 'X-Auth': hash, 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    })
      .then((response) => {
        if (!response.ok) {
          console.log('Ошибка: код', response.status);
          return getRequest(bodyPayload);
        }
        return response.json();
      })
      .catch((err) => {
        console.error('Error', err);
      });
  };

  const getIds = async () => {
    const bodyPayload = { action: 'get_ids', params: { offset: 0 + 50 * page, limit: 50 } };
    await getRequest(bodyPayload).then((data) => {
      setIds(Array.from(new Set(data.result)));
    });
  };

  const getItems = async () => {
    const bodyPayload = { action: 'get_items', params: { ids: id } };
    await getRequest(bodyPayload).then((data) => {
      setItems(data.result);
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

  console.log('items', items);

  console.log(page);
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
