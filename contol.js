const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

async function getLoc() {
    try {
        const res = await fetch('https://ip-api.com/json/');
        const data = await res.json();
        return data.city ? `${data.city}, ${data.regionName}` : "Location Hidden";
    } catch { return "Offline Mode"; }
}

async function trackEverything() {
    const loc = await getLoc();
    const now = new Date();
    const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
    const yK = `${now.getFullYear()}`;
    const data = { location: loc, time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), date: now.toLocaleDateString() };

    const update = async (path) => {
        const keys = [`years/${yK}`, `months/${mK}`, `days/${dK}`];
        for (let k of keys) {
            const r = await fetch(`${dbURL}/${path}/${k}.json`);
            const c = (await r.json()) || 0;
            await fetch(`${dbURL}/${path}/${k}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
        }
    };

    if (new URLSearchParams(window.location.search).get('show') === 'admin') {
        await update('v2_admin_stats');
        await fetch(`${dbURL}/v2_admin_logs.json`, { method: 'POST', body: JSON.stringify(data) });
    } else {
        await update('v2_visitor_stats');
        await fetch(`${dbURL}/v2_visitor_logs.json`, { method: 'POST', body: JSON.stringify(data) });
    }
}

async function showDashboard() {
    const res = await fetch(`${dbURL}/.json`);
    const data = (await res.json()) || {};
    const v = data.v2_visitor_stats || {};
    const a = data.v2_admin_stats || {};
    const dK = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
    
    const div = document.createElement('div');
    div.id = "admin-panel";
    div.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#0d1117;color:#fff;z-index:9999;padding:20px;overflow:auto;";
    div.innerHTML = `
        <div style="max-width:800px; margin:auto;">
            <h2>System Admin Dashboard2</h2>
            <button onclick="location.reload()">REFRESH</button> <button onclick="this.parentElement.parentElement.remove()">CLOSE</button>
            <div style="margin-top:20px;">
                <h3>Admin (v2)</h3>
                <p>Today: ${a.days?.[dK] || 0}</p>
                <h3>Visitor (v2)</h3>
                <p>Today: ${v.days?.[dK] || 0}</p>
            </div>
        </div>`;
    document.body.appendChild(div);
}

if (new URLSearchParams(window.location.search).get('show') === 'admin') showDashboard();
trackEverything();