// // control.js - Complete System: Tracking & Professional Dashboard (v2)
// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// // 1. ट्रैकिंग लॉजिक
// async function trackEverything() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const isAdminEntry = urlParams.get('show') === 'admin';
//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//         const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
//         const yK = `${now.getFullYear()}`;

//         const geoRes = await fetch('https://ip-api.com/json/');
//         const geoData = await geoRes.json();
//         const locName = geoData.city ? `${geoData.city}, ${geoData.regionName}` : "Unknown";

//         const commonData = { location: locName, time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), date: now.toLocaleDateString() };

//         const updateCount = async (basePath) => {
//             const keys = [`years/${yK}`, `months/${mK}`, `days/${dK}`];
//             for (let k of keys) {
//                 const r = await fetch(`${dbURL}/${basePath}/${k}.json`);
//                 const c = (await r.json()) || 0;
//                 await fetch(`${dbURL}/${basePath}/${k}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
//             }
//         };

//         if (isAdminEntry) {
//             localStorage.setItem('is_admin_access', 'true');
//             await updateCount('v2_admin_stats');
//             await fetch(`${dbURL}/v2_admin_logs.json`, { method: 'POST', body: JSON.stringify(commonData) });
//         } else if (localStorage.getItem('is_admin_access') !== 'true') {
//             await updateCount('v2_visitor_stats');
//             await fetch(`${dbURL}/v2_visitor_logs.json`, { method: 'POST', body: JSON.stringify(commonData) });
//         }
//     } catch (e) { console.log("System Tracking Active"); }
// }

// // 2. डैशबोर्ड UI लॉजिक
// async function showProfessionalPanel() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = (await res.json()) || {};
//     const vStats = data.v2_visitor_stats || {};
//     const aStats = data.v2_admin_stats || {};
//     const now = new Date();
//     const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//     const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
//     const yK = `${now.getFullYear()}`;

//     const overlay = document.createElement('div');
//     overlay.id = "system-admin-panel";
//     overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:#0d1117; color:#c9d1d9; z-index:2147483647; font-family:sans-serif; overflow-y:auto; padding:20px; box-sizing:border-box;";
    
//     overlay.innerHTML = `
//         <style>
//             #system-admin-panel .panel { background:#161b22; border:1px solid #30363d; border-radius:10px; padding:20px; margin-bottom:20px; }
//             #system-admin-panel .grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-bottom:15px; }
//             #system-admin-panel .box { background:#0d1117; padding:10px; border-radius:6px; text-align:center; border:1px solid #21262d; }
//             #system-admin-panel .log { height:250px; overflow-y:auto; font-size:12px; }
//             #system-admin-panel .entry { border-bottom:1px solid #21262d; padding:8px 0; display:flex; justify-content:space-between; }
//             #system-admin-panel .btn-grp { display:flex; gap:10px; justify-content:center; margin-bottom:20px; }
//             #system-admin-panel button { width:150px; padding:10px; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:white; }
//         </style>
//         <div style="max-width:900px; margin:auto;">
//             <h2 style="text-align:center; color:#58a6ff; margin-bottom:20px;">System Admin Dashboard</h2>
//             <div class="btn-grp">
//                 <button style="background:#238636;" onclick="location.reload()">REFRESH</button>
//                 <button style="background:#da3633;" onclick="document.getElementById('system-admin-panel').remove()">CLOSE</button>
//             </div>
            
//             <div class="panel">
//                 <h3 style="color:#f85149; margin-top:0;">Admin Access (v2)</h3>
//                 <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
//                     <div class="box"><small>Today</small><br><b>${aStats.days?.[dK] || 0}</b></div>
//                     <div class="box"><small>Year</small><br><b>${aStats.years?.[yK] || 0}</b></div>
//                 </div>
//                 <div class="log">${Object.values(data.v2_admin_logs || {}).reverse().map(l => `
//                     <div class="entry"><span>${l.location}</span><span>${l.date} | ${l.time}</span></div>
//                 `).join('')}</div>
//             </div>

//             <div class="panel">
//                 <h3 style="color:#3fb950; margin-top:0;">Visitor Insights (v2)</h3>
//                 <div class="grid">
//                     <div class="box"><small>Today</small><br><b>${vStats.days?.[dK] || 0}</b></div>
//                     <div class="box"><small>Month</small><br><b>${vStats.months?.[mK] || 0}</b></div>
//                     <div class="box"><small>Year</small><br><b>${vStats.years?.[yK] || 0}</b></div>
//                 </div>
//                 <div class="log">${Object.values(data.v2_visitor_logs || {}).reverse().map(l => `
//                     <div class="entry"><span>${l.location}</span><span>${l.date} | ${l.time}</span></div>
//                 `).join('')}</div>
//             </div>
//         </div>
//     `;
//     document.body.appendChild(overlay);
// }

// if (new URLSearchParams(window.location.search).get('show') === 'admin') showProfessionalPanel();
// trackEverything();


// -----------------------------------------------------------------------------------------------------------------------------
// control.js - Professional Dashboard with Detail-View (v2)
// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// // 1. ट्रैकिंग लॉजिक (Tracking Logic)
// async function trackEverything() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const isAdminEntry = urlParams.get('show') === 'admin';
//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//         const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
//         const yK = `${now.getFullYear()}`;

//         const geoRes = await fetch('https://ip-api.com/json/');
//         const geoData = await geoRes.json();
//         const locName = geoData.city ? `${geoData.city}, ${geoData.regionName}` : "Unknown";

