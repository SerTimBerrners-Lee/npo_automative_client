<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
         <h3>Расход со склада, Заказ {{ sh.number_order }}</h3>
         
         <h3>Сборки</h3>
         <table>
          <tr>
            <th>№</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Кол-во</th>
            <th>Стоимость</th>
          </tr>
          <tr v-for="(cb, inx) of cbed" :key='cb'>
            <td class='center'>{{ inx + 1 }}</td>
            <td class='center'>{{ cb.obj.articl }}</td>
            <td class='center'>{{ cb.obj.name }}</td>
            <td class='center'>{{ cb.kol }}</td>
            <td class='center'>{{ 0 }}</td>
          </tr>
         </table>

         <h3>Детали</h3>
         <table>
          <tr>
            <th>№</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Кол-во</th>
            <th>Стоимость</th>
          </tr>
          <tr v-for="(det, inx) of detal" :key='det'>
            <td class='center'>{{ inx + 1 }}</td>
            <td class='center'>{{ det.obj.articl }}</td>
            <td class='center'>{{ det.obj.name }}</td>
            <td class='center'>{{ det.kol }}</td>
            <td class='center'>{{ 0 }}</td>
          </tr>
         </table>

      </div>
    </div>
     <Loader v-if='loader' />
  </div>
</template>

<script>
import MixModal from '@/mixins/mixmodal';
import { mapActions, mapGetters } from 'vuex';

export default { 
  props: {
    sh: Object
  },
  data() {
    return {
      detal: [],
      cbed: [],
      loader: true,
    }
  },
  mixins: [MixModal],
  computed: mapGetters(['']),
  methods: {
    ...mapActions(['']),

  },
  async mounted() {
    this.loader = true;
    try {
      const pars1 = this.sh.list_cbed_detal ? JSON.parse(this.sh.list_cbed_detal) : [];
      const pars2 = this.sh.list_hidden_cbed_detal ? JSON.parse(this.sh.list_hidden_cbed_detal) : [];
      for (const item of pars1.concat(pars2)) {
        if (item.type == 'detal') this.detal.push(item);
        if (item.type == 'cbed') this.cbed.push(item);
      }

    } catch(err) {
      console.error(err);
    }
    this.loader = false;
  }
}
</script>

<style scoped>
.content-modal-right-menu {
  animation: width 1s 1 ease;
  width: 40%;
}
.left-block-modal {
  width: 60%;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
@keyframes width {
  from {
    width: 1vw;
  }
  to {
    width: 40%;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 60%;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 40%;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 60%;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
</style>