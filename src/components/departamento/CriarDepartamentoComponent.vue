<template>
   <v-overlay :model-value="isLoading" class="align-center justify-center">
      <v-progress-circular v-model="isLoading" color="primary" size="64" width="5" indeterminate />
   </v-overlay>
   <v-container fluid fill-height>
      <TitleComponent title="Gerenciamento de Departamentos" />

      <CardDepartamento :editar="false" :valorDefault="defaultDepartamento" rota="departamentos"
         :funcao="criarDepartamento" :funcaoVoltar="voltar" @nomeDepartamento="pegarDepartamento"
         @nomeResponsavel="pegarResponsavel" />
   </v-container>
</template>

<script setup lang="ts">
import { departamentoStore } from '../../stores';
import TitleComponent from '../TitleComponent.vue';
import { useRouter } from 'vue-router';
import CardDepartamento from './cardDepartamento.vue';
import { onMounted, ref } from 'vue';
import useNotification from '../../stores/notification';

const notificator = useNotification();
const departamentoStoreDados = departamentoStore();
const router = useRouter()
const isLoading = ref(false)

const defaultDepartamento = {
   nome_departamento: '',
   responsavel_id: { id_usuario: null }
}

const voltar = () => {
   router.push({ name: 'departamentos' });
   departamentoStoreDados.novoDepartamento = { ...defaultDepartamento };

};
const criarDepartamento = async () => {
   isLoading.value = true
   try {
      await departamentoStoreDados.criarDepartamento(departamentoStoreDados.novoDepartamento)
      notificator.notifySuccess("Sucesso ao criar departamento!");
      router.push("/departamentos");
   } catch (error) {
      notificator.notifyError("Erro ao criar departamento!");
   } finally {
      isLoading.value = false
   }


}

const pegarDepartamento = (item: string) => {
   departamentoStoreDados.novoDepartamento.nome_departamento = item
}
const pegarResponsavel = (item: string) => {
   departamentoStoreDados.novoDepartamento.responsavel_id.id_usuario = item;
}


onMounted(() => {
   departamentoStoreDados.novoDepartamento = { ...defaultDepartamento };

})
</script>