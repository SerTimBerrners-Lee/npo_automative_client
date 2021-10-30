
const assetsFunction = (path, assets) => {
	switch (path) {
		case '/': 
			return true;
		case '/product':
			return assets.product;
		case '/filebase':
			return assets.baseFile;
		case '/basematerial':
			return assets.baseMaterial;
		case '/basebuyer':
			return assets.baseBuyer;
		case '/baseprovider':
			return assets.baseProvider;
		case '/basetools':
			return assets.baseTools;
		case '/baseequipment':
			return assets.baseEquipment;
		case '/basedetals':
			return assets.baseDetal;
		case '/sclad':
			return assets.sclad;
		case '/cbed':
			return assets.baseCbed;
		case '/issueshipment':
			return assets.issueShipments;
		case '/assembly':
			return assets.assembly;
		case '/metalloworking':
			return assets.metalloworking;
		case '/library':
			return assets.linrary;
		case '/resultwork':
			return assets.workResult;
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