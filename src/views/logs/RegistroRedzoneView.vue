<template>
    <v-app pa-0>
        <v-main>
            <v-container>
                <TitleComponent title="Histórico da redzone" />
                <TabelaComponent :is-loading="isLoading" titulo="Registro da redzone" :headers="headers"
                    :itensRegistro="registroRedzone.dadosRedzone" />
            </v-container>
        </v-main>

    </v-app>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import registroRedzoneStore from '../../stores/RegistroRedzone';

const registroRedzone = registroRedzoneStore()
const isLoading = ref(false);
const route = useRoute();
const redzoneId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

const headers = [
    { title: 'Id', value: 'id', sortable: true },
    { title: 'Dia', value: 'data' },
    { title: 'Lotação atual', value: 'lotacao' },
    { title: 'Entrada/Saida', value: 'entrada' },


]

const pegarDados = async () => {
    isLoading.value = true;
    try {
      await registroRedzone.pegarHistoricoRedZone(redzoneId)
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    pegarDados()
    const intervalId = setInterval(() => {
        pegarDados();
    }, 4000);

    onBeforeUnmount(() => {
        clearInterval(intervalId);
    });
});
</script>
