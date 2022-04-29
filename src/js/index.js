import store from '../store/';
import { random } from 'lodash';

const imgArr = ['bmp', 'gif', 'jpg', 'png', 'pds', 'tif', 'odg', 'jpeg', 'eps', 'pict', 'pcx', 'ico', 'webp'];
const moviArr = ['mp4', 'webm', 'ogv'];

const getReversDate = DAT =>  {
  if (!DAT) return 0;

  const date = DAT.split('T')[0].replaceAll('-', '.').split('.').reverse().join('.');
  const time = DAT.split('T')[1].split('.')[0];
  return { date, time }
}

const showMessage = (title, message, type = 'i') => {
  const commit = store.commit;

  commit('setTitleInform', title);

  if (!title && type == 's') 
    commit('setTitleInform', 'Успешно');
  else if (!title && type == 'e') 
    commit('setTitleInform', 'Ошибка');
  else if (!title && type == 'w') 
    commit('setTitleInform', 'Предупреждение');
  else if (!title) 
    commit('setTitleInform', 'Уведомление');

  commit('setMessageInform', message);
  commit('setTypeInform', type);
  commit('setKeyInform', random(1, 999));
}
 
const photoPreloadUrl = (input, cb, checkTypes = false) => {
  if(!input || !input.name) return 0;

  let typeFile = input.name.split('.')[input.name.split('.').length - 1].toLowerCase();
  if (typeFile.indexOf('_archive_v', 1) != -1) typeFile = typeFile.split('_archive_v')[0]

  let type;
  for(let imgType of imgArr) {
    if(typeFile == imgType)
      type = 'img'
  }
  for(let movi of moviArr) {
    if(movi == typeFile)
      type = 'movi'
  }

  if (type != 'img' && type != 'movi') 
    return cb({ type: 'doc', typename: typeFile })
  
  if (type == 'img' && checkTypes)
    return cb({ type: 'img', typename: typeFile })
  if (type == 'movi' && checkTypes)
    return cb({type, typename: typeFile})
  if (type == 'movi')
    return cb({type, typename: typeFile})

  const reader = new FileReader()
  reader.onload = function(e){
    if(e && e.target && e.target.result)
      return cb({ type, url: e.target.result})
  } 
  reader.readAsDataURL(input)
} 

const addNull = (str) => str.length <= 1 ? "0" + str : str

const dataFormat = () => {
  const dat =  new Date();
  const Day = addNull(String(dat.getUTCDate()));
  const Month = addNull((String(dat.getMonth() + 1)));
  const Yeard = dat.getFullYear();

  const splitData = `${Day}.${Month}.${Yeard}`;
  return splitData;
}

const timeFormat = () => {
  let dat =  new Date()
  let Hours = addNull(String(dat.getHours()))
  let Minute = addNull(String(dat.getMinutes()))
  let splitTime= `${Hours}:${Minute}`;
  return splitTime
}

const dateIncrementHors = (date, hors) =>  {
  if (!date || date.split('.').length != 3) return '';
  let day = Number(date.split('.')[0]);
  let mount = Number(date.split('.')[1]);
  let year = Number(date.split('.')[2]);

  let endDayMount = new Date(year, mount, 0).getDate();

  let iterationHors = Math.floor(hors / 24);
  let sumDay = day + iterationHors;
  let lastDay = day;
  day = day + iterationHors;

  while(sumDay > endDayMount){
    mount = mount + 1;
    if(mount > 12) {
      mount = 1;
      year++;
    }
    day = 1;

    iterationHors = iterationHors - (endDayMount - lastDay);
    endDayMount = new Date(year, mount, 0).getDate();
    sumDay = day + iterationHors;
    day = (iterationHors - 1) || 1;

  }

  return { day, mount, year, iterationHors }
}

/**
 *  Сравнения дат. типа: '10.03.2022'
 *  В зависимости от условия выдает тип Boolean.
 * @param {*} one_date 
 * @param {*} two_date 
 * @param {*} operation 
 * @returns boolean
 */
const comparison = (one_date = new Date().toLocaleDateString('ru-RU'), two_date = new Date().toLocaleDateString('ru-RU'), operation = '==') => {
  const d1 = utfDate(one_date);
  const d2 = utfDate(two_date);

  function utfDate(d) {
    const ds = d.split('.').reverse().join('-') + 'T10:10:10Z';
    return ds;
  }

  let result;
  switch(operation) {
    case '==':
      result = Date.parse(d1) == Date.parse(d2);
      break;
    case '<':
      result = Date.parse(d1) < Date.parse(d2);
      break;
    case '>':
      result = Date.parse(d1) > Date.parse(d2);
      break;
    case '<=':
      result = Date.parse(d1) <= Date.parse(d2);
      break;
    case '>=':
      result = Date.parse(d1) >= Date.parse(d2);
      break;
    case '!=':
      result = Date.parse(d1) != Date.parse(d2);
      break;
  }

  return result;
}

const dateDifference = (date_one = new Date().toLocaleString('ru-RU').split(',')[0], date_two) => {
  if(!date_two) return 0;
  const toFormatString = (date) => {
    const spl = date.split('.');
    return `${spl[2]}-${spl[1]}-${spl[0]}T10:20:30Z`;
  }

  let date1 = new Date(toFormatString(date_one));
  let date2 = new Date(toFormatString(date_two));
  const mat = Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
  return date2.getTime() < date1.getTime() ? -mat: mat;
}

const sortState = (arr, operation) => {
  for(let obj in arr) {
    for(let obj2 in arr) {
      if(operation == '<')
        if(Date.parse(arr[obj].createdAt) <
          Date.parse(arr[obj2].createdAt)) {
          let detal = arr[obj2];
          arr[obj2] = arr[obj];
          arr[obj] = detal;
        }
      if(operation == '>')
        if(Date.parse(arr[obj].createdAt) >
          Date.parse(arr[obj2].createdAt)) {
          let variabl = arr[obj2];
          arr[obj2] = arr[obj];
          arr[obj] = variabl;
        }
    }
  }

  return operation == '<' ? '>' : '<';
}

const differencesShipments = (noSortArr) => {
  for(const ship of noSortArr) {
    if (ship.date_shipments) 
      ship.difference = dateDifference(undefined, ship.date_shipments);
    else ship.difference = 0;
  }
  const arr = noSortArr.sort((a, b) => a.difference - b.difference);
  return arr;
}

export  {
  getReversDate,
  showMessage,
  photoPreloadUrl,
  dataFormat,
  timeFormat,
  dateIncrementHors,
  comparison,
  dateDifference,
  differencesShipments,
  sortState
}
