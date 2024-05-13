import { defineStore } from "pinia";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../utils/services/axios";
import { AxiosError } from "axios";
import { Usuario } from "../types/IUsuario";
import { ref } from "vue";
import IUsuario from "../interfaces/IUsuario";

const UsuarioStore = defineStore("usuario", () => {
  const usuario = ref<IUsuario>({} as IUsuario);
  const errorCatch = ref<unknown>(undefined);

  async function getAll() {
    try {
      const res = await getRequest("usuarios");
      return { data: res.data, error: null };
    } catch (error: unknown) {
      throw new Error(
        (error instanceof AxiosError ? error.response?.data.error : null) ||
          error
      );
    }
  }

  async function create(usuario: Usuario) {
    try {
      const res = await postRequest("/usuarios", usuario);
      return { data: res.data, error: null };
    } catch (error: unknown) {
      throw new Error(
        (error instanceof AxiosError ? error.response?.data.error : null) ||
          error
      );
    }
  }

  const getUsuarioById = async (id: number) => {
    try {
      const response = await getRequest(`usuarios/${id}`);
      usuario.value = response.data;
    } catch (error) {
      errorCatch.value = error;
    }
  };

  const desativarOuAtivarUsuario = async (id: number) => {
    try {
      const response = await deleteRequest(`usuarios/${id}`);
      usuario.value = response.data.reverse();
    } catch (error) {
      errorCatch.value = error;
    }
  };

  async function update(id: number, usuario: Usuario) {
    try {
      const res = await putRequest(`usuarios/${id}`, usuario);
      return { data: res.data, error: null };
    } catch (error: unknown) {
      throw new Error(
        (error instanceof AxiosError ? error.response?.data.error : null) ||
          error
      );
    }
  }

  return {
    usuario,
    getAll,
    create,
    getUsuarioById,
    desativarOuAtivarUsuario,
    update,
  };
});

export default UsuarioStore;
