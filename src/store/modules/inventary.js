import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    inventaryT: [],
    inventaryPT: [],
    inventary: [],
    nameInventary: {},

    searchTypeInv: [],
    searchPTypeInv: [],
    searchInventary: []
  },
  getters: {
    getTInventary(state) {
      return state.inventaryT
    },
    getPTInventary(state) {
      return state.inventaryPT
    },
    getInventary(state) {
      return state.inventary
    },
  },
  actions: { 
    async fetchAllInventary(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('pushAllTInventary', result)
        return result
      }
    },
    async addNewTInventary(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary`, {
        method: 'post',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      })

      if(res.ok) {
        const result = await res.json()
        ctx.commit('addNewTInventaryMutation', result)
        return result
      }
    },
    async removeTInventary(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/${id}`, {
        method: 'delete'
      })
      if(res.ok)
        ctx.commit('removeTInventaryMutation', id)
    },
    async updateNewTInventary(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary`, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      })
      if(res.ok) {
        const result = await res.json()
        console.log('result', result)
        ctx.commit('updateTInventary', result)
        return result
      }
    },
    async fetchAllPInventary(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/pt/`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('pushAllPTInventary', result)
        return result
      }
    },
    async addNewPTInventary(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/pt/`, {
        method: 'post',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      })

      if(res.ok) {
        const result = await res.json()
        ctx.commit('addNewPTInventaryMutation', result)
        return result
      }
    },
    async removePTInventary(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/pt/${id}`, {
        method: 'delete'
      })
      if(res.ok)
        ctx.commit('removePTInventaryMutation', id)
    },
    async updatePTInventary(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/pt/`, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      })
      if(res.ok) {
        const result = await res.json()
        console.log('result', result)
        ctx.commit('updatePTInventary', result)
        return result
      }
    },

    // async getPTInstrumentList(ctx) {
    //   const res = await fetch(`${PATH_TO_SERVER}api/instrument/pt/`)
    //   const result = await res.json()

    //   ctx.commit('pushPTInstrumentList', result)
    // },
    // async addNameInstrument(ctx, data) {
    //   const res = await fetch(`${PATH_TO_SERVER}api/instrument/nameinstrument`, {
    //     method: 'post',
    //     body: data
    //   })

    //   if(res.ok) {
    //     const result = await res.json()
    //     ctx.dispatch('fetchAllInstruments')
    //     ctx.dispatch('getAllNameInstrument')
    //     return result
    //   }
    // },
    // async fetchOneNameInstrument(ctx, id) {
    //   const res = await fetch(`${PATH_TO_SERVER}api/instrument/name/${id}`)
    //   const result = await res.json()
    //   ctx.commit('addOneNameInstrument', result)
    // },
    // async removeFileInstrument(ctx, id) {
    //   await fetch(`${PATH_TO_SERVER}api/instrument/file/${id}`, {
    //     method: 'delete'
    //   })
    // },
    // async updateNameInstrument(ctx, data) {
    //   const res = await fetch(`${PATH_TO_SERVER}api/instrument/nameinstrument/update`, {
    //     method: 'post',
    //     body: data
    //   })

    //   if(res.ok) {
    //     const result = await res.json()
    //     return result 
    //   }
    // },
    // async banNameInstrument(ctx, id) {
    //   await fetch(`${PATH_TO_SERVER}api/instrument/ban/${id}`, {
    //     method: 'delete'
    //   })
    //   ctx.commit('hideNameInstrument', id)    
    // },
    // async getAllNameInstrument(ctx) {
    //   const res = await fetch(`${PATH_TO_SERVER}api/instrument/nameinstrument`)
    //   const result = await res.json()
    //   ctx.commit('pushAllNameInstrument', result)
    // }
  },
  mutations: { 
    pushAllTInventary(state, inventary) {
      state.inventaryT = inventary
    },
    addNewTInventaryMutation(state, inventary) {
      state.inventaryT.push(inventary)
    },
    updateTInventary(state, inventary) {
      for(let inx in state.inventaryT) {
        if(state.inventaryT[inx].id == inventary.id) state.inventaryT[inx] = inventary
      }
    },
    removeTInventaryMutation(state, id) {
      state.inventaryT = state.inventaryT.filter(e => e.id != id)
    },

    pushAllPTInventary(state, inventary) {
      state.inventaryPT = inventary
    },
    addNewPTInventaryMutation(state, inventary) {
      state.inventaryPT.push(inventary)
    },
    updatePTInventary(state, inventary) {
      for(let inx in state.inventaryPT) {
        if(state.inventaryPT[inx].id == inventary.id) state.inventaryPT[inx] = inventary
      }
    },
    removePTInventaryMutation(state, id) {
      state.inventaryPT = state.inventaryPT.filter(e => e.id != id)
    }
    // pushAllNameInstrument(state, data) {
    //   state.PPTInstrument = data.filter(el => !el.ban)
    // },
    // pushPTInstrumentList(state, data) {
    //   state.PTInstrument = data
    // },
    // hideNameInstrument(state, id) {
    //   state.PPTInstrument = state.PPTInstrument.filter(inst => inst.id != id)
    //   // Найти родителя и удалиться из него
    //   state.TInstrument.forEach(el => {
    //     el.nameInstruments = el.nameInstruments.filter((e) => e.id != id)
    //   })
    //   state.instansTInstrument.forEach(el => {
    //     el.nameInstruments = el.nameInstruments.filter((e) => e.id != id)
    //   })
    //   state.PTInstrument.forEach(el => {
    //     el.nameInstrument = el.nameInstrument.filter((e) => e.id != id)
    //   })
    // },
    // addOneNameInstrument(state, nameInstrument) {
    //   state.nameInstrument = nameInstrument
    // },
    // getAllName(state, data) {
    //   state.PPTInstrument = data.nameInstrument.filter(nameInstrument => !nameInstrument.ban)
    // },
    // addAllTInstrument(state, instruments) {
    //   state.TInstrument = instruments
    // },
    // addOneTInstrument(state, instrument) {
    //   state.TInstrument.push(instrument)
    // },
    // removeTInstrument(state, id) {
    //   state.TInstrument = state.TInstrument.filter(instr => instr.id != id)
    // },
    // addOnePTInstrument(state, PTInstrument) {
    //   if(!state.PTInstrument)
    //     state.PTInstrument = []
    //   state.PTInstrument.push(PTInstrument)
    // },
    // filterAllpInstrument(state, instrument) {
    //   if(!instrument.pInstruments)   
    //     state.PTInstrument = []

    //   state.PTInstrument = instrument.pInstruments
    //   if(!instrument.nameInstruments)
    //     state.PPTInstrument = []
    //   state.PPTInstrument = instrument.nameInstruments.filter(el => !el.ban)
    // },
    // removePTInstrument(state, id) {
    //   state.PTInstrument = state.PTInstrument.filter(pI => pI.id != id)
    // },
    // updatePTInstrument(state, result) {
    //   state.PTInstrument = state.PTInstrument.map(pt => pt.id == result.id ? result : pt)
    // },
    // filterAllInstrumentNyId(state, id) {
    //   state.TInstrument = state.TInstrument.filter(pI => pI.id == id.type)
    //   state.PTInstrument = state.PTInstrument.filter(p => p.id == id.pType)
    // },
    // throwInstansInstruments(state) {
    //   state.instansTInstrument = []
    //   state.instansPTInstrument = []
    //   state.PPTInstrument = []
    //   state.linkId = 0
    // },
    // getInstansTools(state, instans) {
    //   state.searchTypeInst = []
    //   state.searchPTypeInst = []
    //   state.searchNameInst = []

    //   if(instans == 0) {
    //     state.TInstrument = state.instansTInstrument
    //     state.PTInstrument = state.instansPTInstrument
    //     state.PPTInstrument = []
    //     state.PTInstrument.forEach(el => {
    //       el.nameInstrument.forEach(name => {
    //         if(!name.ban)
    //           state.PPTInstrument.push(name)
    //       })
    //     })
    //     state.linkId = 0
    //     return 0
    //   }
    //   if(state.instansTInstrument.length == 0) 
    //     state.instansTInstrument = state.TInstrument
    //   if(state.instansPTInstrument.length == 0)
    //     state.instansPTInstrument = state.PTInstrument

    //   state.linkId = instans

    //   state.TInstrument = state.instansTInstrument
    //     .filter(inst => inst.instans == instans)
    //   if(state.instansPTInstrument.length && state.instansPTInstrument[0].instruments.length) {
    //     state.PTInstrument = state.instansPTInstrument
    //       .filter(inst => inst.instruments[0].instans == instans)
    //   }
      

    //   state.PPTInstrument = []
    //   state.PTInstrument.forEach(el => {
    //     el.nameInstrument.forEach(name => {
    //       if(!name.ban)
    //         state.PPTInstrument.push(name)
    //     })
          
    //   })
    // },
    // searchTypeInst(state, inst) {
    //   if(!state.searchTypeInst.length) 
    //     state.searchTypeInst =  state.TInstrument

    //   state.TInstrument = state.searchTypeInst
    //   if(!inst) 
    //     return

    //   state.TInstrument = state.TInstrument
    //     .filter(t =>  (t.name.slice(0, inst.length).toLowerCase()) == inst.toLowerCase())
    // },
    // searchPTInst(state, inst) {
    //   if(!state.searchPTypeInst.length) 
    //     state.searchPTypeInst =  state.PTInstrument

    //   state.PTInstrument = state.searchPTypeInst
    //   if(!inst) 
    //     return

    //   state.PTInstrument = state.PTInstrument
    //     .filter(t =>  (t.name.slice(0, inst.length).toLowerCase()) == inst.toLowerCase())

    // },
    // searchNameInst(state, inst) {
    //   if(!state.searchNameInst.length) 
    //     state.searchNameInst =  state.PPTInstrument

    //   state.PPTInstrument = state.searchNameInst
    //   if(!inst) 
    //     return

    //   state.PPTInstrument = state.PPTInstrument
    //     .filter(t =>  (t.name.slice(0, inst.length).toLowerCase()) == inst.toLowerCase())

    // },
  }
}