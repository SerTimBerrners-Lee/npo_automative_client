<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Редактирование заказа склада</h3>
        
        <div class="block two_header">
          <div>
           <p>
            <span>№ Заказа: </span>
            <span>{{ treatment?.number_order || '-' }}</span>
           </p>

            <p>
              <span>{{ type_treatment == 'ass' ? 'Сборка:' : 'Деталь:' }}</span>
              <span v-if='type_treatment == "ass"'>{{ treatment?.cbed?.name || '-' }}</span>
              <span v-else>{{ treatment?.detal?.name || '-' }}</span>
            </p>
          </div>
          <div>
            <p>
              <span>Количество готовых:</span>
              <span>{{ treatment?.kolvo_create }}</span>
            </p>
            <p class='tooltip'>
              <span>Количество заказанных:</span>
              <input 
                type='number'
                v-model='kolvo_shipments' 
                :min='0'/>
              <span class="tooltiptext" style='top: 10px; right: 100px;'>Количество не может быть меньще количества изделий задейственных в Технологических операциях</span>
            </p>
          </div>
        </div>

        <h3>Примечание: </h3>
        <textarea maxlength='250' v-model="description"></textarea>

        <div class="btn-control out-btn-control" >
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
          <button class="btn-status btn-black" @click='save'>Сохранить</button>
        </div>
      </div>
    </div>

    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { showMessage } from '@/js/';
export default {
  props: {
    treatment: {
      type: Object
    },
    type_treatment: {
      type: String
    },
  },
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',   

      titleMessage: '',
      message: '',
      type: '',
      keyInformTip: 0,

      kolvo_shipments: 0,
      description: '',
    }
  },
  methods: {
    ...mapActions([
      'fetchUpdateMetaloworking',
      'fetchUpdateAssemble'
    ]),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    save() {
      const data = {
        kolvo_shipments : this.kolvo_shipments,
        description : this.description
      }

      if(this.type_treatment == 'ass') {
        data['cbed_id'] = this.treatment.cbed?.id;
        data['ass_id'] = this.treatment.id;
        data['ass_type'] = this.treatment.type_izd;
        this.fetchUpdateAssemble(data).then(res => {
          res ? showMessage('', 'Успешно', 's', this) : showMessage('', 'Произошла ошибка при изменении', 'e', this)

          this.$emit('unmount_treatment', this.type_treatment)
          return this.destroyModalF();
        })
      }
      if(this.type_treatment == 'metall') {
        data['detal_id'] = this.treatment.detal?.id;
        data['metal_id'] = this.treatment.id;
        this.fetchUpdateMetaloworking(data).then(res => {
          res ? showMessage('', 'Успешно', 's', this) : showMessage('', 'Произошла ошибка при изменении', 'e', this)

          this.$emit('unmount_treatment', this.type_treatment);
          return this.destroyModalF();
        })
      }
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';

    if(!this.treatment) return this.destroyModalF();
    if(!this.type_treatment) return this.destroyModalF();

    this.kolvo_shipments = this.treatment.kolvo_shipments;
    this.description = this.treatment.description;
  },
}
</script>

<style scoped>
.out-btn-control {
  bottom: 10px;
}
textarea {
  margin: 10px;
  width: 48%;
  height: 120px;
}
.btn-file{
  color: black;
  background: #d3d3d3;
  padding: 6px;
  font-weight: normal;
  font-size: 16px;
  cursor: pointer;
}
.block {
  margin-bottom: 10px;
}
table {
  width: 100%;
}
.two_header * {
  margin:4px;
}
.two_header input{
  width:23%;
}
.two_header  div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.two_header  div>p {
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
  width: 40vw;
}
.left-block-modal {
  width: 60vw;
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
    width: 1vw;
  }
  to {
    width: 40vw;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 60vw;
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
    width: 60vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 50vw;
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