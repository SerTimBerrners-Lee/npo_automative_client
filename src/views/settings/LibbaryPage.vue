<template>
  <div>
    <h3>14. Разделы библиотеки</h3>
    <div class="cont">
      <table>
        <tr>
          <th>№</th>
          <th class="width-350">Наименование раздела</th>
        </tr>
        <tr 
          class="td-row"
          v-for='(chapt, inx) of getChapter' 
          @click="selected(chapt)"
          :key="chapt">
          <td>{{ inx + 1 }}</td>
          <td>{{ chapt.name }}</td>
        </tr>
      </table>
      <div class="btn-control" v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
        <button class="btn-small btn-add" @click='create'>Создать</button>
        <button class="btn-small" @click='edit'>Редактировать</button>
        <button class="btn-small" @click='remove'>Удалить</button>
      </div>
    </div>
    <AddEditModal 
      :key='keyGenerateModal' 
      v-if='showGenerateModal' 
      :type='type_open'
      :chapter='chapter_selected'
      @unmount='unmount_chapter'
    />
    <Loader v-if='loader' />
  </div>
</template>

<script>
import { random } from 'lodash';
import {mapActions, mapGetters} from 'vuex';
import AddEditModal from '@/components/Library/AddEditModal';

export default {
  data() {
    return{
      keyGenerateModal: random(1, 999),
      showGenerateModal: false,
      chapter_selected: null,
      type_open: 'create',

      loader: false
    }
  },
  computed: mapGetters(['getRoleAssets', 'getChapter']),
  components: {AddEditModal},
  methods: {
    ...mapActions(['getAllChapter', 'removeChapter']),
    unmount_chapter() {
      this.getAllChapter()
    },
    create() {
      this.keyGenerateModal = random(1, 999)
      this.showGenerateModal = true
      this.type_open = 'create'
    },
    edit() {
      if(!this.chapter_selected) return false

      this.keyGenerateModal = random(1, 999)
      this.showGenerateModal = true
      this.type_open = 'edit'
    },
    remove() {
     if(!this.chapter_selected) return false

      this.removeChapter(this.chapter_selected.id)
    },
    selected(chapted) {
      this.chapter_selected = chapted
    }
  },
  async mounted() {
    this.loader = true
    await this.getAllChapter()
    this.loader = false
  }
}
</script>