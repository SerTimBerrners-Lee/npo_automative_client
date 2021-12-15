// MAIN function 
function checkedJsonList(izd, recursive = false) {
	if(izd.cbeds && izd.cbeds.length && izd.listCbed) {
		let list_cbed = JSON.parse(izd.listCbed)
		pushElement(izd.cbeds, list_cbed, 'cbed', recursive)
		for(let cb of list_cbed) {
			getOneCbEdById(cb.cb.id).then(res => parserListIzd(res, cb.kol))
		}
	}
	if(izd.detals && izd.detals.length && izd.listDetal) {
		let list_detals = JSON.parse(izd.listDetal)
		pushElement(izd.detals, list_detals, 'detal', recursive)
		for(let det of list_detals ) {
			getOneDetal(det.det.id).then(res => {
				for(let i = 0; i < det.kol; i++) {
					let mat_true = false
					let material_find
					for(let material of res.materials) {
						if(material.id == res.mat_zag) {
							mat_true = true
							material_find = material
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
						checkedJsonList({...res, materialList: parse_str})
						mat_true = false
					}
					else checkedJsonList(res)
				}
			}) 
		}
	}
}

function pushElement(elements, list_pars, type, list_cbed_detal, list_hidden_cbed_detal, recursive = false) {
	for(let element of elements) {
		let kol = 1;
		for(let item of list_pars) {
			let id;
			switch(type) {
				case 'cbed':
					id = item.cb.id;
					break;
				case 'detal':
					id = item.det.id
					break;
			}
			if(id == element.id)
				kol = item.kol
		}
		if(type != 'mat')  {
			let check = true
			for(let iz = 0; iz < list_cbed_detal.length; iz++) {
				if(element.id == list_cbed_detal[iz].obj.id && element.name == list_cbed_detal[iz].obj.name) {
					list_cbed_detal[iz].kol = Number(list_cbed_detal[iz].kol) + Number(kol)
					check = false
				}	
			}
			if(check) {
				if(!recursive)
					list_cbed_detal.push({
						type,
						obj: {id: element.id, name: element.name,  articl: element.articl},
						kol
					})
				else {
					element.obj = {id: element.id}
					element.type = type
					const check_dublecate = checkDublecate(list_hidden_cbed_detal, element)
					if(check_dublecate != null) 
						list_hidden_cbed_detal[check_dublecate].kol = list_hidden_cbed_detal[check_dublecate].kol + kol
					else 
						list_hidden_cbed_detal.push({
							type,
							obj: {id: element.id, name: element.name,  articl: element.articl},
							kol
						})
				}
			} else check = true
		}
	}
	return {list_cbed_detal, list_hidden_cbed_detal}
}
/**
 * Парсит комплектацию СБ или Д
 */
function parserListIzd(res, kol) {
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
			checkedJsonList({...res, cbeds, detals}, true)
	} catch(e) {console.error(e)}		
}
/**
 * Добавляем СБ или Д
 */
function responseDetalCb(res, list_cbed_detal) {
	if(res && res.type == 'cbed') 
		parserListIzd(res.obj, 1)

	const check_dublecate = checkDublecate(list_cbed_detal, res)
	if(check_dublecate != null) 
		return list_cbed_detal[check_dublecate].kol++
	list_cbed_detal.push({
		...res, 
		obj: {id: res.obj.id, name: res.obj.name, articl: res.obj.articl},
		kol: 1
	})

	return list_cbed_detal
}
/**
 * Осуществляем проверку на дублирование
 */
 function checkDublecate(arr, res) {
	for(let inx in arr) {
		if(arr[inx].obj.id == res.obj.id && arr[inx].type == res.type) return inx
	}
	return null
}