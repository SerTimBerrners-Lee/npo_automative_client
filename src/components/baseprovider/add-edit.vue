<template>
    <div>
        <h3>Создать поставщика</h3>
        <div class="block">
            <span>Наименование:</span>
            <input class="input_name" type="text" v-model="obj.name">
            <span>ИНН:</span>
            <input type="text" v-model="obj.inn">
            <span>КПП:</span>
            <input type="text" v-model="obj.cpp">
        </div>
        <div class="main_content">
            <div class="left_content">
                <div>
                    <h3>Реквизиты</h3>
                    <table class="recvizits"> 
                        <tr>
                            <th>Юр. адрес</th>
                            <td class='td-row' ref='adress' contenteditable></td>
                        </tr>
                        <tr>
                            <th>Телефон</th>
                            <td class='td-row' ref='phone' contenteditable></td>
                        </tr>
                        <tr>
                            <th>Сайт</th>
                            <td class='td-row' ref='site' contenteditable></td>
                        </tr>
                        <tr>
                            <th>Эл.почта</th>
                            <td class='td-row' ref='email' contenteditable></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3>Контакты</h3>
                    <table class="recvizits">
                        <tr class="td-row" v-for="(cont, index) in obj.contact" :key="cont" @click="getContact(cont, index)">
                            <th v-text='cont.initial'></th>
                            <td v-text='cont.description'></td>
                        </tr>
                    </table>
                    <div class="btn-control">
                        <button class="btn-small" @click="delContact" v-if="contact">Удалить</button>
                        <button class="btn-small btn-add" @click="addContact">Добавить</button>
                    </div>
                </div>
                <div>
                    <h3>Описание / Примечание</h3>
                    <textarea v-model="obj.description" cols="30" rows="10"></textarea>
                </div>
            </div>

            <div class="right_content">
                <div>
                    <h3>Документы</h3>
                </div>
                <h3>Поставляемый материал</h3>
                <div class="scroll-table">
                    <table class="material_post_table">
                        <tr>
                            <th>Тип</th>
                            <th>Подтип</th>
                            <th>Материал</th>
                        </tr>
                        <tr v-for="i in 40" :key="i">
                            <td>...</td>
                            <td>...</td>
                            <td>...</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
             <div class="edit-save-block block">
                <button class="btn-status" @click="$router.push('/baseprovider')">Отменить</button>
                <button class="btn-status btn-black" @click='addProvider'>Сохранить</button>
            </div>
            <AddContact 
                :key='keyModal'
                @unmount='unmount'
                v-if="isShow"
            />
    </div>
</template>
<script>

import AddContact from './add-contact.vue';
import { random } from 'lodash';
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            obj: {
                name: '',
                inn: '',
                cpp: '',
                description: '',
                contact: [],
            },
            keyModal: random(1, 2313123123213),
            isShow: false,
            contact: null
        }
    },
    components: {AddContact},
    methods: {
        ...mapActions(['addOneProvider']),
        unmount(data) {
            if(!data)
                return 0;
            this.obj.contact.push({...data})
        },
        addContact() {
            this.keyModal = random(1, 2312312312312)
            this.isShow = true
        },
        getContact(cont, index) {
            this.contact = { cont, index }
        },
        delContact() {
            if(!this.contact) return 0;
            this.obj.contact = this.obj.contact.filter((a, index) => index != this.contact.index)
        },
        addProvider() {
            let adress = this.$refs.adress.textContent
            let phone = this.$refs.phone.textContent
            let site = this.$refs.site.textContent
            let email = this.$refs.email.textContent
            this.addOneProvider({
                adress,
                phone,
                site,
                email,
                ...this.obj
            })
        }
    }
}
</script>

<style scoped>
    .block{
        width: 1050px;
    }
    .block * {
        margin: 5px;
    }
    .input_name {
        width: 310px;
    }
    .recvizits td {
        width: 400px;
    }
    .recvizits th {
        width: 169px;
    }
    textarea {
        width: 100%;
    }
    .left_content {
        width: 600px;
    }
    .right_content {
        width: 600px;
        margin-left: 40px;
    }
    .main_content {
        display: flex;
        margin-bottom: 50px;
    }
    .material_post_table th, td{
        width: 33%;
    }
    .material_post_table {
        width: 100%;
    }
    .scroll-table{
        width: 100%;
        height: 450px;
    }
</style>