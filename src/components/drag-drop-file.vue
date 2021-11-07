<template>
  <div class="pointer-files-to-add" @dragover="dragover" @dragleave="dragleave" @drop="drop">
    <label for="docsFileSelected">Перенесите сюда файлы или кликните для добавления с вашего компьютера.</label>
    <input 
      id="docsFileSelected" 
      @change="e => addDock(e)" 
      type="file" 
      style="display:none;" 
      required multiple
      ref='file'>
  </div>
  <AddFile 
    :parametrs='docFiles' 
    v-if="isChangeFolderFile" 
    @unmount='unmount'
    :return_files="'push'"
    :typeGetFile='typeGetFile'
    :key='keyWhenModalGenerate' />
</template>


<script>
import AddFile from '@/components/filebase/addfile.vue';
import { random }  from 'lodash';
export default {
  props: ['typeGetFile'],
  data() {
    return {
      docFiles: [],
      keyWhenModalGenerate: random(10, 999),
      isChangeFolderFile: false,
    }
  },
  components: {AddFile},
  methods: {
    unmount(res) {
      this.$emit('unmount', res)
    },
    onChange() {
      this.docFiles = [...this.$refs.file.files]
    },
    dragover(event) {
      event.preventDefault();
      let label = event.currentTarget.children[0]
      if (!label.classList.contains('hover_files')) 
        label.classList.add('hover_files');
    },
    dragleave(event) {
      event.currentTarget.children[0].classList.remove('hover_files');
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.addDock();
      event.currentTarget.children[0].classList.remove('hover_files');
    },
    addDock() {
      this.onChange()
      this.keyWhenModalGenerate = random(10, 1111)
      this.isChangeFolderFile = true
    },
  }
}
</script>

<style scoped>
[v-cloak] {
  display: none;
}
.main {
  width: 700px;
  height: 300px;
  margin: 200px;
}
.hover_files {
  background: rgb(110, 110, 110);
  color: black;
}
label, .pointer-files-to-add  {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 50px;
  text-align: center;
}
</style>