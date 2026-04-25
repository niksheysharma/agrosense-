// Mock Data and Logic for AgroSense

const translations = {
    EN: {
        navDashboard: "Home",
        navSoil: "Soil",
        welcome: "Welcome back, Farmer!",
        farmStatus: "Your farm is looking healthy overall.",
        alertTitle: "Pest Alert",
        alertDesc: "High risk of Aphids matching regional trends. Consider preventive spray.",
        soilHealth: "Real-time Soil Health",
        seeAll: "Details",
        recentScans: "Recent Scans",
        newScan: "New Diagnosis",
        scanInstruction: "Capture or upload a clear picture of the affected leaf.",
        tapToUpload: "Tap to capture or upload",
        offlineReady: "Works offline",
        analyzeBtn: "Analyze Disease & Soil",
        retakeBtn: "Retake",
        analyzing: "Running On-Device AI...",
        diagnosisResult: "Diagnosis Result",
        rootCauseAnalysis: "Root Cause Analysis",
        actionPlan: "Recommended Action Plan",
        readAloud: "Read Aloud",
        backHome: "Back to Home",
        soilHealthCard: "Soil Health Card",
        live: "Live Data",
        soilRecommendations: "Soil Recommendations",
        soilAdviceText: "Phosphorus levels are dropping. Consider applying a balanced NPK fertilizer (like 10-26-26) in the next week. Moisture is critical, schedule irrigation soon."
    },
    HI: {
        navDashboard: "होम",
        navSoil: "मिट्टी",
        welcome: "वापसी पर स्वागत है, किसान!",
        farmStatus: "आपका खेत कुल मिलाकर स्वस्थ दिख रहा है।",
        alertTitle: "कीट अलर्ट",
        alertDesc: "क्षेत्रीय रुझानों के अनुसार एफिड्स का उच्च जोखिम। निवारक स्प्रे पर विचार करें।",
        soilHealth: "रीयल-टाइम मिट्टी का स्वास्थ्य",
        seeAll: "विवरण",
        recentScans: "हाल के स्कैन",
        newScan: "नया निदान",
        scanInstruction: "प्रभावित पत्ती की एक साफ तस्वीर लें या अपलोड करें।",
        tapToUpload: "कैप्चर या अपलोड करने के लिए टैप करें",
        offlineReady: "ऑफ़लाइन काम करता है",
        analyzeBtn: "रोग और मिट्टी का विश्लेषण करें",
        retakeBtn: "फिर से लें",
        analyzing: "ऑन-डिवाइस एआई चल रहा है...",
        diagnosisResult: "निदान परिणाम",
        rootCauseAnalysis: "मूल कारण विश्लेषण",
        actionPlan: "अनुशंसित कार्य योजना",
        readAloud: "जोर से पढ़ें",
        backHome: "होम पर वापस जाएं",
        soilHealthCard: "मृदा स्वास्थ्य कार्ड",
        live: "लाइव डेटा",
        soilRecommendations: "मिट्टी की सिफारिशें",
        soilAdviceText: "फास्फोरस का स्तर गिर रहा है। अगले सप्ताह में संतुलित एनपीके उर्वरक (जैसे 10-26-26) लगाने पर विचार करें। नमी बहुत कम है, जल्द ही सिंचाई का समय तय करें।"
    }
};

const mockRecentScans = [
    { id: 1, disease: "Healthy Tomato", date: "Today, 09:41 AM", img: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=150&h=150" },
    { id: 2, disease: "Early Blight", date: "Yesterday, 04:20 PM", img: "https://images.unsplash.com/photo-1614914134440-1e5b854a613f?auto=format&fit=crop&q=80&w=150&h=150" }
];

// Current mocked soil data (Simulating BLE/IoT input)
const currentSoilData = {
    N: 45, // mg/kg
    P: 12, // mg/kg (low)
    K: 180, // mg/kg
    pH: 6.5,
    moisture: 32, // % (low)
    temp: 28 // C
};

// Correlation Engine logic
function correlateData(diseaseStr) {
    let result = {
        disease: "Unknown",
        confidence: "80%",
        symptoms: "General distress.",
        rootCause: "Unknown factors.",
        actions: []
    };

    // Very basic mock correlation
    if (diseaseStr.includes("blight") || diseaseStr.includes("spot")) {
        result.disease = "Early Blight";
        result.confidence = "92%";
        result.symptoms = "Brown necrotic spots with concentric rings.";
        result.rootCause = `Combining leaf symptoms with your current soil moisture (${currentSoilData.moisture}%) and temperature (${currentSoilData.temp}°C), this fungal infection is likely spreading due to recent warm spells alternating with dry soil stress.`;
        result.actions = [
            "Apply copper-based fungicide to affected plants immediately.",
            "Water at the base of the plant to avoid wetting leaves.",
            "Remove and burn heavily infected lower leaves."
        ];
    } else if (diseaseStr.includes("yellow")) {
        result.disease = "Nitrogen Deficiency";
        result.confidence = "88%";
        result.symptoms = "Lower leaves turning pale yellow (chlorosis).";
        result.rootCause = `Your soil sensor shows Nitrogen at ${currentSoilData.N} mg/kg (borderline) while Phosphorus is low (${currentSoilData.P} mg/kg). The yellowing is directly correlated to low nutrient availability.`;
        result.actions = [
            "Apply urea or a balanced NPK fertilizer within 2 days.",
            "Increase watering slightly to help nutrient uptake.",
            "Consider planting leguminous cover crops next season."
        ];
    } else {
        // Default generic outcome
        result.disease = "Nutrient Stress";
        result.confidence = "85%";
        result.symptoms = "Leaf discoloration and wilting.";
        result.rootCause = `Identified plant stress correlates with low soil moisture (${currentSoilData.moisture}%) and low Phosphorus (${currentSoilData.P} mg/kg).`;
        result.actions = [
            "Irrigate the field this evening.",
            "Apply a phosphorus-rich granular fertilizer.",
            "Monitor for 3 days to see if symptoms halt."
        ];
    }

    return result;
}
