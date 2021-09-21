<template>
    <div class="conten main-block"> 
        <div class="items_1">
            <img src="@/assets/logo.png" alt="logo" class="logo">
            <div>
                <h2>Система</h2>
                <h2>Эффективного</h2>
                <h2>Производства</h2> 
            </div>
        </div>
        <div class="items_2">
            <div class="form-auth">
                <div class="item-form">
                    <h2>Вход в систему</h2>

                    <label for="tabel">Табельный номер</label>
                    <select name="tabel" id="tabel" 
                        v-model="selectTabel"
                        @change="changeTabelUser">
                        <option v-for="user in getUsers" :key="user" >
                            {{  user.tabel }}
                        </option>
                    </select> 
                    
                    <label for="initial">Логин</label>
                    <select name="initial" id="initial" 
                        v-model="selectLogin"
                        @change="changeSelectUser">
                        <option v-for="user in getUsers" 
                            :key="user" >
                            {{ user.login }}
                        </option>
                    </select> 

                    <label for="password">Пароль</label>
                    <input class="input-auth" type="password" name="password" id="password" ref="input_password">

                    <button type="submit" class="btn blues" @click="checkedUser">Войти</button>

                    <p class="tabel-placholder"> {{ strTabels.length ? strTabels : "Начните вводить табель"}} </p>
                </div>
                <div class="item-form">
                    <span class="btn-number" v-for="item in 9" :key="item" @click="tabelStrSplit(item)"> 
                        {{ item }}
                    </span>

                    <span class="btn-number" v-for="item in 2" :key="item * 20" @click="tabelStrSplit(item == 1 ? 'del' : 0)"> 
                        {{ item == 1 ? 	'&#8592;' : 0 }}
                    </span>

                    <span class="btn-number" @click="tabelSearch" > 
                        ВВОД
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

import { mapGetters, mapActions }from 'vuex'
export default {
    name: 'Authorization',
    props: {
        msg: String
    },
    computed: mapGetters(['getUsers']),
    data() {
        return {
            selectTabel: null,
            selectLogin: null,
            strTabels: "",
            flagsBlocingInput: false
        }
    },
    methods: {
        ...mapActions(['getAllUsers']),
        changeTabelUser() {
            this.getUsers.forEach((user) => {   
                if(user.tabel == this.selectTabel) {
                    this.selectLogin = user.login
                }
            })
        },
        changeSelectUser() {
            this.getUsers.forEach((user) => {   
                if(user.login == this.selectLogin) {
                    this.selectTabel = user.tabel
                }
            })
        },

        tabelStrSplit(num) {
            if (this.flagsBlocingInput)
                return

            if(num === 'del') {
                if(this.strTabels.length)
                    this.strTabels = this.strTabels.substr(0, this.strTabels.length - 1)
                
                return 
            }
            this.strTabels += num

        },
        tabelSearch() {
            this.$refs.input_password.focus()

            
            this.getUsers.forEach((user) => {   
                if(user.tabel == this.strTabels) {
                    this.selectTabel = user.tabel
                    this.selectLogin = user.login
                }
            })


            this.flagsBlocingInput = true
            setTimeout(() => {
                this.strTabels = "";
                this.flagsBlocingInput = false
            }, 1500)
        },
        checkedUser() {
            this.$emit('checked', true)
        }
    },
    async mounted() {
        await this.getAllUsers()

        if(this.getUsers.length) {
            this.selectLogin = this.getUsers[0].login
            this.selectTabel = this.getUsers[0].tabel
        }
    }
}
</script>

<style>
h2 {
    color: #ffffff;
    margin: 2px; 
    font-size: 36px;
}

.conten {
    display: flex;
    background: #2f2e33;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    margin-left: 0px;
    padding-top: 20px;
    padding-left: 10px;
}


.items_1 {
    display: flex;
    height: 150px;
}

.items_1 > div {
    display: flex;
    flex-direction: column;
}

.form-auth div:first-child {
    border: 1px solid aliceblue;
    border-radius: 4px;
    height: 450px;
    display: flex;
    flex-direction: column;
    padding: 10px;  
    margin-top: 20px;
}

 select{
    height: 40px;
    width: 300px;
    margin: 6px;
    margin-top: 0px;
    border-radius: 5px;
    border: none;
    font-size: 22px;
    padding-left: 8px;
}

.input-auth {
    height: 40px;
    width: 290px;
    border-radius: 5px; 
    background-color: #e6e6e6;
    border: none;
    padding: 0px;
    padding-left: 10px;
    margin: 6px;
    margin-top: 0px;
}

label {
    margin: 6px;
    margin-bottom: 3px;
    font-size: 11px;
    font-weight: bold;
    color: #ececec;
    margin-top: 25px;
    margin-left: 8px;
}

.btn {
    height: 40px;
    width: 300px;
    margin: 6px;
    border: none;
    border-radius: 5px;
    margin-top: 25px;
    cursor: pointer;
}

.blues {
    background-color: #18a0fb;
    font-size: 16px;
    color: #ececec;
}

.form-auth div:first-child h2{
    font-size: 23px;
    font-weight: normal;
    padding-bottom: 25px;
}

.form-auth {
    display: flex;
    margin-top: 180px;
    margin-left: 130px;
}

.form-auth div:last-child {
    display: flex;
    margin-left: 30px;
    flex-wrap: wrap;
    width: 400px;
} 

.btn-number {
    border: 1px solid aliceblue;
    border-radius: 4px;
    height: max-content;
    color: #ececec;
    font-size: 25px;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 20px;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.btn-number:hover {
    background-color: #fff;
    color: black;
}

.blues:hover {
    background-color: #35aeff;
}

.tabel-placholder {
    text-align: center;
    color: white;
    font-weight: bolder;
}
</style>