//         const commonData = { location: locName, time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), date: now.toLocaleDateString() };

//         const updateCount = async (basePath) => {
//             const keys = [`years/${yK}`, `months/${mK}`, `days/${dK}`];
//             for (let k of keys) {
//                 const r = await fetch(`${dbURL}/${basePath}/${k}.json`);
//                 const c = (await r.json()) || 0;
//                 await fetch(`${dbURL}/${basePath}/${k}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
//             }
//         };

//         if (isAdminEntry) {
//             localStorage.setItem('is_admin_access', 'true');
//             await updateCount('v2_admin_stats');
//             await fetch(`${dbURL}/v2_admin_logs.json`, { method: 'POST', body: JSON.stringify(commonData) });
//         } else if (localStorage.getItem('is_admin_access') !== 'true') {
//             await updateCount('v2_visitor_stats');
//             await fetch(`${dbURL}/v2_visitor_logs.json`, { method: 'POST', body: JSON.stringify(commonData) });
//         }
//     } catch (e) { console.log("System Tracking Active"); }
// }

// // 2. डैशबोर्ड और Detail UI लॉजिक
// async function showProfessionalPanel() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = (await res.json()) || {};
//     const vStats = data.v2_visitor_stats || {};
//     const aStats = data.v2_admin_stats || {};
    
//     // UI Render Function
//     window.renderDashboard = (viewType = 'main', title = '', stats = {}) => {
//         const container = document.getElementById('panel-content');
//         if (viewType === 'main') {
//             container.innerHTML = `
//                 <div class="grid">
//                     <div class="box" onclick="renderDashboard('detail', 'Admin Access', ${JSON.stringify(aStats).replace(/"/g, "'")})">
//                         <small>Admin (Total)</small><br><b>${Object.values(aStats.years || {}).reduce((a,b)=>a+b, 0)}</b>
//                     </div>
//                     <div class="box" onclick="renderDashboard('detail', 'Visitors', ${JSON.stringify(vStats).replace(/"/g, "'")})">
//                         <small>Visitors (Total)</small><br><b>${Object.values(vStats.years || {}).reduce((a,b)=>a+b, 0)}</b>
//                     </div>
//                 </div>
//             `;
//         } else {
//             container.innerHTML = `
//                 <button onclick="renderDashboard()" style="background:#58a6ff; border:none; padding:5px 15px; border-radius:5px; cursor:pointer; margin-bottom:10px;">← Back</button>
//                 <h3>${title} Details</h3>
//                 <div style="background:#0d1117; padding:15px; border-radius:8px; border:1px solid #21262d;">
//                     <p>Current Year Data: ${stats.years ? Object.values(stats.years)[0] : 0}</p>
//                     <p>Current Month Data: ${stats.months ? Object.values(stats.months)[0] : 0}</p>
//                 </div>
//             `;
//         }
//     };

//     const overlay = document.createElement('div');
//     overlay.id = "system-admin-panel";
//     overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:#0d1117; color:#c9d1d9; z-index:2147483647; font-family:sans-serif; overflow-y:auto; padding:20px; box-sizing:border-box;";
    
//     overlay.innerHTML = `
//         <style>
//             .grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:15px; }
//             .box { background:#161b22; padding:20px; border-radius:10px; border:1px solid #30363d; cursor:pointer; text-align:center; transition:0.2s; }
//             .box:hover { border-color:#58a6ff; background:#1f242c; }
//         </style>
//         <div style="max-width:600px; margin:auto;">
//             <h2 style="text-align:center;">System Admin Dashboard</h2>
//             <div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
//                 <button onclick="location.reload()" style="padding:10px; cursor:pointer;">REFRESH</button>
//                 <button onclick="document.getElementById('system-admin-panel').remove()" style="padding:10px; cursor:pointer;">CLOSE</button>
//             </div>
//             <div id="panel-content"></div>
//         </div>
//     `;
//     document.body.appendChild(overlay);
//     window.renderDashboard(); // Initial Load
// }

// // Initialization
// if (new URLSearchParams(window.location.search).get('show') === 'admin') showProfessionalPanel();
// trackEverything();
// ---------------------------------------------------------------------------------------------
// control.js - Professional UI Upgrade
// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// async function showProfessionalPanel() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = (await res.json()) || {};
//     const vStats = data.v2_visitor_stats || {};
//     const aStats = data.v2_admin_stats || {};

//     window.renderDashboard = (viewType = 'main', title = '', stats = {}) => {
//         const container = document.getElementById('panel-content');
//         if (viewType === 'main') {
//             container.innerHTML = `
//                 <div class="stats-grid">
//                     <div class="card" onclick="renderDashboard('detail', 'Admin Access', ${JSON.stringify(aStats).replace(/"/g, "'")})">
//                         <small>ADMIN ACCESS</small>
//                         <div class="value">${Object.values(aStats.years || {}).reduce((a,b)=>a+b, 0)}</div>
//                     </div>
//                     <div class="card" onclick="renderDashboard('detail', 'Visitors', ${JSON.stringify(vStats).replace(/"/g, "'")})">
//                         <small>TOTAL VISITORS</small>
//                         <div class="value">${Object.values(vStats.years || {}).reduce((a,b)=>a+b, 0)}</div>
//                     </div>
//                 </div>
//             `;
//         } else {
//             container.innerHTML = `
//                 <button class="back-btn" onclick="renderDashboard()">← Back to Overview</button>
//                 <div class="detail-card">
//                     <h3>${title} Stats</h3>
//                     <div class="stat-row"><span>Yearly Total</span> <b>${stats.years ? Object.values(stats.years)[0] : 0}</b></div>
//                     <div class="stat-row"><span>Monthly Total</span> <b>${stats.months ? Object.values(stats.months)[0] : 0}</b></div>
//                 </div>
//             `;
//         }
//     };

