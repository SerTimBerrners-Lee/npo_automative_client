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
    ctx.$data.keyInformTip = random(21212*3423)
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

export  {
    getReversDate,
    showMessage,
    photoPreloadUrl
}
