function eSelectSpan(e_last, e_now) {
  if(e_last) e_last.classList.remove('td-row-all');
  e_last = e_now;
  e_last.classList.add('td-row-all');

  return e_last;
}

export {
  eSelectSpan
}