//     const overlay = document.createElement('div');
//     overlay.id = "system-admin-panel";
//     overlay.innerHTML = `
//         <style>
//             #system-admin-panel { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(10, 15, 20, 0.95); color:#e6edf3; z-index:99999; font-family: 'Segoe UI', sans-serif; padding:40px; box-sizing:border-box; }
//             .stats-grid { display:grid; grid-template-columns: 1fr 1fr; gap:20px; }
//             .card { background:#1c2128; padding:25px; border-radius:12px; border:1px solid #30363d; cursor:pointer; text-align:center; transition:0.3s; }
//             .card:hover { background:#222a33; border-color:#58a6ff; transform:translateY(-5px); }
//             .value { font-size: 2em; font-weight: bold; margin-top: 10px; color: #58a6ff; }
//             .back-btn { background:transparent; border:1px solid #30363d; color:#8b949e; padding:8px 15px; border-radius:6px; cursor:pointer; margin-bottom:15px; }
//             .stat-row { display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid #30363d; }
//         </style>
//         <div style="max-width:700px; margin:auto;">
//             <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
//                 <h2 style="margin:0;">Analytics Control</h2>
//                 <button onclick="document.getElementById('system-admin-panel').remove()" style="background:#da3633; border:none; color:white; padding:8px 15px; border-radius:6px; cursor:pointer;">Close</button>
//             </div>
//             <div id="panel-content"></div>
//         </div>
//     `;
//     document.body.appendChild(overlay);
//     window.renderDashboard();
// }

// if (new URLSearchParams(window.location.search).get('show') === 'admin') showProfessionalPanel();
// ---------------------------------------------------------------------------------------------------------------

// control.js - Fixed & Sync Logic (v2)
// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// // 1. Data Formatter - Sabse important, yahi consistency ensure karega
// function getKeys() {
//     const now = new Date();
//     return {
//         dK: `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`,
//         mK: `${now.getMonth() + 1}-${now.getFullYear()}`,
//         yK: `${now.getFullYear()}`
//     };
// }

// // 2. Tracking Logic
// async function trackEverything() {
//     try {
//         const { dK, mK, yK } = getKeys();
//         const isAdminEntry = new URLSearchParams(window.location.search).get('show') === 'admin';
//         const basePath = isAdminEntry ? 'v2_admin_stats' : 'v2_visitor_stats';
        
//         // Count update function
//         const updateCount = async (path, key, subKey) => {
//             const url = `${dbURL}/${path}/${key}/${subKey}.json`;
//             const res = await fetch(url);
//             const current = (await res.json()) || 0;
//             await fetch(url, { method: 'PUT', body: JSON.stringify(current + 1) });
//         };

//         // Update all stats
//         await updateCount(basePath, 'days', dK);
//         await updateCount(basePath, 'months', mK);
//         await updateCount(basePath, 'years', yK);

//         // Logs (Optional)
//         const commonData = { time: new Date().toLocaleTimeString(), date: new Date().toLocaleDateString() };
//         await fetch(`${dbURL}/${isAdminEntry ? 'v2_admin_logs' : 'v2_visitor_logs'}.json`, { 
//             method: 'POST', body: JSON.stringify(commonData) 
//         });

//     } catch (e) { console.log("Tracking paused"); }
// }

// // 3. UI and Clear Function
// async function showProfessionalPanel() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = (await res.json()) || {};
//     const v = data.v2_visitor_stats || {days:{}, months:{}, years:{}};
//     const a = data.v2_admin_stats || {days:{}, months:{}, years:{}};
//     const { dK, mK, yK } = getKeys();

//     const overlay = document.createElement('div');
//     overlay.id = "system-admin-panel";
//     overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:99999;color:#fff;padding:20px;font-family:sans-serif;";
    
//     overlay.innerHTML = `
//         <div style="max-width:600px; margin:auto;">
//             <h2>Admin Dashboard v2</h2>
//             <button onclick="document.getElementById('system-admin-panel').remove()">Close</button>
//             <button onclick="clearData()" style="background:red; color:white;">Clear All Data</button>
//             <div style="margin-top:20px;">
//                 <h3>Visitor Stats</h3>
//                 <p>Today: ${v.days[dK] || 0}</p>
//                 <p>Month: ${v.months[mK] || 0}</p>
//                 <p>Year: ${v.years[yK] || 0}</p>
//             </div>
//         </div>
//     `;
//     document.body.appendChild(overlay);
// }

// // 4. Reset function (Manual control)
// window.clearData = async () => {
//     if(confirm("Are you sure you want to wipe all v2 data?")) {
//         await fetch(`${dbURL}/v2_visitor_stats.json`, { method: 'DELETE' });
//         await fetch(`${dbURL}/v2_admin_stats.json`, { method: 'DELETE' });
//         alert("Data cleared! Refresh the page.");
//     }
// };

// if (new URLSearchParams(window.location.search).get('show') === 'admin') showProfessionalPanel();
// trackEverything();

// ..---------------------------------------------------------

// // control.js - Full Integrated System v2
// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// // 1. Consistent Helper: Date Keys (Isse data aage-peechhe nahi hoga)
// function getKeys() {
//     const now = new Date();
//     return {
//         dK: `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`,
//         mK: `${now.getMonth() + 1}-${now.getFullYear()}`,
//         yK: `${now.getFullYear()}`
//     };
// }

