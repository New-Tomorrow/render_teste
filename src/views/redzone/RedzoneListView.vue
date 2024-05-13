<template>
  <v-overlay :model-value="loading" class="align-center justify-center">
    <v-progress-circular v-model="loading" color="primary" size="64" width="5" indeterminate />
  </v-overlay>
  <v-container>
    <v-row>
      <v-col cols="9">
        <v-text-field variant="outlined" rounded v-model="searchTerm" label="Buscar Redzone"
          clear-icon="mdi mdi-close-circle" clearable></v-text-field>
      </v-col>
      <v-col class="text-right">
        <v-btn prepend-icon="mdi mdi-plus" rounded variant="tonal" color="blue"
          @click="router.push(`/redzone/create`);">Criar Redzone</v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-n5">
      <v-col cols="12" class="text-center">
        <v-btn-toggle v-model="statusFilter" variant="outlined" divided>
          <v-btn :value="null" color="primary">Todos</v-btn>
          <v-btn :value="true" color="success">Ativos</v-btn>
          <v-btn :value="false" color="error">Desativados</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col v-for="redzone in filteredRedzones" :key="redzone.id_redzone" cols="12" sm="6" md="4" lg="3">
        <v-card class="pa-2" hover>
          <v-card-title class="text-center" style="color: #3f51b5;">{{ redzone.nome_redzone }}</v-card-title>
          <v-row class="py-2">
            <v-divider class="mx-7" />
          </v-row>
          <v-row>
            <v-col class="px-6 pt-1 mb-n5">
              <v-chip variant="tonal" :color="redzone.status ? 'success' : 'red'" :text="redzone.status ? 'Ativo' :
    'Desativado'" />
            </v-col>
          </v-row>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <span class="font-weight-bold">Responsável:</span>
                  {{ redzone.responsavel_id.nome_usuario }}
                </v-col>
              </v-row>
              <v-row class="mt-n2">
                <v-col>
                  <span class="font-weight-bold">Capacidade Máxima:</span>
                  {{ redzone.capacidade_maxima }}
                </v-col>
              </v-row>
              <v-row class="mt-n2">
                <v-col>
                  <span class="font-weight-bold">Departamento:</span>
                  {{ redzone.id_departamento.nome_departamento }}
                </v-col>
              </v-row>
              <v-row class="mt-n2">
                <v-col>
                  <span class="font-weight-bold">URL Câmera:</span>
                  {{ redzone.camera }}
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="text-center">
            <v-tooltip location="bottom" text="Visualizar Registros">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" @click="router.push(`/redzone/logs/${redzone.id_redzone}`)"
                  color="grey-darken-1">mdi
                  mdi-eye</v-icon>
              </template>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip location="bottom" text="Editar">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" @click="router.push(`/redzone/update/${redzone.id_redzone}`)" color="primary">mdi
                  mdi-pencil</v-icon>
              </template>
            </v-tooltip>
            <v-tooltip location="bottom" :text="redzone.status ? 'Desativar' : 'Ativar'">
              <template v-slot:activator="{ props }">
                <v-btn variant="text" v-bind="props" v-if="!loading" @click="active(redzone)"
                  :color="redzone.status ? 'red' : 'green'" v-on="on"
                  :icon="redzone.status ? 'mdi mdi-sync-off' : 'mdi mdi-sync'" />
                <v-btn variant="plain" v-if="loading" :loading="loading" />
              </template>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { Redzone } from '../../types/IRedzone';
import RedzoneStore from '../../stores/Redzone';
import { obterDataFormatada } from '../../utils/formatters';
import useNotification from '../../stores/notification';

const router = useRouter();
const redzoneService = RedzoneStore();
const loading = ref(false);
const redzones = ref<Redzone[]>([]);
const statusFilter = ref<boolean | null>(null);
const searchTerm = ref('')
const notificator = useNotification();

const active = async (redzone: Redzone) => {
  try {
    loading.value = true
    const dataAtualFormatada = obterDataFormatada();
    const redzoneEnviada = {
      id_redzone: Number(redzone.id_redzone),
      nome_redzone: redzone.nome_redzone,
      responsavel_id: redzone.responsavel_id,
      camera: redzone.camera,
      capacidade_maxima: redzone.capacidade_maxima,
      id_departamento: redzone.id_departamento,
      delete_at: redzone.status === true ? dataAtualFormatada : ''
    }
    await redzoneService.update(redzoneEnviada)
    redzone.status = !redzone.status
    redzone.status ? notificator.notifySuccess('Sucesso ao desativar redzone!') : notificator.notifySuccess('Sucesso ao ativar redzone!')
    await getAll()
  } catch (error) {
    console.log(error)
    notificator.notifyError('Erro atualizar redzone')
  } finally {
    loading.value = false
    router.push(`/redzone`);
  }
  redzone.status = !redzone.status;
}

const getAll = async () => {
  loading.value = true;
  try {
    const response = await redzoneService.getAll();
    redzones.value = response.data
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

const filteredRedzones = computed(() => {
  let filtered = redzones.value;
  if (searchTerm.value.trim() !== '') {
    const term = searchTerm.value.trim().toLowerCase();
    filtered = filtered.filter(redzone =>
      redzone.nome_redzone?.toLowerCase().includes(term) ||
      (redzone.id_departamento?.nome_departamento ?? '').toLowerCase().includes(term)
    );
  }
  if (statusFilter.value !== null) {
    filtered = filtered.filter(redzone => {
      if (statusFilter.value === true) {
        return redzone.status === true;
      } else if (statusFilter.value === false) {
        return redzone.status === false;
      } else {
        return true;
      }
    });
  }
  return filtered
});

watchEffect(() => {
  filteredRedzones.value;
});

onMounted(async () => {
  await getAll();
});
</script>
