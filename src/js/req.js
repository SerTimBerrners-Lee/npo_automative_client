import PATH_TO_SERVER from '@/js/path';

export default async function Req(path, options = {}) {
  let auth = null;
  if (localStorage.getItem('auth')) auth = JSON.parse(localStorage.getItem('auth'));

  options.headers = options.headers ? 
    new Headers({
      ...options.headers,
      'Authorization': `Bearer ${auth?.token}`,
    }) : new Headers({'Authorization': `Bearer ${auth?.token}`});
    
  const result = await fetch(`${PATH_TO_SERVER}${path}`, options);
  console.log(result);
  return result;
}