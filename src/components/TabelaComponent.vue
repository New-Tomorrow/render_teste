<template>
  <v-container>
    <div class="d-flex justify-end">
      <v-btn @click="$router.push({ name: rota })" v-if="adicionar" color="primary" text class="ma-2">
        {{ adicionar }}
      </v-btn>
    </div>
    <v-card :title="titulo" class="text-light-blue-darken-4 mx-auto ml-10" elevation="10">
      <template v-slot:text>
        <v-text-field v-model="search" label="Procurar" prepend-inner-icon="mdi mdi-magnify" variant="outlined"
          hide-details single-line></v-text-field>
      </template>
      <v-data-table loading-text="Procurando informações" :loading="isLoading" items-per-page-text="Itens por página"
        no-data-text="Não possui nenhum registro." :headers="headers" :items="itensRegistro
          ? itensRegistro
          : itensDepartamento
            ? itensDepartamento
            : intensUsuario
        " item-key="id" :items-per-page="25" :search="search">
        <template v-slot:item="{ item }">
          <tr>
            <td>
              {{
        item.id
          ? item.id
          : item.id_departamento
            ? item.id_departamento
            : item.id_usuario
      }}
            </td>
            <td v-if="item.redzone || item.nome_departamento || item.nome_usuario">
              {{
        item.redzone
          ? item.redzone
          : item.nome_departamento
            ? item.nome_departamento
            : item.nome_usuario
      }}
            </td>
            <td>
              {{
          item.data
            ? formatarData(item.data)
            : formatarData(item.create_at)
        }}
            </td>
            <td v-if="item.responsavel_id?.nome_usuario" class="text-capitalize">
              {{ item.responsavel_id.nome_usuario }}
            </td>

            <td v-if="item.email">
              {{ item.email }}
            </td>
            <td v-if="item.matricula_empresa">
              {{ item.matricula_empresa }}
            </td>
            <td v-if="item.tipo_usuario">
              <v-chip variant="tonal" :color="item.tipo_usuario === 'Administrador' ? 'blue' : item.tipo_usuario === 'Guarda'? 'green': 'orange'
        ">
                {{ item.tipo_usuario }}
              </v-chip>
            </td>
            <td v-show="item.lotacao || item.lotacao === 0">
              <v-chip v-if="item.lotacaoMaxima" variant="tonal"
                :color="item.lotacao > item.lotacaoMaxima ? 'red' : 'green'">
                {{ item.lotacao }}
              </v-chip>
              <v-chip v-else>
                {{ item.lotacao }}
              </v-chip>
            </td>

            <td v-if="item.entrada">
              <v-chip variant="tonal" class="text-capitalize" :color="item.entrada === 'saida' ? '#F6893D' : '#3B82F6'">
                {{ item.entrada }}
              </v-chip>
            </td>
            <td @click="
        desativar &&
        desativar(
          item.id
            ? item.id
            : item.id_departamento
              ? item.id_departamento
              : item.id_usuario
        )
        " v-if="headers.some((header) => header.value === 'desativar')">
              <v-tooltip :text="!item.status ? 'Desativar' : 'Ativar'">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" class="cursor-pointer" :color="!item.status ? 'red' : 'green'"
                    aria-hidden="false">
                    {{ !item.status ? "mdi mdi-sync-off" : "mdi mdi-sync" }}
                  </v-icon>
                </template>
              </v-tooltip>
            </td>
            <td @click="
        editar && editar(
          item.id
            ? item.id
            : item.id_departamento
              ? item.id_departamento
              : item.id_usuario
        )
        " v-if="headers.some((header) => header.value === 'editar')">
              <v-tooltip text="Editar">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" class="cursor-pointer" color="#3B82F6" aria-hidden="false">
                    mdi mdi-pen
                  </v-icon>
                </template>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import IDepartamento from "../interfaces/IDepartamento";
import IUsuario from "../interfaces/IUsuario";

interface Registro {
  id: number;
  entrada: string;
  data: string;
  lotacao?: number;
  redzone?: string;
  lotacaoMaxima?: number;
}

const search = ref("");
const props = defineProps<{
  headers: { title: string; value: string }[];
  itensRegistro?: { registro: Registro[] }[];
  itensDepartamento?: IDepartamento[];
  intensUsuario?: IUsuario[];
  adicionar?: string;
  rota?: string;
  titulo: string;
  isLoading?: boolean;
  desativar?: (id: number) => void;
  ativar?: (id: number) => void;
  editar?: (id: number) => void;
}>();

function formatarData(data: string): string {
  const [ano, mes, diaHora] = data.split("-");
  const [dia, hora] = diaHora.split(" ");

  return `${dia}/${mes}/${ano} ${hora}`;
}
</script>
