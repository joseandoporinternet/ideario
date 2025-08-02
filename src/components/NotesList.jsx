const NotesList = ({ notes, selectedNote, onSelectNote, onDeleteNote }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const truncateContent = (content, maxLength = 120) => {
    if (!content) return 'Sin contenido...';
    const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (!textContent) return 'Sin contenido...';
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...' 
      : textContent;
  };

  return (
    <div className="noteslist-panel">
      {/* Header */}
      <div className="noteslist-header">
        <h2 className="noteslist-title">Mis Notas</h2>
        <p className="noteslist-count">
          {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
        </p>
      </div>
      {/* Lista de notas */}
      <div className="noteslist-list">
        {notes.length === 0 ? (
          <div className="noteslist-empty">
            <span className="noteslist-empty-icon">📝</span>
            <h3 className="noteslist-empty-title">Sin notas aún</h3>
            <p className="noteslist-empty-desc">Crea tu primera nota para empezar a organizar tus ideas</p>
            <div className="noteslist-empty-hint">Usa el botón "Nueva Nota" arriba</div>
          </div>
        ) : (
          <div className="noteslist-items">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={
                  "noteslist-item" +
                  (selectedNote?.id === note.id ? " selected" : "")
                }
              >
                {selectedNote?.id === note.id && (
                  <div className="noteslist-item-indicator"></div>
                )}
                <div className="noteslist-item-header">
                  <h3 className={"noteslist-item-title" + (selectedNote?.id === note.id ? " selected" : "")}>
                    {note.title || 'Sin título'}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                    className="noteslist-item-delete"
                    title="Eliminar nota"
                  >
                    <svg className="noteslist-item-delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="noteslist-item-content">{truncateContent(note.content)}</p>
                <div className="noteslist-item-footer">
                  <span className="noteslist-item-date">{formatDate(note.updated)}</span>
                  {note.content && note.content.length > 0 && (
                    <div className="noteslist-item-icons">
                      {note.content.includes('<img') && <span>🖼️</span>}
                      {note.content.includes('<a ') && <span>🔗</span>}
                      {(note.content.includes('<ul>') || note.content.includes('<ol>')) && <span>📋</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;