import { defineStore } from "pinia";
import { getRequest } from "../utils/services/axios";
import { ref } from "vue";
import { IregistroRedzone } from "../interfaces/IRedzoneRegistro";

const registroRedzoneStore = defineStore('registro', () => {
    const dadosRedzone = ref<IregistroRedzone[]>([])

    const pegarHistorico = async () => {
        const response = await getRequest('log')

        dadosRedzone.value = response.data.reverse();
    }

    const pegarHistoricoRedZone = async (idRedzone: string) => {
      const response = await getRequest(`log/redzone/${idRedzone}`)
      dadosRedzone.value = response.data.reverse();
  }


    return {
        dadosRedzone,
        pegarHistorico,
        pegarHistoricoRedZone
    }
})

export default registroRedzoneStore;
