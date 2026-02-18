const supabase = window.supabase.createClient(
"YOUR_SUPABASE_URL",
"YOUR_ANON_KEY"
);

async function login(){

const { error } = await supabase.auth.signInWithPassword({
email: document.getElementById("email").value,
password: document.getElementById("password").value
});

if(error){
alert(error.message);
}else{
window.location.href="dashboard.html";
}

}
