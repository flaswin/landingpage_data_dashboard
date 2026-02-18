const supabase = window.supabaseClient;

document.getElementById("loginBtn")
.addEventListener("click", async ()=>{

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const { error } = await supabase.auth.signInWithPassword({
email: email,
password: password
});

if(error){
alert(error.message);
}else{
window.location.href="dashboard.html";
}

});
