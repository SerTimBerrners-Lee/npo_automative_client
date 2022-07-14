
import store from '../store/';
import PATH_TO_SERVER from '@/js/path';

async function getCommit() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!store) reject();
      resolve(store.commit);
    }, 1000)
  });
}

export default async function Req(path, options = {}) {
  let auth = null;
  if (localStorage.getItem('auth')) auth = JSON.parse(localStorage.getItem('auth'));

  const commit = await getCommit();
  options.headers = options.headers ? 
    new Headers({
      ...options.headers,
      'Authorization': `Bearer ${auth?.token}`,
    }) : new Headers({'Authorization': `Bearer ${auth?.token}`});
    
  commit('loaderChange', true);
  const result = await fetch(`${PATH_TO_SERVER}${path}`, options);
  commit('loaderChange', false);

  return result;
}