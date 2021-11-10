<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Норма времени по операциям</h3>
			<div class="block">
				<table v-if='operations.length'>
					<tr>
						<th>Операция</th>
						<th>Норма времени, ч</th>
					</tr>
          <tr v-for='operation of operations' :key="operation">
            <td>{{ operation.full_name }}</td>
            <td class='center'>{{ oneIzdTime(operation) }}</td>
          </tr>
				</table>
        <span v-else>В технологическом процессе нет операций</span>
			</div>
    </div>
  </div>
</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import { OperationTime } from '@/js/operation.js';
export default {
  props: ['type', 'izdelie'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

      operations: []
    }
  },
  computed: mapGetters([]),
  methods: {
    ...mapActions(['fetchTechProcess', 'getOneCbEdById', 'getOneDetal']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    oneIzdTime(operation) {
			let ot = new OperationTime(operation)
			return ot.count
		},
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 

    let izd;
    if(this.$props.type == 'cb') 
      izd = await this.getOneCbEdById(this.$props.izdelie.id)
    if(this.$props.type == 'det') 
      izd = await this.getOneDetal(this.$props.izdelie.id)

    if(izd.techProcesses && izd.techProcesses.id) {
      const tp = await this.fetchTechProcess(izd.techProcesses.id)
      console.log(tp)
      if(tp) this.operations = tp.operations
    } 
  },
}
</script>

<style scoped>
.out-btn-control {
  width: 96%;
}
table{ 
  width: 100%;
  margin-bottom: 50px;
}
.block input {
  width: 50px;
}
.block * {
  margin: 3px;
}
.block {
  display: flex;
}
.block p {
  display: flex;
  align-items: center;
  font-size: 13px;
}
textarea {
  height: 130px;
}
</style>