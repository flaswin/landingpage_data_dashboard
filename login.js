const supabase = window.supabase.createClient(
"https://mficuhiqstpdwdwaayzg.supabase.co",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1maWN1aGlxc3RwZHdkd2FheXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzkwNzQsImV4cCI6MjA4NjQxNTA3NH0.WZE3Hd7XQquXuF_WaPtTLz1KFsXpfaCq-eZypbbn6pU"
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
