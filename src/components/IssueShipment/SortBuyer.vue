<template>
  <div class='main'>
    <p>
      <button 
        class="btn-small"
        @click='openBuyerModal'>Выбрать Покупателя: </button>
      <span>{{ set_buyer? sliceName(set_buyer.name) : 'все' }}</span>
    </p>
    <BuyerModal 
      :key='buyer_key'
      v-if='buyer_show'
      @unmount='unmount_buyer'
    />
  </div>
</template>

<script>
import { random } from 'lodash';
import { mapMutations } from 'vuex';
import { sliceName } from '@/js/methods';
import BuyerModal from '@/components/BaseBuyer/ListBuyer';

export default {
  data() {
    return {
      set_buyer: null,
      buyer_key: random(1, 999),
      buyer_show: false,
    }
  },
  components: {
    BuyerModal
  },
  methods: {
    ...mapMutations(['filterShipmentsToBuyer']),
    unmount_buyer(buyer) {
      if (!buyer || !buyer.id) return false;
      this.set_buyer = buyer;
      this.filterShipmentsToBuyer(buyer.id);
    },
    sliceName(str) {
      return sliceName(str);
    },
    openBuyerModal() {
      this.set_buyer = null;
      this.buyer_key = random(1, 999);
      this.buyer_show = true;

    },
  },
}
</script>

<style scoped>
.main {
  margin-left: 20px;
}
</style>