document.addEventListener("DOMContentLoaded",()=>{

const db=window.db;

loginBtn.onclick=async()=>{

const {data,error}=await db.auth.signInWithPassword({
email:email.value,
password:password.value
});

if(error){
alert(error.message);
return;
}

localStorage.setItem("sb",
JSON.stringify(data.session));

window.location.href="app.html";

};

});
