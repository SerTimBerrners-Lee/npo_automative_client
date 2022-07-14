<template>
  <div>
    <div> 
      <div>
        <IssueForMe />
      </div>
    </div>
    <div class="block-two">
      <h3>План по операциям</h3>
      <div class="operation-block">
        <div class="type-operation" v-for='(operation, inx) of getTypeOperations' :key='operation'>
          <span>{{ inx }}.</span>
          <span>{{ operation.name }}</span>
        </div>
      </div>
    </div>
    
    <TableResultWorkers 
      v-if='getMetaloworkings.length'
      :metall='getMetaloworkings'
    />
    <p v-else>Нет выполненых задач</p>

    <Loader v-if='loader' />
  </div>
</template>

<script>
import { dateIncrementHors } from '@/js/';
import { mapGetters, mapActions } from 'vuex';
import IssueForMe from '@/components/Issue/IssueForMe';
import TableResultWorkers from '@/components/ResultWork/Table';

export default {
  data() {
    return {
      srokList: [
        'Срочно',
        'Нормально',
        'Отложено',
        'На контроль'
      ],
      loader: false
    }
  },
  components: { 
    TableResultWorkers,
    IssueForMe
  },
  computed: mapGetters([
    'getAuth',
    'getForMeIssue',
    'getTypeOperations',
    'getMetaloworkings'
  ]),
  methods: {
    ...mapActions([
      'fetchIssueList',
      'getAllTypeOperations',
      'fetchResultWorkMetall'
    ]),
    dateIncrementHors(date, hors) {
      const dat = dateIncrementHors(date, hors);
      return `${dat.day}.${dat.mount}.${dat.year}`;
    },
    incrementDay(date, hors) {
      const dat = dateIncrementHors(date, hors);
      return `${dat.iterationHors}`;
    },
  },
  async mounted() {
    this.loader = true;
    if(this.getAuth && this.getAuth.id) 
      await this.fetchIssueList(this.getAuth.id);

    await this.getAllTypeOperations();
    await this.fetchResultWorkMetall();
    this.loader = false;
  }
}
</script>

<style>
.select-small{
  width: 98%;
}
.container {
  flex-direction: column;
  padding: 10px;
  margin: 40px;
  margin-left: 210px;
  padding-top: 40px;
}
table {
  border: 1px solid #d3d3d3;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 16px;
}
.wort-page-table {
  font-size: 16px;
}
th {
  border: 1px solid #d3d3d3;
}
td {
  border: 1px solid #d3d3d3;
}
.block-one {
  width: max-content;
}
.block-one>.scroll-table{
  width: inherit;
}
</style>