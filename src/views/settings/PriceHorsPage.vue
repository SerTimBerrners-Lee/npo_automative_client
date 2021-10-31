<template>
  <div>
    <h3>15. Стоимость норма-часа</h3>
    <div class="cont">
      <table>
        <tr>
          <th class="width-350">Наименование</th>
          <th>Ед.</th>
          <th>Значение</th>
        </tr>
        <tr class="td-row" v-if='norm_hors'>
          <td>{{ norm_hors.name }}</td>
          <td>{{ norm_hors.ez }}</td>
          <td>
            <input style='width: 100px;' type="number" min='1' v-model='norm_hors.znach'>
          </td>
        </tr>
      </table>
      <div class="btn-control" style='margin-top: 10px;'  v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
        <button class="btn-small btn-add" @click='update'>Сохранить</button>
      </div>
    </div>
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='showInformPanel'
      :key='keyInformTip'
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import PATH_TO_SERVER from '@/js/path';
import { showMessage } from '@/js/';
import InformFolder from '@/components/InformFolder.vue';
export default {
  data() {
    return{
      norm_hors: null,

      titleMessage: '',
      message: '',
      type: '',
      showInformPanel: false,
      keyInformTip: 0,
    }
  },
  computed: mapGetters(['getRoleAssets']),
  components: {InformFolder},
  methods: {
    async update() {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/normhors`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          znach: this.norm_hors.znach
        })
      })
      if(res.ok)
        showMessage('', 'Значение успешно обновлено', 's', this)
        else 
          showMessage('', 'Произошла ошибка при обновлении значения', 'e', this)
    }
  },
  async mounted() {
    const res = await fetch(`${PATH_TO_SERVER}api/settings/normhors`)
    if(res.ok) {
      try {
        const result = await res.json()
        this.norm_hors = result[0]
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>