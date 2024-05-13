import { createRouter, createWebHistory } from "vue-router";
import RegistroRoute from './RegistroRoute'
import RedzoneRoute from "./RedzoneRoute";
import departamentoRoute from "./DepartamentoRoute";
import UsuarioRoute from "./UsuarioRoute";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    RegistroRoute,
    ...UsuarioRoute, 
    ...RedzoneRoute,
    departamentoRoute,
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