// // 2. Tracking Logic: Record all visits
// async function trackEverything() {
//     try {
//         const { dK, mK, yK } = getKeys();
//         const isAdmin = new URLSearchParams(window.location.search).get('show') === 'admin';
//         const basePath = isAdmin ? 'v2_admin_stats' : 'v2_visitor_stats';
        
//         // Location fetch with fallback
//         let loc = "Unknown";
//         try {
//             const res = await fetch('https://ip-api.com/json/');
//             const data = await res.json();
//             loc = data.city ? `${data.city}, ${data.regionName}` : "Unknown";
//         } catch(e) { loc = "Offline"; }

//         // Update counts
//         const update = async (path, key, subKey) => {
//             const url = `${dbURL}/${path}/${key}/${subKey}.json`;
//             const res = await fetch(url);
//             const current = (await res.json()) || 0;
//             await fetch(url, { method: 'PUT', body: JSON.stringify(current + 1) });
//         };

//         await update(basePath, 'days', dK);
//         await update(basePath, 'months', mK);
//         await update(basePath, 'years', yK);

//         // Logs
//         await fetch(`${dbURL}/${isAdmin ? 'v2_admin_logs' : 'v2_visitor_logs'}.json`, { 
//             method: 'POST', body: JSON.stringify({ location: loc, time: new Date().toLocaleTimeString(), date: new Date().toLocaleDateString() }) 
//         });

//     } catch (e) { console.log("Tracking Error"); }
// }

// // 3. Dashboard UI Logic
// async function showProfessionalPanel() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = (await res.json()) || {};
//     const v = data.v2_visitor_stats || {days:{}, months:{}, years:{}};
//     const a = data.v2_admin_stats || {days:{}, months:{}, years:{}};
//     const { dK, mK, yK } = getKeys();

//     const overlay = document.createElement('div');
//     overlay.id = "system-admin-panel";
//     overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#0d1117;color:#c9d1d9;z-index:999999;font-family:sans-serif;padding:20px;overflow-y:auto;";
    
//     overlay.innerHTML = `
//         <div style="max-width:800px; margin:auto;">
//             <div style="display:flex; justify-content:space-between; align-items:center;">
//                 <h2 style="color:#58a6ff;">Admin Dashboard v2</h2>
//                 <div>
//                     <button onclick="location.reload()" style="background:#238636;color:white;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;">REFRESH</button>
//                     <button onclick="clearData()" style="background:#da3633;color:white;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;margin-left:10px;">Clear Data</button>
//                     <button onclick="document.getElementById('system-admin-panel').remove()" style="background:#30363d;color:white;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;margin-left:10px;">CLOSE</button>
//                 </div>
//             </div>
            
//             <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px;">
//                 <div style="background:#161b22;padding:20px;border-radius:10px;border:1px solid #30363d;">
//                     <h3 style="color:#f85149;">Admin Stats</h3>
//                     <p>Today: <b>${a.days[dK] || 0}</b></p>
//                     <p>Month: <b>${a.months[mK] || 0}</b></p>
//                     <p>Year: <b>${a.years[yK] || 0}</b></p>
//                 </div>
//                 <div style="background:#161b22;padding:20px;border-radius:10px;border:1px solid #30363d;">
//                     <h3 style="color:#3fb950;">Visitor Stats</h3>
//                     <p>Today: <b>${v.days[dK] || 0}</b></p>
//                     <p>Month: <b>${v.months[mK] || 0}</b></p>
//                     <p>Year: <b>${v.years[yK] || 0}</b></p>
//                 </div>
//             </div>
//         </div>
//     `;
//     document.body.appendChild(overlay);
// }

// // 4. Reset Function
// window.clearData = async () => {
//     if(confirm("Confirm to wipe all v2 data?")) {
//         await fetch(`${dbURL}/v2_visitor_stats.json`, { method: 'DELETE' });
//         await fetch(`${dbURL}/v2_admin_stats.json`, { method: 'DELETE' });
//         alert("Data cleared. Refresh page.");
//     }
// };

// // Initialization
// if (new URLSearchParams(window.location.search).get('show') === 'admin') showProfessionalPanel();
// trackEverything();

// ----------------------------------------------------------------------------------------------------------------------

// control.js - Integrated Tracking & Professional Dashboard
// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// // 1. ट्रैकिंग लॉजिक (Tracking Logic)
// async function trackEverything() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const isAdminEntry = urlParams.get('show') === 'admin';
//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//         const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
//         const yK = `${now.getFullYear()}`;

//         // Get Location
//         const geoRes = await fetch('https://ip-api.com/json/');
//         const geoData = await geoRes.json();
//         const locName = geoData.city ? `${geoData.city}, ${geoData.regionName}` : "Unknown";

//         const commonData = { 
//             location: locName, 
//             time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
//             date: now.toLocaleDateString() 
//         };

//         const updateCount = async (basePath) => {
//             const keys = [`years/${yK}`, `months/${mK}`, `days/${dK}`];
//             for (let k of keys) {
//                 const r = await fetch(`${dbURL}/${basePath}/${k}.json`);
//                 const c = (await r.json()) || 0;
//                 await fetch(`${dbURL}/${basePath}/${k}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
//             }
//         };

