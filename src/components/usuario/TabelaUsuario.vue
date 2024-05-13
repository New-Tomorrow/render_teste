<template>
    <v-app>
        <v-main>
            <v-container>
                <TitleComponent title="Gerenciamento de Usuários" />
                <TabelaComponent titulo="Usuários" :headers="headers"
                    :itensDepartamento="usuarios" adicionar="Criar usuário"
                    rota="criarUsuarios" :desativar="desativarOuAtivar" :isLoading="isLoading"/>
            </v-container>
        </v-main>

    </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TabelaComponent from '../TabelaComponent.vue';
import TitleComponent from '../TitleComponent.vue';
import { UsuarioStore, departamentoStore } from '../../stores';
import IUsuario from '../../interfaces/IUsuario';

const departamentoStoreDados = departamentoStore();
const isLoading = ref(false);
const usuarios = ref<IUsuario[]>()

const usuarioService = UsuarioStore()

const headers = [
    { title: 'Id do usuário', value: 'id_usuario' },
    { title: 'Nome', value: 'nome_usuario' },
    { title: 'Criado em', value: 'creatre_at' },
    { title: 'E-mail', value: 'email' },
    { title: 'Matrícula', value: 'matricula_empresa' },
    { title: 'Tipo', value: 'tipo_usuario' },
    { title: 'Ativar/Desativar', value: 'desativar' },
    { title: 'Editar', value: 'editar' }


]
const desativarOuAtivar = async (id: number) => {
    isLoading.value = true
    try {
        departamentoStoreDados.desativarOuAtivarDepartamento(id.toString());
    } catch (error) {
        console.log(error);
    } finally {
        setTimeout(() => {
            isLoading.value = false
            pegarDados();
        }, 900);
    }

}

const pegarDados = async () => {
    const response = await usuarioService.getAll();

    usuarios.value = response.data;
    
}

onMounted(() => {
    pegarDados()
})
</script>