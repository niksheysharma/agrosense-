class AgroSenseApp {
    constructor() {
        this.currentLang = 'EN';
        this.currentTab = 'dashboard';
        this.mainContent = document.getElementById('mainContent');
        this.lastImage = null;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupLanguageToggle();
        
        // Initial render
        this.switchTab('dashboard');
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
    }

    setupLanguageToggle() {
        const langBtn = document.getElementById('langToggle');
        const langSpan = document.getElementById('currentLang');
        
        langBtn.addEventListener('click', () => {
            this.currentLang = this.currentLang === 'EN' ? 'HI' : 'EN';
            langSpan.textContent = this.currentLang;
            this.applyTranslations();
            
            // Re-render specific dynamic data if needed (though applyTranslations handles DOM)
            if(this.currentTab === 'dashboard') {
                this.renderRecentScans();
            }
        });
    }

    applyTranslations() {
        const dict = translations[this.currentLang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });
    }

    switchTab(tabId) {
        this.currentTab = tabId;
        const template = document.getElementById(`tmpl-${tabId}`);
        if (!template) return;

        this.mainContent.innerHTML = '';
        this.mainContent.appendChild(template.content.cloneNode(true));
        
        // Post render actions
        if (tabId === 'dashboard') {
            this.renderRecentScans();
        } else if (tabId === 'scan') {
            this.setupScanPage();
        }
        
        this.applyTranslations();
        feather.replace();
        
        // Update Bottom Nav UI if triggered programmatically
        document.querySelectorAll('.nav-item').forEach(nav => {
            if(nav.getAttribute('data-tab') === tabId) nav.classList.add('active');
            else nav.classList.remove('active');
        });
    }

    renderRecentScans() {
        const container = document.querySelector('.scans-list');
        if (!container) return;
        
        container.innerHTML = mockRecentScans.map(scan => `
            <div class="scan-item">
                <img src="${scan.img}" alt="${scan.disease}" class="scan-thumb">
                <div class="scan-info">
                    <h4>${this.currentLang === 'HI' && scan.disease === "Early Blight" ? "शुरुआती झुलसा" : scan.disease}</h4>
                    <span class="scan-date">${scan.date}</span>
                </div>
                <i data-feather="chevron-right" class="text-muted"></i>
            </div>
        `).join('');
        feather.replace();
    }

    setupScanPage() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const scanPreview = document.getElementById('scanPreview');
        const previewImage = document.getElementById('previewImage');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        const analysisLoader = document.getElementById('analysisLoader');

        uploadArea.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.lastImage = e.target.result;
                    uploadArea.classList.add('hidden');
                    scanPreview.classList.remove('hidden');
                    previewImage.src = this.lastImage;
                };
                reader.readAsDataURL(file);
            }
        });

        retakeBtn.addEventListener('click', () => {
            scanPreview.classList.add('hidden');
            uploadArea.classList.remove('hidden');
            fileInput.value = '';
        });

        analyzeBtn.addEventListener('click', () => {
            scanPreview.classList.add('hidden');
            analysisLoader.classList.remove('hidden');
            
            const loaderText = document.getElementById('loaderText');
            
            // Simulate AI inference & Correlating data
            setTimeout(() => {
                loaderText.textContent = this.currentLang === 'EN' ? "Analyzing leaf patterns..." : "पत्ती के पैटर्न का विश्लेषण...";
            }, 1000);
            
            setTimeout(() => {
                loaderText.textContent = this.currentLang === 'EN' ? "Correlating with soil health..." : "मिट्टी के स्वास्थ्य के साथ सहसंबंध...";
            }, 2500);

            setTimeout(() => {
                this.showResultScreen();
            }, 4500);
        });
    }

    showResultScreen() {
        // We use the result template
        const template = document.getElementById('tmpl-result');
        this.mainContent.appendChild(template.content.cloneNode(true));
        
        // Hide the original scan wrapper visually, we overlaid result on top
        const scanSection = document.querySelector('.screen-scan');
        if(scanSection) scanSection.style.display = 'none';

        // Populate Result
        document.getElementById('resImage').src = this.lastImage;
        
        // Mock a specific keyword based on randomness or time to show variation, using 'blight' for demo
        const resultData = correlateData("blight");
        
        document.getElementById('resConfidence').textContent = resultData.confidence;
        document.getElementById('resDisease').textContent = resultData.disease;
        document.getElementById('resSymptoms').textContent = resultData.symptoms;
        document.getElementById('resRootCause').textContent = resultData.rootCause;
        
        const actionsContainer = document.getElementById('resActions');
        actionsContainer.innerHTML = resultData.actions.map((act, index) => `
            <li class="action-item">
                <div class="action-number">${index + 1}</div>
                <div class="action-text">${act}</div>
            </li>
        `).join('');

        this.applyTranslations();
        feather.replace();
    }

    speakResult() {
        if('speechSynthesis' in window) {
            const disease = document.getElementById('resDisease').textContent;
            const cause = document.getElementById('resRootCause').textContent;
            const textToSpeak = this.currentLang === 'EN' 
                ? `Diagnosis is ${disease}. ${cause}` 
                : `${disease} का निदान किया गया है।`;
                
            const msg = new SpeechSynthesisUtterance(textToSpeak);
            msg.lang = this.currentLang === 'EN' ? 'en-US' : 'hi-IN';
            window.speechSynthesis.speak(msg);
        } else {
            alert("Voice synthesis not supported in this browser.");
        }
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AgroSenseApp();
    feather.replace();
});
