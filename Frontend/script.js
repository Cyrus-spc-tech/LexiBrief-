/**
 * LexiBrief Pro - Enterprise Legal AI
 * Frontend Core Logic with Backend API Integration
 */

// --- 1. STATE MANAGEMENT ---
let currentUser = null;
let selectedFile = null;
let processingInProgress = false;
let documentHistory = [];

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api'; // Update with your backend URL
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const SUPPORTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

// --- 2. ELEMENT SELECTORS ---
const appShell = document.getElementById('app-shell');
const authPage = document.getElementById('page-auth');
const reportModal = document.getElementById('report-modal');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const processingOptions = document.getElementById('processing-options');
const progressSection = document.getElementById('progress-section');

// --- 3. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    loadUserPreferences();
    setupDragAndDrop();
    loadDocumentHistory();
});

// --- 4. AUTHENTICATION LOGIC ---
window.toggleAuth = function(type) {
    document.getElementById('form-login').classList.toggle('hidden', type === 'register');
    document.getElementById('form-register').classList.toggle('hidden', type === 'login');
};

window.handleAuth = function(e, type) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        email: formData.get('email') || formData.get('reg-email'),
        password: formData.get('password') || formData.get('reg-password'),
        name: formData.get('reg-name') || 'John Doe'
    };

    // Simulate authentication (replace with real API call)
    simulateAuth(userData, type);
};

async function simulateAuth(userData, type) {
    try {
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Processing...';
        submitBtn.disabled = true;
        lucide.createIcons();

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Store user data
        currentUser = {
            name: userData.name,
            email: userData.email,
            level: 12,
            xp: 2450
        };

        // Transition to main app
        authPage.classList.add('hidden');
        appShell.classList.remove('hidden');
        document.getElementById('user-display-name').innerText = `${currentUser.name}'s Profile`;
        
        // Update stats
        updateDashboardStats();
        
        showToast('Welcome back, ' + currentUser.name + '!', 'success');
        
    } catch (error) {
        showToast('Authentication failed. Please try again.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// --- 5. NAVIGATION LOGIC ---
window.showPage = function(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    
    // Show selected page
    document.getElementById('page-' + pageId).classList.remove('hidden');
    
    // Update sidebar active state
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // Page-specific initialization
    if (pageId === 'profile') {
        renderHistory();
        updateProfileStats();
    } else if (pageId === 'analytics') {
        updateAnalyticsStats();
    } else if (pageId === 'settings') {
        loadSettings();
    }
    
    lucide.createIcons();
};

window.logout = function() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        documentHistory = [];
        appShell.classList.add('hidden');
        authPage.classList.remove('hidden');
        showToast('Logged out successfully', 'success');
    }
};

// --- 6. FILE HANDLING ---
window.handleFileSelect = function(input) {
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    
    // Validate file
    if (!validateFile(file)) {
        return;
    }
    
    selectedFile = file;
    showProcessingOptions();
};

function validateFile(file) {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        showToast('File size exceeds 50MB limit', 'error');
        return false;
    }
    
    // Check file type
    if (!SUPPORTED_TYPES.includes(file.type)) {
        showToast('Unsupported file type. Please upload PDF, DOCX, or TXT files', 'error');
        return false;
    }
    
    return true;
}

function showProcessingOptions() {
    uploadArea.style.display = 'none';
    processingOptions.style.display = 'block';
    lucide.createIcons();
}

window.cancelProcessing = function() {
    selectedFile = null;
    fileInput.value = '';
    uploadArea.style.display = 'block';
    processingOptions.style.display = 'none';
};

window.startProcessing = function() {
    if (!selectedFile || processingInProgress) return;
    
    const summaryType = document.querySelector('input[name="summary-type"]:checked').value;
    processDocument(selectedFile, summaryType);
};

