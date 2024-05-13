<template>
  <v-container>
    <v-app-bar color="primary" prominent>
      <v-row bg-color="#015280" class="d-flex justify-space-between align-center">
        <v-col cols="9">
          <v-img :width="95" src="../assets/logoAltave-removebg-preview.png" alt="logo-altave" />
        </v-col>
        <v-col cols="2">
          <div>
            <v-menu v-model="menu" :close-on-content-click="false" >
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="plain">
                  MASTER
                </v-btn>
              </template>
              <v-card min-width="300">
                <!-- <v-list>
                  <v-list-item @click="menuActive" subtitle="Usuário" title="Everton Ribeiro">
                  </v-list-item>
                </v-list>

                <v-divider></v-divider> -->

                <v-list>
                  <v-list-item @click="menuActive('usuarios')">
                    <div class="d-flex ga-3">
                      <v-icon icon="fa-users" color="#015280" />
                      <div class="text-overline">Meus usuários</div>
                    </div>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item @click="menuActive('departamentos')">
                    <div class="d-flex ga-3">
                      <v-icon icon="fa-book" color="#015280" />
                      <div class="text-overline">Departamentos</div>
                    </div>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item @click="menuActive('redzone')">
                    <div class="d-flex ga-3">
                      <v-icon icon="mdi mdi-circle-off-outline" color="#015280" />
                      <div class="text-overline">Redzones</div>
                    </div>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item @click="menuActive('redzone/filtragem')">
                    <div class="d-flex ga-3">
                      <v-icon icon="mdi mdi-filter" color="#015280" />
                      <div class="text-overline">Filtragem Redzones</div>
                    </div>
                  </v-list-item>
                </v-list>
                <!-- <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn variant="text" @click="menu = false">
                    Logout
                  </v-btn>
                </v-card-actions> -->
              </v-card>
            </v-menu>
          </div>
        </v-col>
      </v-row>
    </v-app-bar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const menu = ref(false);
const message = ref(true);
const hints = ref(true)


const menuActive = (rota: string) => {
  router.push(`/${rota}`);
}

</script>