//         if (isAdminEntry) {
//             localStorage.setItem('is_admin_access', 'true');
//             await updateCount('v2_admin_stats');
//             await fetch(`${dbURL}/v2_admin_logs.json`, { method: 'POST', body: JSON.stringify(commonData) });
//         } else if (localStorage.getItem('is_admin_access') !== 'true') {
//             await updateCount('v2_visitor_stats');
//             await fetch(`${dbURL}/v2_visitor_logs.json`, { method: 'POST', body: JSON.stringify(commonData) });
//         }
//     } catch (e) { console.log("System Tracking Active"); }
// }

// // 2. प्रोफेशनल डैशबोर्ड UI लॉजिक (Professional UI)
// async function showProfessionalPanel() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = (await res.json()) || {};
//     const vStats = data.v2_visitor_stats || {};
//     const aStats = data.v2_admin_stats || {};

//     window.renderDashboard = (viewType = 'main', title = '', stats = {}) => {
//         const container = document.getElementById('panel-content');
//         if (viewType === 'main') {
//             container.innerHTML = `
//                 <div class="stats-grid">
//                     <div class="card" onclick="renderDashboard('detail', 'Admin Access', ${JSON.stringify(aStats).replace(/"/g, "'")})">
//                         <small>ADMIN ACCESS</small>
//                         <div class="value">${Object.values(aStats.years || {}).reduce((a,b)=>a+b, 0)}</div>
//                     </div>
//                     <div class="card" onclick="renderDashboard('detail', 'Visitors', ${JSON.stringify(vStats).replace(/"/g, "'")})">
//                         <small>TOTAL VISITORS</small>
//                         <div class="value">${Object.values(vStats.years || {}).reduce((a,b)=>a+b, 0)}</div>
//                     </div>
//                 </div>
//             `;
//         } else {
//             container.innerHTML = `
//                 <button class="back-btn" onclick="renderDashboard()">← Back to Overview</button>
//                 <div class="detail-card">
//                     <h3>${title} Stats</h3>
//                     <div class="stat-row"><span>Yearly Total</span> <b>${stats.years ? Object.values(stats.years)[0] : 0}</b></div>
//                     <div class="stat-row"><span>Monthly Total</span> <b>${stats.months ? Object.values(stats.months)[0] : 0}</b></div>
//                 </div>
//             `;
//         }
//     };

//     const overlay = document.createElement('div');
//     overlay.id = "system-admin-panel";
//     overlay.innerHTML = `
//         <style>
//             #system-admin-panel { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(10, 15, 20, 0.95); color:#e6edf3; z-index:99999; font-family: 'Segoe UI', sans-serif; padding:40px; box-sizing:border-box; }
//             .stats-grid { display:grid; grid-template-columns: 1fr 1fr; gap:20px; }
//             .card { background:#1c2128; padding:25px; border-radius:12px; border:1px solid #30363d; cursor:pointer; text-align:center; transition:0.3s; }
//             .card:hover { background:#222a33; border-color:#58a6ff; transform:translateY(-5px); }
//             .value { font-size: 2em; font-weight: bold; margin-top: 10px; color: #58a6ff; }
//             .back-btn { background:transparent; border:1px solid #30363d; color:#8b949e; padding:8px 15px; border-radius:6px; cursor:pointer; margin-bottom:15px; }
//             .stat-row { display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid #30363d; }
//         </style>
//         <div style="max-width:700px; margin:auto;">
//             <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
//                 <h2 style="margin:0;">Analytics Control</h2>
//                 <button onclick="document.getElementById('system-admin-panel').remove()" style="background:#da3633; border:none; color:white; padding:8px 15px; border-radius:6px; cursor:pointer;">Close</button>
//             </div>
//             <div id="panel-content"></div>
//         </div>
//     `;
//     document.body.appendChild(overlay);
//     window.renderDashboard();
// }

// // Initial Run
// trackEverything();
// if (new URLSearchParams(window.location.search).get('show') === 'admin') {
//     showProfessionalPanel();
// }

// ------------------------------------------------------------------------------------------------------------------------------
// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// // 1. ट्रैकिंग लॉजिक (Location, Date, Time के साथ)
// async function trackAndLog() {
//     try {
//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//         const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
//         const yK = `${now.getFullYear()}`;
        
//         // IP से असली Location उठाना
//         let loc = "Unknown Location";
//         try {
//             const geoRes = await fetch('https://ip-api.com/json/');
//             const geoData = await geoRes.json();
//             loc = geoData.city ? `${geoData.city}, ${geoData.regionName}` : "Unknown";
//         } catch(e) { loc = "Hidden"; }

//         const logEntry = {
//             location: loc,
//             time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
//             date: now.toLocaleDateString()
//         };

//         const isAdmin = new URLSearchParams(window.location.search).get('show') === 'admin';
//         const basePath = isAdmin ? 'v2_admin_stats' : 'v2_visitor_stats';
//         const logPath = isAdmin ? 'v2_admin_logs' : 'v2_visitor_logs';

//         // Stats Increment
//         const keys = [`years/${yK}`, `months/${mK}`, `days/${dK}`];
//         for (let k of keys) {
//             const r = await fetch(`${dbURL}/${basePath}/${k}.json`);
//             const c = (await r.json()) || 0;
//             await fetch(`${dbURL}/${basePath}/${k}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
//         }

//         // Log Push
//         await fetch(`${dbURL}/${logPath}.json`, { method: 'POST', body: JSON.stringify(logEntry) });
//     } catch (e) { console.error("Tracking Error:", e); }
// }

// // 2. प्रोफेशनल UI + Bhutiya Thunderstorm Magic
// async function showProfessionalPanel() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = (await res.json()) || {};
//     const vStats = data.v2_visitor_stats || {};
//     const aStats = data.v2_admin_stats || {};
//     const aLogs = Object.values(data.v2_admin_logs || {}).reverse();
//     const vLogs = Object.values(data.v2_visitor_logs || {}).reverse();

