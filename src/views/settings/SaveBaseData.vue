<template>
  <div>
    <h3>16. Сохранение баз данных, настроек, истории действий</h3>
    <div class='main_db'>
      <div class="block block_db">
        <br>
        <button class="btn blues" @click='pushNewDB'>Генерировать новую копию сейчас</button>

        <div class="card g4" v-if='select_db'>
          <div>
            <img class="img-to-card" src="@/assets/img/db_photo.webp" alt="db">
            <span class="date-span-db">
              {{ select_db.date }}
            </span>
          </div>
          <div  v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
            <div>
              Запустить 
            </div>
            <div class='delete' @click='dropDB'>
              Уничтожить 
            </div>
          </div>
          <unicon 
            class='icons_import' 
            name="import" 
            fill="black" 
            width='25'
            @click='downloadDB()' />
        </div>
      </div>
      <div class="db-date-block">
        <span class="span_db">Список резервных копий: {{ getDB.length }} копий.</span>
        <div class="scroll-table">
          <table>
            <tr>
              <th>№</th>
              <th>Дата и Время</th>
              <th>Полное название</th>
              <th>Размер</th>
            </tr>
            <tr 
              v-for='(db, inx) of getDB' 
              :key="db"
              class='td-row'
              @click='setDB(db)'>
              <td class='center'>{{ inx + 1 }}</td>
              <td>{{ db.date }}</td>
              <td>{{ db.name }}</td>
              <td class='center'>{{ db.size }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class='main_db'>
      <div class="block">
        <span class="span_db">Бездействие пользователя макс.мин: </span>
        <input type="number" min='1' v-model='inaction'>
        <br>
        <button class="btn blues" @click='saveInaction'>Сохранить</button>
      </div>
    </div>
    <Loader v-if='loader' />
  </div>
</template>

<script>
import { showMessage } from '@/js/';
import PATH_TO_SERVER from '@/js/path.js';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return{
      select_db: null,
      loader: false,

      inaction: 0
    }
  },
  computed: mapGetters(['getRoleAssets', 'getDB']),
  methods: {
    ...mapActions([
      'fetchDB', 
      'fetchAddDB', 
      'fetchDropDB', 
      'fetchInactionHors', 
      'fetchChangeInaction'
    ]),
    downloadDB() {
      if(!this.select_db) return showMessage('', 'Резервная копия не выбрана', 's');
      window.open(`${PATH_TO_SERVER}db/${this.select_db.name}`);
    },
    fetchAllDump() {
      this.fetchDB().then(() => this.loader = false);
    },
    async pushNewDB() {
      this.loader = true
      const res = await this.fetchAddDB();
      if (res) showMessage('', 'Резервная копия успешно сгенерированна', 's');
      else showMessage('', 'Произошла ошибка на сервере', 'e');

      this.fetchAllDump();
    },
    setDB(db) {
      this.select_db = db;
    },
    async dropDB() {
      if(!this.select_db) return false; 
      
      const res = await this.fetchDropDB(this.select_db.name)
      if(res) showMessage('', 'Резервная копия успешно удалена', 's');
      this.select_db = null;
    },
    async saveInaction() {
      const res = await this.fetchChangeInaction(this.inaction);
      if(res) showMessage('', 'Часы бездействия успешно обновлены', 's');
      else showMessage('', 'Произошла ошибка при обновлении часов', 'e');
    }
  },
  async mounted() {
    this.loader = true;
    const res = await this.fetchInactionHors();
    if(res) this.inaction = res.inaction;
    this.fetchAllDump();
  }
}
</script>

<style scoped>
.delete:hover {
  background: rgba(172, 74, 74, 0.596);
}
.main_db {
  display: flex;
}
input[type=number] {
  width: 60px;;
}
.scroll-table {
  width: 660px;
}
table {
  width: 100%;
}
tr {
  height: 20px;
}
.main_db div {
  margin: 10px;
  height: fit-content;
}
#db_save {
  margin-top: 20px; 
  border: 1px solid #d3d3d3;
}
.span_db {
  font-weight: bold;
  font-size: 16px;
  width: 100%;
}
.block, .block_db {
  width: 400px;
  padding: 20px;
  margin-top: 20px;
}
.block_db {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.img-to-card {
  height: 90px;
  width: 70px;
}
.card {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: max-content;
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  cursor: pointer;
  user-select: none;
  box-shadow: 1px 1px 8px 1px #d3d3d3;
  background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%);
}
.card>div {
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.card>div div {
  margin: 5px;
  width: 100px;
  border-radius: 39px;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
}
.date-span-db {
  margin-top: 5px;
  font-size: small;
}
.card>div:first-child {
  display: flex;
  justify-content: center;
  align-items: center;
}
.db-date-block {
  margin-top: 25px;
  height: 400px;
  padding-right: 25px;
  overflow: hidden;
  overflow-y: auto;
}
.g1>div div{
  box-shadow: 5px -1px 5px -2px #00C9FF;
}
.g1>div div:hover {
  box-shadow: 5px -1px 15px -2px #00C9FF;
}
.g4 {
  background: linear-gradient(90deg, #efd5ff 0%, #515ada 100%);
}
.g4>div div{
  box-shadow: 5px -1px 5px -2px #515ada;
}
.g4>div div:hover {
  box-shadow: 5px -1px 15px -2px #515ada;
}
.g4>.unicon {
  padding: 5px;
  margin:0px;
  height:20px;
  border-radius: 25px;
}
.g4>.unicon:hover {
  box-shadow: 5px -1px 15px -2px #2b34ad;
}
</style>