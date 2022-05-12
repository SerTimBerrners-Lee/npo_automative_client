import { differencesShipments } from '@/js/';
import { mapActions, mapMutations, mapGetters} from 'vuex';

export default {
  data() {
    return {
      list_cbed_detal: [],
      childrens: []
    }
  },
	computed: mapGetters([
		'getOneShipments',
	]),
  methods: {
    ...mapActions(['fetchAllShipmentsById', 'fetchIncludesFolderSh']),
    ...mapMutations(['setOneShipment']),
    async childrenSord(id) {
      try {
				this.list_cbed_detal = [];

				const result = await this.fetchAllShipmentsById({ id, light: true });

				if(!result) return this.destroyModalF();
				this.setOneShipment(result);
				if (result.list_cbed_detal) this.list_cbed_detal = JSON.parse(result.list_cbed_detal);

				const ship_id_for_children = result.parent_id || result.id;
		
				const childrens = await this.fetchIncludesFolderSh({ id: ship_id_for_children, folder: 'childrens' });
				if (childrens) {
					const child = childrens.childrens.filter(el => el.id != result.id);
					this.childrens = differencesShipments(child);
				}
				const res = differencesShipments([result]);
				this.childrens.push(res[0]);

			} catch (err) { console.error(err, 'shipments modal beforeCreateF'); }
    }
  }
}