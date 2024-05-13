<template>
    <v-overlay :model-value="isLoading" class="align-center justify-center">
        <v-progress-circular v-model="isLoading" color="primary" size="64" width="5" indeterminate />
    </v-overlay>
    <v-app>
        <v-main>
            <v-container>
                <TitleComponent title="Gerenciamento de Departamentos" />
                <TabelaComponent titulo="Departamentos" :headers="headers"
                    :itensDepartamento="departamentoStoreDados.departamento" adicionar="Criar departamento"
                    rota="criarDepartamento" :editar="editar" :desativar="desativarOuAtivar" :isLoading="isLoading" />
            </v-container>
        </v-main>

    </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TabelaComponent from '../TabelaComponent.vue';
import TitleComponent from '../TitleComponent.vue';
import { departamentoStore } from '../../stores';
import { useRouter } from 'vue-router';
import useNotification from '../../stores/notification';

const notificator = useNotification();
const departamentoStoreDados = departamentoStore();
const isLoading = ref(false);
const router = useRouter();

const headers = [
    { title: 'Id do departamento', value: 'id_departamento' },
    { title: 'Nome do departamento', value: 'nome_usuario' },
    { title: 'Criado em', value: 'create_at' },
    { title: 'Nome do Responsável', value: 'nome_responsavel' },
    { title: 'Ativar/Desativar', value: 'desativar' },
    { title: 'Editar', value: 'editar' }

]

const desativarOuAtivar = async (id: number) => {
    isLoading.value = true
    try {
        departamentoStoreDados.desativarOuAtivarDepartamento(id.toString());
        notificator.notifySuccess("Sucesso ao desativar/ativar departamento!");
    } catch (error) {
        console.log(error);
        notificator.notifyError("Erro ao desativar/ativar departamento!");
    } finally {
        setTimeout(() => {
            isLoading.value = false
            pegarDados();
        }, 900);
    }

}
const getDepartamento = async (id: string) => {
    await departamentoStoreDados.getDepartamentoById(id);
};


const editar = async (id: number) => {
    isLoading.value = true
    try {
        await getDepartamento(id.toString());
        if (departamentoStoreDados.editarDepartamento.responsavel_id.id_usuario) {
            router.push({ name: 'editarDepartamento', params: { id: id } });
        }
    } catch (error) {
        notificator.notifyError("Erro na tentativa de edição do departamento!");
    } finally {
        isLoading.value = false
    }
};
const pegarDados = async () => {
    isLoading.value = true
    try {
        await departamentoStoreDados.getDepartamento();
        notificator.notifySuccess("Sucesso ao listar departamentos!");
    } catch (error) {
        console.log(error);
        notificator.notifyError("Erro ao listar departamentos!");
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    pegarDados()
})
</script>