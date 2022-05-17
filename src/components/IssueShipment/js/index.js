import PATH_TO_SERVER from '@/js/path';

/* main 
* Сюда попадает очередное ИЗДЕЛИЕ
* Рекурсивно подсчитывает количество СБ и Д в изделии или СБ
*/
async function checkedJsonList(izd, ctx, recursive = false) {
	if (!ctx) return false;

	// Проходим по списку сборок
	if (izd.listCbed) {
		const list_cbed = JSON.parse(izd.listCbed);
		if (!izd.cbeds) izd.cbeds = list_cbed.map(el => el.cb);
		pushElement(izd.cbeds, list_cbed, 'cbed', ctx, recursive);
		for (const cb of list_cbed) {
			const res = await ctx.$store.dispatch('getOneCbEdById', cb.cb.id);
			const materials = await ctx.$store.dispatch('getOneCbEdField', {fields: 'materials', id: cb.cb.id});
			if (!res) continue;
			res.materials = materials.materials;
			await parserListIzd(res, cb.kol, ctx);
		}
	}

	// Проходим по деталям
	if (izd.detals && izd.detals.length && izd.listDetal) {
		const list_detals = JSON.parse(izd.listDetal);
			for (const det in list_detals) {
				const res = await ctx.$store.dispatch('getOneDetal', list_detals[det].det.id);
				
				for (const item of izd.detals) {
					if (item.id == res.id) item.articl = res.articl;
				}

				for (let i = 0; i < list_detals[det].kol; i++) {
					let mat_true = false;
					let material_find;
					let LEN = 0;
					let MASS = 0;
					for (let material of res.materials) {
						if (material.id == res.mat_zag) {
							mat_true = true;
							material_find = material;
							list_detals[det].det.zag = material;
							LEN = res.DxL.split('x')[1] ? (Number(res.DxL.split('x')[1]) / 1000) : 0;
							MASS = Number(res?.massZag || 0);
						}
					}
					if (mat_true) {
						let parse_str;
						if (res.materialList) {
							parse_str = JSON.parse(res.materialList);
							parse_str.push({art: 1, mat: {id: material_find.id, name: material_find.name,  LEN, MASS}, kol: 1});
							parse_str = JSON.stringify(parse_str);
						} else
							parse_str = JSON.stringify([{art: 1, mat: {id: material_find.id, name: material_find.name, LEN, MASS}, kol: 1}]);

						mat_true = false;
						checkedJsonList({...res, materialList: parse_str}, ctx);
					}
					else checkedJsonList(res, ctx);
				}
				if (det == list_detals.length -1)
					pushElement(izd.detals, list_detals, 'detal', ctx, recursive);
			}
	}

	// Проходим по материалам
	if (izd.materials && izd.materials.length && izd.materialList)
		parseMaterialList(izd, izd.materialList, ctx, recursive);
	
	if (izd.materials && izd.materials.length && izd.listPokDet)
		parseMaterialList(izd, izd.listPokDet, ctx, recursive);
	
}

function parseMaterialList(izd, materialJson, ctx, recursive) {
	try {
		const list_material = JSON.parse(materialJson);
		pushElement(izd.materials, list_material, 'material', ctx, recursive);
	} catch (e) {console.error(e)} 
}
/**
 * Добавляем материал СБ или Деталь 
 * @param {} elements 
 * @param {*} list_pars 
 * @param {*} type 
 * @param {*} ctx 
 * @param {*} recursive 
 * @returns 
 */
function pushElement(elements, list_pars, type, ctx, recursive = false) {
	if (!ctx) return false;
	// Проходим по массиву полных объектов
	for (const element of elements) {
		let kol = 1;
		let find = false;
		element.type = type;
		element.obj = { id: element.id, articl: element.articl };

		// Проходим по распарсеному списку
		for (const item of list_pars) {
			let id;
			switch(type) {
				case 'cbed':
					id = item.cb.id;
					break;
				case 'detal':
					id = item.det.id;
					break;
				case 'material':
					element.LEN = item.mat.LEN;
					element.MASS = item.mat.MASS;
					id = item.mat.id;
					break;
			}

			if (element.id == id) {
				find = true;
				kol = Number(item.kol);
				if (type == 'detal') element.zag = item?.det?.zag;
			}
		}
		if (!find) continue;

		// Проверяем на повторение в основном массиве
		let check = true;
		const cDubl = checkDublecate(ctx.list_cbed_detal, element);
		if(cDubl !== null) {
			ctx.list_cbed_detal[cDubl].kol += Number(kol);
			if(type == 'material') {
				if(element.LEN)	ctx.list_cbed_detal[cDubl].obj.LEN = (Number(ctx.list_cbed_detal[cDubl].obj.LEN) + Number(element.LEN));
				if(element.MASS) ctx.list_cbed_detal[cDubl].obj.MASS = (Number(ctx.list_cbed_detal[cDubl].obj.MASS) + Number(element.MASS));
			}
			check = false;
		}

		if(check) {
			if(!recursive || type == 'material') 
				chechAndAddElement(ctx.list_cbed_detal, element, kol, type, ctx);
			else 
				chechAndAddElement(ctx.list_hidden_cbed_detal, element, kol, type, ctx);
		}
	}

	// Проверка и добавление элемента
	async function chechAndAddElement(arr, element, kol, type, ctx) {
		const check_dublecate = checkDublecate(arr, element);
		if(check_dublecate != null)	arr[check_dublecate].kol += Number(kol);
		else {
			let ava_path;
			if (type == 'detal'|| type == 'cbed') {
				if (type == 'detal') {
					ava_path = await ctx.$store.dispatch('fetchDetalAva', element.id);
				}
				if (type == 'cbed') {
					ava_path = await ctx.$store.dispatch('fetchCbedAva', element.id);
				}
			}
			if (ava_path && ava_path.path) ava_path = `${PATH_TO_SERVER}${ava_path.path}`;

			if(type == 'material') {
				const res = await ctx.$store.dispatch("fetchGetOnePPM", element.id);
				element['podMaterial'] = res?.podMaterial || null;
				element['material'] = res?.material || null;
				const check_dublecate = checkDublecate(arr, element);
				if(!check_dublecate) {
					arr.push({
						type,
						obj: {...element},
						kol: Number(kol),
						ava_path,
					});
				}
			} else {
				arr.push({
					type,
					obj: {...element},
					kol: Number(kol),
					ava_path,
				});
			}
		}
	}
}

function checkDublecate(arr, res) {
	for (let inx in arr) {
		if (arr[inx].obj.id == res.obj.id && arr[inx].type == res.type) 
			return inx;
	}
	return null;
}

/**
 * Сюда попадает изделие с сборками и деталями
 * Парсит комплектацию СБ или Д
*/
async function parserListIzd(res, kol, ctx) {
	try {
		const cbeds = res.listCbed ? JSON.parse(res.listCbed) : [];
		const detals = res.listDetal ? JSON.parse(res.listDetal) : [];
		if (cbeds.length) {
			for (let inx in cbeds) {
				const ress = await ctx.$store.dispatch('getOneCbEdById', cbeds[inx].cb.id);
				if (ress) cbeds[inx] = ress;
			}
		}
		if (detals.length) {
			for (let inx in detals) {
				detals[inx] = detals[inx].det;
				detals[inx].articl = res?.articl || '';
			}
		}
		for (let i = 0; i < kol; i++) 
			checkedJsonList({...res, cbeds, detals}, ctx, true);
	} catch(e) {console.error(e)}
}
/**
 * Осуществляем проверку на дублирование
*/

export {
	checkedJsonList
}
