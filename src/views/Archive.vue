<template>
  <div> 
    <h3>Архив</h3>

    <div class='main'>
      <div>
        <MiniNavigation
          @unmount='filterType'
          :arrData='arrData'
          :pos="'y'"
          :default_item='false' />
      </div>
      <div class='table_content'>
        <TableIzd v-if='selectItem == 1' />
        <TableCbed v-if='selectItem == 2' />
        <TableDetal v-if='selectItem == 3' />
        <TableMaterial v-if='selectItem == 4' />
        <TableUser v-if='selectItem == 5' />
        <TableInstument v-if='selectItem == 6' />
        <TableEquipment v-if='selectItem == 7' />
        <TableInventary v-if='selectItem == 8' />
        <TableProvider v-if='selectItem == 9' />
        <TableBuyer v-if='selectItem == 10' />
        <TableFile v-if='selectItem == 11' />
      </div>
    </div>
  </div>
  <Loader v-if='loader' />
</template>
<script>
import { mapActions } from 'vuex';
import TableIzd from '@/components/Archive/TableIzd';
import TableFile from '@/components/Archive/TableFile';
import TableUser from '@/components/Archive/TableUser';
import TableCbed from '@/components/Archive/TableCbed';
import TableDetal from '@/components/Archive/TableDetal';
import TableBuyer from '@/components/Archive/TableBuyer';
import TableMaterial from '@/components/Archive/TableMaterial';
import TableProvider from '@/components/Archive/TableProvider';
import TableInstument from '@/components/Archive/TableInstument';
import TableEquipment from '@/components/Archive/TableEquipment';
import TableInventary from '@/components/Archive/TableInventary';

export default {
  data() {
    return {
      loader: false,
      arrData: [
        'Изделия',
        'Сборки',
        'Детали',
        'Материалы',
        'Пользователи',
        'Инстумент и Оснастка',
        'Оборудование',
        'Техника и Инвентарь',
        'Поставщики',
        'Покупатели',
        'Файлы',
      ],
      selectItem: 0,
    }
  },
  components: {
    TableDetal,
    TableIzd,
    TableCbed,
    TableMaterial,
    TableUser,
    TableInstument,
    TableEquipment,
    TableInventary,
    TableProvider,
    TableBuyer,
    TableFile
  },
  methods: {
    ...mapActions([
      'getAllProductArchive',
      'getAllCbedArchive',
      'getAllDetalsArchive',
      'fetchGetArchivePPM',
      'getAllUsersArchive',
      'getAllNameInstrumentArchive',
      'fetchAllEquipmentArchive',
      'fetchAllNameInventaryArchive',
      'fetchGetProvidersArchive',
      'fetchAllBuyersArchive',
      'fetchFilesArchive'
    ]),
    async filterType(number) {
      this.selectItem = number - 1;
      
      this.loader = true;
      switch(this.selectItem) {
        case 1:
          await this.getAllProductArchive();
          break;
        case 2:
          await this.getAllCbedArchive();
          break;
        case 3:
          await this.getAllDetalsArchive();
          break;
        case 4:
          await this.fetchGetArchivePPM();
          break;
        case 5:
          await this.getAllUsersArchive();
          break;
        case 6:
          await this.getAllNameInstrumentArchive();
          break;
        case 7:
          await this.fetchAllEquipmentArchive();
          break;
        case 8:
          await this.fetchAllNameInventaryArchive();
          break;
        case 9:
          await this.fetchGetProvidersArchive();
          break;
        case 10:
          await this.fetchAllBuyersArchive();
          break;
        case 11:
          await this.fetchFilesArchive();
          break;
      }
      this.loader = false;
    }
  },
  async mounted() {
    this.loader = true;

    this.loader = false;
  }
}
</script>

<style scoped>
.table_content {
  margin-left: 30px;
  width: 80%;
  height: 700px;
  overflow: auto;
  display: block;
}
.table_content table {
  width: 80%;
}
.main {
  display: flex;
}
</style>