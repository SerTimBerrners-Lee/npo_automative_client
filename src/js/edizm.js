const getKolvoMaterial = (mat) => {
	let arr_ez = []
	try {
		let pars_mat_kol = JSON.parse(mat.kolvo) // Выбранные ЕИ у Материала
		let pars_ez_kol = null
		if(mat.ez_kolvo) pars_ez_kol = JSON.parse(mat.ez_kolvo) // Данные о количестве материала для определенной ЕИ

		if(pars_mat_kol.c1) 
			if(pars_ez_kol)	arr_ez.push({ez: 'шт', material_kolvo: Object.values(pars_ez_kol)[0].material_kolvo, shipments_kolvo: Object.values(pars_ez_kol)[0].shipments_kolvo})
				else 	arr_ez.push({ez: 'шт', ...mat})
		
		if(pars_mat_kol.c2) 
			if(pars_ez_kol)	arr_ez.push({ez: 'л', material_kolvo: Object.values(pars_ez_kol)[1].material_kolvo, shipments_kolvo: Object.values(pars_ez_kol)[1].shipments_kolvo})
				else	arr_ez.push({ez: 'л', ...mat})
		
		if(pars_mat_kol.c3)
			if(pars_ez_kol)	arr_ez.push({ez: 'кг', material_kolvo: Object.values(pars_ez_kol)[2].material_kolvo, shipments_kolvo: Object.values(pars_ez_kol)[2].shipments_kolvo})
				else	arr_ez.push({ez: 'кг', ...mat})
		
		if(pars_mat_kol.c4) 
			if(pars_ez_kol)	arr_ez.push({ez: 'м', material_kolvo: Object.values(pars_ez_kol)[3].material_kolvo, shipments_kolvo: Object.values(pars_ez_kol)[3].shipments_kolvo})
				else	arr_ez.push({ez: 'м', ...mat})
		
		if(pars_mat_kol.c5) 
			if(pars_ez_kol)	arr_ez.push({ez: 'м.куб', material_kolvo: Object.values(pars_ez_kol)[4].material_kolvo, shipments_kolvo: Object.values(pars_ez_kol)[4].shipments_kolvo})
				else	arr_ez.push({ez: 'м.куб', ...mat})
		
		if(arr_ez.length == 0) arr_ez.push({ez: 'шт',...mat})
		return arr_ez
	} catch (e) {console.error(e)}
}

export {
	getKolvoMaterial
}