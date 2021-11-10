<template>
	<div>
		<h3>Библиотека</h3>
		<div class="block">
      <span>Выбрать пользователя:</span>
      <input type="text">
      <span>Все:</span>
      <input type="text">
    </div>
    <div class='table_block'>
      <div class="table-scroll">
        <table>
         <tr class='td-row'
            v-for='chapt of getChapter' 
            :key='chapt'
            @class='e => setChapter(chapt, e.target)'>
            <th>{{ chapt.name }}</th>
          </tr>
        </table>
      </div>
      <div>
        <div class="table-scroll" style='margin-left: 5px;'>
          <table>
            <tr>
              <th>Имя файла или ссылки</th>
              <th>Расширение</th>
              <th>Описание</th>
              <th>Избранное</th>
              <th>Загрузил</th>
              <th>Просмотреть или перейти</th>
            </tr>
          </table>
        </div>
        <div class="btn-control">
          <button class="btn-small">В архив</button>
          <button class="btn-small">Забрать себе</button>
          <button class="btn-small">Редактировать</button>
          <button class="btn-small" @click='addFileLink'>Добавить файл или ссылку</button>
          <button class="btn-small btn-add">Скачать</button>
        </div>
      </div>
    </div>
    <Loader v-if='loader' />
    <AddFileLink 
      :key='keyLinlFile'
      v-if='showLinkFile'
    />
	</div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import AddFileLink from '@/components/library/add-file.vue';
import { random } from 'lodash';
export default {
  data() {
    return {  
      loader: false,
      select_chapter: null,
      span_chapter: null,
      keyLinlFile: random(1, 999),
      showLinkFile: false,
    }
  },
  computed: {
    ...mapGetters([
      'getChapter'
    ]),
  },
  components: {AddFileLink},
  methods: {
    ...mapActions([
      'getAllChapter'
    ]),
    setChapter(chapter, e) {
      if(this.span_chapter) this.span_chapter.classList.add('td-row-all')
      this.select_chapter = chapter
      this.span_chapter = e
      this.span_chapter.classList.add('td-row-all')
    },
    addFileLink() {
      this.keyLinlFile = random(1, 999)
      this.showLinkFile = true
    }
  },
  async mounted() { 
    this.loader = true
    await this.getAllChapter()
    this.loader = false
  }
}
</script>

<style scoped>
.table_block{
  display: flex;
}
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