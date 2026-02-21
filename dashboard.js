document.addEventListener("DOMContentLoaded", async ()=>{

const db = window.db;

// restore session
let saved=JSON.parse(localStorage.getItem("sb"));

if(!saved){
window.location.href="index.html";
return;
}

await db.auth.setSession(saved);

loadLeads();

// logout
logoutBtn.onclick = async ()=>{
localStorage.removeItem("sb");
await db.auth.signOut();
window.location.href="index.html";
}

});
