import PATH_TO_SERVER from './path'

export async function afterAndBeforeOperation(tp_id, operation_id, type = 'all') {
	const result = await fetch(`${PATH_TO_SERVER}api/detal/techprocess/${tp_id}`)
	if(!result.ok) return false
	const res = await result.json()
	if(!res.operations.length) return false
	
	let beforeOperation = null
	let afterOperation = null
	let currentOperation = null
	let last = true
	for(let operation of res.operations) {
		if(operation.id != operation_id && last)
			beforeOperation = operation
		if(operation.id == operation_id && last) {
			currentOperation = operation
			last = false
		}
		if(operation.id != operation_id && !last) {
			afterOperation = operation
			break;
		}
	}	
	if(!beforeOperation)
		beforeOperation = currentOperation
	if(!afterOperation)
		afterOperation = currentOperation

	if(type == 'before')
		return beforeOperation
	else if(type == 'after')
		return afterOperation
	else 
		return {
			before: beforeOperation,
			after: afterOperation
		}
}

export async function getStatus(tp_id, operation_id, curr_id=1, return_is='index') {
	const result = await fetch(`${PATH_TO_SERVER}api/detal/techprocess/${tp_id}`)
	if(!result.ok) return false
	const tech_proc = await result.json()
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
			pt: this.pt,
			mt: this.mt,
			ht: this.ht
		}
	}
	static pt
	static mt
	static ht
	static kol_create_izd 

	timeKolvo() {
		return this.pt + ((this.mt + this.ht) * this.kol_create_izd)
	}
}
