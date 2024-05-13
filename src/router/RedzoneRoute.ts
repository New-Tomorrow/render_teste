import RedzoneListView from '../views/redzone/RedzoneListView.vue'
import RedzoneCreateView from '../views/redzone/RedzoneCreateView.vue'
import RedzoneUpdateView from '../views/redzone/RedzoneUpdateView.vue';
import Filtragem from '../views/redzone/Filtragem.vue';
import RegistroRedzoneView from '../views/logs/RegistroRedzoneView.vue';

const RedzoneRoutes = [
  {
    path: '/redzone',
    children: [
      { path: '/redzone', component: RedzoneListView },
      { path: 'create', name: 'create', component: RedzoneCreateView },
      { path: 'update/:id', name: 'update', component: RedzoneUpdateView },
      { path: 'filtragem', name: 'filtragem', component: Filtragem },
      { path: 'logs/:id', name: 'Logs', component: RegistroRedzoneView },
    ]
  }
];

export default RedzoneRoutes
