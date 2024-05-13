<template>
  <v-overlay :model-value="loading" class="align-center justify-center">
    <v-progress-circular v-model="loading" color="primary" size="64" width="5" indeterminate />
  </v-overlay>
  <v-container>
    <v-row justify="center" class="pb-5">
      <v-card elevation="7" min-width="800">
        <v-card-title class="text-center" style="color: #3F51B5;">Criar Redzone</v-card-title>
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
                  <v-select v-model="form.departamento" :items="departamentoService.departamento"
                    item-title="nome_departamento" item-value="id_departamento" variant="outlined" rounded></v-select>
                </v-col>
                <v-col cols="12">
                  <h1 class="text-subtitle-1" style="color: #3F51B5;">Responsável:</h1>
                </v-col>
                <v-col cols="12" class="mt-n5">
                  <v-select v-model="form.responsavel" :items="responsaveis" item-title="email" item-value="id_usuario"
                    variant="outlined" rounded></v-select>
                </v-col>
              </v-col>
            </v-row>
            <v-row justify="center" class="pb-2">
              <v-btn color="red-darken-1" variant="outlined" rounded @click="router.push(`/redzone`)">Cancelar</v-btn>
              <v-btn class="mx-4" color="blue" :loading="loading" rounded @click="validateAndCreate">Criar</v-btn>
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
import { Usuario } from '../../types/IUsuario';
import RedzoneStore from '../../stores/Redzone';
import { useRouter } from 'vue-router';
import departamentoStore from '../../stores/Departamento';

const notificator = useNotification();
const redzoneService = RedzoneStore();
const router = useRouter();
const loading = ref(false)
const userService = UsuarioStore();
const departamentoService = departamentoStore();
const responsaveis = ref<Usuario[]>([]);

const form = ref({
  nome: '',
  lotacao: '',
  urlCamera: '',
  departamento: null,
  responsavel: null,
});

const getUsers = async () => {
  try {
    const response = await userService.getAll();
    responsaveis.value = response.data
  } catch (error) {
    console.log(error);
  }
};

const getDepartamentos = async () => {
  await departamentoService.getDepartamento()
};

const validateAndCreate = async () => {
  if (!form.value.nome || !form.value.lotacao || !form.value.urlCamera || !form.value.departamento || !form.value.responsavel) {
    notificator.notifyWarning('Por favor, preencha todos os campos.');
    return;
  }

  try {
    loading.value = true
    const redzoneEnviada = {
      nome_redzone: form.value.nome,
      responsavel_id: {
        id_usuario: form.value.responsavel
      },
      camera: form.value.urlCamera,
      capacidade_maxima: Number(form.value.lotacao),
      id_departamento: {
        id_departamento: form.value.departamento
      }
    }
    await redzoneService.create(redzoneEnviada)
    notificator.notifySuccess('Sucesso ao criar redzone!')
  } catch (error) {
    console.log(error)
    notificator.notifyError('Erro criar redzone')
  } finally {
    loading.value = false
    router.push(`/redzone`);
  }
};

onMounted(async () => {
  await getUsers();
  await getDepartamentos();
});

</script>
