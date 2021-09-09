<template>
    <div class="main-dive">
        <h3>База инструмента и оснастки (типы и подтипы)</h3>
        <div class="cont">
            <TableMaterial :title='"Тип (инструмента или оснастки)"' 
                :arrayItem="allTInstrument" 
                :type='"T"' 
                @clickMat="clickMat"/>
            <div class="btn-control">
                <button class="btn-add btn-small" @click='create("TYPE")'>Создать</button>
                <button class="btn-small"  @click='edit("TYPE", "edit")'>Редактировать</button>
                <button class="btn-small" @click='remove("TYPE")'>Удалить</button>
            </div>
        </div>
        <div class="cont">
            <TableMaterial :title='"Подтип"' 
                :arrayItem="allPTInstrument" 
                :type="'PT'" 
                @clickMat="clickMat"/>
            <div class="btn-control">
                <button class="btn-add btn-small" @click='create("PODTYPE")'>Создать</button>
                <button class="btn-small" @click="edit('PODTYPE', 'edit')">Редактировать</button>
                <button class="btn-small" @click="remove('PODTYPE')">Удалить</button>
            </div>
        </div>
        <addEditOborudovanie
                @unmount='unmount' 
                :parametrs='parametrs' 
                v-if='showIs'
                :key='keyModals' />
    </div>
</template>

<script>
import TableMaterial from '@/components/mathzag/table-material.vue'
import addEditOborudovanie from '@/components/oborudovanie/add-edit-oborudovanie.vue'
import { mapGetters } from 'vuex'
import { random } from 'lodash'

export default {
    data() {
        return{
            showIs: false,
            parametrs: null,
            keyModals: random(20, 2132356723547632),
        }
    },
    computed: mapGetters(['allTInstrument', 'allPTInstrument']),
    components: {addEditOborudovanie, TableMaterial},
    methods: {
        unmount(res) {
            if(!res)
                return 0
            // if(res.type == "TYPE") {
            //     // Добавляем тип
            // }
            // if(res.type = "PODTYPE") {
            //     // Добавляем под тип
            // }
        },
        clickMat(material) {
            console.log(material)
        },
        create(instrument, type = 'create') {
            this.parametrs = {
                instrument, 
                type
            },
            this.keyModals = random(2, 123123123123123)
            this.showIs = true
        }
    },
    async mounted() {

    }
}
</script>