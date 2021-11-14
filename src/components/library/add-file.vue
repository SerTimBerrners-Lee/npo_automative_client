<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Добавление файла</h3>

        <div class="block">
          <div class="block">
            <p>
              <span>Имя {{ is_link ? 'ссылки' : 'файла' }}</span>
              <input type="text" v-model='name'>
              <label for="link">Ссылка:</label>
              <input type="checkbox" id="link" v-model='is_link'>
            </p>
            <p v-if='is_link'>
              <span>Ссылка</span>
              <input type="text" v-model='link'>
            </p>
          </div>
          <div style='height: 50px;' v-if='!is_link'>
            <FileLoader 
              :typeGetFile='"getfile"' 
              @unmount='file_unmount' 
              :is_one="true"/>
          </div>
          <div style='margin-top: 50px;'>
            <h3>Описание</h3>
            <textarea maxlength='250' rows="6" v-model='description' ></textarea>
          </div>
        </div>
        <div class="btn-control out-btn-control">
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
          <button class="btn-status btn-black" @click='loadToServer'>Сохранить</button>
          <button class="btn-status btn-black">Обновить</button>
        </div>
    </div>
    </div>
  </div> 
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  props: ['select_chapter'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',

      formData: new FormData(),
      is_link: false,
      name: '',
      link: '',
      description: ''
    }
  },
  computed: {
    ...mapGetters(['getAuth']),
  },
  components: {},
  methods: {
    ...mapActions(['saveNewLink']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    loadToServer() {
      if(!this.getAuth.id) return false
      if(!this.name) return false
      if(!this.link && this.is_link) return false
      this.formData.append('is_link', this.is_link)
      this.formData.append('name', this.name)
      this.formData.append('link', this.link)
      this.formData.append('user_id', this.getAuth.id)
      this.formData.append('chapter_id', this.$props.select_chapter.id)
      this.formData.append('description', this.description)

      this.saveNewLink(this.formData).then(() => this.destroyModalF())
    },
    ...mapActions(['']),
    file_unmount(e) { 
      if(!e) return 0
      this.formData = e.formData
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    
  }
}
</script>

<style scoped>
label {
  color: black;
  margin: 0px;
}
textarea {
  width: 400px;
}
p {
  display: flex;
  align-items: center;
}
p * {
  margin-left: 10px;
}
input[type=text] {
  width: 50%;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  height: 100vh;
  width: 50%;
}
.left-block-modal {
  width: 50%;
  height: 10000px;
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
    width: 1%;
  }
  to {
    width: 50%;
  }
}
@keyframes width-right {
  from {
    width: 0%;
  }
  to {
    width: 50%;
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
    width: 30vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 70vw;
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