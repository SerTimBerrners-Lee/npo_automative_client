<template>
    <div>
        <div class="table-content">
        <h3 class="h3-title">1. Сотрудники</h3>
        <div class="type-issue">
            <span @click="knowGet = !knowGet" 
                    v-if="getUserBan.length > 0">{{ knowGet ? 'Архив: '+getUserBan.length : 'Активные пользователи: '+getUsers.length}}</span>
        </div>
            <div class="scroll-table" style="height: 450px;">
            <table> 
                <tr>
                    <th>Табельный номер</th>
                    <th>Должность</th>
                    <th style="width: 300px;">Инициалы</th>
                </tr>
                <tr class="td-row" 
                    v-for="user in knowGet ? getUsers : getUserBan" 
                    :key="user" @click="e => userShow(user, e.target.parentElement)"
                    >
                    <td class="tabel-td">{{ user.tabel }}</td>
                    <td>{{ user.role ? user.role.description : '' }}</td>
                    <td> {{ user.initial }}</td>
                </tr>
                <tr class="td-row"  v-for="iten in 70" :key="iten">
                    <td style='height: 10px;'></td> 
                    <td></td>
                    <td></td>
                </tr>
            </table> 
            </div>
            <div class="btn-control" v-if='getRoleAssets && !getRoleAssets.assets.usersListAssets.read'>
                <button 
                    @click="userBan"
                    class='btn-small' > 
                    {{ knowGet ? 'В архив' : 'В Активные' }}
                </button>
                <button 
                    @click="editUser"
                    class='btn-small'>
                    Редактировать</button>
                <button 
                    @click="addUser"
                    class='btn-small btn-add'>
                    Добавить
                </button>
            </div>
        </div>
        <div class="inform-content" v-if='getRoleAssets && getRoleAssets.assets.usersListAssets.hideUserData'>
            <h3 class="initial-user">{{ initial }}</h3>
            <div class="inform-block">
                <div class="contact-inform">
                    <div class="data-user-form">
                        <div class="prim">
                            <p class="p-1">
                            <span>Должность: </span>
                            <input type="text" :value='roles'>
                            <span>Табельный номер: </span>
                            <input type="text" :value='tabel'>
                            </p>
                            <p class="p-2">
                                <span>Дата приема на работу: </span>
                                <input type="text" :value='dateWork'>
                            </p>
                            <p class="p-3">
                                <span>Логин: </span>
                                <input type="text" :value='login'>
                                <span>День рождения: </span>
                                <input type="text" :value='birthday'>
                            </p>
                            <h3>Контактные данные</h3>
                            <p class="p-4">
                                <span>Моб. телефон: </span>
                                <input type="text" :value='phone'>
                            </p> 
                            <p class="p-5">
                                <span>Постоянный адрес проживания: </span>
                                <input type="text" :value='adress'>
                            </p>
                            <p class="p-6">
                                <span>Адрес по прописке: </span>
                                <input type="text" :value='adressProps'>
                            </p>
                        </div>
                        <h3>Примечание</h3>
                        <textarea class="textarea-har" cols="30" rows="10" v-text='primetch'></textarea>
                    </div>
                </div>
                <div class="har-inform">
                    <div class="ava-block">
                        <img :src='image' alt="аватарка"/>
                            <h3>Роль пользователя</h3>
                            <h3>Оборот ТМЦ</h3>
                    </div>
                    <div class="ava-right-block">
                        <h3 style='margin-top: 0px;'>Характеристика</h3>
                        <textarea class="textarea-har" cols="30" rows="10" v-text='haracteristic'></textarea>
                        <h3>Документы</h3>
                        <table>
                            <tr>
                                <th>Файл</th>
                            </tr>
                            <tr class="td-row" v-for="document in documents" :key="document">
                                <td @click="openNewWindow(document.path)"> {{ document.name }}</td>
                            </tr>
                        </table>
                        <button class='btn-small'>Скачать</button>
                        <button class='btn-small'>Открыть</button>
                    </div>
                </div>
            </div>
            <div class="working-block">
                <h3>Объем выполненных работ</h3>
                <div class="result-work">
                    <span>Дата: </span>
                    <input type="text" class="calendar-input">
                    <span>Выбрать период, с: </span>
                    <input type="text" class="calendar-input">
                    <span>по: </span>
                    <input type="text" class="calendar-input">
                    <button class='btn-small'>Сбросить фильтр</button>
                </div>
                <div class="scroll-table" style="height: 190px; margin-left: 10px;">
                    <table >
                        <tr>
                            <th>Дата</th>
                            <th>№ Заказа</th>
                            <th>Изделие</th>
                            <th>Операция</th>
                            <th>Норма ч.</th>
                            <th>Кол-во, ч.</th>
                            <th>Итого, ч.</th>
                        </tr>
                        <tr v-for="iten in 6" :key="iten" class="td-row">
                            <td>13.05.2021</td>
                            <td>18-225</td>
                            <td>Выпрессовщик сайдендблоков ВСГ25</td>
                            <td>Заготовительная</td>
                            <td>5</td>
                            <td>4</td>
                            <td>8</td>
                        </tr>
                        <tr>
                            <th colspan="5" scope="colgroup" style="border: none;"></th>
                            <th colspan="1" scope="colgroup">Итого, ч:</th>
                            <th colspan="1" scope="colgroup">46</th>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <InformFolder v-if='showInformPanel' :title='titleMessage' :message='message' :type='type'  :key='keyInformTip' />
    </div>
