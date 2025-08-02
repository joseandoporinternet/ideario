import { useState, useEffect } from "react";
import {
  pb,
  authUser,
  createUser,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  deleteImagesByNote,
} from "./services/pocketbase";
import Navbar from "./components/Navbar";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'

  // Verificar si hay usuario autenticado al cargar
  useEffect(() => {
    const authData = pb.authStore.model;
    if (authData) {
      setUser(authData);
      loadNotes();
    } else {
      setShowAuth(true);
    }
    setIsLoading(false);

    // Escuchar cambios en el auth store
    pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    });
  }, []);

  const loadNotes = async () => {
    try {
      const notesData = await getNotes();
      setNotes(notesData.items);
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const handleAuth = async (email, password, passwordConfirm = null) => {
    try {
      if (authMode === "login") {
        await authUser(email, password);
      } else {
        await createUser(email, password, passwordConfirm);
        await authUser(email, password);
      }
      setShowAuth(false);
      loadNotes();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleLogout = () => {
    pb.authStore.clear();
    setUser(null);
    setNotes([]);
    setSelectedNote(null);
    setShowAuth(true);
  };

  const handleNewNote = async () => {
    try {
      // Crea la nota en el backend con título y contenido vacíos
      const nuevaNota = await createNote("", "");
      // Recarga la lista de notas (opcional, pero recomendado)
      await loadNotes();
      // Selecciona la nota recién creada (con id real)
      setSelectedNote(nuevaNota);
    } catch (error) {
      alert("Error al crear la nota: " + error.message);
    }
  };

  const handleSaveNote = async (noteData) => {
    if (!selectedNote) return;

    try {
      await updateNote(selectedNote.id, noteData.title, noteData.content);
      await loadNotes();

      // Actualizar la nota seleccionada
      const updatedNote = { ...selectedNote, ...noteData };
      setSelectedNote(updatedNote);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta nota?")) return;

    try {
      await deleteImagesByNote(noteId); // Elimina imágenes asociadas
      await deleteNote(noteId);
      await loadNotes();

      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="app-loader">
        <div className="loader-text">Cargando...</div>
      </div>
    );
  }

  if (showAuth) {
    return (
      <AuthComponent
        onAuth={handleAuth}
        authMode={authMode}
        setAuthMode={setAuthMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onNewNote={handleNewNote} onLogout={handleLogout} />
      <div className="main-content">
        <NotesList
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={setSelectedNote}
          onDeleteNote={handleDeleteNote}
        />
        <NoteEditor note={selectedNote} onSave={handleSaveNote} />
      </div>
    </div>
  );
}

// Componente de autenticación
const AuthComponent = ({ onAuth, authMode, setAuthMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === "register" && password !== passwordConfirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    onAuth(email, password, passwordConfirm);
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="auth-header">
          {" "}
          <img src="/ideario_logo.png" width={"128px"} alt="" />
          <h2 className="auth-title">Ideario</h2>
          <p className="auth-subtitle">
            {authMode === "login"
              ? "Inicia sesión en tu cuenta"
              : "Crea tu cuenta"}
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Contraseña</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>
          {authMode === "register" && (
            <div className="auth-field">
              <label className="auth-label">Confirmar Contraseña</label>
              <input
                type="password"
                required
                minLength={8}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="auth-input"
              />
            </div>
          )}
          <button type="submit" className="auth-btn">
            {authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </button>
        </form>
        <div className="auth-footer">
          <button
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
            className="auth-switch"
          >
            {authMode === "login"
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
