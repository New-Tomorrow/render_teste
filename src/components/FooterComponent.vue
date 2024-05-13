<template>
    <v-footer no-flex class="bg-light-blue-darken-4 justify-center text-center d-flex flex-row">
        <div class="">
            <v-btn v-for="icon in icons" :key="icon" :icon="icon" variant="text" class="justify-start"></v-btn>
            <div>
                © {{ new Date().getFullYear() }} — <strong>Altave | Todos os direitos reservados.</strong>
            </div>
        </div>
    </v-footer>
</template>
<script setup lang="ts">
const icons = [
    'fa-facebook',
    'fa-linkedin',
    'fa-instagram',
    ]
const links = [
    {title: 'Política de Privacidade', route: '/1'},
    {title: 'Notícias', route: '/2'},
    {title: 'Recursos', route: '/3'},
    {title: 'Carreira', route: '/4'},
    {title: 'Contato', route: '/5'}
]
</script>
