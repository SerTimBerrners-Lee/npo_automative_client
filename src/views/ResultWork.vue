<template>
	<div>
		<h3>Результаты работы</h3>
    <div class="type-issue">
      <span>По сотрудникам</span>
      <span>По оборудованию</span>
    </div>
  
    <TableResultWorkers
      :metall='getMetaloworkings'
    />

	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TableResultWorkers from '@/components/ResultWork/Table';

export default {
	data() {
		return{
		}
	},
  computed: mapGetters(['getMetaloworkings']),
	components: { TableResultWorkers },
	methods: {
    ...mapActions(['fetchResultWorkMetall']),
	},
	async mounted() {
    await this.fetchResultWorkMetall();
	}
}
</script>
<style scoped>
.block {
  padding: 5px;
}
.block .btn {
  margin: 0px;
}
.block * {
  margin-left: 5px;
}
.block  input {
  width: 90px;
}
</style>