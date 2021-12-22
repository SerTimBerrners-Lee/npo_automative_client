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
	if(oD) {
		oD = JSON.parse(oD)
		if(m.material.outsideDiametr) 
			ctx.obj.DxL = padStart('x', oD.znach.length + 1, oD.znach)
	}
	if(leng) {
		leng = JSON.parse(leng)
		if(m.material.length) 
			ctx.obj.DxL = padEnd(ctx.obj.DxL, ctx.obj.DxL.length + leng.znach.length, leng.znach)
	}
	//  Чтобы узнать Массу нужно ПЛОТНОСТЬ * (ПЛОЩАДЬ СЕЧЕНИЯ * ДЛИНУ)
	if(aCS) {
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
	console.log("Материал При добавлении заготовки к детали: ", m)
	try{
		const height = JSON.parse(m.material.height)
		const thickness = JSON.parse(m.material.thickness)
		const wallThickness = JSON.parse(m.material.wallThickness)
		const width = JSON.parse(m.material.width)
		if(height) ctx.obj.variables_znach.push({
			name: 'Высота', ez: 'мм', znach: height.znach == 'variable' ? 0:JSON.parse(m.height).znach})
		if(thickness) ctx.obj.variables_znach.push({
			name: 'Толщина', ez: 'мм', znach: thickness.znach == 'variable' ? 0:JSON.parse(m.thickness).znach})
		if(wallThickness) ctx.obj.variables_znach.push({
			name: 'Толщина стенки', ez: 'мм', znach: wallThickness.znach == 'variable' ? 0:JSON.parse(m.wallThickness).znach})
		if(width) ctx.obj.variables_znach.push({
			name: 'Ширина', ez: 'мм', znach: width.znach == 'variable' ? 0: JSON.parse(m.width).znach})
	} catch(e) {console.error(e)}
}


const changeHaracteristic = (val, inx, ctx) =>  {
	if(inx == 'DxL') {
		if(val.indexOf('x') < 0) {
			ctx.obj.DxL = 'x'
			return 0
		}
		let dxl = val.split('x')
		if(dxl.length == 2) {
			if(ctx.inputMassZag * dxl[1])
				ctx.obj.massZag = ctx.density * (ctx.inputMassZag * (Number(dxl[1])/1000))
			if(ctx.obj.massZag)
				ctx.obj.trash = ctx.obj.massZag - ctx.obj.haracteriatic[0].znach 
		}
	}
}

export {
	calcParams,
	changeHaracteristic,
	parseVariableFold
}