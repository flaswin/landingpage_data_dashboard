const supabase = window.supabase.createClient(
"YOUR_SUPABASE_URL",
"YOUR_ANON_KEY"
);

let leadsData=[];

async function login(){

const {error} = await supabase.auth.signInWithPassword({
email: document.getElementById("email").value,
password: document.getElementById("password").value
});

if(error){
alert(error.message);
}else{
loadLeads();
}

}

async function loadLeads(){

const {data,error}=await supabase
.from("leads")
.select("*")
.order("created_at",{ascending:false});

leadsData=data;

const tbody=document.getElementById("tableBody");

tbody.innerHTML="";

data.forEach(row=>{

tbody.innerHTML+=`
<tr>
<td>${row.fullname}</td>
<td>${row.mobile}</td>
<td>${row.semester}</td>
<td>${row.department}</td>
<td>${row.college}</td>
<td>${row.created_at}</td>
</tr>
`;

});

}

function download(){

let csv="fullname,mobile,semester,department,college,created_at\n";

leadsData.forEach(r=>{
csv+=`${r.fullname},${r.mobile},${r.semester},${r.department},${r.college},${r.created_at}\n`;
});

const blob=new Blob([csv],{type:"text/csv"});
const url=URL.createObjectURL(blob);

const a=document.createElement("a");
a.href=url;
a.download="leads.csv";
a.click();

}