//     window.renderDashboard = (viewType = 'main', title = '', stats = {}) => {
//         const container = document.getElementById('panel-content');
//         if (viewType === 'main') {
//             container.innerHTML = `
//                 <div class="stats-grid">
//                     <div class="card" onclick="renderDashboard('detail', 'Admin Access', ${JSON.stringify(aStats).replace(/"/g, "'")})">
//                         <small>ADMIN ACCESS</small>
//                         <div class="value">${Object.values(aStats.years || {}).reduce((a,b)=>a+b, 0)}</div>
//                     </div>
//                     <div class="card" onclick="renderDashboard('detail', 'Visitors', ${JSON.stringify(vStats).replace(/"/g, "'")})">
//                         <small>TOTAL VISITORS</small>
//                         <div class="value">${Object.values(vStats.years || {}).reduce((a,b)=>a+b, 0)}</div>
//                     </div>
//                 </div>
//                 <div style="margin-top:20px; background:#1c2128; padding:15px; border-radius:12px; border:1px solid #30363d;">
//                     <h3>Recent Activity</h3>
//                     <div style="height:200px; overflow-y:auto; font-size:0.8em;">
//                         ${vLogs.map(l => `<div class="stat-row"><span>${l.location}</span> <b>${l.date} - ${l.time}</b></div>`).join('')}
//                     </div>
//                 </div>
//             `;
//         } else {
//             container.innerHTML = `
//                 <button class="back-btn" onclick="renderDashboard()">← Back to Overview</button>
//                 <div class="detail-card">
//                     <h3>${title} Stats</h3>
//                     <div class="stat-row"><span>Yearly Total</span> <b>${stats.years ? Object.values(stats.years)[0] : 0}</b></div>
//                     <div class="stat-row"><span>Monthly Total</span> <b>${stats.months ? Object.values(stats.months)[0] : 0}</b></div>
//                 </div>
//             `;
//         }
//     };

//     const overlay = document.createElement('div');
//     overlay.id = "system-admin-panel";
//     overlay.innerHTML = `
//         <style>
//             @keyframes ghost-lightning { 
//                 0%, 95% { background: rgba(10, 15, 20, 0.95); box-shadow: inset 0 0 100px #000; }
//                 96% { background: #fff; box-shadow: inset 0 0 100px #fff; }
//                 97% { background: rgba(10, 15, 20, 0.95); }
//                 98% { background: #fff; box-shadow: inset 0 0 100px #fff; }
//                 100% { background: rgba(10, 15, 20, 0.95); }
//             }
//             #system-admin-panel { position:fixed; top:0; left:0; width:100%; height:100%; z-index:99999; animation: ghost-lightning 5s infinite; font-family: 'Segoe UI', sans-serif; padding:40px; box-sizing:border-box; color:#e6edf3; }
//             .stats-grid { display:grid; grid-template-columns: 1fr 1fr; gap:20px; }
//             .card { background:#1c2128; padding:25px; border-radius:12px; border:1px solid #30363d; cursor:pointer; text-align:center; transition:0.3s; }
//             .card:hover { background:#222a33; border-color:#58a6ff; transform:translateY(-5px); }
//             .value { font-size: 2em; font-weight: bold; margin-top: 10px; color: #58a6ff; }
//             .back-btn { background:transparent; border:1px solid #30363d; color:#8b949e; padding:8px 15px; border-radius:6px; cursor:pointer; margin-bottom:15px; }
//             .stat-row { display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid #30363d; }
//         </style>
//         <div style="max-width:700px; margin:auto;">
//             <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
//                 <h2 style="margin:0;">⚡ Analytics Control</h2>
//                 <button onclick="document.getElementById('system-admin-panel').remove()" style="background:#da3633; border:none; color:white; padding:8px 15px; border-radius:6px; cursor:pointer;">Close</button>
//             </div>
//             <div id="panel-content"></div>
//         </div>
//     `;
//     document.body.appendChild(overlay);
//     window.renderDashboard();
// }

// // System Execution
// trackAndLog();
// if (new URLSearchParams(window.location.search).get('show') === 'admin') {
//     showProfessionalPanel();
// }  
// perfect -------------------------------------------------
// --------------------------------------------------------------------------------------------------------

// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// // 1. ट्रैकिंग लॉजिक (IP, Date, Time, Unique ID)
// async function trackAndLog() {
//     try {
//         const now = new Date();
//         // Day Name, Date, Time formatting
//         const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
//         const fullDate = now.toLocaleDateString('en-IN', options); // e.g. "Wednesday, 27-05-2026"
//         const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//         let loc = "Tracking Blocked";
//         try {
//             const geoRes = await fetch('https://ip-api.com/json/');
//             const geoData = await geoRes.json();
//             if(geoData.status === 'success') {
//                 loc = `${geoData.city}, ${geoData.countryCode}`;
//             }
//         } catch(e) { loc = "VPN/Ad-Blocker Active"; }

//         // Unique Visitor ID generator (Fixing "Unknown" name)
//         const visitorID = "Visitor #" + Math.floor(1000 + Math.random() * 9000);

//         const logEntry = {
//             name: visitorID,
//             location: loc,
//             time: time,
//             date: fullDate
//         };

//         const isAdmin = new URLSearchParams(window.location.search).get('show') === 'admin';
//         const logPath = isAdmin ? 'v2_admin_logs' : 'v2_visitor_logs';

