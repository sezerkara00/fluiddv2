interface ManuelState {
  butonlar: any[]
}

export default {
  state: {
    butonlar: [
      { text: 'Kala0', value: 'k0', defaultValue: 10.020, currentValue: 10.020 },
      { text: 'Kala1', value: 'k1', defaultValue: 11.020, currentValue: 11.020 },
      { text: 'Kala2', value: 'k2', defaultValue: 12.020, currentValue: 12.020 },
      { text: 'Kala3', value: 'k3', defaultValue: 13.020, currentValue: 13.020 }
    ]
  },
  mutations: {
    updateButtonValue(state: ManuelState, payload: { index: number; value: number }) {
      state.butonlar[payload.index].currentValue = payload.value
    }
  },
  actions: {
    incrementValue({ commit, state }: any, buttonIndex: number) {
      const newValue = +(state.butonlar[buttonIndex].currentValue + 0.1).toFixed(3)
      commit('updateButtonValue', { index: buttonIndex, value: newValue })
    },
    decrementValue({ commit, state }: any, buttonIndex: number) {
      const newValue = +(state.butonlar[buttonIndex].currentValue - 0.1).toFixed(3)
      commit('updateButtonValue', { index: buttonIndex, value: newValue })
    }
  }
} 