<template>
  <v-overlay :model-value="isLoading" class="align-center justify-center">
    <v-progress-circular v-model="isLoading" color="primary" size="64" width="5" indeterminate />
  </v-overlay>
  <v-app>
    <v-main>
      <v-container>
        <TitleComponent title="Gerenciamento de Usuários" />
        <TabelaComponent titulo="Usuários" :headers="headers" :intensUsuario="usuarios" adicionar="Criar usuário"
          rota="criarUsuarios" :editar="editarUsuario" :desativar="desativarOuAtivar" :isLoading="isLoading" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { UsuarioStore, departamentoStore } from "../../stores";
import IUsuario from "../../interfaces/IUsuario";
import TabelaComponent from "../../components/TabelaComponent.vue";
import TitleComponent from "../../components/TitleComponent.vue";
import useNotification from "../../stores/notification";
import { useRouter } from "vue-router";

const router = useRouter();

const isLoading = ref(false);
const usuarios = ref<IUsuario[]>();
const notificator = useNotification();

const usuarioService = UsuarioStore();

const headers = [
  { title: "Id do usuário", value: "id_usuario" },
  { title: "Nome", value: "nome_usuario" },
  { title: "Criado em", value: "creatre_at" },
  { title: "E-mail", value: "email" },
  { title: "Matrícula", value: "matricula_empresa" },
  { title: "Tipo", value: "tipo_usuario" },
  { title: "Ativar/Desativar", value: "desativar" },
  { title: "Editar", value: "editar" },
];
const desativarOuAtivar = async (id: number) => {
  isLoading.value = true;
  try {
    usuarioService.desativarOuAtivarUsuario(id);
    notificator.notifySuccess("Sucesso ao desativar/ativar usuário!");
  } catch (error) {
    console.log(error);
    notificator.notifyError("Erro ao desativar/ativar usuário!");
  } finally {
    setTimeout(() => {
      isLoading.value = false;
      pegarDados();
    }, 900);
  }
};

const getUsuario = async (id: number) => {
  isLoading.value = true
  try {
    await usuarioService.getUsuarioById(id);
    notificator.notifySuccess("Sucesso ao buscar usuários!");
  } catch (error) {
    notificator.notifyError("Erro ao buscar usuário!")
  } finally {
    isLoading.value = true
  }
};

const editarUsuario = async (id: number) => {
  try {
    await getUsuario(id);
    if (usuarioService.usuario.id_usuario) {
      router.push({ name: "editarUsuario", params: { id: id } });
    }
  } catch (error) {
    console.log(error);
  }
};

const pegarDados = async () => {
  isLoading.value = true

  try {
    const response = await usuarioService.getAll();
    usuarios.value = response.data;
    notificator.notifySuccess("Sucesso ao listar usuários!")
  } catch (error) {
    notificator.notifyError("Erro ao listar usuários!")
  } finally {
    isLoading.value = false
  }
};

onMounted(() => {
  pegarDados();
});
</script>
