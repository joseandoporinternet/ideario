import { useState } from 'react';

const Navbar = ({ onNewNote, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getUserInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo y título */}
        <div className="navbar-brand">
          <span className="navbar-logo">
            <img src="/ideario_logo.png" width={'64px'} alt="" />
          </span>
          <span className="navbar-title">Ideario</span>
          <span className="navbar-subtitle">| Tu espacio para ideas</span>
        </div>
        {/* Botones y usuario */}
        <div className="navbar-actions">
          <button
            onClick={onNewNote}
            className="navbar-btn"
          >
            <svg className="navbar-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nueva Nota</span>
          </button>
          {user && (
            <div className="navbar-user-menu">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="navbar-user-btn"
              >
                <div className="navbar-user-avatar">
                  {getUserInitials(user.email)}
                </div>
                <span className="navbar-user-email">{user.email.split('@')[0]}</span>
                <svg className={`navbar-user-arrow${showUserMenu ? ' open' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showUserMenu && (
                <div className="navbar-user-dropdown">
                  <div className="navbar-user-dropdown-header">
                    <p className="navbar-user-dropdown-name">{user.email.split('@')[0]}</p>
                    <p className="navbar-user-dropdown-email">{user.email}</p>
                  </div>
                  <div className="navbar-user-dropdown-actions">
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className="navbar-user-dropdown-btn"
                    >
                      <svg className="navbar-user-dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Configuración</span>
                    </button>
                    <div className="navbar-user-dropdown-divider"></div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="navbar-user-dropdown-btn logout"
                    >
                      <svg className="navbar-user-dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showUserMenu && (
        <div className="navbar-user-backdrop" onClick={() => setShowUserMenu(false)}></div>
      )}
    </nav>
  );
};

export default Navbar;