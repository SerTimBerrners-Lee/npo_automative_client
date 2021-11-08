let arr = [
	"02.11.2021",
	'03.11.2021',
	'08.11.2021',
	'05.11.2021',	
	'06.11.2021',	
	'04.11.2021',	
	'07.11.2021'
]

const comparison = (one_date = new Date().toLocaleDateString('ru-RU'), two_date = new Date().toLocaleDateString('ru-RU'), operation = '==') => {
	let d1 = utfDate(one_date)
	let d2 = utfDate(two_date) 

	function utfDate(d) {
		let ds = d.split('.').reverse().join('-') + 'T10:10:10Z'
		return ds
	}

	let result
	switch(operation) {
		case '==':
			result = Date.parse(d1) == Date.parse(d2)
			break
		case '<':
			result = Date.parse(d1) < Date.parse(d2)
			break
		case '>':
			result = Date.parse(d1) > Date.parse(d2)
			break
		case '<=':
			result = Date.parse(d1) <= Date.parse(d2)
			break
		case '>=':
			result = Date.parse(d1) >= Date.parse(d2)
			break
		case '!=':
			result = Date.parse(d1) != Date.parse(d2)
			break
	}

	return result

}

let new_arr = []
for(let i = 0; i < arr.length; i++) {
	for(let j = 0; j < arr.length; j++) {
		if(comparison(arr[i], arr[j], '>')) {
			cop = arr[i]
			arr[i] = arr[j]
			arr[j] = cop
		}
	}
}

console.log(arr)