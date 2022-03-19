import { returnSpanEz } from './edizm';

// Удаляет выделенный класс у переданного объекта и возвращает для нового
function eSelectSpan(e_last, e_now) {
  if(e_last) e_last.classList.remove('td-row-all');
  e_last = e_now;
  e_last.classList.add('td-row-all');

  return e_last;
}

// Возвращает объект с позицией на заказ
function posToDeliveries(position, position_list) {
  if(!position) return false;

  for(const item of position_list) {
    if(item.id == position.id && item.type == position.type) return false;
  }
  
  try {
    const ez = returnSpanEz(position.kolvo) ? JSON.parse(position.kolvo) : 1;
    return {
      art: '',
      name: position.name,
      ez,
      kol: position.shipments_kolvo ? position.shipments_kolvo : 1,
      kolvo: position.kolvo ? position.kolvo : null,
      sum: 0,
      description: '',
      type: position.type ? position.type : 'mat',
      id: position.id
    };
  } catch(e) {console.error(e, 'Err!')}
}

// Возвращаем массив с типом Позиции
function returnTypePosition(type) {
  const arr_type = [
    ['Материал', 'Мат'],
    ['Инструмент', 'Инстр.'],
    ['Оборудование', 'Об.'],
    ['Инвентарь', 'Инв.']
  ];
  
  if(!type) return arr_type[0];

  switch(type) {
    case 'mat':
      return arr_type[0];
    case 'tools':
      return arr_type[1];
    case 'eq':
      return arr_type[2];
    case 'inventary':
      return arr_type[3];
    default:
      return arr_type[0];
  }
}

export {
  eSelectSpan,
  posToDeliveries,
  returnTypePosition
}