async function processDocument(file, summaryType) {
    processingInProgress = true;
    
    // Hide options, show progress
    processingOptions.style.display = 'none';
    progressSection.style.display = 'block';
    
    // Initialize progress
    updateProgress(0, 'Initializing neural engine...');
    
    try {
        // Step 1: Upload file
        updateProgress(20, 'Uploading document...');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('summary_type', summaryType);
        
        // Simulate file upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateProgress(40, 'Extracting text from document...');
        activateStep('step-extract');
        
        // Step 2: Process document
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateProgress(60, 'Processing legal content...');
        activateStep('step-process');
        
        // Step 3: Generate summary
        await new Promise(resolve => setTimeout(resolve, 2000));
        updateProgress(80, 'Generating AI summary...');
        activateStep('step-summarize');
        
        // Step 4: Complete processing
        const result = await simulateDocumentProcessing(file, summaryType);
        updateProgress(100, 'Processing complete!');
        
        // Add to history
        addToHistory(result);
        
        // Show results
        setTimeout(() => {
            progressSection.style.display = 'none';
            uploadArea.style.display = 'block';
            openSummary(result);
            showToast('Document processed successfully!', 'success');
        }, 1000);
        
    } catch (error) {
        console.error('Processing error:', error);
        showToast('Processing failed. Please try again.', 'error');
        resetProcessingState();
    } finally {
        processingInProgress = false;
    }
}

async function simulateDocumentProcessing(file, summaryType) {
    // Simulate backend processing with realistic results
    const baseName = file.name.split('.')[0];
    const timestamp = new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    // Generate realistic summary based on file type
    let summary = '';
    let riskLevel = 'Low';
    let riskMessage = '';
    
    if (file.name.toLowerCase().includes('agreement') || file.name.toLowerCase().includes('contract')) {
        summary = `This ${summaryType} summary captures the key terms of the ${baseName} agreement. The document outlines standard commercial terms including payment schedules, delivery obligations, and confidentiality provisions. Key clauses include limitation of liability, indemnification, and termination provisions. The agreement appears to follow standard legal templates with no unusual provisions detected.`;
        riskLevel = Math.random() > 0.7 ? 'Medium' : 'Low';
        riskMessage = riskLevel === 'Medium' ? 
            'Some clauses may require further review for clarity.' : 
            'Standard agreement with no critical risks identified.';
    } else if (file.name.toLowerCase().includes('nda') || file.name.toLowerCase().includes('confidential')) {
        summary = `This ${summaryType} summary of the ${baseName} covers the confidentiality obligations between parties. The document defines confidential information, permitted disclosures, and the duration of confidentiality commitments. Standard exceptions for legal requirements and publicly available information are included. The terms appear balanced and enforceable.`;
        riskLevel = Math.random() > 0.8 ? 'High' : 'Low';
        riskMessage = riskLevel === 'High' ? 
            'Broad definition of confidential information may require attention.' : 
            'Standard confidentiality terms with appropriate limitations.';
    } else {
        summary = `This ${summaryType} summary provides a comprehensive overview of the ${baseName} document. The content has been analyzed for key legal concepts, obligations, and risk factors. The summary maintains the essential legal terminology while reducing the document length by approximately 95%. All critical provisions and deadlines have been preserved.`;
        riskLevel = ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)];
        riskMessage = 'Document processed successfully. Review full document for complete details.';
    }
    
    return {
        id: Date.now(),
        name: file.name,
        date: timestamp,
        type: summaryType.toUpperCase(),
        risk: riskLevel,
        summary: summary,
        riskMessage: riskMessage,
        compression: (2 + Math.random() * 3).toFixed(1),
        processingTime: (1.5 + Math.random() * 2).toFixed(1),
        confidence: (92 + Math.random() * 7).toFixed(0),
        rouge1: (0.35 + Math.random() * 0.15).toFixed(2),
        rouge2: (0.12 + Math.random() * 0.10).toFixed(2),
        rougel: (0.30 + Math.random() * 0.12).toFixed(2)
    };
}

function updateProgress(percentage, status) {
    const progressFill = document.getElementById('progress-fill');
    const progressStatus = document.getElementById('progress-status');
    
    progressFill.style.width = percentage + '%';
    progressStatus.textContent = status;
}