//         await fetch(`${dbURL}/${logPath}.json`, { 
//             method: 'POST', 
//             body: JSON.stringify(logEntry) 
//         });

//     } catch (e) { console.error("Tracking Error:", e); }
// }

// // 2. प्रोफेशनल डैशबोर्ड UI (Thunderstorm + Scrollbar Fix)
// async function showProfessionalPanel() {
//     const res = await fetch(`${dbURL}/.json`);
//     const data = (await res.json()) || {};
//     const vStats = data.v2_visitor_stats || {};
//     const aStats = data.v2_admin_stats || {};
//     const vLogs = Object.values(data.v2_visitor_logs || {}).reverse();

//     window.renderDashboard = (viewType = 'main', title = '', stats = {}) => {
//         const container = document.getElementById('panel-content');
//         if (viewType === 'main') {
//             container.innerHTML = `
//                 <div class="stats-grid">
//                     <div class="card" onclick="renderDashboard('detail', 'Admin Access', ${JSON.stringify(aStats).replace(/"/g, "'")})">
//                         <small>ADMIN ACCESS</small>
//                         <div class="value">${Object.values(aStats.years || {}).reduce((a,b)=>a+b, 0)}</div>
//                     </div>
//                     <div class="card" onclick="renderDashboard('detail', 'Visitors', ${JSON.stringify(vStats).replace(/"/g, "'")})">
//                         <small>TOTAL VISITORS</small>
//                         <div class="value">${Object.values(vStats.years || {}).reduce((a,b)=>a+b, 0)}</div>
//                     </div>
//                 </div>
//                 <div style="margin-top:20px; background:#1c2128; padding:15px; border-radius:12px; border:1px solid #30363d;">
//                     <h3>Recent Activity</h3>
//                     <div class="log-box">
//                         ${vLogs.map(l => `
//                             <div class="stat-row">
//                                 <span><b>${l.name}</b> - ${l.location}</span> 
//                                 <span style="white-space:nowrap; margin-left:10px;">${l.date} | ${l.time}</span>
//                             </div>
//                         `).join('')}
//                     </div>
//                 </div>
//             `;
//         } else {
//             container.innerHTML = `
//                 <button class="back-btn" onclick="renderDashboard()">← Back to Overview</button>
//                 <div class="detail-card">
//                     <h3>${title} Stats</h3>
//                     <div class="stat-row"><span>Yearly Total</span> <b>${stats.years ? Object.values(stats.years)[0] : 0}</b></div>
//                     <div class="stat-row"><span>Monthly Total</span> <b>${stats.months ? Object.values(stats.months)[0] : 0}</b></div>
//                 </div>
//             `;
//         }
//     };

//     const overlay = document.createElement('div');
//     overlay.id = "system-admin-panel";
//     overlay.innerHTML = `
//         <style>
//             @keyframes ghost-lightning { 
//                 0%, 95% { background: rgba(10, 15, 20, 0.95); box-shadow: inset 0 0 100px #000; }
//                 96% { background: #fff; box-shadow: inset 0 0 100px #fff; }
//                 97% { background: rgba(10, 15, 20, 0.95); }
//                 98% { background: #fff; box-shadow: inset 0 0 100px #fff; }
//                 100% { background: rgba(10, 15, 20, 0.95); }
//             }
//             #system-admin-panel { position:fixed; top:0; left:0; width:100%; height:100%; z-index:99999; animation: ghost-lightning 5s infinite; font-family: 'Segoe UI', sans-serif; padding:40px; box-sizing:border-box; color:#e6edf3; }
//             .stats-grid { display:grid; grid-template-columns: 1fr 1fr; gap:20px; }
//             .card { background:#1c2128; padding:25px; border-radius:12px; border:1px solid #30363d; cursor:pointer; text-align:center; transition:0.3s; }
//             .card:hover { background:#222a33; border-color:#58a6ff; transform:translateY(-5px); }
//             .value { font-size: 2em; font-weight: bold; margin-top: 10px; color: #58a6ff; }
//             .back-btn { background:transparent; border:1px solid #30363d; color:#8b949e; padding:8px 15px; border-radius:6px; cursor:pointer; margin-bottom:15px; }
            
//             /* SCROLLBAR FIX */
//             .log-box { 
//                 height:200px; 
//                 overflow-y:auto; 
//                 padding-right: 20px; /* scrollbar overlap fix */
//             }
//             .stat-row { 
//                 display:flex; 
//                 justify-content:space-between; 
//                 padding:12px 0; 
//                 border-bottom:1px solid #30363d; 
//             }
//         </style>
//         <div style="max-width:700px; margin:auto;">
//             <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
//                 <h2 style="margin:0;">⚡ Analytics Control</h2>
//                 <button onclick="document.getElementById('system-admin-panel').remove()" style="background:#da3633; border:none; color:white; padding:8px 15px; border-radius:6px; cursor:pointer;">Close</button>
//             </div>
//             <div id="panel-content"></div>
//         </div>
//     `;
//     document.body.appendChild(overlay);
//     window.renderDashboard();
// }

// // System Execution
// trackAndLog();
// if (new URLSearchParams(window.location.search).get('show') === 'admin') {
//     showProfessionalPanel();
// }


// ............................................................===============================================

