import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    typeM: [],
    instansTypeM: [],
    podTypeM: [],
    instansPodTypeM: [],
    
    podMaterial: [],
    onePPT: {},
    linkId: 0,

    sTypeM: [],
    sPTypeM: [],
    sProviderPM: [],

    stateMaterialTime: [],

    searchTypeM: [],
    searchPTypeM: [],
    searchMaterial: [],
  },
  getters: {
    alltypeM(state) {
      return state.typeM
    },
    allPodTypeM(state) {
      return state.podTypeM
    },
    getOnePodMaterial(state) {
      return state.podMaterial
    },
    getOnePPT(state) {
      return state.onePPT
    },
    getLinkId(state) {
      return state.linkId
    }
  },
  actions: { 
    async getAllTypeMaterial(ctx) {
      const res =  await fetch(`${PATH_TO_SERVER}api/settings/material`)
      const result = await res.json()

      await ctx.commit("getTypeMaterial", result)
      return result
    },
    async getAllPodTypeMaterial(ctx, instans = 'all') {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/typematerial/${instans}`)
      const result = await res.json()

      await ctx.commit('filterMatByPodType', result)
      return result
    },
    async createTypeM(ctx, material) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/material`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...material
        })
      })
      
      const result = await res.json()
      ctx.commit('addTypeMaterial', result)
    },
    async createPodType(ctx, pod_type) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/podtype`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...pod_type
        })
      })
      
      if(res.ok) {
        const result = await res.json()
        ctx.commit('createPodType', result)
      }
    },
    async removeMaterial(ctx, id) {
      const res =  await fetch(`${PATH_TO_SERVER}api/settings/material/${id}`, {
          method: 'delete'
        })
        if(res.ok)
          ctx.commit('deleteMaterial', id)
    },
    async updateTypeM(ctx, material) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/material/update`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...material
        })
      });

      const result = await res.json()
      ctx.commit('updateMaterial', result)
    },
    async updatePodMaterial(ctx, podM) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/podtype/update`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...podM
        })
      });

      const result = await res.json()
      ctx.commit('updatePodMaterial', {result, matId: podM.parentId} )
    },
    async deletePodType(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/podtype/${id}`, {
        method: 'delete'
      })

      if(res.ok)
        ctx.commit('deletePodMaterial', id)
    },
    async getOnePodType(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/typematerialid/${id}`)
      const result = await res.json()
      
      if(res.ok) {
       ctx.commit('addOnePodType', result)
        console.log(result)
        return result
      }
    },
    async createNewPodPodMaterial(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/podpodtype/`, {
        method: 'post',
        body: data
      })
      if(res.ok) {
        ctx.commit('onePPTClear')
        return true
      } else return false
    },
    async removePPM(ctx, id) {
      const res =  await fetch(`${PATH_TO_SERVER}api/settings/podpodtype/${id}`, {
        method: 'delete'
      })
      if(res.ok)
        ctx.dispatch('getAllTypeMaterial')
    },
    async bannedPPM(ctx, id) {
      const res =  await fetch(`${PATH_TO_SERVER}api/settings/podpodtype/${id}`)
      if(res.ok) {
        ctx.dispatch('getAllTypeMaterial')
        ctx.commit('bannedPPM', id)
      }
    },
    async fetchGetOnePPM(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/podpodtype/get/${id}`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('addOnePPTyep', result)
        return result
      }
    },
    async fetchGetAllPPM(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/podpodtype`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('pushAllPPT', result)
        return result
      }
    },
    async fetchPPMNoLight(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/materials/podtypematerial`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('pushAllPPT', result)
        return result
      }
    },
    async fetchGetAllDeficitPPM(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/materialdeficit`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('sortPPMtoParent', result)
        return result
      }
    },
    async fetchAllProviderMaterial(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/materialprovider`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('sortPPMtoParent', result)
        return result
      }
    },
    async fetchAllProviderMaterialById(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/materialprovider/${id}`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('materialForProvider', result)
        return result
      }
    },
    async fetchGetAllShipmentsPPM(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/materialshipment`)
      if(res.ok) {
        const result = await res.json()
        let new_result = []
        for(let obj of result) {
          new_result.push({...obj.mat, dev: obj.dev})
        }
        ctx.commit('sortPPMtoParent', new_result)
        console.log(result)
        return result
      }
    },
    async attachFileToMaterial(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/files/${data.mat_id}/${data.file_id}`)
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },
  },
  mutations: { 
    sortPPMtoParent(state, result) {
      state.podMaterial = result
      for(let mat of result) {
        let check = false
        if(mat.material) {
          for(let inx in state.typeM) {
            if(state.typeM[inx].id == mat.material.id) {
              check = true
              state.typeM[inx].podPodMaterials.push(mat)
            }
          }
          if(!check) 
            state.typeM.push({ ...mat.material, podPodMaterials: [mat]})        
            else check = false 
          if(!state.typeM.length)
            state.typeM.push({ ...mat.material, podPodMaterials: [mat]})
        }

        check = false
        if(mat.podMaterial) {
          for(let inx in state.podTypeM) {
            if(state.podTypeM[inx].id == mat.podMaterial.id) {
              check = true
              if(state.podMaterial[inx] && state.podMaterial[inx].podPodMaterials && state.podMaterial[inx].podPodMaterials.length) 
                state.podMaterial[inx].podPodMaterials.push(mat)
              else 
                state.podMaterial[inx].podPodMaterials = [mat]
            }
          }
          if(!check) 
            state.podTypeM.push({ ...mat.podMaterial, podPodMaterials: [mat]})        
            else check = false 
          if(!state.podTypeM.length)
            state.podTypeM.push({ ...mat.podMaterial, podPodMaterials: [mat]})
        } 
      }

    },
    throwInstans(state) {
      state.instansTypeM = []
      state.instansPodTypeM = []
      state.linkId = 0
    },
    getInstansMaterial(state, instans) {
      state.searchMaterial = []
      state.searchPTypeM = []
      state.searchTypeM = []
      
      state.podMaterial = []
      if(instans == 0) {
        state.typeM = state.instansTypeM
        state.podTypeM = state.instansPodTypeM
        state.typeM.forEach(el => {
          el.podPodMaterials.forEach(e => {
            state.podMaterial.push(e)
          })
        })
        state.linkId = 0
        return 0
      }
      if(state.instansTypeM.length == 0) 
        state.instansTypeM = state.typeM
      if(state.instansPodTypeM.length == 0)
        state.instansPodTypeM = state.podTypeM

      state.linkId = instans

      state.typeM = state.instansTypeM.filter(mat => mat.instansMaterial == instans)
      state.podTypeM = state.instansPodTypeM.filter(mat => mat.instansMaterial == instans)
      state.typeM.forEach(el => {
        el.podPodMaterials.forEach(e => {
          state.podMaterial.push(e)
        })
      })
    },
    addTypeMaterial(state, material) {
      state.typeM.push(material)
    },
    getTypeMaterial(state, materisls) {
      state.typeM = materisls
    },
    updateMaterial(state, material) {
      state.typeM = state.typeM.filter(mat => mat.id != material.id)
      state.typeM.push(material)
    },
    filterMatByPodType(state, podMaterials) {
      state.podTypeM = podMaterials
    }, 
    deleteMaterial(state, id) {
      state.typeM = state.typeM.filter(typ => typ.id != id)
    },
    deletePodMaterial(state, id) {
      state.podTypeM = state.podTypeM.filter(typ => typ.id != id)
    },
    updatePodMaterial(state, data) {
      state.podTypeM = state.podTypeM.filter(typ => typ.id != data.result.id)
      state.podTypeM.push(data.result)
      state.typeM.forEach(res => {
        if(data.matId == res.id) {
          res.podMaterials = res.podMaterials.filter(podM => podM.id != data.result.id)
          res.podMaterials.push(data.result)
        }
      })
    },
    createPodType(state, data) { 
      state.podTypeM.push(data)
    },
    addOnePodType(state, typMaterial) {
      state.podMaterial = typMaterial.podPodMaterials.filter(material => !material.ban)
    },
    addOnePPTyep(state, PPT) {
      state.onePPT = PPT
    },
    bannedPPM(state, id) {
      state.podMaterial = state.podMaterial.filter(ppm => ppm.id != id)
    },
    filterMaterialById(state, id) {
      state.typeM = state.typeM.filter(m => m.id == id)
    },
    filterPodMaterialById(state, id) {
      state.podTypeM = state.podTypeM.filter(m => m.id == id)
    },
    onePPTClear(state) {
      state.onePPT = {}
    },
    toEmptyPPT(state) {
      state.podMaterial = []
    },
    filterByNameMaterial(state, mat) {
      state.podMaterial = mat.podPodMaterials
    },
    filterByNameMaterialById(state, mat) {
      if(!mat.podPodMaterials.length) return []
      if(!state.searchMaterial.length)
        state.searchMaterial = state.podMaterial
      let new_arr = state.searchMaterial.map(e => {
        for(let podm of mat.podPodMaterials) {
          if(podm.id == e.id) return e
        }
      })
      state.podMaterial = new_arr.filter(e => e)
    },
    pushAllPPT(state, data) {
      state.podMaterial = data
    },
    searchTypeMutation(state, tm) {
      if(!state.searchTypeM.length) 
        state.searchTypeM =  state.typeM

      state.typeM = state.searchTypeM
      if(!tm) 
        return

      state.typeM = state.typeM
        .filter(t =>  (t.name.slice(0, tm.length).toLowerCase()) == tm.toLowerCase())
    },
    searchPTypeMutation(state, tm) {
      if(!state.searchPTypeM.length) 
        state.searchPTypeM = state.podTypeM
      state.podTypeM = state.searchPTypeM
      if(!tm)  
        return
          
      state.podTypeM = state.podTypeM
        .filter(t =>  (t.name.slice(0, tm.length).toLowerCase()) == tm.toLowerCase())
    },
    searchMaterialMutation(state, tm) {
      if(!state.searchMaterial.length) 
        state.searchMaterial = state.podMaterial

      state.podMaterial = state.searchMaterial
      if(!tm) 
        return
      state.podMaterial = state.podMaterial
        .filter(t =>  (t.name.slice(0, tm.length).toLowerCase()) == tm.toLowerCase())
    },
    clearCascheMaterial(state) {
      state.typeM = []
      state.instansTypeM = []
      state.podTypeM = []
      state.instansPodTypeM = []
      state.podMaterial = []
      state.onePPT = {}
    }
  }
}