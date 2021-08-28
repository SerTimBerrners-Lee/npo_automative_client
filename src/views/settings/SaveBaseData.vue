<template>
    <div>
        <h3>Сохранение баз данных, настроек, истории действий</h3>
        <div class="block">
            <span class="span_db">Делать резервную копию базы данных каждые: </span>
            <select name="save_time_db" id="db_save">
                <option>12 ч</option>
                <option>24 ч</option>
                <option>2 д</option>
                <option>4 д</option>
                <option>6 д</option>
                <option>8 д</option>
                <option>12 д</option>
                <option>Никогда</option>
            </select>
            <br>
            <button class="btn blues">Генерировать новую копию сейчас</button>
        </div>
        <div class="db-date-block">
            <span class="span_db">Список резервных копий:</span>
            <div class="card g1">
                <div>
                    <img class="img-to-card" src="@/assets/img/db_photo.webp" alt="db">
                    <span class="date-span-db">
                        29.08.2021
                    </span>
                </div>
                <div>
                    <div>
                        Запустить 
                    </div>
                    <div>
                        Уничтожить 
                    </div>
                </div>
            </div>
            <div class="card g4">
                <div>
                    <img class="img-to-card" src="@/assets/img/db_photo.webp" alt="db">
                    <span class="date-span-db">
                        30.08.2021
                    </span>
                </div>
                <div>
                    <div>
                        Запустить 
                    </div>
                    <div>
                        Уничтожить 
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#db_save {
    margin-top: 20px; 
    border: 1px solid #d3d3d3;
}
.span_db {
    font-weight: bold;
    font-size: 16px;
    width: 100%;
 }
 .block {
     width: 400px;
     padding: 20px;
     margin-top: 20px;
 }
 .img-to-card {
     height: 90px;
     width: 70px;
 }
 .card {
     display: flex;
     flex-direction: row;
     flex-wrap: nowrap;
     width: max-content;
     border-radius: 10px;
     padding: 20px;
     margin: 20px;
     cursor: pointer;
     user-select: none;
     box-shadow: 1px 1px 8px 1px #d3d3d3;
     background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%);
 }
 .card>div {
     display: flex;
    flex-direction: column;
    padding: 10px;
 }
 .card>div div {
    margin: 5px;
    width: 100px;
    border-radius: 39px;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
 }
 .date-span-db {
     margin-top: 5px;
     font-size: small;
 }
 .card>div:first-child {
     display: flex;
     justify-content: center;
     align-items: center;
 }
 .db-date-block {
     margin-top: 25px;
 }
 .g1>div div{
     box-shadow: 5px -1px 5px -2px #00C9FF;
 }
  .g1>div div:hover {
     box-shadow: 5px -1px 15px -2px #00C9FF;
 }
 .g4 {
     background: linear-gradient(90deg, #efd5ff 0%, #515ada 100%);
 }
.g4>div div{
     box-shadow: 5px -1px 5px -2px #515ada;
 }
.g4>div div:hover {
     box-shadow: 5px -1px 15px -2px #515ada;
 }
</style>