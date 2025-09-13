export const injectCSS = () => {
    if (document.getElementById('courier-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'courier-animations';
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .card-hover:hover {
            transform: scale(1.02) !important;
            box-shadow: 0 8px 25px rgba(0,191,166,0.15) !important;
        }
        
        .button-hover:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 5px 15px rgba(0,191,166,0.3) !important;
        }
        
        .modal-enter {
            animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes modalSlideIn {
            from { opacity: 0; transform: scale(0.9) translateY(-20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .status-update {
            animation: statusChange 0.6s ease-out;
        }
        
        @keyframes statusChange {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .card-hover:hover {
            transform: scale(1.02) translateY(-4px) !important;
            box-shadow: 0 12px 35px rgba(0,191,166,0.2) !important;
        }
        
        .sort-toggle:hover {
            color: #aaa !important;
        }
        
        .compact-sort-button:hover {
            background: rgba(0,191,166,0.05) !important;
            color: #ddd !important;
        }
        
        @keyframes logoGlow {
            0% { filter: drop-shadow(0 0 15px rgba(255,215,0,0.6)); }
            100% { filter: drop-shadow(0 0 25px rgba(255,215,0,1)) drop-shadow(0 0 35px rgba(0,191,166,0.4)); }
        }
        
        @keyframes shimmerText {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .back-to-top:hover {
            transform: scale(1.1) translateY(-2px) !important;
            box-shadow: 0 12px 30px rgba(0,191,166,0.5) !important;
        }
        
        .edit-search-button:hover {
            background: rgba(0,191,166,0.3) !important;
            transform: scale(1.05) !important;
        }
        
        .compact-logo-btn:hover {
            background: rgba(255,215,0,0.1) !important;
            transform: scale(1.05) !important;
        }
        
        .back-from-about:hover {
            background: rgba(255,255,255,0.2) !important;
            color: white !important;
        }
        
        .stat-card:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(0,191,166,0.2) !important;
        }
        
        .vision-card:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(255,215,0,0.2) !important;
        }
        
        .clear-button:hover {
            background: rgba(239,83,80,0.2) !important;
            color: #ef5350 !important;
            transform: translateY(-50%) scale(1.1) !important;
        }
        
        .search-input:focus {
            border-color: #00bfa6 !important;
            box-shadow: 0 0 0 3px rgba(0,191,166,0.1) !important;
        }
        
        .search-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00bfa6, transparent);
            opacity: 0.6;
        }
    `;
    document.head.appendChild(style);
};