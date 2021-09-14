<template>
    <div class="main-dive">
        <h3>База непроизводственной техники и инвентаря (типы и подтипы)</h3>
        <img style='position: fixed ;
                z-index: 12;
                width: 700px;
                margin: 0 auto;
                left: 0;
                right: 0;' 
                src="@/assets/img/unnamed.jpg" 
                alt="На реставрации ">
        <div class="cont">
            <div class="cont scroll-table scrolls-type-490">
                <table class="type-table">
                    <tr>
                        <th class="width-350">Тип</th>
                    </tr>
                    <tr class="td-row" v-for="i in 20" :key="i">
                        <td>...</td>
                    </tr>
                </table>
            </div>
            <div class="btn-control">
                <button class="btn-add btn-small">Создать</button>
                <button class="btn-small">Редактировать</button>
                <button class="btn-small">Удалить</button>
            </div>
        </div>
        <div class="cont">
            <div class="cont scroll-table scrolls-type-490">
                <table class="type-table">
                    <tr>
                        <th class="width-350">Подтип</th>
                    </tr>
                    <tr class="td-row" v-for="i in 20" :key="i">
                        <td>...</td>
                    </tr>
                </table>
            </div>
            <div class="btn-control">
                <button class="btn-add btn-small">Создать</button>
                <button class="btn-small">Редактировать</button>
                <button class="btn-small">Удалить</button>
            </div>
        </div>
    </div>
</template>