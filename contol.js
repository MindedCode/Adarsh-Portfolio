// control.js - Professional Admin Dashboard & Tracking (v2)
const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// ट्रैकिंग लॉजिक (अब यहीं से चलेगा)
async function trackEverything() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const isAdminEntry = urlParams.get('show') === 'admin';
        const now = new Date();
        const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
        const yK = `${now.getFullYear()}`;

        const geoRes = await fetch('https://ip-api.com/json/');
        const geoData = await geoRes.json();
        const locName = geoData.city ? `${geoData.city}, ${geoData.regionName}` : "Unknown";

        const commonData = { location: locName, time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), date: now.toLocaleDateString() };

        const updateCount = async (basePath) => {
            const keys = [`years/${yK}`, `months/${mK}`, `days/${dK}`];
            for (let k of keys) {
                const r = await fetch(`${dbURL}/${basePath}/${k}.json`);
                const c = (await r.json()) || 0;
                await fetch(`${dbURL}/${basePath}/${k}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
            }
        };

        if (isAdminEntry) {
            localStorage.setItem('is_admin_access', 'true');
            await updateCount('v2_admin_stats');
            await fetch(`${dbURL}/v2_admin_logs.json`, { method: 'POST', body: JSON.stringify(commonData) });
            return;
        }

        if (localStorage.getItem('is_admin_access') === 'true') return;

        await updateCount('v2_visitor_stats');
        await fetch(`${dbURL}/v2_visitor_logs.json`, { method: 'POST', body: JSON.stringify(commonData) });

    } catch (e) { console.log("System Status: Operational"); }
}

// डैशबोर्ड UI लॉजिक
async function showProfessionalPanel() {
    const res = await fetch(`${dbURL}/.json`);
    const data = (await res.json()) || {};
    const vStats = data.v2_visitor_stats || {};
    const aStats = data.v2_admin_stats || {};
    const now = new Date();
    const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
    const yK = `${now.getFullYear()}`;

    const overlay = document.createElement('div');
    overlay.id = "system-admin-panel";
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:#0d1117; color:#c9d1d9; z-index:2147483647; font-family:sans-serif; overflow-y:auto; padding:20px; box-sizing:border-box;";
    
    overlay.innerHTML = `
        <style>
            #system-admin-panel .panel { background:#161b22; border:1px solid #30363d; border-radius:10px; padding:20px; margin-bottom:20px; }
            #system-admin-panel .grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-bottom:15px; }
            #system-admin-panel .box { background:#0d1117; padding:10px; border-radius:6px; text-align:center; border:1px solid #21262d; }
            #system-admin-panel .log { height:250px; overflow-y:auto; font-size:12px; }
            #system-admin-panel .entry { border-bottom:1px solid #21262d; padding:8px 0; display:flex; justify-content:space-between; }
            #system-admin-panel .btn-grp { display:flex; gap:10px; justify-content:center; margin-bottom:20px; }
            #system-admin-panel button { width:150px; padding:10px; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:white; }
        </style>
        <div style="max-width:900px; margin:auto;">
            <h2 style="text-align:center; color:#58a6ff; margin-bottom:20px;">System Admin Dashboard1</h2>
            <div class="btn-grp">
                <button style="background:#238636;" onclick="location.reload()">REFRESH</button>
                <button style="background:#da3633;" onclick="document.getElementById('system-admin-panel').remove()">CLOSE</button>
            </div>
            
            <div class="panel">
                <h3 style="color:#f85149; margin-top:0;">Admin Access (v2)</h3>
                <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="box"><small>Today</small><br><b>${aStats.days?.[dK] || 0}</b></div>
                    <div class="box"><small>Year</small><br><b>${aStats.years?.[yK] || 0}</b></div>
                </div>
                <div class="log">${Object.values(data.v2_admin_logs || {}).reverse().map(l => `
                    <div class="entry"><span>${l.location}</span><span>${l.date} | ${l.time}</span></div>
                `).join('')}</div>
            </div>

            <div class="panel">
                <h3 style="color:#3fb950; margin-top:0;">Visitor Insights (v2)</h3>
                <div class="grid">
                    <div class="box"><small>Today</small><br><b>${vStats.days?.[dK] || 0}</b></div>
                    <div class="box"><small>Month</small><br><b>${vStats.months?.[mK] || 0}</b></div>
                    <div class="box"><small>Year</small><br><b>${vStats.years?.[yK] || 0}</b></div>
                </div>
                <div class="log">${Object.values(data.v2_visitor_logs || {}).reverse().map(l => `
                    <div class="entry"><span>${l.location}</span><span>${l.date} | ${l.time}</span></div>
                `).join('')}</div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

const params = new URLSearchParams(window.location.search);
if (params.get('show') === 'admin') showProfessionalPanel();
trackEverything();