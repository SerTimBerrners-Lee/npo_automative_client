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
                    <button class="btn-small">Редактировать</button>
               </p>
                <p>
                    <button class="btn-small">В архив</button>
                </p>
        </div>
    </div>
</template>

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