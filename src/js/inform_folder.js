import { random } from 'lodash';

export default function showMessage(title, message, type, ctx) {
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