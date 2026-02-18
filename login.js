const supabase = window.supabase.createClient(
"YOUR_SUPABASE_URL",
"YOUR_ANON_KEY"
);

document.getElementById("loginBtn")
.addEventListener("click", async ()=>{

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const { data, error } = await supabase.auth.signInWithPassword({
email: email,
password: password
});

if(error){
alert(error.message);
}else{
window.location.href="dashboard.html";
}

});
