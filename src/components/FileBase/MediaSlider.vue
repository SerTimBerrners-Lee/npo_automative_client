<template>
    <div :style='width_main'>
      <div class="slider_main">
        <div class='img_content' v-if='files.length'>

          <div class="left_button" @click='swapMedia("l")'>&#8592;</div>
          <div class="img_folder" :style='width' v-if="file">
            <img v-if='file.type == "img"' 
              class='img_slider' 
              @click='img => sizeImg(img.target)'
              :src='file.path'>
            <video v-if='file.type == "movi"'
              @click='img => sizeImg(img.target)'
              controls="controls"
              class='img_slider'>
              <source :src='file.path' >
            </video>
          </div>
          <div class="right_button"  @click='swapMedia("r")'>&#8594;</div>

        </div>
      </div>
    </div>
</template>

<script>
import { isEmpty } from 'lodash';
import {photoPreloadUrl} from '@/js/';
import PATH_TO_SERVER from '@/js/path';

export default {
  // data = {name, path, (banned*)}
  props: ['data', 'width', 'static', 'width_main'],
  data() {
    return {
      files: [],
      file: {},
      fPoz: 0
    }
  },
  methods: {
    swapMedia(ate = 'r') {
      if(isEmpty(this.file)) {
        this.fPoz = 0;
        this.file = this.files[this.fPoz];
        return 0;
      }
      if(ate == 'r' && this.fPoz + 1 <= this.files.length -1) {
        this.fPoz++;
        this.file = this.files[this.fPoz];
      } 
      if(ate == 'l' && this.fPoz - 1 >= 0) {
        this.fPoz--;
        this.file = this.files[this.fPoz];
      } 
    },
    sizeImg(img) {
      img.parentElement.classList.toggle('all_size_block');
      if(img.parentElement.classList.contains('all_size_block'))
        img.parentElement.style = "width: 100%";
      else
        img.parentElement.style = this.$props.width;
      img.classList.toggle('all_size_img');
    }
  },
  async mounted() {
    if (!this.$props.data) return 0;

    // Принимает параметры name, path, (banned*)
    let ava;
    for (const file of this.$props.data) {
      if (file?.banned) continue;
      if (file?.path?.indexOf('_archive_', 1) != -1) continue;

      photoPreloadUrl(file, res => {
        if(res.type == 'movi' || res.type == 'img') {
          if(this.$props.static)
            this.files.push({ path: file.path, type: res.type, name: file.name });
          else
            this.files.push({ path: PATH_TO_SERVER + file.path, type: res.type, name: file.name });

          if (file.ava) ava = file;
        }
      }, true);
    }

    if (ava) {
      let findItem;
      this.files = this.files.filter(el => {
        if (el.name == ava.name) findItem = el;
        return el.name !== ava.name;
      });
      this.files.unshift(findItem);
    }

    this.swapMedia('l')
  }
}
</script>

<style scoped>
.slider_main {
  width: 100%;
  height: 250px;
  margin-bottom: 5px;
  display: flex;
}
.img_slider {
  height: 250px;
  margin: 0 auto;
  left: 0;
  right: 0;
  max-width: 97%;
} 
.left_button, .right_button {
  font-weight: bold;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content:center;
  user-select: none;
  cursor: pointer;
  height: 250px;
  width: 70px;
  background-color: rgb(168, 168, 168);
  z-index: 3;
  opacity: 0.5;
}
.left_button:hover, .right_button:hover {
  background-color: rgb(53, 53, 53);
}
.img_content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.img_folder {
  position: absolute;
  width: 434px;
  display: flex;
}
.all_size_block {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  background-color: black;
  z-index: 4;
}
.all_size_img {
  height: 100%;
}
</style>