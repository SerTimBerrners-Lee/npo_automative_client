<template>
    <div>
        <h3>База деталей</h3>
            <img style='position: fixed ;
                z-index: 12;
                width: 700px;
                margin: 0 auto;
                left: 0;
                right: 0;' 
                src="@/assets/img/unnamed.jpg" 
                alt="На реставрации ">
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
                    <td>001-1</td>
                    <td>ШВ70-300</td>
                    <td>Выпрессовщик шкворней 70тонн с тележкой и п/г насосом</td>
                </tr>
            </table>
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
                <tr>
                    <td>СБ 125672537612367</td>
                    <td>Набор отправок </td>
                    <td>2</td>
                </tr>
                 <tr v-for="item in 42" :key="item">
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
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
                    <td>234324234234</td>
                    <td>Шток</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>234324234234</td>
                    <td>Шток</td>
                    <td>1</td>
                </tr>
                <tr v-for="item in 42" :key="item">
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </div>
        <div class="btn-control">
               <p>
                    <button class="btn-small btn-add">Создать</button>
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
        width: 440px;
    }
    .table-base-detal tr {
        height: 65px;
    }
    .scroll-table {
        height: 600px;
        width: 1345px;
    }
    .tb-title {
        height: 50px;
        text-align: center;
    }
    .btn-control {
        width: 1340px;
        flex-direction: column;
        align-items: flex-end;
    }
    .btn-control button {
        margin: 2px;
    }
</style>