const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// 1. ट्रैकिंग लॉजिक (Manual Day Logic + Unique ID)
async function trackAndLog() {
    try {
        const now = new Date();
        
        // Day Name Manual Logic - 100% Work Karega
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = days[now.getDay()];
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const fullDate = `${dayName}, ${day}-${month}-${year}`;
        
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let loc = "Tracking Blocked";
        try {
            const geoRes = await fetch('https://ip-api.com/json/');
            const geoData = await geoRes.json();
            if(geoData.status === 'success') {
                loc = `${geoData.city}, ${geoData.countryCode}`;
            }
        } catch(e) { loc = "VPN Active"; }

        const visitorID = "Visitor #" + Math.floor(1000 + Math.random() * 9000);

        const logEntry = {
            name: visitorID,
            location: loc,
            time: time,
            date: fullDate
        };

        const isAdmin = new URLSearchParams(window.location.search).get('show') === 'admin';
        const logPath = isAdmin ? 'v2_admin_logs' : 'v2_visitor_logs';

        await fetch(`${dbURL}/${logPath}.json`, { 
            method: 'POST', 
            body: JSON.stringify(logEntry) 
        });

    } catch (e) { console.error("Tracking Error:", e); }
}

// 2. प्रोफेशनल UI + Bhutiya Thunderstorm Magic
async function showProfessionalPanel() {
    const res = await fetch(`${dbURL}/.json`);
    const data = (await res.json()) || {};
    const vStats = data.v2_visitor_stats || {};
    const aStats = data.v2_admin_stats || {};
    const vLogs = Object.values(data.v2_visitor_logs || {}).reverse();

    window.renderDashboard = (viewType = 'main', title = '', stats = {}) => {
        const container = document.getElementById('panel-content');
        if (viewType === 'main') {
            container.innerHTML = `
                <div class="stats-grid">
                    <div class="card" onclick="renderDashboard('detail', 'Admin Access', ${JSON.stringify(aStats).replace(/"/g, "'")})">
                        <small>ADMIN ACCESS</small>
                        <div class="value">${Object.values(aStats.years || {}).reduce((a,b)=>a+b, 0)}</div>
                    </div>
                    <div class="card" onclick="renderDashboard('detail', 'Visitors', ${JSON.stringify(vStats).replace(/"/g, "'")})">
                        <small>TOTAL VISITORS</small>
                        <div class="value">${Object.values(vStats.years || {}).reduce((a,b)=>a+b, 0)}</div>
                    </div>
                </div>
                <div style="margin-top:20px; background:#1c2128; padding:15px; border-radius:12px; border:1px solid #30363d;">
                    <h3>Recent Activity</h3>
                    <div class="log-box">
                        ${vLogs.map(l => `
                            <div class="stat-row">
                                <span><b>${l.name || 'Visitor'}</b> (${l.location})</span> 
                                <span style="white-space:nowrap; margin-left:10px;">${l.date} | ${l.time}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <button class="back-btn" onclick="renderDashboard()">← Back to Overview</button>
                <div class="detail-card">
                    <h3>${title} Stats</h3>
                    <div class="stat-row"><span>Yearly Total</span> <b>${stats.years ? Object.values(stats.years)[0] : 0}</b></div>
                    <div class="stat-row"><span>Monthly Total</span> <b>${stats.months ? Object.values(stats.months)[0] : 0}</b></div>
                </div>
            `;
        }
    };

    const overlay = document.createElement('div');
    overlay.id = "system-admin-panel";
    overlay.innerHTML = `
        <style>
            @keyframes ghost-lightning { 
                0%, 95% { background: rgba(10, 15, 20, 0.95); box-shadow: inset 0 0 100px #000; }
                96% { background: #fff; box-shadow: inset 0 0 100px #fff; }
                97% { background: rgba(10, 15, 20, 0.95); }
                98% { background: #fff; box-shadow: inset 0 0 100px #fff; }
                100% { background: rgba(10, 15, 20, 0.95); }
            }
            #system-admin-panel { position:fixed; top:0; left:0; width:100%; height:100%; z-index:99999; animation: ghost-lightning 5s infinite; font-family: 'Segoe UI', sans-serif; padding:40px; box-sizing:border-box; color:#e6edf3; }
            .stats-grid { display:grid; grid-template-columns: 1fr 1fr; gap:20px; }
            .card { background:#1c2128; padding:25px; border-radius:12px; border:1px solid #30363d; cursor:pointer; text-align:center; transition:0.3s; }
            .card:hover { background:#222a33; border-color:#58a6ff; transform:translateY(-5px); }
            .value { font-size: 2em; font-weight: bold; margin-top: 10px; color: #58a6ff; }
            .back-btn { background:transparent; border:1px solid #30363d; color:#8b949e; padding:8px 15px; border-radius:6px; cursor:pointer; margin-bottom:15px; }
            
            /* SCROLLBAR & OVERLAP FIX */
            .log-box { 
                height:200px; 
                overflow-y:auto; 
                padding-right: 20px;
                scrollbar-width: thin;
            }
            .stat-row { 
                display:flex; 
                justify-content:space-between; 
                padding:12px 0; 
                border-bottom:1px solid #30363d; 
            }
        </style>
        <div style="max-width:700px; margin:auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                <h2 style="margin:0;">⚡ Analytics Control</h2>
                <button onclick="document.getElementById('system-admin-panel').remove()" style="background:#da3633; border:none; color:white; padding:8px 15px; border-radius:6px; cursor:pointer;">Close</button>
            </div>
            <div id="panel-content"></div>
        </div>
    `;
    document.body.appendChild(overlay);
    window.renderDashboard();
}

// System Execution
trackAndLog();
if (new URLSearchParams(window.location.search).get('show') === 'admin') {
    showProfessionalPanel();
}