<template>
  <v-overlay :model-value="loading" class="align-center justify-center">
    <v-progress-circular v-model="loading" color="primary" size="64" width="5" indeterminate />
  </v-overlay>
  <v-container>
    <v-row justify="center" class="pb-5">
      <v-card elevation="7" min-width="800">
        <v-card-title class="text-center" style="color: #3F51B5;">Atualizar Redzone</v-card-title>
        <v-card-text>
          <v-form @prevent.submit="validateAndCreate()">
            <v-row>
              <v-col cols="6">
                <v-col cols="12">
                  <h1 class="text-subtitle-1" style="color: #3F51B5;">Nome:</h1>
                </v-col>
                <v-col cols="12" class="mt-n5">
                  <v-text-field variant="outlined" rounded v-model="form.nome"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <h1 class="text-subtitle-1" style="color: #3F51B5;">Lotação:</h1>
                </v-col>
                <v-col cols="12" class="mt-n5">
                  <v-text-field type="number" variant="outlined" rounded v-model="form.lotacao"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <h1 class="text-subtitle-1" style="color: #3F51B5;">URL da Câmera:</h1>
                </v-col>
                <v-col cols="12" class="mt-n5">
                  <v-text-field variant="outlined" rounded v-model="form.urlCamera"></v-text-field>
                </v-col>
              </v-col>
              <v-col cols="6">
                <v-col cols="12">
                  <h1 class="text-subtitle-1" style="color: #3F51B5;">Departamento:</h1>
                </v-col>
                <v-col cols="12" class="mt-n5">
                  <v-select v-model="form.departamento" :items="departamentos" item-title="nome_departamento"
                    item-value="id_departamento" variant="outlined" rounded></v-select>
                </v-col>
                <v-col cols="12">
                  <h1 class="text-subtitle-1" style="color: #3F51B5;">Responsável:</h1>
                </v-col>
                <v-col cols="12" class="mt-n5">
                  <v-select v-model="form.responsavel" :items="responsaveis" item-title="email" item-value="id_usuario"
                    variant="outlined" rounded></v-select>
                </v-col>
                <v-col cols="12" class="mt-n5">
                  <v-switch v-model="form.status" :label="form.status ? 'Ativo' : 'Desativado'" color="green-accent-4"
                    hide-details inset />
                </v-col>
              </v-col>
            </v-row>
            <v-row justify="center" class="pb-2">
              <v-btn color="red-darken-1" variant="outlined" rounded @click="router.push(`/redzone`)">Cancelar</v-btn>
              <v-btn class="mx-4" color="blue" :loading="loading" rounded @click="validateAndCreate">Atualizar</v-btn>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useNotification from '../../stores/notification';
import UsuarioStore from '../../stores/Usuario';
import DepartamentoStore from '../../stores/Departamento';
import { Usuario } from '../../types/IUsuario';
import RedzoneStore from '../../stores/Redzone';
import { useRoute, useRouter } from 'vue-router';
import { obterDataFormatada } from '../../utils/formatters';
import { Departamento } from '../../types/IDepartamento';

const notificator = useNotification();
const redzoneService = RedzoneStore();
const route = useRoute();
const router = useRouter();
const loading = ref(false)
const redzoneId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

const form = ref({
  nome: '',
  lotacao: '',
  urlCamera: '',
  departamento: null,
  responsavel: null,
  status: null
});

const userService = UsuarioStore();
const departamentoService = DepartamentoStore();
const responsaveis = ref<Usuario[]>([]);
const departamentos = ref<Departamento[]>([])

const getUsers = async () => {
  try {
    const response = await userService.getAll();
    responsaveis.value = response.data
  } catch (error) {
    console.log(error);
  }
};

const validateAndCreate = async () => {
  if (!form.value.nome || !form.value.lotacao || !form.value.urlCamera || !form.value.departamento || !form.value.responsavel) {
    notificator.notifyWarning('Por favor, preencha todos os campos.');
    return;
  }

  try {
    loading.value = true
    const dataAtualFormatada = obterDataFormatada();
    let usuario = ''
    let departamento = ''
    if (!isNaN(form.value.responsavel)) {
      usuario = form.value.responsavel
    } else {
      usuario = form.value.responsavel.id_usuario
    }

    if (!isNaN(form.value.departamento)) {
      departamento = form.value.departamento
    } else {
      departamento = form.value.departamento.id_departamento
    }

    const redzoneEnviada = {
      id_redzone: Number(redzoneId),
      nome_redzone: form.value.nome,
      responsavel_id: { id_usuario: usuario },
      camera: form.value.urlCamera,
      capacidade_maxima: Number(form.value.lotacao),
      id_departamento: { id_departamento: departamento },
      delete_at: form.value.status === true ? '' : dataAtualFormatada
    }
    await redzoneService.update(redzoneEnviada)
    notificator.notifySuccess('Sucesso ao atualizar redzone!')
  } catch (error) {
    console.log(error)
    notificator.notifyError('Erro atualizar redzone')
  } finally {
    loading.value = false
    router.push(`/redzone`);
  }
};

async function getRedzone() {
  loading.value = true
  try {
    const response = await redzoneService.getOne(redzoneId);
    form.value.nome = response.data.nome_redzone
    form.value.responsavel = response.data.responsavel_id
    form.value.lotacao = response.data.capacidade_maxima
    form.value.urlCamera = response.data.camera
    form.value.departamento = response.data.id_departamento
    form.value.status = response.data.status
    notificator.notifySuccess('Sucesso ao buscar informações da redzone!')
  } catch (error) {
    notificator.notifyError('Erro ao buscar informações da redzone.')
    console.log(error);
  }
  finally {
    loading.value = false
  }

}

onMounted(async () => {
  await departamentoService.getDepartamento();
  departamentos.value = departamentoService.departamento
  await getRedzone()
  await getUsers()
});
</script>