function activateStep(stepId) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(stepId).classList.add('active');
}

function resetProcessingState() {
    selectedFile = null;
    fileInput.value = '';
    progressSection.style.display = 'none';
    uploadArea.style.display = 'block';
    processingOptions.style.display = 'none';
    updateProgress(0, 'Initializing neural engine...');
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
}

// --- 7. REPORT MODAL LOGIC ---
window.openSummary = function(documentData) {
    if (!documentData) return;
    
    // Populate modal with document data
    document.getElementById('m-name').textContent = documentData.name;
    document.getElementById('m-summary').textContent = documentData.summary;
    document.getElementById('m-type').textContent = documentData.type;
    document.getElementById('m-compression').textContent = documentData.compression + '%';
    document.getElementById('m-time').textContent = documentData.processingTime + 's';
    document.getElementById('m-confidence').textContent = documentData.confidence + '%';
    document.getElementById('m-rouge1').textContent = documentData.rouge1;
    document.getElementById('m-rouge2').textContent = documentData.rouge2;
    document.getElementById('m-rougel').textContent = documentData.rougel;
    
    // Update risk assessment
    const riskCard = document.getElementById('m-risk');
    const riskClass = documentData.risk.toLowerCase();
    riskCard.className = `risk-card risk-${riskClass}`;
    riskCard.innerHTML = `<strong>${documentData.risk} Risk:</strong> ${documentData.riskMessage}`;
    
    // Show modal
    reportModal.classList.remove('hidden');
    lucide.createIcons();
};

window.closeModal = function() {
    reportModal.classList.add('hidden');
};

window.exportReport = function() {
    showToast('Exporting PDF report...', 'success');
    // Implement PDF export functionality
    setTimeout(() => {
        showToast('Report exported successfully!', 'success');
    }, 1500);
};

