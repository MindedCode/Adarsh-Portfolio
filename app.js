const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

async function trackEverything() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const isAdminEntry = urlParams.get('show') === 'admin';
        const now = new Date();
        
        const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
        const yK = `${now.getFullYear()}`;

        // Accurate Location Fetching
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        const locName = geoData.city ? `${geoData.city}, ${geoData.region}` : "Unknown Location";

        const commonData = {
            location: locName,
            time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            date: now.toLocaleDateString(),
            platform: navigator.platform
        };

        const updateCount = async (basePath) => {
            const keys = ['total', `years/${yK}`, `months/${mK}`, `days/${dK}`];
            for (let k of keys) {
                const r = await fetch(`${dbURL}/${basePath}/${k}.json`);
                const c = await r.json() || 0;
                await fetch(`${dbURL}/${basePath}/${k}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
            }
        };

        if (isAdminEntry) {
            localStorage.setItem('is_malik', 'true');
            await updateCount('admin_stats');
            await fetch(`${dbURL}/admin_logs.json`, { method: 'POST', body: JSON.stringify(commonData) });
            return;
        }

        // Check if user is Admin
        if (localStorage.getItem('is_malik') === 'true') return;

        // Count Visitor
        await updateCount('visitor_stats');
        await fetch(`${dbURL}/visitor_logs.json`, { 
            method: 'POST', 
            body: JSON.stringify({ ...commonData, source: document.referrer || "Direct" }) 
        });

    } catch (e) { console.log("System Syncing..."); }
}

async function showProfessionalPanel() {
    const res = await fetch(`${dbURL}/.json`);
    const data = await res.json() || {};
    const vStats = data.visitor_stats || {};
    const aStats = data.admin_stats || {};
    const dK = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
    const mK = `${new Date().getMonth() + 1}-${new Date().getFullYear()}`;

    const overlay = document.createElement('div');
    overlay.id = "kaaZra-admin";
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:#0d1117; color:#c9d1d9; z-index:2147483647; font-family:sans-serif; overflow-y:auto; padding:10px; box-sizing:border-box;";
    
    overlay.innerHTML = `
        <style>
            .panel-card { background:#161b22; border:1px solid #30363d; border-radius:8px; padding:15px; margin-bottom:15px; }
            .stat-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:10px; margin-bottom:15px; }
            .stat-box { background:#0d1117; padding:10px; border-radius:6px; text-align:center; border:1px solid #21262d; }
            .log-container { height:250px; overflow-y:auto; background:#0d1117; border-radius:6px; padding:8px; font-size:12px; }
            .log-entry { border-bottom:1px solid #21262d; padding:8px 0; display:flex; justify-content:space-between; flex-wrap:wrap; }
            .btn { cursor:pointer; padding:10px 20px; border-radius:6px; border:none; font-weight:bold; transition:0.3s; }
            .btn-refresh { background:#238636; color:#fff; width:100%; margin-bottom:10px; }
            .btn-refresh:hover { background:#2ea043; }
            .btn-close { background:#da3633; color:#fff; width:100%; }
            .btn-close:hover { background:#f85149; }
            @media (min-width: 768px) {
                .main-grid { display:grid; grid-template-columns: 1fr 1fr; gap:20px; }
                .stat-grid { grid-template-columns: repeat(4, 1fr); }
            }
        </style>
        <div style="max-width:1000px; margin:auto;">
            <h2 style="color:#58a6ff; text-align:center; margin-bottom:20px;">🛡️ KaaZra Master Control</h2>
            
            <button class="btn btn-refresh" onclick="location.reload()">Refresh Data</button>
            
            <div class="main-grid">
                <div class="panel-card">
                    <h3 style="color:#3fb950; border-bottom:1px solid #30363d; padding-bottom:5px;">👥 Visitors</h3>
                    <div class="stat-grid">
                        <div class="stat-box"><small>Today</small><br><b>${vStats.days?.[dK] || 0}</b></div>
                        <div class="stat-box"><small>Month</small><br><b>${vStats.months?.[mK] || 0}</b></div>
                        <div class="stat-box"><small>Total</small><br><b>${vStats.total || 0}</b></div>
                    </div>
                    <div class="log-container">
                        ${Object.values(data.visitor_logs || {}).reverse().slice(0,30).map(l => `
                            <div class="log-entry">
                                <span style="color:#58a6ff;">${l.location}</span>
                                <span style="color:#8b949e;">${l.time}</span>
                            </div>
                        `).join('') || "No Logs"}
                    </div>
                </div>

                <div class="panel-card">
                    <h3 style="color:#f85149; border-bottom:1px solid #30363d; padding-bottom:5px;">🛡️ Admin Access</h3>
                    <div class="stat-grid">
                        <div class="stat-box"><small>Today</small><br><b>${aStats.days?.[dK] || 0}</b></div>
                        <div class="stat-box"><small>Total</small><br><b>${aStats.total || 0}</b></div>
                    </div>
                    <div class="log-container">
                        ${Object.values(data.admin_logs || {}).reverse().slice(0,30).map(l => `
                            <div class="log-entry">
                                <span style="color:#f85149;">${l.location}</span>
                                <span style="color:#8b949e;">${l.time}</span>
                            </div>
                        `).join('') || "No Logs"}
                    </div>
                </div>
            </div>
            <button class="btn btn-close" onclick="document.getElementById('kaaZra-admin').remove()">Close Dashboard</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

const p = new URLSearchParams(window.location.search);
if (p.get('show') === 'admin') showProfessionalPanel();
trackEverything();

// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// async function trackEverything() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const isAdminEntry = urlParams.get('show') === 'admin';
//         const now = new Date();

//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//         const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
//         const yK = `${now.getFullYear()}`;

//         // लोकेशन फेज करना
//         const geoRes = await fetch('https://ipapi.co/json/');
//         const geoData = await geoRes.json();
//         const locName = geoData.city ? `${geoData.city}, ${geoData.region}` : "Unknown Location";

//         const commonData = {
//             location: locName,
//             time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
//             date: now.toLocaleDateString(),
//             platform: navigator.platform
//         };

//         const updateCount = async (basePath, timeKey) => {
//             const paths = [`${basePath}/total`, `${basePath}/years/${yK}`, `${basePath}/months/${mK}`, `${basePath}/days/${dK}`];
//             for (let path of paths) {
//                 const r = await fetch(`${dbURL}/${path}.json`);
//                 const c = await r.json() || 0;
//                 await fetch(`${dbURL}/${path}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
//             }
//         };

//         if (isAdminEntry) {
//             // एडमिन एक्सेस ट्रैक करें
//             localStorage.setItem('is_malik', 'true');
//             await updateCount('admin_stats');
//             await fetch(`${dbURL}/admin_logs.json`, { method: 'POST', body: JSON.stringify(commonData) });
//             return;
//         }

//         // नॉर्मल विज़िटर (अगर मालिक खुद नहीं है)
//         if (localStorage.getItem('is_malik') === 'true') return;

//         await updateCount('visitor_stats');
//         await fetch(`${dbURL}/visitor_logs.json`, {
//             method: 'POST',
//             body: JSON.stringify({ ...commonData, source: document.referrer || "Direct" })
//         });

//     } catch (e) { console.log("System Ready"); }
// }

// async function showProfessionalPanel() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = await res.json() || {};

//     const vStats = data.visitor_stats || {};
//     const aStats = data.admin_stats || {};
//     const now = new Date();
//     const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//     const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
//     const yK = `${now.getFullYear()}`;

//     const overlay = document.createElement('div');
//     overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:#0f0f12; color:#e0e0e0; z-index:999999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:20px; overflow-y:auto; box-sizing:border-box;";

//     overlay.innerHTML = `
//         <div style="max-width:1100px; margin:auto;">
//             <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:15px; margin-bottom:25px;">
//                 <h1 style="margin:0; font-size:24px; color:#58a6ff;">🚀 Professional Analytics Dashboard</h1>
//                 <div>
//                     <button onclick="location.reload()" style="background:#238636; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:600;">Refresh Data</button>
//                     <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background:#da3633; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:600; margin-left:10px;">Close</button>
//                 </div>
//             </div>

//             <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;">
                
//                 <div style="background:#161b22; border:1px solid #30363d; border-radius:12px; padding:20px;">
//                     <h2 style="font-size:18px; margin-top:0; color:#3fb950; border-bottom:1px solid #30363d; padding-bottom:10px;">👥 Visitor Insights</h2>
                    
//                     <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; margin-bottom:20px;">
//                         <div style="text-align:center; background:#0d1117; padding:10px; border-radius:8px;"><small style="color:#8b949e;">Today</small><br><b>${vStats.days?.[dK] || 0}</b></div>
//                         <div style="text-align:center; background:#0d1117; padding:10px; border-radius:8px;"><small style="color:#8b949e;">Month</small><br><b>${vStats.months?.[mK] || 0}</b></div>
//                         <div style="text-align:center; background:#0d1117; padding:10px; border-radius:8px;"><small style="color:#8b949e;">Year</small><br><b>${vStats.years?.[yK] || 0}</b></div>
//                         <div style="text-align:center; background:#23863622; padding:10px; border-radius:8px; border:1px solid #238636;"><small style="color:#8b949e;">Total</small><br><b>${vStats.total || 0}</b></div>
//                     </div>

//                     <div style="height:400px; overflow-y:auto; background:#0d1117; border-radius:8px; padding:10px;">
//                         ${Object.values(data.visitor_logs || {}).reverse().slice(0, 50).map(l => `
//                             <div style="border-bottom:1px solid #21262d; padding:10px 0; font-size:13px;">
//                                 <div style="display:flex; justify-content:space-between;"><span style="color:#58a6ff; font-weight:bold;">${l.location}</span><span style="color:#8b949e;">${l.time}</span></div>
//                                 <div style="color:#8b949e; font-size:11px; margin-top:4px;">Ref: ${l.source} | Date: ${l.date}</div>
//                             </div>
//                         `).join('') || '<p style="text-align:center; color:#444;">No visitors tracked yet.</p>'}
//                     </div>
//                 </div>

//                 <div style="background:#161b22; border:1px solid #30363d; border-radius:12px; padding:20px;">
//                     <h2 style="font-size:18px; margin-top:0; color:#f85149; border-bottom:1px solid #30363d; padding-bottom:10px;">🛡️ Admin Access Logs</h2>
                    
//                     <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; margin-bottom:20px;">
//                         <div style="text-align:center; background:#0d1117; padding:10px; border-radius:8px;"><small style="color:#8b949e;">Today</small><br><b>${aStats.days?.[dK] || 0}</b></div>
//                         <div style="text-align:center; background:#0d1117; padding:10px; border-radius:8px;"><small style="color:#8b949e;">Month</small><br><b>${aStats.months?.[mK] || 0}</b></div>
//                         <div style="text-align:center; background:#0d1117; padding:10px; border-radius:8px;"><small style="color:#8b949e;">Year</small><br><b>${aStats.years?.[yK] || 0}</b></div>
//                         <div style="text-align:center; background:#f8514922; padding:10px; border-radius:8px; border:1px solid #f85149;"><small style="color:#8b949e;">Total</small><br><b>${aStats.total || 0}</b></div>
//                     </div>

//                     <div style="height:400px; overflow-y:auto; background:#0d1117; border-radius:8px; padding:10px;">
//                         ${Object.values(data.admin_logs || {}).reverse().slice(0, 50).map(l => `
//                             <div style="border-bottom:1px solid #21262d; padding:10px 0; font-size:13px;">
//                                 <div style="display:flex; justify-content:space-between;"><span style="color:#f85149; font-weight:bold;">${l.location}</span><span style="color:#8b949e;">${l.time}</span></div>
//                                 <div style="color:#8b949e; font-size:11px; margin-top:4px;">Platform: ${l.platform} | Date: ${l.date}</div>
//                             </div>
//                         `).join('') || '<p style="text-align:center; color:#444;">No admin activity recorded.</p>'}
//                     </div>
//                 </div>

//             </div>
//         </div>
//     `;
//     document.body.appendChild(overlay);
// }

// const params = new URLSearchParams(window.location.search);
// if (params.get('show') === 'admin') showProfessionalPanel();
// trackEverything();

// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// async function trackEverything() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const isAdminEntry = urlParams.get('show') === 'admin';
//         const now = new Date();

//         // --- 1. समय की चाबियाँ (Keys for Day, Month, Year) ---
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//         const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
//         const yK = `${now.getFullYear()}`;

//         // --- 2. एडमिन का पक्का इंतज़ाम ---
//         if (isAdminEntry) {
//             localStorage.setItem('is_malik', 'true'); // पक्का निशान
//         }

//         // लोकेशन डेटा (City + Region)
//         const geoRes = await fetch('https://ipapi.co/json/');
//         const geoData = await geoRes.json();
//         const locName = `${geoData.city || 'Unknown'}, ${geoData.region || 'Unknown'}`;

//         const commonData = {
//             location: locName,
//             time: now.toLocaleTimeString(),
//             date: now.toLocaleDateString(),
//             device: navigator.platform
//         };

//         // अगर एडमिन है, तो सिर्फ लॉग रिकॉर्ड करो (काउंटिंग के बिना)
//         if (isAdminEntry) {
//             await fetch(`${dbURL}/admin_access_logs.json`, { method: 'POST', body: JSON.stringify(commonData) });
//             return;
//         }

//         // मालिक को दोबारा चेक करो (अगर लोकल स्टोरेज में निशान है तो भाग जाओ)
//         if (localStorage.getItem('is_malik') === 'true') return;

//         // --- 3. चारों प्रकार की काउंटिंग (Year, Month, Day, Total) ---
//         const updateCount = async (path) => {
//             const r = await fetch(`${dbURL}/stats/${path}.json`);
//             const c = await r.json() || 0;
//             await fetch(`${dbURL}/stats/${path}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
//         };

//         await updateCount('total');
//         await updateCount(`years/${yK}`);
//         await updateCount(`months/${mK}`);
//         await updateCount(`days/${dK}`);

//         // विज़िटर लॉग्स
//         await fetch(`${dbURL}/logs.json`, {
//             method: 'POST',
//             body: JSON.stringify({ ...commonData, source: document.referrer || "Direct" })
//         });

//     } catch (e) { console.log("KaaZra System Updated"); }
// }

// async function showMasterDashboard() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = await res.json() || {};
//     const stats = data.stats || {};
//     const now = new Date();
//     const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//     const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
//     const yK = `${now.getFullYear()}`;

//     const div = document.createElement('div');
//     div.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:#000; color:#0f0; z-index:999999; font-family:monospace; padding:15px; overflow-y:auto; box-sizing:border-box;";

//     div.innerHTML = `
//         <div style="max-width:550px; margin:auto; border:2px solid #0f0; padding:20px; background:#0a0a0a; border-radius:15px;">
//             <h2 style="text-align:center; color:#fff; text-shadow:0 0 10px #0f0;">🔥 SUPREME ANALYTICS</h2>

//             <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
//                 <div style="border:1px solid #333; padding:10px; text-align:center;">
//                     <small>TODAY</small><br><b style="font-size:24px;">${stats.days?.[dK] || 0}</b>
//                 </div>
//                 <div style="border:1px solid #333; padding:10px; text-align:center;">
//                     <small>MONTH</small><br><b style="font-size:24px;">${stats.months?.[mK] || 0}</b>
//                 </div>
//                 <div style="border:1px solid #333; padding:10px; text-align:center;">
//                     <small>YEAR</small><br><b style="font-size:24px;">${stats.years?.[yK] || 0}</b>
//                 </div>
//                 <div style="border:1px solid #0f0; padding:10px; text-align:center; background:#020;">
//                     <small>TOTAL</small><br><b style="font-size:24px;">${stats.total || 0}</b>
//                 </div>
//             </div>

//             <h4 style="color:red; border-left:3px solid red; padding-left:10px;">🚨 WHO ACCESSED ADMIN?</h4>
//             <div style="height:100px; overflow-y:auto; background:#1a0000; padding:8px; font-size:11px; margin-bottom:20px;">
//                 ${Object.values(data.admin_access_logs || {}).reverse().slice(0, 5).map(l => `
//                     <div style="border-bottom:1px solid #400; padding:5px 0;">📍 ${l.location} | ${l.time}</div>
//                 `).join('')}
//             </div>

//             <h4 style="color:#f0f; border-left:3px solid #f0f; padding-left:10px;">📍 RECENT VISITORS (Location Live)</h4>
//             <div style="height:250px; overflow-y:auto; background:#050505; border:1px solid #222; padding:10px; font-size:11px;">
//                 ${Object.values(data.logs || {}).reverse().slice(0, 30).map(l => `
//                     <div style="border-bottom:1px solid #222; padding:8px 0;">
//                         <span style="color:#0f0;">[${l.source || 'Direct'}]</span> <b>${l.location}</b><br>
//                         <span style="color:#666;">${l.date} | ${l.time}</span>
//                     </div>
//                 `).join('')}
//             </div>

//             <button onclick="location.reload()" style="width:100%; margin-top:20px; padding:15px; background:#0f0; color:#000; font-weight:bold; border:none; cursor:pointer; border-radius:10px;">REFRESH DATA</button>
//             <button onclick="this.parentElement.parentElement.remove()" style="width:100%; margin-top:10px; padding:10px; background:#333; color:#fff; border:none; cursor:pointer; border-radius:10px;">EXIT</button>
//         </div>
//     `;
//     document.body.appendChild(div);
// }

// const params = new URLSearchParams(window.location.search);
// if (params.get('show') === 'admin') showMasterDashboard();
// trackEverything();

// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// // --- GHOST VOICE FUNCTION ---
// function scream() {
//     const msg = new SpeechSynthesisUtterance("Welcome to the Dark Zone, Master Adarsh. Someone is watching you.");
//     msg.pitch = 0.1; msg.rate = 0.8; msg.volume = 1;
//     window.speechSynthesis.speak(msg);
// }

// async function trackEverything() {
//     try {
//         const p = new URLSearchParams(window.location.search);
//         const isAdmin = p.get('show') === 'admin';
//         const dK = `${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`;

//         // Accurate Location Fetch
//         const geo = await fetch('https://ipapi.co/json/').then(r => r.json());
//         const loc = geo.city ? `${geo.city}, ${geo.region}` : `${geo.country_name || 'Unknown Location'}`;

//         const payload = {
//             loc: loc,
//             time: new Date().toLocaleTimeString(),
//             date: new Date().toLocaleDateString(),
//             src: document.referrer ? new URL(document.referrer).hostname : 'Direct'
//         };

//         if (isAdmin) {
//             localStorage.setItem('is_malik', 'true');
//             scream(); // एडमिन पैनल खुलते ही आवाज़ आएगी
//             await fetch(`${dbURL}/admin_access.json`, { method: 'POST', body: JSON.stringify(payload) });
//             return;
//         }

//         if (localStorage.getItem('is_malik') === 'true') return;

//         // Stats Update
//         const update = async (path) => {
//             const r = await fetch(`${dbURL}/stats/${path}.json`);
//             const c = await r.json() || 0;
//             await fetch(`${dbURL}/stats/${path}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
//         };
//         await update('total'); await update(`days/${dK}`);
//         await fetch(`${dbURL}/logs.json`, { method: 'POST', body: JSON.stringify(payload) });

//     } catch (e) { console.log("The spirits are restless..."); }
// }

// async function showGhostPanel() {
//     const d = await fetch(`${dbURL}/.json`).then(r => r.json()) || {};
//     const stats = d.stats || {};
//     const adminLogs = d.admin_access || {};
//     const visitorLogs = d.logs || {};

//     const div = document.createElement('div');
//     div.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#f00;z-index:9999999;font-family:'Courier New',monospace;padding:10px;overflow-y:auto;text-shadow:2px 2px 5px #f00;font-size:13px;border:5px solid #f00;";

//     let gH = "";
//     Object.keys(stats.days || {}).slice(-5).forEach(k => {
//         const v = stats.days[k];
//         gH += `<div style="margin:5px 0">${k} <span style="color:#0f0">${'⚡'.repeat(Math.min(v, 10))}</span> ${v}</div>`;
//     });

//     div.innerHTML = `
//         <div style="max-width:500px;margin:auto;background:rgba(20,0,0,0.9);padding:20px;border:2px solid #f00;box-shadow:0 0 50px #f00;">
//             <h1 style="text-align:center;font-size:22px;letter-spacing:8px;color:#fff;animation:shake 0.5s infinite">⚠ VOODOO DASHBOARD ⚠</h1>

//             <div style="display:flex;justify-content:space-around;margin:20px 0;border:1px solid #f00;padding:10px;background:#300;">
//                 <div style="text-align:center">MORTALS<br><b style="font-size:28px;color:#fff;">${stats.total || 0}</b></div>
//                 <div style="text-align:center;color:#0f0">INTRUDERS<br><b style="font-size:28px">${Object.keys(adminLogs).length}</b></div>
//             </div>

//             <div style="padding:10px;border:1px solid #444;margin-bottom:15px;background:#1a0000">
//                 <p style="margin:0;color:#f0f;font-weight:bold">BLOOD PULSE (DAILY):</p>
//                 ${gH || 'Waiting for blood...'}
//             </div>

//             <p style="margin:0;color:#fff;font-weight:bold">🔴 CAUGHT RED-HANDED (ADMINS):</p>
//             <div style="height:100px;overflow:auto;background:#000;padding:5px;border:1px solid #f00;margin-bottom:15px;font-size:11px">
//                 ${Object.values(adminLogs).reverse().slice(0,10).map(l=>`<div style="color:#f00">> ${l.loc} | ${l.time}</div>`).join('')}
//             </div>

//             <p style="margin:0;color:#0f0;font-weight:bold">👤 RECENT SOULS (VISITORS):</p>
//             <div style="height:250px;overflow:auto;background:#000;padding:5px;border:1px solid #0f0">
//                 ${Object.values(visitorLogs).reverse().slice(0,30).map(l=>`
//                     <div style="border-bottom:1px solid #300;padding:8px 0;">
//                         <span style="color:#fff">[${l.src}]</span> <b>${l.loc}</b><br>
//                         <small style="color:#666">${l.date} @ ${l.time}</small>
//                     </div>
//                 `).join('')}
//             </div>

//             <button onclick="location.reload()" style="width:100%;margin-top:20px;padding:15px;background:#f00;color:#fff;border:none;font-weight:bold;cursor:pointer;box-shadow:0 0 15px #f00;font-size:16px;">RE-SYNC SOULS</button>
//         </div>
//         <style>@keyframes shake { 0%{transform:translate(0)} 25%{transform:translate(2px)} 50%{transform:translate(-2px)} 100%{transform:translate(0)} }</style>
//     `;
//     document.body.appendChild(div);
// }

// const params = new URLSearchParams(window.location.search);
// if (params.get('show') === 'admin') showGhostPanel();
// trackEverything();

// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// async function trackEverything() {
//     try {
//         const p = new URLSearchParams(window.location.search);
//         const isAdmin = p.get('show') === 'admin';
//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

//         // Global Location & Identity
//         const geo = await fetch('https://ipapi.co/json/').then(r => r.json());
//         const loc = `${geo.city || 'Mars'}, ${geo.region || geo.country_name || 'System'}`;

//         const payload = {
//             loc: loc,
//             time: now.toLocaleTimeString(),
//             date: now.toLocaleDateString(),
//             src: document.referrer ? new URL(document.referrer).hostname : 'Direct/Status'
//         };

//         // SCENARIO: ADMIN ACCESS (Chor Pakda Gaya)
//         if (isAdmin) {
//             localStorage.setItem('is_malik', 'true');
//             await fetch(`${dbURL}/admin_access.json`, { method: 'POST', body: JSON.stringify(payload) });
//             return;
//         }

//         // SCENARIO: NORMAL VISITOR
//         if (localStorage.getItem('is_malik') === 'true') return;

//         const update = async (path) => {
//             const r = await fetch(`${dbURL}/stats/${path}.json`);
//             const c = await r.json() || 0;
//             await fetch(`${dbURL}/stats/${path}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
//         };

//         await update('total');
//         await update(`days/${dK}`);
//         await fetch(`${dbURL}/logs.json`, { method: 'POST', body: JSON.stringify(payload) });

//     } catch (e) { console.log("System Haunted..."); }
// }

// async function showGhostPanel() {
//     const d = await fetch(`${dbURL}/.json`).then(r => r.json()) || {};
//     const stats = d.stats || {};
//     const adminLogs = d.admin_access || {};
//     const visitorLogs = d.logs || {};

//     const div = document.createElement('div');
//     div.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#0f0;z-index:9999999;font-family:'Courier New',monospace;padding:10px;overflow-y:auto;text-shadow:0 0 5px #0f0;font-size:12px;";

//     // Matrix Style Graph
//     let gH = "";
//     Object.keys(stats.days || {}).slice(-5).forEach(k => {
//         const v = stats.days[k];
//         gH += `<div style="margin:4px 0">${k} <span style="color:#fff">${'█'.repeat(Math.min(v, 10))}</span> ${v}</div>`;
//     });

//     div.innerHTML = `
//         <div style="max-width:500px;margin:auto;border:1px solid #0f0;padding:15px;box-shadow:inset 0 0 20px #0f0, 0 0 10px #0f0;">
//             <h1 style="text-align:center;font-size:18px;margin:0;letter-spacing:5px;animation:blink 1s infinite">☠ MASTER GHOST PANEL ☠</h1>

//             <div style="display:flex;justify-content:space-around;margin:15px 0;border:1px solid #333;padding:10px;">
//                 <div style="text-align:center">VISITS<br><b style="font-size:24px">${stats.total || 0}</b></div>
//                 <div style="text-align:center;color:red">CHOR (ADMINS)<br><b style="font-size:24px">${Object.keys(adminLogs).length}</b></div>
//             </div>

//             <div style="background:#050505;padding:10px;border:1px solid #222;margin-bottom:15px">
//                 <p style="margin:0 0 5px 0;color:#f0f;font-weight:bold">DAILY PULSE:</p>
//                 ${gH || 'Calculating souls...'}
//             </div>

//             <p style="margin:0;color:red;font-weight:bold">🔴 INTRUSION DETECTED (ADMIN ACCESS):</p>
//             <div style="height:100px;overflow:auto;background:#1a0000;padding:5px;border:1px solid red;margin-bottom:15px;font-size:10px">
//                 ${Object.values(adminLogs).reverse().slice(0, 10).map(l => `<div>> ${l.loc} | ${l.time}</div>`).join('')}
//             </div>

//             <p style="margin:0;color:#00c3ff;font-weight:bold">👥 RECENT MORTALS (VISITORS):</p>
//             <div style="height:250px;overflow:auto;background:#000;padding:5px;border:1px solid #0f0">
//                 ${Object.values(visitorLogs).reverse().slice(0, 30).map(l => `
//                     <div style="border-bottom:1px solid #1a1a1a;padding:5px 0;">
//                         <span style="color:#0f0">[${l.src || 'Unknown'}]</span> <b>${l.loc || 'Shadow Realm'}</b><br>
//                         <small style="color:#555">${l.date} @ ${l.time}</small>
//                     </div>
//                 `).join('')}
//             </div>

//             <button onclick="location.reload()" style="width:100%;margin-top:20px;padding:15px;background:#0f0;color:#000;border:none;font-weight:bold;cursor:pointer;box-shadow:0 0 10px #0f0">RE-SYNC SYSTEM</button>
//         </div>
//         <style>@keyframes blink { 0%, 100% {opacity:1} 50% {opacity:0.3} }</style>
//     `;
//     document.body.appendChild(div);
// }

// const params = new URLSearchParams(window.location.search);
// if (params.get('show') === 'admin') showGhostPanel();
// trackEverything();

// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// async function trackEverything() {
//     try {
//         const params = new URLSearchParams(window.location.search);
//         const isAdmin = params.get('show') === 'admin';
//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

//         // 1. Global Location Fetch (Works Worldwide)
//         const geo = await fetch('https://ipapi.co/json/').then(r => r.json());
//         const loc = `${geo.city || 'Unknown'}, ${geo.region || geo.country_name || 'Earth'}`;

//         const data = {
//             loc,
//             time: now.toLocaleTimeString(),
//             date: now.toLocaleDateString(),
//             src: document.referrer.includes('linkedin') ? 'LinkedIn' : (document.referrer ? 'Web' : 'Direct')
//         };

//         // 2. Separate Admin vs Normal Tracking
//         if (isAdmin) {
//             localStorage.setItem('is_malik', 'true');
//             await fetch(`${dbURL}/admin_logs.json`, { method: 'POST', body: JSON.stringify(data) });
//             return;
//         }

//         if (localStorage.getItem('is_malik') === 'true') return;

//         // 3. Increment Stats (Total & Daily)
//         const update = async (p) => {
//             const c = await fetch(`${dbURL}/stats/${p}.json`).then(r => r.json()) || 0;
//             await fetch(`${dbURL}/stats/${p}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
//         };
//         await update('total');
//         await update(`days/${dK}`);
//         await fetch(`${dbURL}/logs.json`, { method: 'POST', body: JSON.stringify(data) });

//     } catch (e) { console.error("KaaZra Sync Error"); }
// }

// async function showDash() {
//     const d = await fetch(`${dbURL}/.json`).then(r => r.json()) || {};
//     const stats = d.stats || {};
//     const dK = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;

//     const div = document.createElement('div');
//     div.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#0f0;z-index:999999;font-family:monospace;padding:10px;overflow-y:auto;font-size:13px;"; // Mobile Friendly Font

//     // Graph Logic
//     let gH = "";
//     Object.keys(stats.days || {}).slice(-5).forEach(k => {
//         const v = stats.days[k];
//         gH += `<div style="margin:5px 0">${k} <div style="background:#0f0;height:8px;display:inline-block;width:${Math.min(v * 10, 80)}px"></div> ${v}</div>`;
//     });

//     div.innerHTML = `
//         <div style="max-width:450px;margin:auto;border:1px solid #333;padding:15px;background:#0a0a0a;border-radius:10px;">
//             <h2 style="text-align:center;color:#fff;font-size:18px;margin:0 0 15px 0">👑 CONTROL CENTER</h2>

//             <div style="display:flex;justify-content:space-between;margin-bottom:15px;background:#111;padding:10px;border-radius:5px;">
//                 <div style="text-align:center">VISITS<br><b style="font-size:20px">${stats.total || 0}</b></div>
//                 <div style="text-align:center">ADMINS<br><b style="font-size:20px;color:red">${Object.keys(d.admin_logs || {}).length}</b></div>
//             </div>

//             <div style="background:#000;padding:8px;border:1px solid #222;margin-bottom:15px;">
//                 <p style="margin:0 0 5px 0;color:#f0f;font-size:11px">WEEKLY GRAPH</p>
//                 ${gH || 'No Data'}
//             </div>

//             <p style="margin:0;color:red;font-size:11px">🚨 ADMIN ACCESS</p>
//             <div style="height:80px;overflow:auto;background:#100;padding:5px;font-size:10px;margin-bottom:15px">
//                 ${Object.values(d.admin_logs || {}).reverse().slice(0, 5).map(l => `<div>${l.loc} | ${l.time}</div>`).join('')}
//             </div>

//             <p style="margin:0;color:#00c3ff;font-size:11px">👥 RECENT VISITORS</p>
//             <div style="height:200px;overflow:auto;background:#050505;padding:5px;font-size:11px;border:1px solid #222">
//                 ${Object.values(d.logs || {}).reverse().slice(0, 25).map(l => `<div style="border-bottom:1px solid #111;padding:5px 0;">[${l.src}] <b>${l.loc}</b><br><small style="color:#555">${l.date} ${l.time}</small></div>`).join('')}
//             </div>

//             <button onclick="location.reload()" style="width:100%;margin-top:15px;padding:12px;background:#0f0;color:#000;font-weight:bold;border:none;border-radius:5px;cursor:pointer">REFRESH</button>
//         </div>`;
//     document.body.appendChild(div);
// }

// if (new URLSearchParams(window.location.search).get('show') === 'admin') showDash();
// trackEverything();


// // CONFIGURATION
// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// // --- PART 1: TRACKING LOGIC (The Silent Worker) ---
// async function trackEverything() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const isAdminEntry = urlParams.get('show') === 'admin';
//         const visitorNameFromURL = urlParams.get('name') || "Anonymous"; // Smart Link Support

//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//         const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
//         const yK = now.getFullYear();

//         // लोकेशन डेटा (City + Region + Country)
//         const geoRes = await fetch('https://ipapi.co/json/');
//         const geoData = await geoRes.json();
//         const locName = `${geoData.city || 'Unknown'}, ${geoData.region || 'India'}`;

//         const commonData = {
//             name: visitorNameFromURL,
//             location: locName,
//             time: now.toLocaleTimeString(),
//             date: now.toLocaleDateString(),
//             device: navigator.platform,
//             fullTS: Date.now()
//         };

//         // SCENARIO 1: ADMIN ACCESS RECORDING
//         if (isAdminEntry) {
//             await fetch(`${dbURL}/admin_access_logs.json`, { 
//                 method: 'POST', 
//                 body: JSON.stringify({ ...commonData, type: "Admin Entry" }) 
//             });
//             localStorage.setItem('is_malik', 'true');
//             return; 
//         }

//         // SCENARIO 2: NORMAL VISITOR (Excluding Admin)
//         if (localStorage.getItem('is_malik') === 'true') return;

//         // Referrer (Kahan se aaya)
//         const ref = document.referrer.toLowerCase();
//         let source = "Direct / WhatsApp";
//         if (ref.includes("linkedin")) source = "LinkedIn";
//         else if (ref.includes("github")) source = "GitHub";
//         else if (ref.includes("facebook") || ref.includes("fb.me")) source = "Facebook";
//         else if (ref.includes("instagram")) source = "Instagram";

//         // Stats Update (Atomic Updates)
//         const updateCount = async (path) => {
//             const r = await fetch(`${dbURL}/stats/${path}.json`);
//             const current = await r.json() || 0;
//             await fetch(`${dbURL}/stats/${path}.json`, { method: 'PUT', body: JSON.stringify(current + 1) });
//         };

//         await updateCount('total');
//         await updateCount(`years/${yK}`);
//         await updateCount(`months/${mK}`);
//         await updateCount(`days/${dK}`);

//         // Visitor Log
//         await fetch(`${dbURL}/logs.json`, { 
//             method: 'POST', 
//             body: JSON.stringify({ ...commonData, source }) 
//         });

//     } catch (e) { console.log("KaaZra System Active"); }
// }

// // --- PART 2: ADMIN UI (The Master Dashboard) ---
// async function showMasterDashboard() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = await res.json() || {};
//     const stats = data.stats || {};
//     const adminLogs = data.admin_access_logs || {};
//     const normalLogs = data.logs || {};

//     const div = document.createElement('div');
//     div.id = "kaaZra-admin-ui";
//     div.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:linear-gradient(135deg, #000, #0a0a0a); color:#0f0; z-index:1000000; font-family: 'Segoe UI', Tahoma, sans-serif; padding:15px; overflow-y:auto; box-sizing:border-box;";

//     // GRAPH LOGIC (Bars)
//     let graphHtml = "";
//     const days = stats.days || {};
//     const last7Days = Object.keys(days).slice(-7);
//     last7Days.forEach(day => {
//         const val = days[day] || 0;
//         const width = Math.min(val * 12, 100);
//         graphHtml += `<div style="margin:6px 0; font-size:11px;">
//             <span style="display:inline-block; width:75px; color:#888;">${day}</span>
//             <div style="background:#0f0; display:inline-block; height:8px; width:${width}px; border-radius:10px; box-shadow: 0 0 5px #0f0;"></div>
//             <span style="margin-left:8px;">${val}</span>
//         </div>`;
//     });

//     div.innerHTML = `
//         <div style="max-width:600px; margin:auto; border:1px solid #1f1f1f; background:#000; padding:20px; border-radius:15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
//             <header style="text-align:center; margin-bottom:20px;">
//                 <h2 style="margin:0; letter-spacing:2px; color:#fff;">MASTER PANEL</h2>
//                 <small style="color:#444;">KaaZra Flash 1.0 - Adarsh Portfolio</small>
//             </header>

//             <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-bottom:20px;">
//                 <div style="background:#111; padding:10px; border-radius:10px; text-align:center; border:1px solid #222;">
//                     <small style="color:#555;">TOTAL</small><br><b style="font-size:22px;">${stats.total || 0}</b>
//                 </div>
//                 <div style="background:#111; padding:10px; border-radius:10px; text-align:center; border:1px solid #222;">
//                     <small style="color:#555;">MONTH</small><br><b style="font-size:22px;">${stats.months?.[Object.keys(stats.months || {}).pop()] || 0}</b>
//                 </div>
//                 <div style="background:#020; padding:10px; border-radius:10px; text-align:center; border:1px solid #0f0;">
//                     <small style="color:#0f0;">YEAR</small><br><b style="font-size:22px;">${stats.years?.[new Date().getFullYear()] || 0}</b>
//                 </div>
//             </div>

//             <div style="background:#0a0a0a; padding:15px; border-radius:10px; border:1px solid #111; margin-bottom:20px;">
//                 <h4 style="margin:0 0 10px 0; color:#f0f; font-size:13px;">DAILY VISITOR GRAPH</h4>
//                 ${graphHtml || '<small style="color:#333;">Syncing data...</small>'}
//             </div>

//             <h4 style="color:#ff4d4d; font-size:13px; margin:10px 0;">🚨 ADMIN PANEL LOGS (Intrusion Alert)</h4>
//             <div style="height:110px; overflow-y:auto; background:#100; border-radius:8px; padding:10px; font-size:11px; border:1px solid #300;">
//                 ${Object.values(adminLogs).reverse().slice(0, 10).map(l => `
//                     <div style="border-bottom:1px solid #200; padding:4px 0;">
//                         📍 ${l.location} <span style="float:right; color:#666;">${l.time}</span>
//                     </div>
//                 `).join('') || 'Clean'}
//             </div>

//             <h4 style="color:#00c3ff; font-size:13px; margin:20px 0 10px;">👤 RECENT VISITORS (Bareilly/Coimbatore)</h4>
//             <div style="height:250px; overflow-y:auto; background:#050505; border-radius:8px; padding:10px; font-size:11px; border:1px solid #222;">
//                 ${Object.values(normalLogs).reverse().slice(0, 40).map(l => `
//                     <div style="border-bottom:1px solid #111; padding:8px 0;">
//                         <span style="color:#0f0;">[${l.source || 'Direct'}]</span> <b>${l.location}</b> <br>
//                         <small style="color:#444;">${l.date} | ${l.time} | User: ${l.name}</small>
//                     </div>
//                 `).join('')}
//             </div>

//             <div style="display:flex; gap:10px; margin-top:20px;">
//                 <button onclick="location.reload()" style="flex:2; padding:12px; border-radius:8px; background:#0f0; border:none; font-weight:bold; cursor:pointer;">REFRESH</button>
//                 <button onclick="document.getElementById('kaaZra-admin-ui').remove()" style="flex:1; padding:12px; border-radius:8px; background:#222; color:#fff; border:none; cursor:pointer;">CLOSE</button>
//             </div>
//         </div>
//     `;
//     document.body.appendChild(div);
// }

// // --- PART 3: CONTACT FORM HELPER ---
// function addFormBackButton() {
//     const thankYouMsg = document.getElementById('thank-you-message'); // Check your HTML ID
//     if (thankYouMsg && !document.getElementById('back-btn')) {
//         const btn = document.createElement('button');
//         btn.id = 'back-btn';
//         btn.innerText = "Back to Portfolio";
//         btn.style = "margin-top:20px; padding:10px 20px; background:#0f0; border:none; cursor:pointer; border-radius:5px; font-weight:bold;";
//         btn.onclick = () => window.location.reload();
//         thankYouMsg.appendChild(btn);
//     }
// }

// // --- INITIALIZE ---
// const params = new URLSearchParams(window.location.search);
// if (params.get('show') === 'admin') showMasterDashboard();
// trackEverything();
// setTimeout(addFormBackButton, 2000); // Wait for DOM

//  code 1......................................
// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// async function trackEverything() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const isAdminEntry = urlParams.get('show') === 'admin';
//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

//         // 1. लोकेशन डेटा - अब इसमें कोई गलती नहीं होगी
//         const geoRes = await fetch('https://ipapi.co/json/');
//         const geoData = await geoRes.json();
//         // बरेली और कोयंबटूर के लिए सटीक नाम
//         const locName = `${geoData.city || 'Unknown'}, ${geoData.region || 'India'}`;

//         const commonData = {
//             location: locName, // यहाँ 'location' ही नाम रखा है ताकि undefined न आए
//             time: now.toLocaleTimeString(),
//             date: now.toLocaleDateString(),
//             device: navigator.platform
//         };

//         // --- SCENARIO 1: ADMIN ACCESS ---
//         if (isAdminEntry) {
//             await fetch(`${dbURL}/admin_access_logs.json`, {
//                 method: 'POST',
//                 body: JSON.stringify({ ...commonData, type: "Admin Access" })
//             });
//             localStorage.setItem('is_malik', 'true');
//             return;
//         }

//         // --- SCENARIO 2: NORMAL VISITOR ---
//         if (localStorage.getItem('is_malik') === 'true') return;

//         // Stats Update
//         const r = await fetch(`${dbURL}/stats/total.json`);
//         const total = await r.json() || 0;
//         await fetch(`${dbURL}/stats/total.json`, { method: 'PUT', body: JSON.stringify(total + 1) });

//         const dr = await fetch(`${dbURL}/stats/days/${dK}.json`);
//         const dayCount = await dr.json() || 0;
//         await fetch(`${dbURL}/stats/days/${dK}.json`, { method: 'PUT', body: JSON.stringify(dayCount + 1) });

//         // Visitor Log - 'location' की स्पेलिंग यहाँ भी सही कर दी है
//         await fetch(`${dbURL}/logs.json`, {
//             method: 'POST',
//             body: JSON.stringify({ ...commonData, source: document.referrer || "Direct" })
//         });

//     } catch (e) { console.log("KaaZra Tracking Fix Applied"); }
// }

// async function showMasterDashboard() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = await res.json() || {};
//     const stats = data.stats || {};
//     const adminLogs = data.admin_access_logs || {};
//     const normalLogs = data.logs || {};

//     const div = document.createElement('div');
//     div.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:#000; color:#0f0; z-index:999999; font-family:monospace; padding:15px; overflow-y:auto; box-sizing:border-box;";

//     // --- ग्राफ लॉजिक (हरी डंडियाँ) ---
//     let graphHtml = "";
//     const days = stats.days || {};
//     const dayKeys = Object.keys(days).slice(-7);
//     dayKeys.forEach(day => {
//         const val = days[day] || 0;
//         const barWidth = Math.min(val * 20, 160); // 1 visit = 20px
//         graphHtml += `<div style="margin:8px 0; font-size:12px;">
//             <span style="display:inline-block; width:80px;">${day}:</span>
//             <div style="background:#0f0; display:inline-block; height:10px; width:${barWidth}px; box-shadow:0 0 5px #0f0; border-radius:2px;"></div>
//             <span style="margin-left:10px; color:#fff;">${val}</span>
//         </div>`;
//     });

//     div.innerHTML = `
//         <div style="max-width:550px; margin:auto; border:2px solid #0f0; padding:20px; background:#0a0a0a; border-radius:12px;">
//             <h2 style="text-align:center; color:#fff; text-shadow:0 0 10px #0f0; margin-top:0;">👑 MASTER CONTROL</h2>

//             <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:20px;">
//                 <div style="background:#111; padding:15px; text-align:center; border:1px solid #222; border-radius:8px;">
//                     <small>TOTAL VISITS</small><br><b style="font-size:32px; color:#fff;">${stats.total || 0}</b>
//                 </div>
//                 <div style="background:#111; padding:10px; border:1px solid #222; border-radius:8px;">
//                     <small style="color:#0f0; display:block; margin-bottom:5px;">WEEKLY TREND</small>
//                     ${graphHtml || '<small style="color:#444;">Collecting Data...</small>'}
//                 </div>
//             </div>

//             <h4 style="color:red; border-left:3px solid red; padding-left:10px;">🚨 ADMIN ALERTS</h4>
//             <div style="height:120px; overflow-y:auto; background:#1a0000; padding:8px; font-size:11px; margin-bottom:20px; border:1px solid #400;">
//                 ${Object.values(adminLogs).reverse().slice(0, 10).map(l => `
//                     <div style="border-bottom:1px solid #300; padding:5px 0;">
//                         📍 <b>${l.location}</b> <span style="float:right;">${l.time}</span>
//                     </div>
//                 `).join('') || 'No records.'}
//             </div>

//             <h4 style="color:#f0f; border-left:3px solid #f0f; padding-left:10px;">📍 RECENT NORMAL VISITORS</h4>
//             <div style="height:250px; overflow-y:auto; background:#050505; padding:8px; font-size:11px; border:1px solid #222;">
//                 ${Object.values(normalLogs).reverse().slice(0, 30).map(l => `
//                     <div style="border-bottom:1px solid #222; padding:10px 0;">
//                         <span style="color:#0f0;">[${l.source || 'Direct'}]</span> <b>${l.location || 'Unknown Location'}</b><br>
//                         <span style="color:#666;">${l.date} | ${l.time}</span>
//                     </div>
//                 `).join('')}
//             </div>

//             <div style="display:flex; gap:10px; margin-top:20px;">
//                 <button onclick="location.reload()" style="flex:1; padding:12px; background:#0f0; color:#000; font-weight:bold; border:none; cursor:pointer; border-radius:5px;">REFRESH</button>
//                 <button onclick="this.parentElement.parentElement.remove()" style="flex:1; padding:12px; background:#333; color:#fff; border:none; cursor:pointer; border-radius:5px;">CLOSE</button>
//             </div>
//         </div>
//     `;
//     document.body.appendChild(div);
// }

// const params = new URLSearchParams(window.location.search);
// if (params.get('show') === 'admin') showMasterDashboard();
// trackEverything();

// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// async function trackEverything() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const isAdminEntry = urlParams.get('show') === 'admin';

//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

//         // लोकेशन डेटा निकालें
//         const geoRes = await fetch('https://ipapi.co/json/');
//         const geoData = await geoRes.json();
//         const loc = `${geoData.city || 'Unknown'}, ${geoData.region || 'India'}`;

//         const commonData = {
//             location: loc,
//             time: now.toLocaleTimeString(),
//             date: now.toLocaleDateString(),
//             userAgent: navigator.userAgent.slice(0, 50) // डिवाइस की जानकारी
//         };

//         // --- SCENARIO 1: किसी ने ADMIN PANEL खोला ---
//         if (isAdminEntry) {
//             // एडमिन लॉग्स में सेव करें (ताकि पता चले किसने चोरी-छिपे पैनल देखा)
//             await fetch(`${dbURL}/admin_access_logs.json`, {
//                 method: 'POST',
//                 body: JSON.stringify({ ...commonData, type: "Admin Access" })
//             });

//             // खुद को 'Malik' मार्क करें ताकि नॉर्मल काउंटिंग में डिस्टर्ब न हो
//             localStorage.setItem('is_malik', 'true');
//             return;
//         }

//         // --- SCENARIO 2: नॉर्मल विज़िटर आया ---
//         if (localStorage.getItem('is_malik') === 'true') return; // अगर आप खुद नॉर्मल ब्राउज़ कर रहे हैं

//         // काउंट बढ़ाना
//         const updateStat = async (path) => {
//             const r = await fetch(`${dbURL}/stats/${path}.json`);
//             const c = await r.json() || 0;
//             await fetch(`${dbURL}/stats/${path}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
//         };

//         await updateStat('total');
//         await updateStat(`days/${dK}`);

//         // नॉर्मल विज़िटर लॉग्स
//         await fetch(`${dbURL}/logs.json`, {
//             method: 'POST',
//             body: JSON.stringify({ ...commonData, source: document.referrer || "Direct" })
//         });

//     } catch (e) { console.log("KaaZra Tracking System Error"); }
// }

// async function showMasterDashboard() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = await res.json() || {};
//     const stats = data.stats || {};
//     const adminLogs = data.admin_access_logs || {};
//     const normalLogs = data.logs || {};

//     const div = document.createElement('div');
//     div.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:#000; color:#0f0; z-index:999999; font-family:monospace; padding:15px; overflow-y:auto; box-sizing:border-box;";

//     // ग्राफ (Last 5 Days)
//     let graphHtml = "";
//     const days = stats.days || {};
//     Object.keys(days).slice(-5).forEach(day => {
//         const val = days[day];
//         graphHtml += `<div style="margin:5px 0; font-size:10px;">${day} <div style="background:#0f0; display:inline-block; height:8px; width:${val * 5}px;"></div> ${val}</div>`;
//     });

//     div.innerHTML = `
//         <div style="max-width:600px; margin:auto; border:2px solid #0f0; padding:15px; background:#0a0a0a; border-radius:10px;">
//             <h2 style="text-align:center; color:#fff; text-shadow:0 0 10px #0f0; margin-top:0;">👑 CONTROL CENTER</h2>

//             <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
//                 <div style="background:#111; padding:10px; text-align:center; border:1px solid #222;">
//                     <small>TOTAL VISITS</small><br><b style="font-size:24px;">${stats.total || 0}</b>
//                 </div>
//                 <div style="background:#111; padding:10px; text-align:center; border:1px solid #222;">
//                     <small>GRAPH TRACKER</small><br>${graphHtml || 'Wait for data...'}
//                 </div>
//             </div>

//             <h4 style="color:red; border-bottom:1px solid red;">🚨 ADMIN PANEL ACCESS HISTORY (Who opened this?)</h4>
//             <div style="height:150px; overflow-y:auto; background:#1a0000; padding:5px; font-size:11px; margin-bottom:20px; border:1px solid red;">
//                 ${Object.values(adminLogs).reverse().map(l => `
//                     <div style="border-bottom:1px solid #400; padding:5px 0;">
//                         📍 <b>${l.location}</b> | ⏰ ${l.time} | 📅 ${l.date}
//                     </div>
//                 `).join('') || 'No admin access recorded yet.'}
//             </div>

//             <h4 style="color:#f0f; border-bottom:1px solid #f0f;">📍 RECENT NORMAL VISITORS</h4>
//             <div style="height:250px; overflow-y:auto; background:#050505; padding:5px; font-size:11px; border:1px solid #333;">
//                 ${Object.values(normalLogs).reverse().slice(0, 30).map(l => `
//                     <div style="border-bottom:1px solid #222; padding:8px 0;">
//                         🌍 [${l.source || 'Direct'}] <b>${l.location}</b><br>
//                         <span style="color:#666;">${l.date} at ${l.time}</span>
//                     </div>
//                 `).join('')}
//             </div>

//             <div style="display:flex; gap:10px; margin-top:20px;">
//                 <button onclick="location.reload()" style="flex:1; padding:12px; background:#0f0; color:#000; font-weight:bold; border:none; cursor:pointer;">REFRESH</button>
//                 <button onclick="this.parentElement.parentElement.remove()" style="flex:1; padding:12px; background:#333; color:#fff; border:none; cursor:pointer;">CLOSE</button>
//             </div>
//         </div>
//     `;
//     document.body.appendChild(div);
// }

// // --- START ---
// const params = new URLSearchParams(window.location.search);
// if (params.get('show') === 'admin') showMasterDashboard();
// trackEverything();

// // --- CONFIGURATION ---
// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// // --- VISITOR TRACKING (BACKEND) ---
// async function trackVisitor() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);

//         // 1. मालिक की पहचान: अगर ?show=admin है, तो ब्राउज़र में निशान लगा दो
//         if (urlParams.get('show') === 'admin') {
//             localStorage.setItem('is_malik', 'true');
//         }

//         // 2. अगर मालिक है, तो काउंटिंग यहीं रोक दो
//         if (localStorage.getItem('is_malik') === 'true') {
//             console.log("Pranaam Malik! Tracking disabled for you.");
//             return;
//         }

//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//         const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
//         const yK = now.getFullYear();

//         // 3. कहाँ से आया (Referrer)
//         const ref = document.referrer.toLowerCase();
//         let source = "Direct / WhatsApp";
//         if (ref.includes("linkedin")) source = "LinkedIn";
//         else if (ref.includes("facebook") || ref.includes("fb.me")) source = "Facebook";
//         else if (ref.includes("instagram")) source = "Instagram";
//         else if (ref.includes("github")) source = "GitHub";

//         // 4. लोकेशन डेटा (IP API)
//         const geoRes = await fetch('https://ipapi.co/json/');
//         const geoData = await geoRes.json();

//         const visitData = {
//             source,
//             city: geoData.city || "Unknown",
//             country: geoData.country_name || "Unknown",
//             time: now.toLocaleTimeString(),
//             fullDate: now.toLocaleDateString()
//         };

//         // 5. Firebase में काउंट बढ़ाना
//         const updateCount = async (path) => {
//             const r = await fetch(`${dbURL}/stats/${path}.json`);
//             const c = await r.json() || 0;
//             await fetch(`${dbURL}/stats/${path}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
//         };

//         await updateCount('total');
//         await updateCount(`years/${yK}`);
//         await updateCount(`months/${mK}`);
//         await updateCount(`days/${dK}`);

//         // 6. लॉग्स सेव करना (History)
//         await fetch(`${dbURL}/logs.json`, { method: 'POST', body: JSON.stringify(visitData) });

//     } catch (e) { console.log("Tracking error..."); }
// }

// // --- ADMIN PANEL UI (FRONTEND) ---
// async function showAdminPanel() {
//     try {
//         const res = await fetch(`${dbURL}/.json`);
//         const data = await res.json();
//         const stats = data.stats || {};
//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//         const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;

//         const div = document.createElement('div');
//         div.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); color:#0f0; z-index:99999; font-family:monospace; padding:20px; overflow-y:auto; box-sizing:border-box;";

//         div.innerHTML = `
//             <div style="max-width:550px; margin:auto; border:2px solid #0f0; padding:20px; border-radius:15px; box-shadow: 0 0 20px #0f0;">
//                 <h1 style="text-align:center; color:#fff; text-shadow: 0 0 10px #0f0; margin-top:0;">👑 MASTER DASHBOARD</h1>

//                 <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin:25px 0;">
//                     <div style="background:#111; border:1px solid #333; padding:15px; text-align:center; border-radius:10px;">
//                         <small style="color:#888;">TODAY</small><br><b style="font-size:24px;">${stats.days?.[dK] || 0}</b>
//                     </div>
//                     <div style="background:#111; border:1px solid #333; padding:15px; text-align:center; border-radius:10px;">
//                         <small style="color:#888;">MONTH</small><br><b style="font-size:24px;">${stats.months?.[mK] || 0}</b>
//                     </div>
//                     <div style="background:#020; border:1px solid #0f0; padding:15px; text-align:center; border-radius:10px; grid-column: span 2;">
//                         <small style="color:#ccc;">TOTAL ALL TIME</small><br><b style="font-size:32px; color:#fff;">${stats.total || 0}</b>
//                     </div>
//                 </div>

//                 <h3 style="border-bottom:1px solid #333; padding-bottom:5px;">RECENT ACTIVITY</h3>
//                 <div style="background:#0a0a0a; padding:10px; border-radius:8px; max-height:300px; overflow-y:auto;">
//                     ${Object.values(data.logs || {}).reverse().slice(0, 15).map(log => `
//                         <div style="margin-bottom:10px; border-bottom:1px solid #222; padding-bottom:8px; font-size:12px;">
//                             <span style="color:#f0f; font-weight:bold;">[${log.source}]</span> 
//                             <span style="color:#fff;">${log.city}, ${log.country}</span>
//                             <div style="color:#888; margin-top:3px;">⏰ ${log.time} | ${log.fullDate || ''}</div>
//                         </div>
//                     `).join('')}
//                 </div>

//                 <button onclick="this.parentElement.parentElement.remove()" style="margin-top:25px; width:100%; background:#0f0; color:#000; border:none; padding:15px; font-weight:bold; border-radius:8px; cursor:pointer; font-size:16px;">EXIT PANEL</button>
//             </div>`;
//         document.body.appendChild(div);
//     } catch (e) { alert("Data load fail!"); }
// }

// // --- EXECUTION ---
// const urlParams = new URLSearchParams(window.location.search);
// if (urlParams.get('show') === 'admin') {
//     showAdminPanel();
// }
// trackVisitor();

// for slider code

$(document).ready(function () {
    $('.slider').slick({
        arrows: false,
        dots: true,
        appendDots: '.slider-dots',
        dotsClass: 'dots'
    })
})

let hamberger = document.querySelector('.hamberger');
let times = document.querySelector('.times');
let mobileNav = document.querySelector('.mobile-nav');
let about = document.querySelector('.about');
let home = document.querySelector('a[href="#home"]');
let skills = document.querySelector('a[href="#skills"]');
let certificates = document.querySelector('a[href="#certificates"]');
let projects = document.querySelector('a[href="#projects"]');
let contact = document.querySelector('a[href="#contact"]');

hamberger.addEventListener('click', function () {
    mobileNav.classList.add('open');
});
times.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});
mobileNav.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

about.addEventListener('click', function () {
    mobileNav.classList.remove('open');
})
hamberger.addEventListener('click', function () {
    mobileNav.classList.add('open');
});

times.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

about.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

home.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

skills.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

certificates.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

projects.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

// contact.addEventListener('click', function(){
//     mobileNav.classList.remove('open');
// });

// for text animation
const textElement = document.getElementById('typewriter');
const words = ["Web Developer", "Web Designer", "Problem Solver"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 200;

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        // remove letter
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 100; // Slight speed increase when deleting
    } else {
        // Add the Letter
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 200;
    }

    // Logic: When the word is completely typed
    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 1500; // Wait 1.5 seconds for the entire word to be written.
    }
    // Logic: when the word is completely delete
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length; // Go to next word
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// for start
document.addEventListener('DOMContentLoaded', type);