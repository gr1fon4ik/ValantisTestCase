import { md5 } from 'js-md5';

export const getRequest = (bodyPayload) => {
  const currentDate = new Date().toISOString().split('-').join('').slice(0, 8);
  const hash = md5('Valantis_' + currentDate);
  return fetch('https://api.valantis.store:41000/', {
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