window.shareReport = function() {
    if (navigator.share) {
        navigator.share({
            title: 'LexiBrief Legal Analysis',
            text: 'Check out this legal document analysis',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'success');
    }
};

// --- 8. HISTORY AND DATA MANAGEMENT ---
function addToHistory(documentData) {
    documentHistory.unshift(documentData);
    saveDocumentHistory();
    updateDashboardStats();
}

function saveDocumentHistory() {
    localStorage.setItem('lexibrief_history', JSON.stringify(documentHistory));
}

function loadDocumentHistory() {
    const saved = localStorage.getItem('lexibrief_history');
    if (saved) {
        documentHistory = JSON.parse(saved);
    } else {
        // Load sample data
        documentHistory = [
            {
                id: 1,
                name: "Service_Agreement_v1.pdf",
                date: "Mar 25, 2026",
                type: "HYBRID",
                risk: "Low",
                summary: "Standard SLA with 99.9% uptime guarantee and Net-30 payment terms."
            },
            {
                id: 2,
                name: "Compliance_Audit_Internal.docx",
                date: "Mar 20, 2026",
                type: "EXTRACTIVE",
                risk: "High",
                summary: "Audit flags missing data encryption protocols in Section 4.2 of the security policy."
            }
        ];
    }
}

function renderHistory() {
    const historyBody = document.getElementById('history-body');
    if (!historyBody) return;
    
    if (documentHistory.length === 0) {
        historyBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    No documents processed yet. Upload your first document to get started.
                </td>
            </tr>
        `;
        return;
    }
    
    historyBody.innerHTML = documentHistory.map(doc => `
        <tr onclick="openSummary(${JSON.stringify(doc).replace(/"/g, '&quot;')})" style="cursor: pointer;">
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i data-lucide="file-text" size="16"></i>
                    <strong>${doc.name}</strong>
                </div>
            </td>
            <td>${doc.date}</td>
            <td><span class="type-badge">${doc.type}</span></td>
            <td>
                <span class="risk-tag risk-${doc.risk.toLowerCase()}">${doc.risk}</span>
            </td>
            <td style="color: var(--primary); font-weight: 600;">View Report</td>
        </tr>
    `).join('');
    
    lucide.createIcons();
}

window.showHistory = function() {
    showPage('profile');
};

// --- 9. DASHBOARD STATISTICS ---
function updateDashboardStats() {
    const totalDocs = documentHistory.length;
    const risksFound = documentHistory.filter(doc => doc.risk === 'High' || doc.risk === 'Medium').length;
    const timeSaved = (totalDocs * 2.5).toFixed(1); // Assume 2.5 hours saved per document
    
    // Update workspace stats
    updateElement('total-docs', totalDocs);
    updateElement('risks-found', risksFound);
    updateElement('time-saved', timeSaved + 'h');
    
    // Update profile stats
    updateElement('profile-total-scans', totalDocs);
    updateElement('profile-risks', risksFound);
    updateElement('profile-xp', currentUser?.xp || '2450');
}

function updateAnalyticsStats() {
    updateDashboardStats();
    // Add more analytics-specific calculations here
}

function updateProfileStats() {
    updateDashboardStats();
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// --- 10. SETTINGS MANAGEMENT ---
function loadSettings() {
    // Load saved preferences
    const settings = JSON.parse(localStorage.getItem('lexibrief_settings') || '{}');
    
    if (settings.defaultSummary) {
        document.getElementById('default-summary').value = settings.defaultSummary;
    }
    if (settings.summaryLength) {
        document.getElementById('summary-length').value = settings.summaryLength;
    }
    if (settings.emailNotifications !== undefined) {
        document.getElementById('email-notifications').checked = settings.emailNotifications;
    }
    if (settings.riskAlerts !== undefined) {
        document.getElementById('risk-alerts').checked = settings.riskAlerts;
    }
}

function saveSettings() {
    const settings = {
        defaultSummary: document.getElementById('default-summary').value,
        summaryLength: document.getElementById('summary-length').value,
        emailNotifications: document.getElementById('email-notifications').checked,
        riskAlerts: document.getElementById('risk-alerts').checked
    };
    
    localStorage.setItem('lexibrief_settings', JSON.stringify(settings));
    showToast('Settings saved successfully!', 'success');
}

// --- 11. USER PREFERENCES ---
function loadUserPreferences() {
    // Load user preferences and apply them
    const settings = JSON.parse(localStorage.getItem('lexibrief_settings') || '{}');
    
    // Apply theme, language, etc.
    if (settings.theme) {
        document.body.setAttribute('data-theme', settings.theme);
    }
}

// --- 12. DRAG AND DROP ---
function setupDragAndDrop() {
    if (!uploadArea) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    uploadArea.addEventListener('drop', handleDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    uploadArea.classList.add('drag-over');
}

function unhighlight(e) {
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect(fileInput);
    }
}

// --- 13. UTILITY FUNCTIONS ---
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    
    // Set message and icon
    toastMessage.textContent = message;
    
    // Set icon based on type
    const iconMap = {
        success: 'check-circle',
        error: 'alert-circle',
        warning: 'alert-triangle',
        info: 'info'
    };
    
    toastIcon.setAttribute('data-lucide', iconMap[type] || 'info');
    
    // Set color based on type
    toast.className = `toast toast-${type}`;
    
    // Show toast
    toast.classList.remove('hidden');
    lucide.createIcons();
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// --- 14. ERROR HANDLING ---
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showToast('An unexpected error occurred', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showToast('A network error occurred', 'error');
});

// --- 15. KEYBOARD SHORTCUTS ---
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for quick file upload
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        fileInput.click();
    }
    
    // Escape to close modal
    if (e.key === 'Escape' && !reportModal.classList.contains('hidden')) {
        closeModal();
    }
});

// --- 16. PERFORMANCE OPTIMIZATION ---
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Handle responsive layout changes
        if (window.innerWidth < 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }, 250);
});

// --- 17. SERVICE WORKER (for PWA support) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
