
const assetsFunction = (path, assets) => {
	console.log(assets)
	switch (path) {
		case '/': 
			return true;
		// PRODUCT
		case '/product':
			return assets.product;
		case '/product/edit/true':
			return assets.productAssets.read || assets.productAssets.writeSomeone
		case '/product/edit/false':
			return assets.productAssets.read || assets.productAssets.writeSomeone
		case '/createproduct' :
			return assets.productAssets.writeSomeone
		// FILEBASE
		case '/filebase':
			return assets.baseFile;
		// BASEMATERIAL
		case '/basematerial':
			return assets.baseMaterial;
		case '/material/add/edit':
			return assets.materialAssets.read || assets.materialAssets.writeSomeone
		case '/material/add/copy':
			return assets.materialAssets.read || assets.materialAssets.writeSomeone
		case '/material/add/create':
			return assets.materialAssets.writeSomeone
		// BASE BUYER
		case '/basebuyer':
			return assets.baseBuyer;
		case '/buyer/edit':
			return assets.buyerAssets.read || assets.buyerAssets.writeSomeone
		case '/buyer/create':
			return assets.buyerAssets.writeSomeone
		// BASE PROVIDER
		case '/baseprovider':
			return assets.baseProvider;
		case '/baseprovider/addedit/edit':
			return assets.providerAssets.read || assets.providerAssets.writeSomeone
		case '/baseprovider/addedit/add':
			return assets.providerAssets.writeSomeone
		// BASE TOOLS
		case '/basetools':
			return assets.baseTools;
		case '/instrument/edit/false':
			return assets.instrumentAssets.read || assets.instrumentAssets.writeSomeone
		case '/instrument/edit/true':
			return assets.instrumentAssets.read || assets.instrumentAssets.writeSomeone
		case '/instrument/add/create':
			return assets.instrumentAssets.writeSomeone
		// BASE  EQUIPMENT
		case '/baseequipment':
			return assets.baseEquipment;
		case '/equipment/edit/true':
			return assets.equipmentAssets.read || assets.equipmentAssets.writeSomeone
		case '/equipment/edit/false':
			return assets.equipmentAssets.read || assets.equipmentAssets.writeSomeone
		case '/equipment/add':
			return assets.equipmentAssets.writeSomeone
		// BASE DETAL
		case '/basedetals':
			return assets.baseDetal;
		case '/detal/edit/false':
			return assets.detalAssets.read || assets.detalAssets.writeSomeone
		case '/detal/edit/true':
			return assets.detalAssets.read || assets.detalAssets.writeSomeone
		case '/detal/add':
			return assets.detalAssets.writeSomeone
		// SCLAD
		case '/sclad':
			return assets.sclad;
		// BASE CBED
		case '/cbed':
			return assets.baseCbed;
		case '/cbed/edit/true':
			return assets.cbedAssets.read || assets.cbedAssets.writeSomeone
		case '/cbed/edit/false':
			return assets.cbedAssets.read || assets.cbedAssets.writeSomeone
		case '/cbed/create':
			return assets.cbedAssets.writeSomeone
		// ISSUE SHIPMENTS
		case '/issueshipment':
			return assets.issueShipments;
		// ASSEMBLY 
		case '/assembly':
			return assets.assembly;
		// METALLOWORKING 
		case '/metalloworking':
			return assets.metalloworking;
		// LIBRARY 
		case '/library':
			return assets.linrary;
		// RESULT WORK 
		case '/resultwork':
			return assets.workResult;
		// ISSUES 
		case '/issues':
			return assets.issue;
		// НАСТРОЙКИ
		case '/settings':
			return assets.settingsAssets.read;
		case '/employee':
			return assets.settingsAssets.users
		case '/edizm':
			return assets.settingsAssets.edizm
		case '/mathzag':
			return assets.settingsAssets.baseMat
		case '/pokdet':
			return assets.settingsAssets.basePokDet
		case '/rashmat':
			return assets.settingsAssets.baseRash
		case '/opertechproc':
			return assets.settingsAssets.operation
		case '/instrosn':
			return assets.settingsAssets.baseTools
		case '/baseoborud':
			return assets.settingsAssets.baseEquipment
		case '/basetech':
			return assets.settingsAssets.baseTech
		case '/diffsklad':
			return assets.settingsAssets.deficit
		case '/uthetwtime':
			return assets.settingsAssets.workTime
		case '/rolesuser':
				return assets.settingsAssets.rols
		case '/dolznuser':
			return assets.settingsAssets.dolzn
		case '/libbarysetting':
			return assets.settingsAssets.library
		case '/pricehors':
			return assets.settingsAssets.priceHors
		case '/savebasedata':
			return assets.settingsAssets.baseData
		case '/employee/edit/edit':
			return assets.usersListAssets.writeYour || assets.usersListAssets.writeSomeone 
		case '/employee/edit/add':
			return assets.usersListAssets.writeYour || assets.usersListAssets.writeSomeone 
		default: 
			return true;
	}
}

export {
	assetsFunction
}