</template>

<script>
import {  mapActions, mapGetters, mapMutations } from 'vuex'
import showMessage from '@/js/inform_folder.js';
import InformFolder from '@/components/InformFolder.vue'
import PATH_TO_SERVER from '@/js/path.js'

export default {
    data() {
        return {
            knowGet: true,
            titleMessage: '',
            message: '',
            type: '',
            showInformPanel: false,
            keyInformTip: '',
            initial: '',
            tabel: '',
            adress: '',
            adressProps: '',
            dateUnWork: '',
            dateWork: '',
            email: '',
            haracteristic: '',
            image: '',
            login: '',
            password: '',
            phone: '',
            primetch: '',
            birthday: '',
            roles: '',
            id: '',

            span: null
        }
    }, 
    computed: mapGetters(['getUsers', 'getUserBan', 'getSelectedUser', 'getRoleAssets', 'getAuth']),
    components: {
        InformFolder
    },
    methods: {
        ...mapActions(['getAllUsers', 'banUserById']),
        ...mapMutations(['selectedUser']),
        userShow(user, e = null) {
            if(user) {
                this.roles = user.role ? user.role.description : '' 
                this.initial = user.initial
                this.tabel = user.tabel
                this.adress = user.adress
                this.adressProps = user.adressProps
                this.dateUnWork = user.dateUnWork
                this.dateWork = user.dateWork
                this.email = user.email
                this.haracteristic = user.haracteristic
                this.image = PATH_TO_SERVER + user.image
                this.login = user.login
                this.password = user.password
                this.phone = user.phone
                this.primetch = user.primetch
                this.birthday = user.birthday
                this.id = user.id
                this.documents = user.documents 
            }

            this.selectedUser(user)
            
            if(!e)
                return 
            
            if(this.span)
                this.span.classList.remove('td-row-all')
            this.span = e
            this.span.classList.add('td-row-all')
        },
        userBan() {
            if(!this.id)
                return showMessage('Ошибка', 'Пользователь не выбран', 'w', this)

            
            if(this.getRoleAssets && !this.getRoleAssets.assets.usersListAssets.writeSomeone) 
                return showMessage('', 'Недостаточно прав', 'w', this)
            this.banUserById(this.id).then(mes => {
                showMessage('', mes.message, mes.type, this)
                if(mes.type == 's') 
                    this.getAllUsers()
            })
        },
        openNewWindow(url) {
            window.open(PATH_TO_SERVER + url, '_blank')
        },
        editUser() {
            if(!this.getSelectedUser) 
                return 0
            
            if(this.getRoleAssets && this.getRoleAssets.assets.usersListAssets.writeSomeone)
                this.$router.push({path: `/employee/edit/edit`})
            else if(this.getRoleAssets && !this.getRoleAssets.assets.usersListAssets.writeSomeone && this.getRoleAssets.assets.usersListAssets.writeYour) 
                if(this.getAuth && this.getAuth.id == this.getSelectedUser.id)
                    this.$router.push({path: `/employee/edit/edit`})
            else
                return showMessage('', 'Недостаточно прав', 'w', this)
        },
        addUser() {
            if(this.getRoleAssets && this.getRoleAssets.assets.usersListAssets.writeSomeone)
                this.$router.push({path: `/employee/edit/add`})
        }
    },
    async mounted() {
        await this.getAllUsers();
        if(this.getUsers.length)
            this.userShow(this.getUsers[0])
    }
}
</script> 

<style scoped>
table td:first-child {
    text-align: center;
}
.table-content {
    width: max-content;
}
.container>div {
    display: flex;
    flex-direction: row;
}
.container>div>div:last-child {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
}
.initial-user{
    color: #057dff;
}
.p-1 input{
    width: 70px;
}
.p-2 input{
    width: 80px;
}
.p-3 input{
    width: 85px;
}
.p-4 input{
    width: 140px;
}
.p-5 input{
    width: 140px;
}
.p-5, .p-6, .p-4 {
    display: flex;
    justify-content: space-between;
}
.p-6 input{
    width: 140px;
}
input {
    margin-left: 4px;
    margin-right: 4px;
    border: 1px solid #d3d3d3;
    border-radius: 4px;
}
textarea {
    height: 90px;
    width: 400px;
    border: 1px solid #d3d3d3;
    border-radius: 4px;
}
.inform-block {
    display: flex;
    flex-direction: row;
}
.prim {
    border: 1px solid #d3d3d3;
    border-radius: 4px;
    padding: 8px;
}
.prim>p {
    font-size: 14px;
}
.tabel-td {
    width: 60px;
}
.har-inform {
    padding: 2px;
    display: flex;
    flex-wrap: nowrap;
}
.textarea-har {
    width: 300px;
    height: 80px;
}
.ava-block {
    width: 260px;
}
.ava-block>img {
    max-width: 260px;
}
.har-inform>div {
    margin-left: 10px;
}
.har-inform>div:last-child {
    margin-left: 30px;
    width: 300px;
}
.har-inform table {
    width: 300px;
}
.har-inform  button {
    margin: 5px;
    float: right;
}
.working-block {
    width: max-content;
}
table {
    margin-top: 0px;
}
.type-issue>span {
    font-size: 15px;
}
.type-issue {
    display: flex;
    justify-content: end;
}
.h3-title {
    float: left;
    user-select: none;
}
</style>