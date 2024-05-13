<template>
  <v-overlay :model-value="loading" class="align-center justify-center">
    <v-progress-circular v-model="loading" color="primary" size="64" width="5" indeterminate />
  </v-overlay>
  <v-container>
    <v-row>
      <v-col cols="5">
        <v-select v-model="redzoneSelected" :items="redzones" item-title="nome_redzone" item-value="id_redzone" variant="outlined" label="Selecione uma redzone"></v-select>
      </v-col>
      <v-col cols="5">
        <VueDatePicker v-model="date" range></VueDatePicker>
      </v-col>
      <v-col class="justify-end">
        <v-btn color="blue" :disabled="!redzoneSelected || !isValidDateRange" @click="searchLogs">Pesquisar</v-btn>
      </v-col>
    </v-row>

    <v-card v-if="mostrarCard" class="white">
      <v-row>
        <v-col cols="12">
          <v-data-table :items="logs" :headers="headers" :search="search" :loading="loading" loading-text="Pesquisando logs no período selecionado..." no-data-text="Não há registros" no-results-text="Nenhum registro atende à busca" export-name="Logs" items-per-page-text="Itens por página">
            <template #top>
              <v-row justify="center">
                <v-col class="px-10 py-5">
                  <v-tooltip location="bottom" text="Exportar para XLSX">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" color="light-blue-lighten-2" @click="exportToXlsx" rounded="xs" class="mr-3">
                          <v-icon size="x-large" color="white">mdi mdi-file-excel</v-icon>
                        </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip location="bottom" text="Exportar para CSV">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" color="light-blue-lighten-2" @click="exportToCsv" rounded="xs" >
                        <v-icon size="x-large" color="white">mdi mdi-file-delimited</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
            </template>
            <template #item.lotacao="{ item }">
              <td>
                <v-chip >
                  {{ item.lotacao }}
                </v-chip>
              </td>
            </template>
            <template v-slot:item.entradaAsString="{ item }">
              <v-chip :color="item.entradaAsString === 'Saida' ? '#3B82F6' : '#F6893D'"
                class="text-uppercase" size="small" label :text="item.entradaAsString === 'Saida' ? 'Saída' : 'Entrada'" />
            </template>
            <template v-slot:item.data="{ item }">
              <span>{{converterComEspaco(item.data)}}</span>
            </template>

          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { RedzoneStore } from '../../stores';
import { Redzone } from '../../types/IRedzone';
import { converterComEspaco } from '../../utils/formatters';
import useNotification from '../../stores/notification';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import * as XLSX from "xlsx";

const redzoneService = RedzoneStore();
const loading = ref(false);
const mostrarCard = ref(false)
const redzones = ref<Redzone[]>([]);
const logs = ref<IRegistroRedzone[]>([]);
const notificator = useNotification();
const redzoneSelected = ref<string | null>(null);
const date = ref<Date[]>();
const search = ref('');

const headers = [
  { title: 'ID do Log', value: 'id' },
  { title: 'Data', value: 'data' },
  { title: 'Lotação Atual', value: 'lotacao' },
  { title: 'Tipo de Entrada', value: 'entradaAsString' },
  { title: 'Redzone', value: 'redzoneNome' }
];

const isValidDateRange = computed(() => {
  return Array.isArray(date.value) && date.value.length === 2 && date.value[0] < date.value[1];
});

const searchLogs = async () => {
  loading.value = true;
  try {
    if (isValidDateRange.value) {
      const startDate = date.value![0].toISOString().split('.')[0];
      const endDate = date.value![1].toISOString().split('.')[0];
      mostrarCard.value = true
      const response = await redzoneService.getRedzoneDates(redzoneSelected.value!, startDate, endDate);
      logs.value = response.data.map((log: any) => ({
        id: log.id,
        data: log.data,
        lotacao: log.lotacao,
        entradaAsString: log.entrada ? 'Entrada' : 'Saida',
        redzoneNome: log.redzoneId.nome_redzone
      }));
      notificator.notifySuccess("Sucesso ao buscar logs!")
    } else {
      notificator.notifyError('Por favor, selecione um intervalo de datas válido.');
    }
  } catch (error) {
    notificator.notifyError('Erro ao buscar logs');
  } finally {
    loading.value = false;
  }
}

const getAll = async () => {
  loading.value = true;
  try {
    const response = await redzoneService.getAll();
    redzones.value = response.data;
  } catch (error) {
    notificator.notifyError('Erro ao carregar redzones');
  } finally {
    loading.value = false;
  }
}

const exportToXlsx = () => {
  const jsonData = logs.value.map(log => ({...log}));
  const ws = XLSX.utils.json_to_sheet(jsonData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Logs');
  XLSX.writeFile(wb, 'logs.xlsx');
  notificator.notifySuccess("Sucesso ao exportar XLSX!")
};

const exportToCsv = () => {
  let csvContent = 'ID do Log,Data,Lotacao Atual,Tipo de Entrada,Redzone\n';
  logs.value.forEach(log => {
    csvContent += `${log.id},${log.data},${log.lotacao},${log.entradaAsString},${log.redzoneNome}\n`;
  });
  const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const csvUrl = window.URL.createObjectURL(csvBlob);
  const link = document.createElement('a');
  link.href = csvUrl;
  link.setAttribute('download', 'logs.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  notificator.notifySuccess("Sucesso ao exportar CSV!")
};

onMounted(async () => {
  await getAll();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 15);
  const endDate = new Date();
  date.value = [startDate, endDate];
});

</script>
