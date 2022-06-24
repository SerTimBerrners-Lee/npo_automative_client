

export default async function Req(path, options = {}) {
  let auth = null;
  if (localStorage.getItem('auth')) auth = JSON.parse(localStorage.getItem('auth'));

  options.headers = options.headers ? 
    new Headers({
      ...options.headers,
      'Authorization': `Bearer ${auth?.token}`,
    }) : new Headers({'Authorization': `Bearer ${auth?.token}`});
    
  return await fetch(path, options);
}