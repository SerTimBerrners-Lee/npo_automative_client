<template>
<div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
        <div :class='destroyModalRight'>
           <div :style="hiddens">
              
               
                <div>
                    <h3>База деталей</h3>
                    <div class="main_table_control">
                        <div class="scroll-table" >
                        <table class="table-base-detal">
                            <tr>
                                <th colspan="3" scope="col">Изделие</th>
                            </tr>
                            <tr>
                                <th>Заводской номер</th>
                                <th>Артикул</th>
                                <th>Наименование</th>
                            </tr>
                            <tr >
                                <td class="tb-title" colspan="3" scope="col"> Без назначенного изделия </td>
                            </tr> 
                            <tr v-for="item in 40" :key="item">
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </table>
                        </div>
                        <div class="scroll-table" >
                            <table class="table-base-detal">
                                <tr>
                                    <th colspan="3" scope="col">Сборочная единица (Тип СБ)</th>
                                </tr>
                                <tr>
                                    <th>Артикул</th>
                                    <th>Наименование</th>
                                    <th>Кол-во СБ на Изделие</th>
                                </tr>
                                <tr>
                                    <td class="tb-title" colspan="3" scope="col">Баз назначенного СБ</td>
                                </tr>
                                <tr v-for="item in 42" :key="item">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                        <div class="scroll-table" >
                            <table class="table-base-detal">
                                <tr>
                                    <th colspan="3" scope="col">Деталь (Тип Д)</th>
                                </tr>
                                <tr>
                                    <th>Артикул</th>
                                    <th>Наименование</th>
                                    <th>Кол-во Д на СБ</th>
                                </tr>   
                                <tr>
                                    <td colspan="3">
                                        <Search 
                                            @unmount='keySearch' 
                                        />
                                    </td>
                                </tr>
                                <tr 
                                    v-for='detal in allDetal' 
                                    :key='detal'
                                    class='td-row'
                                    @click='e => setDetals(detal, e.target.parentElement)'
                                    >
                                    <td>{{ detal.articl }}</td>
                                    <td>{{ detal.name }}</td>
                                    <td>...</td>
                                </tr>
                                <tr v-for="item in 42" :key="item">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                     <div class="btn-control" v-if='idFile'>
                            <p>
                                <button class="btn-small btn-add"
                                        @click='responsDetal'>
                                    Выбрать
                                </button>
                            </p>
                    </div>
                    <div class="btn-control" v-if='!idFile'>
                        <p>
                                <button class="btn-small btn-add" @click='$router.push("/detal/add")'>Создать</button>
                                <button class="btn-small btn-add">Создать копированием</button>
                                <button class="btn-small" @click='editDetal'>Редактировать</button>
                        </p>
                        <p>
                            <button class="btn-small" @click='deleteDetal'>В архив</button>
                        </p>
                    </div>
                    <DetalModal
                        :key='detalModalKey'
                        v-if='detalIsShow'
                    />
                </div>
                   
               
           </div>
        </div>
</div> 
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'
import DetalModal from '@/components/basedetal/detal-modal.vue';
import { random } from 'lodash';
import Search from '@/components/search.vue'

export default {

  props: ['techProcessID', 'idFile'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',
      
        selectedDetal: null,
        tr: null,
        detalModalKey: random(1, 123e2),
        detalIsShow: false
    }
  },
  computed: mapGetters(['allDetal']),
  components: {DetalModal, Search},
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    ...mapActions(['getAllDetals', 'deleteDetelyId']),
    ...mapMutations(['addOneSelectDetal', 'filterDetalToArticle']),
    setDetals(detal, e) {
        this.selectedDetal = detal
            if(this.tr) 
            this.tr.classList.remove('td-row-all')
        
        this.tr = e
        this.tr.classList.add('td-row-all')
        this.addOneSelectDetal(this.selectedDetal)

        this.detalModalKey = random(1, 34e5)
        this.detalIsShow = true
    },
    editDetal() {
        if(!this.selectedDetal)
            return 0

        this.$router.push("/detal/edit")
    },
    keySearch(v) {
        setTimeout(() => {
            this.filterDetalToArticle(v)
        }, 
        500)
    },
    deleteDetal() {
        if(!this.selectedDetal)
            return 0
        this.deleteDetelyId(this.selectedDetal.id)
    },
    responsDetal() {
        if(!this.selectedDetal)
            return 0
        this.$emit("responsDetal", this.selectedDetal)
        this.destroyModalF()
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'

    this.getAllDetals()
  }
}
</script>

<style scoped>
    .table-base-detal {
        float: left;
        width: 400px;
    }
    .table-base-detal tr {
        height: 65px;
    }
    .scroll-table {
        height: 600px;
        
    }
    .tb-title {
        height: 50px;
        text-align: center;
    }
    .btn-control {
        width: 1260px;
        flex-direction: column;
        align-items: flex-end;
    }
    .btn-control button {
        margin: 2px;
    }
    table {
        font-size: 14px;
    }
    .main_table_control {
        display: flex;
    }
    
.content-modal-right-menu-hidden {
    animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
    animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
    animation: width 1s 1 ease;
    height: 10000px;
    width: 70%;
}
.left-block-modal {
    width: 30%;
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
        width: 70%;
    }
}
@keyframes width-right {
    from {
        width: 0%;
    }
    to {
        width: 30%;
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