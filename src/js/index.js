import { random } from 'lodash';

const imgArr = ['bmp', 'gif', 'jpg', 'png', 'pds', 'tif', 'odg', 'jpeg', 'eps', 'pict', 'pcx', 'ico', 'webp']
const moviArr = ['mp4', 'webm', 'ogv']

const getReversDate = DAT =>  {
  if(!DAT)
    return 0

  let date = DAT.split('T')[0].replaceAll('-', '.').split('.').reverse().join('.')
  let time = DAT.split('T')[1].split('.')[0]
  return { date, time } 
}

const showMessage = (title, message, type, ctx) =>  {
  if(!ctx) 
    return 0;

  if(title == '' && type == 's') {
    ctx.$data.titleMessage = 'Успешно';
  }
  if(title == '' && type == 'e') {
    ctx.$data.titleMessage = 'Ошибка';
  }
  if(title == '' && type == 'w') {
    ctx.$data.titleMessage = 'Предупреждение';
  }
  if(title == '' && type == '') {
    ctx.$data.titleMessage = 'Информация';
  }

  ctx.$data.message = message;
  ctx.$data.type = type;
  ctx.$data.showInformPanel = true
  ctx.$data.keyInformTip = random(21212)
}
 
const photoPreloadUrl = (input, cb, checkTypes = false) => {
  if(!input) 
    return 0;

  let typeFile = input.name.split('.')[input.name.split('.').length - 1].toLowerCase();
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
  
  if(type == 'img' && checkTypes)
    return cb({ type: 'img', typename: typeFile })
  if(type == 'movi' && checkTypes)
    return cb({type, typename: typeFile})
  if(type == 'movi')
    return cb({type, typename: typeFile})

  const reader = new FileReader()
  reader.onload = function(e){
    return cb({ type, url: e.target.result})
  } 
  reader.readAsDataURL(input)
} 

const dataFormat = () => {
  let dat =  new Date()
  let Day = String(dat.getUTCDate())
  let Month = String(dat.getMonth() + 1)
  let Yeard = dat.getFullYear()

  let splitData = `${addNull(Day)}.${addNull(Month)}.${Yeard}`;
  return splitData
}

const timeFormat = () => {
  let dat =  new Date()
  let Hours = dat.getHours()
  let Minute = dat.getMinutes() 
  let splitTime= `${addNull(Hours)}:${addNull(Minute)}`;
  return splitTime
}

const addNull = (str) => str.length == 1 ? "0" + str : str


const dateIncrementHors = (date, hors) =>  {
  if(!date || date.split('.').length != 3) return ''
  let day = Number(date.split('.')[0])
  let mount = Number(date.split('.')[1])  
  let year = Number(date.split('.')[2]) 

  let endDayMount = new Date(year, mount, 0).getDate()

  let iterationHors = Math.floor(hors / 24)
  let sumDay = day + iterationHors;
  let lastDay = day
  day = day + iterationHors

  while(sumDay > endDayMount){
    mount = mount + 1
    if(mount > 12) {
      mount = 1
      year++
    }
    day = 1

    iterationHors = iterationHors - (endDayMount - lastDay) 
    endDayMount = new Date(year, mount, 0).getDate()
    sumDay = day + iterationHors;
    day = (iterationHors - 1) || 1

  }

  return {day, mount, year, iterationHors}
}

export  {
  getReversDate,
  showMessage,
  photoPreloadUrl,
  dataFormat,
  timeFormat,
  dateIncrementHors
}
