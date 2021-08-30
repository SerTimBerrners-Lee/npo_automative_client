import { random } from 'lodash';

export default function showMessage(title, message, type, ctx) {
    if(!ctx) 
        return 0;

    ctx.$data.titleMessage = title;
    ctx.$data.message = message;
    ctx.$data.type = type;
    ctx.$data.showInformPanel = true
    ctx.$data.keyInformTip = random(21212*3423)
}