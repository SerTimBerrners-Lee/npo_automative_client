<template>
    <div class='main_product_block'>
        <div class='block_product'>
             <h3>Изделия</h3>
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
                    <tr>
                        <td colspan="3">
                            <Search 
                                :placeholder="'Поиск по Артиклу'"
                                @unmount='keySearch' 
                            />
                        </td>
                    </tr>
                    <tr v-for='product in allProduct' 
                        :key='product'
                        class='td-row'
                        @click='e => setProduct(product, e.target.parentElement)'
                        >
                        <td>{{ product.fabricNumber }}</td>
                        <td>{{ product.articl }}</td>
                        <td>{{ product.name }}</td>
                    </tr>
                    <tr v-for="item in 40" :key="item">
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
                </div>
            </div>
            <div class="btn-control">
                <p>
                    <button class="btn-small btn-add" @click='create'>Создать</button>
                    <button class="btn-small btn-add" @click='createCopy'>Создать копированием</button>
                    <button class="btn-small" @click='editProduct'>Редактировать</button>
                </p>
                <p>
                    <button class="btn-small" @click='deleteProduct'>В архив</button>
                </p>
            </div>
        </div>
        
        <div class="right_info_block" v-if='selecteProduct'>
        <div class="block">
            <h3>Краткая Информация о сборочной единице</h3>
            <p>
            <span class="title_span">Наименование: </span><span>{{ selecteProduct.name }}</span>
            </p>
            <!-- <MediaSlider v-if='equipment.documents.length' :data='equipment.documents' :key='equipment.documents' /> -->
            <div>
            <span>Описание / Примечание</span>
            <textarea style="width: 90%; height: 120px;" cols="30" rows="10" :value='selecteProduct.description'> </textarea>
            </div>
            <div v-if='selecteProduct.documents.length > 0'>
                <h3>Документы</h3>
                <table style="width: 100%;">
                    <tr>
                        <th>Файл</th>
                    </tr> 
                    <tr class="td-row" v-for='doc in selecteProduct.documents' :key='doc' @click='setDocs(doc)'>
                        <td>{{ doc.name }}</td>
                    </tr>
                </table>
                <div class="btn-control">
                <button class="btn-small" @click='openDock'>Открыть</button>
                </div>
                <OpensFile 
                    :parametrs='itemFiles' 
                    v-if="showFile" 
                    @unmount='openFile'
                    :key='keyWhenModalGenerateFileOpen'
                />
            </div> 
        </div>
        </div>
    </div>
</template>
 
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Search from '@/components/search.vue'
import OpensFile from '@/components/filebase/openfile.vue'
import { random } from 'lodash'

export default {
    data() {
        return {
            selecteProduct: null,
            tr: null,

            itemFiles: null,
            showFile: false,
            keyWhenModalGenerateFileOpen: random(1, 23123)
        }
    },
    computed: mapGetters(['allProduct']),
    components: {Search, OpensFile},
    methods: {
        ...mapActions(['getAllProduct']),
        ...mapMutations([]),
        setProduct(product, e) {
            this.selecteProduct = product
             if(this.tr) 
                this.tr.classList.remove('td-row-all')
            
            this.tr = e
            this.tr.classList.add('td-row-all')
        },
        editProduct() {
            if(!this.selecteProduct)
                return 0

            // this.$router.push({path: '/detal/edit/false'})
        },
        create() {
            this.$router.push('/createproduct')
        },
        createCopy() {
            if(!this.selecteProduct)
                return 0

            // this.$router.push({path: '/detal/edit/true'})
        },
        keySearch(v) {
                console.log(v)
        },
        deleteProduct() {
            if(!this.selecteProduct)
                return 0
        },
        setDocs(dc) {
            this.itemFiles = dc
            this.showFile = true
            this.keyWhenModalGenerateFileOpen = random(1, 23123)
        },

    },


    async mounted() {
        this.getAllProduct()
    }
}
</script>

<style scoped>
    .block_cb_ed {
        width: 870px;
    }
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
    .block_product {
        width: 400px;
    }
    .right_info_block {
        width: 400px;
    }
    .main_product_block {
        display: flex;
    }
    .right_info_block {
        margin:10px;
        margin-top: 70px;
    }

</style>