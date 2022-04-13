import { returnSpanEz } from './edizm';
import store from '../store/';

// Удаляет выделенный класс у переданного объекта и возвращает для нового
function eSelectSpan(e_last, e_now, classs = 'td-row-all') {
  if(e_last) e_last.classList.remove(classs);
  e_last = e_now;
  e_last.classList.add(classs);

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

function parseSpetification(obj) {
  let materialList = [],
    listPokDet = [],
    listDetal = [],
    listCbed = [];

  try {
    if(obj.materialList)
      materialList = JSON.parse(obj.materialList);
    if(obj.listPokDet)
      listPokDet = JSON.parse(obj.listPokDet);
    if(obj.listDetal)
      listDetal = JSON.parse(obj.listDetal);
    if(obj.listCbed)
      listCbed = JSON.parse(obj.listCbed);
  } catch(e) {console.error(e)}

  return {materialList, listPokDet, listDetal, listCbed};
}

function sliceName(str, len = 22) {
  if (!str) return '-';
  if (str.length > len) {
    str = str.slice(0, 32);
    str += '...';
  }
  return str;
}

function getBuyerFilter(_id) {
  if (!_id) return 'На Склад';
  
  const buyer = store.getters.allBuyer.filter(el => el.id == _id);
  if (buyer && buyer.length) return buyer[0].name;
  return 'На Склад';
}

export {
  eSelectSpan,
  posToDeliveries,
  returnTypePosition,
  parseSpetification,
  sliceName,
  getBuyerFilter
}