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
        <table style='width: 300px;'>
         <tr class='td-row'
            v-for='chapt of getChapter' 
            :key='chapt'
            @click='e => setChapter(chapt, e.target)'>
            <th>{{ chapt.name  }}</th>
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
            <tr
              v-for='link of getLinks' 
              :key='link'
              class='td-row'
              @click='e => setLinks(link, e.target.parentElement)'>
              <td>{{ link.name }}</td>  
              <td class='center'>{{ link.is_link ? 'WWW' : getFormat(link) }}</td>  
              <td>{{ link.description }}</td>  
              <td class='center' @click='addToFavorites(link)'>
                <unicon name="star" fill="khaki" v-if='isFavorites(link)'/>
                <unicon name="star" fill="gray" v-else/>
              </td>  
              <td>{{ link.user ? link.user.login : '' }}</td> 
              <td v-if='link.is_link'>
                <a :href='link.link' class='active'>{{ link.link }}</a></td>
              <td 
                class='active'
                style='cursor: pointer;'
                @click='openDocuments(link.documents)'
                v-else>{{ 'Посмотреть' }}</td>
            </tr>
          </table>
        </div>
        <div class="btn-control">
          <button class="btn-small"
            v-if='select_link && select_link.responsible_id == getAuth.id'
            @click='toBan'
          >В архив</button>
          <!-- <button class="btn-small" v-if='select_link'>Забрать себе</button> -->
          <button class="btn-small" @click='editFileLink' v-if='select_link'>Редактировать</button>
          <button class="btn-small" @click='addFileLink'>Добавить файл или ссылку</button>
          <button 
            v-if='select_link && !select_link.is_link'
            class="btn-small btn-add"
            @click='saveDocunment'
            >Скачать</button>
        </div>
      </div>
    </div>
    <Loader v-if='loader' />
    <AddFileLink 
      :key='keyLinlFile'
      v-if='showLinkFile'
      :select_chapter='select_chapter'
      :type_open='type_open'
      :links='select_link'
    />
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
    <OpensFile 
      :parametrs='itemFiles' 
      v-if="itemFiles"
      :key='keyWhenModalGenerateFileOpen' />
	</div>
</template>
<script>
import { random } from 'lodash';
import { showMessage } from '@/js/';
import PATH_TO_SERVER from '@/js/path';
import OpensFile from '@/components/filebase/openfile.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import AddFileLink from '@/components/library/add-file.vue';
export default {
  data() {
    return {  
      loader: false,
      select_chapter: null,
      select_link: null,
      span_chapter: null,
      span_link: null,
      keyLinlFile: random(1, 999),
      showLinkFile: false,
      itemFiles: null,
      keyWhenModalGenerateFileOpen: random(10, 999),

      titleMessage: '',
      message: '',
      type: '',
      keyInformTip: 0,
      type_open: 'create'
    }
  },
  computed: {
    ...mapGetters([
      'getChapter',
      'getLinks',
      'getAuth'
    ]),
  },
  components: {AddFileLink, OpensFile},
  methods: {
    ...mapActions([
      'getAllChapter',
      'getAllLinks', 
      'fetchToBanLinks',
      'addLinkToFavorite'
    ]),
    ...mapMutations(['filterLinksToChapter', 'returnAllLinks']),
    setChapter(chapter, e) {
      if(this.span_chapter) this.span_chapter.classList.remove('td-row-all')
      if(this.select_chapter && chapter.id == this.select_chapter.id) return this.returnAllLinks()
      this.select_chapter = chapter
      this.span_chapter = e
      this.span_chapter.classList.add('td-row-all')
      
      this.filterLinksToChapter(chapter)
    },
    setLinks(link, e) {
      if(this.span_link) this.span_link.classList.remove('td-row-all')
       this.select_link = link
      this.span_link = e
      this.span_link.classList.add('td-row-all')
    },
    addFileLink() {
      if(!this.select_chapter)
        return showMessage('', 'Выберите раздел', 'w', this)
      this.keyLinlFile = random(1, 999)
      this.showLinkFile = true
      this.type_open = 'create'
    },
    editFileLink() {
      if(!this.select_link) return showMessage('', 'Сначала выберите что хотите отредактировать', 'w', this)
      this.keyLinlFile = random(1, 999)
      this.showLinkFile = true
      this.type_open = 'edit'
    },
    openDocuments(documents) {
      if(documents.length) 
      this.itemFiles = documents[0]
      this.keyWhenModalGenerateFileOpen = random(1, 999)
    },
    getFormat(link) {
      if(link.documents && link.documents.length) {
        const doc = link.documents[0].name
        return doc.split('.')[doc.split('.').length - 1].toUpperCase()
      }
    }, 
    toBan() {
      if(!this.select_link) return false
      this.fetchToBanLinks(this.select_link.id).then(() => 
        showMessage('', 'Успешно перенесено в архив', 's', this))
    },
    saveDocunment() {
      if(!this.select_link) return false
      if(!this.select_link.documents || !this.select_link.documents.length) return false
      window.open(`${PATH_TO_SERVER+this.select_link.documents[0].path}`, '_blank').focus()
    },
    isFavorites(link) {
      if(!link.users || !link.users.length) return false
      for(let user of link.users) {
        if(user.id == this.getAuth.id) return true
      }
      return false
    },
    addToFavorites(link) {
      if(!this.getAuth.id) return false
      this.addLinkToFavorite({user_id: this.getAuth.id, links_id: link.id}).then(() => showMessage('', 'Избранное изменено!', 's', this))
    }
  },
  async mounted() { 
    this.loader = true
    await this.getAllChapter()
    await this.getAllLinks()
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