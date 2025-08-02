import PocketBase from 'pocketbase';

const PB_URL = 'https://pocketbase-production-026e.up.railway.app';

export const pb = new PocketBase(PB_URL);

// Función para autenticar usuario
export const authUser = async (email, password) => {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return authData;
  } catch (error) {
    throw error;
  }
};

// Función para crear usuario
export const createUser = async (email, password, passwordConfirm) => {
  try {
    const data = {
      email,
      password,
      passwordConfirm,
    };
    const record = await pb.collection('users').create(data);
    return record;
  } catch (error) {
    throw error;
  }
};

// Función para obtener notas del usuario
export const getNotes = async () => {
  try {
    const records = await pb.collection('notes').getList(1, 50, {
      sort: '-created',
      filter: `user = "${pb.authStore.model?.id}"`,
    });
    return records;
  } catch (error) {
    throw error;
  }
};

// Función para crear nota
export const createNote = async (title, content) => {
  try {
    const data = {
      title,
      content,
      user: pb.authStore.model?.id,
    };
    const record = await pb.collection('notes').create(data);
    return record;
  } catch (error) {
    throw error;
  }
};

// Función para actualizar nota
export const updateNote = async (id, title, content) => {
  try {
    const data = { title, content };
    const record = await pb.collection('notes').update(id, data);
    return record;
  } catch (error) {
    throw error;
  }
};

// Función para eliminar nota
export const deleteNote = async (id) => {
  try {
    await pb.collection('notes').delete(id);
  } catch (error) {
    throw error;
  }
};

// Subir imagen a PocketBase y devolver la URL
export const uploadImage = async (file, noteId) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('note', noteId); // Relacionar imagen con la nota

    const record = await pb.collection('images').create(formData);
    // Devuelve la URL pública de la imagen
    return pb.files.getUrl(record, record.image);
  } catch (error) {
    throw error;
  }
};

// Eliminar imágenes asociadas a una nota
export const deleteImagesByNote = async (noteId) => {
  try {
    const images = await pb.collection('images').getFullList({
      filter: `note = "${noteId}"`
    });
    for (const img of images) {
      await pb.collection('images').delete(img.id);
    }
  } catch (error) {
    // Si no hay imágenes, no pasa nada
  }
};