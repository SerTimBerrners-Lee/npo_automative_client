<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <div v-if="parametrs.mat == 'TYPE'">
        <h3>{{ titleapp }} типа материала (тип профиля заготовки)</h3>
        <div class="block">
            <p> 
                <span>Наименование: </span>
                <input type="text" v-model.trim='obj.inputs'>
            </p>
        </div>
        <h4>Характеристики</h4>
        <table style="width: 100%;">
            <tr>
                <th>Наименование</th>
                <th>
                    ЕИ
                </th>
                <th>Значение</th>
            </tr>
            <tr>
                <td  @click='obj.length_permanent = ""'>Длина (L)</td>
                <td>
                    м, мм
                </td>
                <td class="input_znach">
                 <p>
                    <span> Постоянное </span>
                    <input type="radio" value="permanent" v-model="obj.length_permanent">
                  </p>
                 <p>
                    <span> Переменное </span>
                    <input type="radio"  value="variable" v-model="obj.length_permanent">
                 </p>
                </td>
            </tr>
            <tr>
                <td  @click='obj.width_permanent = ""'>Ширина (A)</td>
                <td>
                    м, мм
                </td>
                <td class="input_znach" >
                 <p>
                    <span> Постоянное </span>
                    <input type="radio" value="permanent" v-model="obj.width_permanent">
                  </p>
                 <p>
                    <span> Переменное </span>
                    <input type="radio" value="variable" v-model="obj.width_permanent">
                 </p>
                </td>
            </tr>
            <tr>
                <td @click='obj.height_permanent = ""'>Высота (B)</td>
                <td>
                   м, мм
                </td>
                <td class="input_znach">
                 <p>
                    <span> Постоянное </span>
                    <input type="radio"  value="permanent" v-model="obj.height_permanent">
                  </p>
                 <p>
                    <span>  Переменное </span>
                    <input type="radio" value="variable" v-model="obj.height_permanent">
                 </p>
                </td>
            </tr>
            <tr>
                <td @click='obj.wallThickness_permanent = ""'>Толщина стенки (С)</td>
                <td>
                   мм
                </td>
                <td class="input_znach">
                 <p>
                    <span> Постоянное </span>
                    <input type="radio" value="permanent" v-model="obj.wallThickness_permanent">
                  </p>
                 <p>
                    <span> Переменное </span>
                    <input type="radio" value="variable" v-model="obj.wallThickness_permanent">
                 </p>
                </td>
            </tr>
            <tr>
                <td @click='obj.outsideDiametr_permanent = ""'>Наружный Диаметр (D)</td>
                <td>
                    мм
                </td>
                <td class="input_znach">
                 <p>
                    <span> Постоянное </span>
                    <input type="radio" value="permanent" v-model="obj.outsideDiametr_permanent">
                  </p>
                 <p>
                    <span> Переменное </span>
                    <input type="radio" value="variable" v-model="obj.outsideDiametr_permanent">
                 </p>
                </td>
            </tr>
              <tr>
                <td @click='obj.thickness_permanent = ""'>Толщина </td>
                <td>
                    мм
                </td>
                <td class="input_znach">
                 <p>
                    <span> Постоянное </span>
                    <input type="radio" value="permanent" v-model="obj.thickness_permanent">
                  </p>
                 <p>
                    <span> Переменное </span>
                    <input type="radio" value="variable" v-model="obj.thickness_permanent">
                 </p>
                </td>
            </tr>
            <tr>
                <td @click='obj.areaCrossSectional_permanent = ""'>Площадь сечения (S)</td>
                <td>
                   м2
                </td>
                <td class="input_znach">
                 <p>
                    <span> Постоянное </span>
                    <input type="radio" value="permanent" v-model="obj.areaCrossSectional_permanent">
                  </p>
                 <p>
                    <span> Переменное </span>
                    <input type="radio" value="variable" v-model="obj.areaCrossSectional_permanent">
                 </p>
                </td>
            </tr>
        </table>
        <div class="btn-control out-btn-control">
            <button class="btn-status btn-black" @click='addEditMaterial'>Сохранить</button>
            <button class="btn-status" @click='destroyModalF'>Отменить</button>
        </div>
      </div>
        <div v-if="parametrs.mat == 'PODTYPE'">
        <h3>{{ titleapp }} типа материала (тип профиля заготовки)</h3>
        <div class="block">
            <p style="align-items: center;"> 
                <span>Наименование: </span>
                <input type="text" v-model.trim='obj_podType.inputs'>
            </p>
        </div>
        <h4>Характеристики</h4>
        <table style="width: 100%;">
            <tr>
                <th>Наименование</th>
                <th>
                    ЕИ
                </th>
                <th>Значение</th>
            </tr>
            <tr>
                <td>Плотность</td>
                <td>
                    м2
                </td>
                <td class="input_znach">
                 <p>
                    <span> Постоянное </span>
                    <input type="radio" value="permanent" v-model="obj_podType.density_permanent">
                  </p>
                 <p>
                    <span> Переменное </span>
                    <input type="radio" value="variable" v-model="obj_podType.density_permanent">
                 </p>
                </td>
            </tr>
            
        </table>
        <div class="btn-control out-btn-control" v-if='parametrs.mat != "PODTYPE"'>
            <button class="btn-status btn-black" v-if="parametrs.type == 'create'" @click='addEditMaterial'>Сохранить</button>
            <button class="btn-status btn-black" v-if="parametrs.type == 'edit'" @click='addEditMaterial'>Обновить</button>
            <button class="btn-status" @click='destroyModalF'>Отменить</button>
        </div>
        <div class="btn-control out-btn-control" v-if='parametrs.mat == "PODTYPE"'>
            <button class="btn-status btn-black" v-if="parametrs.type == 'create'" @click='addEditPodMaterial'>Сохранить</button>
            <button class="btn-status btn-black" v-if="parametrs.type == 'edit'" @click='addEditPodMaterial'>Обновить</button>
            <button class="btn-status" @click='destroyModalF'>Отменить</button>
        </div>
      </div>
    </div>
    <!-- <table >
      <tr>
        <th>Профиль</th>
        <th>Формула расчета объёма</th>
        <th>Формула площади S с постоянными величинами</th>
        <th>Примечание</th>
        <th>Постоянные значения (указываем конкретные значения при создании материала)</th>
        <th>Переменные значения (указываем в детали - характеристика заготовки</th>
      </tr>
      <tr>
        <th>Круг</th>
        <td rowspan="5" space='row' >V = S*L</td>
        <td>3.14*D кв./4</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table> -->
  </div>
</div>
</template>

<script>
export default {
  props: ['parametrs'],
  data() {
      return {
          destroyModalLeft: 'left-block-modal',
          destroyModalRight: 'content-modal-right-menu',
          hiddens: 'display: none;',
          inputs: '',
          inputs_short: '',
          titleapp: 'Добавление',
          obj: {
            length_permanent: '',
            width_permanent: '',
            height_permanent: '',
            wallThickness_permanent: '',
            outsideDiametr_permanent: '',
            thickness_permanent: '',
            areaCrossSectional_permanent: 'permanent',
            inputs: '',
          },
          obj_podType : {
            inputs: '',
            density_permanent: '',
          }

      }
  },
  mounted() {
      console.log(this.parametrs)
      this.destroyModalLeft = 'left-block-modal'
      this.destroyModalRight = 'content-modal-right-menu'
      this.hiddens = 'opacity: 1;'
      if(this.parametrs.type != 'create') {
          this.titleapp = 'Редактирование'
          if(this.parametrs.mat == "TYPE") {
            let el = this.parametrs.element
            this.obj.inputs = el.name
            if(el.length && typeof el.length == 'string') 
              this.obj.length_permanent = JSON.parse(el.length).znach 
            if(el.length && typeof el.length == 'object') 
              this.obj.length_permanent = el.length.znach 
            
            if(el.width && typeof el.width == 'string') 
              this.obj.width_permanent = JSON.parse(el.width).znach 
            if(el.width && typeof el.width == 'object') 
              this.obj.width_permanent = el.width.znach 
            
            if(el.height && typeof el.height == 'string')
              this.obj.height_permanent = JSON.parse(el.height).znach 
            if(el.height && typeof el.height == 'object')
              this.obj.height_permanent = el.height.znach 
      
            if(el.wallThickness && typeof el.wallThickness == 'string')
              this.obj.wallThickness_permanent = JSON.parse(el.wallThickness).znach 
            if(el.wallThickness && typeof el.wallThickness == 'object')
              this.obj.wallThickness_permanent = el.wallThickness[0].znach 
            
            if(el.outsideDiametr && typeof el.outsideDiametr == 'string')
              this.obj.outsideDiametr_permanent = JSON.parse(el.outsideDiametr).znach 
            if(el.outsideDiametr && typeof el.outsideDiametr == 'object')
              this.obj.outsideDiametr_permanent = el.outsideDiametr.znach 

            if(el.thickness && typeof el.thickness == 'string')
              this.obj.thickness_permanent = JSON.parse(el.thickness).znach 
            if(el.thickness && typeof el.thickness == 'object')
              this.obj.thickness_permanent = el.thickness.znach 
            
            if(el.areaCrossSectional && typeof el.areaCrossSectional == 'string')
              this.obj.areaCrossSectional_permanent = JSON.parse(el.areaCrossSectional).znach 
            if(el.areaCrossSectional && typeof el.areaCrossSectional == 'object')
              this.obj.areaCrossSectional_permanent = el.areaCrossSectional.znach 
          }

          if(this.parametrs.mat == "PODTYPE") {
            let mat = this.parametrs.material
            this.obj_podType.inputs = mat.name
            if(mat.density) {
              if(typeof mat.density == 'string') 
                this.obj_podType.density_permanent = JSON.parse(mat.density).znach
              if(typeof mat.density == 'object')
                this.obj_podType.density_permanent = mat.density[0].znach
            }
          }
      } 
  },
  methods: {
      destroyModalF() {
          this.destroyModalLeft = 'left-block-modal-hidden'
          this.destroyModalRight = 'content-modal-right-menu-hidden'
          this.hiddens = 'display: none;'
          this.$emit('unmount', 0) 
      },
      addEditPodMaterial() {
          if(this.obj_podType.inputs.length < 2) return 0;
          if(this.parametrs.type == 'create') {
            this.$emit('unmount', {
              type: 'createPodMaterial',
              data: {
                density: this.obj_podType.density_permanent != '' ? {
                  edizm: "м2",
                  znach: this.obj_podType.density_permanent
                } : {},
                name: this.obj_podType.inputs
              }
            })
          }

          if(this.parametrs.type == 'edit') {
            this.$emit('unmount', {
              type: 'editPodMaterial',
              data: {
                density: this.obj_podType.density_select != '' ? {
                  edizm: "м2",
                  znach: this.obj_podType.density_permanent
                } : {},
                name: this.obj_podType.inputs,
                id: this.parametrs.material.id
              }
            })
          }
        this.destroyModalF()
      },
      addEditMaterial() {
          if(this.obj.inputs.length > 2) {
            let dat = this.obj
            let data = {
                    name: dat.inputs,
                    length: dat.length_permanent != '' ? {
                      edizm: 'м,мм',
                      znach: dat.length_permanent
                    } : {} ,
                    width: dat.width_permanent != '' ? {
                      edizm: 'м,мм',
                      znach: dat.width_permanent
                    } : {} ,
                    height: dat.height_permanent != '' ? {
                      edizm: 'м,мм',
                      znach: dat.height_permanent
                    } : {},
                    wallThickness: dat.wallThickness_permanent != '' ? {
                      edizm: 'мм',
                      znach: dat.wallThickness_permanent
                    } : {},
                    outsideDiametr: dat.outsideDiametr_permanent != '' ? {
                      edizm: 'мм',
                      znach: dat.outsideDiametr_permanent
                    } : {},
                    thickness: dat.thickness_permanent != '' ? {
                      edizm: 'мм',
                      znach: dat.thickness_permanent
                    } : {},
                    areaCrossSectional: dat.areaCrossSectional_permanent != '' ? {
                      edizm: 'm2',
                      znach: dat.areaCrossSectional_permanent
                    } : {}
                  }
              if(this.parametrs.type == 'create') {
                  this.$emit('unmount', {
                      type: 'create',
                      data
                  })
              } else if (this.parametrs.type == 'edit'){
                  if(this.parametrs.mat == "TYPE") {
                    data.id = this.parametrs.element.id
                    this.$emit('unmount', {
                        type: 'edit',
                        data
                    })
                  }
              }
              this.destroyModalF()
          } else {
              this.$emit('unmount', {
                  type: 'error',
                  message: 'Слишком короткое наименование'
              })
              return 0
          }
      }
  }
}
</script>

<style scoped>
  .right-menu-p>input {
      width: 70%;
  }
  .input_znach {
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
  }
  .input_znach p {
    display: flex;
    justify-content: space-between;
    margin-right: 5px;
    margin-left: 5px;
    margin: 0;
    width: 100%;
  }
  .select-small{
      font-size: 14px;
      padding: 5px;
      font-weight: bolder;
  }
  .block p * {
      margin-left: 10px;
  }
  .block p {
      display: flex;
      justify-content: space-between;
  }
  .block p input {
      width: 76%;
  }
  .select-small {
      width : 100%;
      height: 100%;
      margin: 0;
      border: none;
  }
  .out-btn-control{
      margin-top: 10px;
  }
  .p-types{
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
  }
  .p-types span:first-child {
      font-weight: bold;
  }
  table {
    user-select: none;
  }
</style>