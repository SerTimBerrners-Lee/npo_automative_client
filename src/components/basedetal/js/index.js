import {padStart, padEnd, isNaN} from 'lodash';
/**
 * Получаем материал и парсим параметры 
 * @param {*} m
 * 1. Получить переменные поля если они есть для отображения 
 * 2. Отобразить поля в хараетеристики (доп поле) 
 */
const calcParams = (m, ctx) => {
	let oD = m.outsideDiametr // Наружный диаметр
	let leng = m.length // Длина
	let aCS = m.areaCrossSectional //  Площадь сечения 
	let density = m.density
	if(m) return false
	if(oD) {
		oD = JSON.parse(oD)
		if(!m.material.outsideDiametr || !oD?.znach) 
			ctx.obj.DxL = null
		else ctx.obj.DxL = padStart('x', oD.znach.length + 1, oD.znach)
	} else {
		if(m.material?.outsideDiametr && (JSON.parse(m.material.outsideDiametr)?.znach == 'variable'))
			ctx.obj.DxL = padStart('x', oD?.znach?.length + 1 || 1, oD?.znach || 0)
		else ctx.obj.DxL = null
	}
	if(leng && ctx.obj.DxL) {
		leng = JSON.parse(leng)
		if(m.material.length) 
			ctx.obj.DxL = padEnd(ctx.obj.DxL, ctx.obj.DxL.length + leng.znach.length, leng.znach)
	}
	//  Чтобы узнать Массу нужно ПЛОТНОСТЬ * (ПЛОЩАДЬ СЕЧЕНИЯ * ДЛИНУ)
	if(aCS && ctx.obj.DxL) {
		aCS = JSON.parse(aCS)
		if(m.material.areaCrossSectional) {
			let dxl = ctx.obj.DxL.split('x')
			if(dxl.length == 2 && Number(dxl[1])) {
				if(isNaN(Number(aCS.znach))) 
					ctx.obj.massZag = floatParse(aCS.znach) 
					else ctx.obj.massZag = aCS.znach 
				ctx.inputMassZag = ctx.obj.massZag
				if(Number(dxl[1]) * Number(ctx.obj.massZag))
					ctx.obj.massZag = Number(dxl[1]) * Number(ctx.obj.massZag)
					else ctx.obj.massZag = 0
			} else {
				if(isNaN(Number(aCS.znach))) 
					ctx.obj.massZag = floatParse(aCS.znach) 
				else
					ctx.obj.massZag = aCS.znach 
				ctx.inputMassZag = ctx.obj.massZag
			}
			ctx.obj.trash = ctx.obj.haracteriatic[0].znach - ctx.obj.massZag
		}
	}
	if(density) {
		try {
			density = JSON.parse(density)
			ctx.density = density.znach
		} catch(e) {console.error(e)}
	}
}

function floatParse(n) {
	return parseFloat(n.replace(",", "."));
}

const parseVariableFold = (m, ctx) => {
	if(!m.material) return false
	try{
		console.log(m)
		const diametr = m.material.outsideDiametr ? JSON.parse(m.material.outsideDiametr) : null
		const areaCS = m.material.areaCrossSectional ? JSON.parse(m.material.areaCrossSectional) : null
		const height = m.material.height ? JSON.parse(m.material.height) : null
		const thickness = m.material.thickness ? JSON.parse(m.material.thickness) : null
		const wallThickness = m.material.wallThickness ? JSON.parse(m.material.wallThickness) : null
		const width = m.material.width ? JSON.parse(m.material.width) : null
		const leng = m.material.length ? JSON.parse(m.material.length) : null

		if(height) height?.znach == 'variable' ? ctx.obj.height = 0 : ctx.obj.height = Number(JSON.parse(m.height)?.znach)
		if(thickness) thickness?.znach == 'variable' ? ctx.obj.thickness = 0 : ctx.obj.thickness = Number(JSON.parse(m.thickness)?.znach)
		if(wallThickness) wallThickness?.znach == 'variable' ? ctx.obj.wallThickness = 0 : ctx.obj.wallThickness = Number(JSON.parse(m.wallThickness)?.znach)
		if(width) width?.znach == 'variable' ? ctx.obj.width = 0 : ctx.obj.width = Number(JSON.parse(m.width)?.znach)
		if(leng) leng?.znach == 'variable' ? ctx.obj.leng = 0 : ctx.obj.leng = Number(JSON.parse(m.length)?.znach)
		if(areaCS) areaCS?.znach == 'variable' ? ctx.obj.areaCS = 0 : ctx.obj.areaCS = Number(JSON.parse(m.areaCrossSectional)?.znach)
		if(diametr) diametr?.znach == 'variable' ? ctx.obj.diametr = 0 : ctx.obj.diametr = Number(JSON.parse(m.outsideDiametr)?.znach)
		
	} catch(e) {console.error(e)}
}


const changeHaracteristic = (val, inx, ctx) =>  {
	switch(inx) {
		case "diametr":
			ctx.obj['diametr'] = val
			break;
		case "lengt":
			ctx.obj['lengt'] = val
			break;
		case "height":
			ctx.obj['height'] = val
			break;
		case "thickness":
			ctx.obj['thickness'] = val
			break;
			case "wallThickness":
				ctx.obj['wallThickness'] = val
			break;
		case "width":
			ctx.obj['width'] = val
			break;
		case "areaCS":
			ctx.obj['areaCS'] = val
			break;
		case "massZag":
			ctx.obj['massZag'] = val
			break;
		case "trash":
			ctx.obj['trash'] = val
			break;
	}
	// if(inx == 'DxL' && ctx.obj.DxL) {
	// 	if(val.indexOf('x') < 0) {
	// 		ctx.obj.DxL = 'x'
	// 		return 0
	// 	}
	// 	let dxl = val.split('x')
	// 	if(dxl.length == 2) {
	// 		if(ctx.inputMassZag * dxl[1])
	// 			ctx.obj.massZag = ctx.density * (ctx.inputMassZag * (Number(dxl[1])/1000))
	// 		if(ctx.obj.massZag)
	// 			ctx.obj.trash = ctx.obj.massZag - ctx.obj.haracteriatic[0].znach 
	// 	}
	// }
}

export {
	calcParams,
	changeHaracteristic,
	parseVariableFold
}