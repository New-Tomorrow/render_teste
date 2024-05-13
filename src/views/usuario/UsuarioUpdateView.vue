<template>
  <v-overlay :model-value="loading" class="align-center justify-center">
    <v-progress-circular v-model="loading" color="primary" size="64" width="5" indeterminate />
  </v-overlay>
  <v-row justify="center" align="center" class="fill-height">
    <v-col cols="12" sm="8" md="6">
      <v-card title="Editar usuário" class="text-light-blue-darken-4" elevation="10">
        <div class="w-75 mx-auto">
          <v-text-field class="mb-4" v-model="form.nomeUsuario" variant="outlined" hide-details="auto" label="Nome" />

          <v-text-field class="mb-4" v-model="form.emailUsuario" variant="outlined" type="email" hide-details="auto"
            label="E-mail" />

          <v-text-field class="mb-4" v-model="form.matriculaUsuario" variant="outlined" hide-details="auto"
            label="Matrícula" />

          <!-- <v-text-field
             class="mb-4"
             v-model="form.senhaUsuario"
             variant="outlined"
             type="password"
             hide-details="auto"
             label="Senha"             
           /> -->

          <v-select v-model="form.tipoUsuario" variant="outlined" label="Selecione a função" :items="funcoes">
          </v-select>
          <v-col cols="12" class="mt-n5">
            <v-switch v-model="form.status" :label="form.status ? 'Ativo' : 'Desativado'" color="green-accent-4"
              hide-details inset />
          </v-col>
          <div class="d-flex justify-space-between pb-4">
            <v-btn color="#299FFF" rounded variant="outlined" class="w-25"
              @click="router.push('/usuarios')">voltar</v-btn>
            <v-btn @click="editarUsuario()" type="submit" color="#299FFF" rounded class="w-25">{{ "Editar" }}</v-btn>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UsuarioStore } from "../../stores";
import useNotification from "../../stores/notification";
import validator from "validator";
import { obterDataFormatada } from '../../utils/formatters';

const router = useRouter();
const route = useRoute();
const id = route.params.id;
const loading = ref(false);
const notificator = useNotification();
const userService = UsuarioStore();
const funcoes = ["Administrador", "Guarda", "Gerente de área"];

const form = ref({
  nomeUsuario: "",
  emailUsuario: "",
  matriculaUsuario: "",
  tipoUsuario: "",
  status: false
});


const editarUsuario = async () => {
  loading.value = true;
  const dataAtualFormatada = obterDataFormatada();
  const usuarioJSON = {
    nome_usuario: form.value.nomeUsuario,
    email: form.value.emailUsuario,
    matricula_empresa: form.value.matriculaUsuario,
    tipo_usuario: form.value.tipoUsuario,
    delete_at: form.value.status === true ? '' : userService.usuario.delete_at ? userService.usuario.delete_at : dataAtualFormatada,
    update_at: dataAtualFormatada
  };
  const idNumber = Number(id);
  try {
    if (
      !form.value.emailUsuario ||
      !form.value.matriculaUsuario ||
      !form.value.nomeUsuario ||
      !form.value.tipoUsuario
    ) {
      notificator.notifyWarning("Por favor, preencha todos os campos.");
      return;
    }

    if (!validator.isEmail(form.value.emailUsuario)) {
      notificator.notifyWarning("E-mail inválido!");
      return;
    }
    await userService.update(idNumber, usuarioJSON);
    notificator.notifySuccess("Sucesso ao atualizar usuário!");
    router.push(`/usuarios`);
  } catch (error) {
    console.log(error);
    notificator.notifyError("Erro atualizar usuário");
  } finally {
    loading.value = false;
  }
};

async function getUser() {
  try {
    const idNumber = Number(id);
    await userService.getUsuarioById(idNumber);

    form.value.nomeUsuario = userService.usuario.nome_usuario
    form.value.emailUsuario = userService.usuario.email
    form.value.matriculaUsuario = userService.usuario.matricula_empresa
    form.value.tipoUsuario = userService.usuario.tipo_usuario
    form.value.status = userService.usuario.status === false ? true : false


    notificator.notifySuccess("Sucesso ao buscar informações do usuário!");
  } catch (error) {
    notificator.notifyError("Erro ao buscar informações do usuário.");
    console.log(error);
  }
}

onMounted(() => {
  getUser();
});
</script>