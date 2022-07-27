// Парсит каждую ЕИ в материале
const getKolvoMaterial = (mat) => {
	const arr_ez = []
	try {
		let pars_mat_kol = JSON.parse(mat.kolvo) // Выбранные ЕИ у Материала
		let pars_ez_kol = null
		if(mat.ez_kolvo) pars_ez_kol = JSON.parse(mat.ez_kolvo) // Данные о количестве материала для определенной ЕИ
		
		if(pars_mat_kol.c1) 
			if(pars_ez_kol)	arr_ez.push({...returnObjectPos(pars_ez_kol, 0, 'шт')})
				else 	arr_ez.push({ez: 'шт', ...mat})
		
		if(pars_mat_kol.c2) 
			if(pars_ez_kol)	arr_ez.push({...returnObjectPos(pars_ez_kol, 1, 'л')})
				else	arr_ez.push({ez: 'л', ...mat})
		
		if(pars_mat_kol.c3)
			if(pars_ez_kol)	arr_ez.push({...returnObjectPos(pars_ez_kol, 2, 'кг')})
				else	arr_ez.push({ez: 'кг', ...mat})
		
		if(pars_mat_kol.c4) 
			if(pars_ez_kol)	arr_ez.push({...returnObjectPos(pars_ez_kol, 3, 'м')})
				else	arr_ez.push({ez: 'м', ...mat})
		
		if(pars_mat_kol.c5) 
			if(pars_ez_kol)	arr_ez.push({...returnObjectPos(pars_ez_kol, 4, 'м.куб')})
				else	arr_ez.push({ez: 'м.куб', ...mat})
		
		if(arr_ez.length == 0) arr_ez.push({ez: 'шт',...mat})
		return arr_ez;
	} catch (e) {console.error(e)}
}

// Возвращает  объект для каждой ЕИ

const returnObjectPos = (obj, poz, ez) => {
	return {
		ez, 
		material_kolvo: Object.values(obj)[poz].material_kolvo, 
		shipments_kolvo: Object.values(obj)[poz].shipments_kolvo,
		min_remaining: Object.values(obj)[poz].min_remaining,
		deliveries_kolvo: Object.values(obj)[poz].deliveries_kolvo,
		price: Object.values(obj)[poz].price,
		poz
	}
}
// Возврашает html код в span для каждой ЕИ
function returnSpanEz(kol) {
	if(!kol) return false;
	try {
		const pars_json = JSON.parse(kol);
		if(!pars_json) return '';
		let str = '';
		if(pars_json.c1) str = '<span> шт </span>';
		if(pars_json.c2) str = str + '<span> л </span>';
		if(pars_json.c3) str = str + '<span> кг </span>';
		if(pars_json.c4) str = str + '<span> м </span>';
		if(pars_json.c5) str = str + '<span> м.куб </span>';

		return str
	} catch (e) {console.error(e)}
}
// Вернуть уже по распарсеному объекту наименование 
function returnEzName(ez) {
	if(!ez) return '';

	switch (ez) {
		case 1:
			return 'шт';
		case 2:
			return 'л';
		case 3:
			return 'кг';
		case 4:
			return 'м';
		case 5:
			return 'м.куб';
		default:
			return 'шт'
	}
}


export {
	getKolvoMaterial,
	returnSpanEz,
	returnEzName
}