<template>
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
        <div class="btn-control">
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
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import DetalModal from '@/components/basedetal/detal-modal.vue';
import { random } from 'lodash';
import Search from '@/components/search.vue'

export default {
    data() {
        return {
            selectedDetal: null,
            tr: null,
            detalModalKey: random(1, 123e2),
            detalIsShow: false
        }
    },
    computed: mapGetters(['allDetal']),
    components: {DetalModal, Search},
    methods: {
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
        }

    },


    async mounted() {
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

</style>