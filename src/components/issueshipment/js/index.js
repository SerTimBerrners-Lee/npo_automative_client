/* main 
* Рекурсивно подсчитывает количество СБ и Д в изделии или СБ
*/
async function checkedJsonList(izd, ctx, recursive = false) {
	if(!ctx) return false

	// Рекурсивно проходим по сборке (если есть)
	if(izd.cbeds && izd.cbeds.length && izd.listCbed) {
		let list_cbed = JSON.parse(izd.listCbed)
		pushElement(izd.cbeds, list_cbed, 'cbed', ctx, recursive)
		for(let cb of list_cbed) {
			ctx.$store.dispatch('getOneCbEdById', cb.cb.id).then(res => parserListIzd(res, cb.kol, ctx))
		}
	}

	// Проходим по деталям
	if(izd.detals && izd.detals.length && izd.listDetal) {
		let list_detals = JSON.parse(izd.listDetal)
			for(let det in list_detals) {
				const res = await ctx.$store.dispatch('getOneDetal', list_detals[det].det.id)
					for(let i = 0; i < list_detals[det].kol; i++) {
						let mat_true = false
						let material_find
						for(let material of res.materials) {
							if(material.id == res.mat_zag) {
								mat_true = true
								material_find = material
								list_detals[det].det.zag = material
							}
						}
						if(mat_true) {
							let parse_str
							if(res.materialList) {
								parse_str = JSON.parse(res.materialList)
								parse_str.push({art: 1, mat: {id: material_find.id, name: material_find.name }, kol: 1})
								parse_str = JSON.stringify(parse_str)
							} else
								parse_str = JSON.stringify([{art: 1, mat: {id: material_find.id, name: material_find.name }, kol: 1}])
						
							mat_true = false
							checkedJsonList({...res, materialList: parse_str}, ctx)
						}
						else checkedJsonList(res, ctx)
					}
					if(det == list_detals.length -1)
						pushElement(izd.detals, list_detals, 'detal', ctx, recursive)
			}
		
	}

	// Проходим по материалам
	if(izd.materials && izd.materials.length && izd.materialList) 
		parseMaterialList(izd, izd.materialList, ctx, recursive)
	
	if(izd.materials && izd.materials.length && izd.listPokDet) 
		parseMaterialList(izd, izd.listPokDet, ctx, recursive)
	
}

function parseMaterialList(izd, materialJson, ctx, recursive) {
	try {
		let list_material = JSON.parse(materialJson)
		pushElement(izd.materials, list_material, 'material', ctx, recursive)
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
	if(!ctx) return false

	for(let element of elements) {
		let kol = 1;
		element.type = type
		element.obj = {id: element.id}

		for(let item of list_pars) {
			let id;
			switch(type) {
				case 'cbed':
					id = item.cb.id;
					break;
				case 'detal':
					id = item.det.id
					break;
				case 'material':
					id = item.mat.id
					break;
			}
			if(id == element.id) {
				element.articl = item.art
				kol = Number(item.kol)
				element.zag = item?.det?.zag
			}
		}
		
		// Проверяем на повторение в основном массиве
		let check = true
		for(let iz = 0; iz < ctx.list_cbed_detal.length; iz++) {
			if(element.id == ctx.list_cbed_detal[iz].obj.id && element.name == ctx.list_cbed_detal[iz].obj.name) {
				ctx.list_cbed_detal[iz].kol = Number(ctx.list_cbed_detal[iz].kol) + Number(kol)
				check = false
			}	
		}

		if(check) {
			if(!recursive || type == 'material') 
				chechAndAddElement(ctx.list_cbed_detal, element, kol, type, ctx)
			else {
				chechAndAddElement(ctx.list_hidden_cbed_detal, element, kol, type, ctx)
			}
		} 
		
	}

	function chechAndAddElement(arr, element, kol, type, ctx) {
		const check_dublecate = checkDublecate(arr, element)
		if(check_dublecate != null) 
			arr[check_dublecate].kol = Number(arr[check_dublecate].kol) + Number(kol)
		else {
			if(type == 'material') {
				ctx.$store.dispatch("fetchGetOnePPM", element.id).then(res => {
					element['podMaterial'] = res?.podMaterial || null
					element['material'] = res?.material || null
					arr.push({
						type,
						obj: {...element},
						kol
					})
				})
			} else {
				arr.push({
					type,
					obj: {...element},
					kol
				})
			}
		}
	}
}

/**
 * Парсит комплектацию СБ или Д
*/
 function parserListIzd(res, kol, ctx) {
	try {
		let cbeds = res.listCbed ? JSON.parse(res.listCbed) : []
		let detals = res.listDetal ? JSON.parse(res.listDetal) : []
		if(cbeds.length) {
			for(let inx in cbeds) {
				cbeds[inx] = cbeds[inx].cb
				if(res.articl) cbeds[inx].articl = res.articl
			}
		}
		if(detals.length) {
			for(let inx in detals) {
				detals[inx] = detals[inx].det
				if(res.articl) detals[inx].articl = res.articl
			}
		}
		for(let i = 0; i < kol; i++) 
			checkedJsonList({...res, cbeds, detals}, ctx, true)
	} catch(e) {console.error(e)}		
}
/**
 * Осуществляем проверку на дублирование
*/
function checkDublecate(arr, res) {
	for(let inx in arr) {
		if(arr[inx].obj.id == res.obj.id && arr[inx].type == res.type) 
			return inx
	}
	return null
}


export {
	checkedJsonList
}