import { comparison } from './index';


/**
 * 
 * @param {*} tp 
 * @param {*} operation_id 
 * @param {*} type 
 * @returns {
			before: beforeOperation,
			after: afterOperation,
			current: currentOperation
		} || {name: '', full_name: ''}
 */

export function afterAndBeforeOperation(tp, operation_id, type = 'all') {
	if (!tp.operations.length) return false
	
	let beforeOperation = null;
	let afterOperation = null;
	let currentOperation = null;
	let last = true;
	for (const operation of tp.operations) {
		if (operation.id != operation_id && last)
			beforeOperation = operation;
		if (operation.id == operation_id && last) {
			currentOperation = operation;
			last = false;
		}
		if (operation.id != operation_id && !last) {
			afterOperation = operation;
			break;
		}
	}

	if (!beforeOperation)
		beforeOperation = {name: '', full_name: 'Нет'}
	if (!afterOperation)
		afterOperation = {name: '', full_name: 'Нет'}

	if (type == 'before')
		return beforeOperation;
	else if (type == 'after')
		return afterOperation;
	else 
		return {
			before: beforeOperation,
			after: afterOperation,
			current: currentOperation
		}
}

export async function getStatus(tech_proc, operation_id, curr_id=1, return_is='index') {
	if(!tech_proc.operations.length) return false

	let index = 0
	for(let inx in tech_proc.operations) {
		if(tech_proc.operations[inx].id == operation_id) 
			index = inx
	}

	if(return_is == 'index')
		return index

	if(return_is == 'pug') {
		let pug_true = '<p class="success_operation">Готово</p>'
		let pug_false = '<p class="work_operation">В процессе</p>'

		for(let inx in tech_proc.operations) {
			if(tech_proc.operations[inx].id == curr_id) {
				if(index > inx) return pug_true
				else return pug_false
			}
		}
	}
}

export class OperationTime {
	constructor(operation, kol_create_izd = 1) {
		if(!operation) return false

		this.pt = Number(operation.preTime) 
		this.mt = Number(operation.mainTime) 
		this.ht = Number(operation.helperTime) 
		this.kol_create_izd = Number(kol_create_izd)

		return {
			count: this.timeKolvo(),
			pt: (this.pt / 60).toFixed(2),
			mt: (this.mt / 60).toFixed(2),
			ht: (this.ht / 60).toFixed(2)
		}
	}
	static pt
	static mt
	static ht
	static kol_create_izd 

	timeKolvo() {
		const num = ((this.pt + (this.mt + this.ht) * this.kol_create_izd) / 60)
		return num.toFixed(2)
	}
}

export function worksHors(operation, kolvo_all = 1) {
	let ot = new OperationTime(operation, kolvo_all)
	return ot.count
}
 
export function workingForMarks(operation, marks) {
	if(!marks || marks.length == 0) return 0
	let count = 0;
	// let ot = new OperationTime(operation)
	for(let mark of marks) {
		count = count + worksHors(operation, mark.kol)
	}

	return count //> worksHors(operation) ? count - ot.pt : count
}

export function returnKolvoBefore(oper) {
	let create = this.returnKolvoCreate(oper)
	return this.$props.izdeles.kolvo_shipments - create < 0 ? 0 : this.$props.izdeles.kolvo_shipments - create
}
/**
 * 
 * @param {*} oper 
 * @returns number
 */
export function returnKolvoCreate(oper) {
	if(!oper.marks || !oper.marks.length) return 0
	let kol = 0
	for(let mark of oper.marks) {
		kol = kol + mark.kol
	}
	return kol
}

/**
 * Возвращаем дату готовности
 * @param [{Shipments}] shipments 
 * @param 1 znach_return - 
 * @returns '12.13.2013'
 */
 export function returnShipmentsDate(shipments, znach_return = 1) {
  if(!shipments || shipments.length == 0) return '-';
  let end_date = shipments[0]?.date_shipments || '-';
  if(znach_return == 2) end_date = shipments[0]?.number_order || '-';

  for(let ship1 of shipments) {
    for(let ship2 of shipments) {
      if(comparison(ship1.date_shipments, ship2.date_shipments, '<')) end_date = znach_return == 1 ? ship1.date_shipments : ship1.number_order
    }
  }
  return end_date;
}