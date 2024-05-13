import UsuarioCreateView from "../views/usuario/UsuarioCreateView.vue";
import UsuarioUpdateView from "../views/usuario/UsuarioUpdateView.vue";
import UsuarioView from "../views/usuario/UsuarioView.vue";

const UsuarioRoute = [
  {
    path: "/",
    redirect: "/usuarios",
    children: [
      {
        path: "/usuarios",
        name: "usuarios",
        meta: {
          title: "Usuarios",
        },
        component: UsuarioView,
      },
      {
        path: "criar-usuarios",
        name: "criarUsuarios",
        meta: {
          title: "Criar Usuario",
        },
        component: UsuarioCreateView,
      },
      {
        path: "editar-usuario/:id",
        name: "editarUsuario",
        meta: {
          title: "Editar Usuario",
        },
        component: UsuarioUpdateView,
      },
    ],
  }
];

export default UsuarioRoute;