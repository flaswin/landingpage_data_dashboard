document.addEventListener("DOMContentLoaded", async ()=>{

const db=window.db;
let page=1;
const perPage=10;
let filtered=[];

// restore session
let saved=JSON.parse(localStorage.getItem("sb"));
if(!saved){
window.location.href="index.html";
return;
}
await db.auth.setSession(saved);

// logout
logoutBtn.onclick=async()=>{
localStorage.removeItem("sb");
await db.auth.signOut();
window.location.href="index.html";
}

// show custom picker
dateFilter.onchange=()=>{
if(dateFilter.value==="custom"){
fromDate.style.display="inline";
toDate.style.display="inline";
}else{
fromDate.style.display="none";
toDate.style.display="none";
}
}

// IST RANGE
function ISTDayRange(date){

let start=new Date(date);
start.setHours(0,0,0,0);

let end=new Date(date);
end.setHours(23,59,59,999);

let startUTC=new Date(start.getTime()-330*60000);
let endUTC=new Date(end.getTime()-330*60000);

return{
start:startUTC.toISOString(),
end:endUTC.toISOString()
};
}

// GROUP
function groupByDate(data){

let groups={};

data.forEach(l=>{

let ist=new Date(
new Date(l.created_at)
.getTime()+330*60000
);

let key=ist.toDateString();

if(!groups[key])groups[key]=[];
groups[key].push(l);

});

return groups;
}

// RENDER
function render(groups){

tableBody.innerHTML="";

Object.keys(groups).forEach(date=>{

let header=document.createElement("tr");
header.className="dateHeader";
header.innerHTML=`<td colspan="6">${date}</td>`;
tableBody.appendChild(header);

groups[date].forEach(r=>{

let ist=new Date(
new Date(r.created_at)
.getTime()+330*60000
);

let row=document.createElement("tr");

row.innerHTML=`
<td>${r.fullname}</td>
<td>${r.mobile}</td>
<td>${r.semester}</td>
<td>${r.department}</td>
<td>${r.college}</td>
<td>${ist.toLocaleTimeString()}</td>
`;

tableBody.appendChild(row);

});

});

}

// FILTER
async function apply(){

let query=db
.from("leads")
.select("*")
.order("created_at",{ascending:false});

if(searchInput.value){
query=query.ilike("fullname",
`%${searchInput.value}%`);
}

// TODAY AUTO
if(dateFilter.value==="today"){
let r=ISTDayRange(new Date());
query=query.gte("created_at",r.start)
.lte("created_at",r.end);
}

// YESTERDAY
if(dateFilter.value==="yesterday"){
let y=new Date();
y.setDate(y.getDate()-1);
let r=ISTDayRange(y);
query=query.gte("created_at",r.start)
.lte("created_at",r.end);
}

// LAST 7
if(dateFilter.value==="last7"){
let t=new Date();
let l7=new Date();
l7.setDate(t.getDate()-6);
let s=ISTDayRange(l7).start;
let e=ISTDayRange(t).end;
query=query.gte("created_at",s)
.lte("created_at",e);
}

// CUSTOM
if(dateFilter.value==="custom" &&
fromDate.value && toDate.value){

let s=ISTDayRange(fromDate.value).start;
let e=ISTDayRange(toDate.value).end;
query=query.gte("created_at",s)
.lte("created_at",e);
}

// DEPT
if(deptFilter.value){
query=query.eq("department",
deptFilter.value);
}

const {data}=await query;

filtered=data;
render(groupByDate(filtered));

}

// AUTO LOAD TODAY
apply();

// MANUAL
applyFilter.onclick=apply;

// EXPORT
exportBtn.onclick=()=>{

let ws=XLSX.utils.json_to_sheet(filtered);
let wb=XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb,ws,"Leads");

let fileName=getExportFileName();

XLSX.writeFile(wb,fileName);

}


});

function getExportFileName(){

let today=new Date().toISOString().split("T")[0];

if(dateFilter.value==="today")
return `leads_today_${today}.xlsx`;

if(dateFilter.value==="yesterday"){

let y=new Date();
y.setDate(y.getDate()-1);
let d=y.toISOString().split("T")[0];

return `leads_yesterday_${d}.xlsx`;
}

if(dateFilter.value==="last7"){

let t=new Date();
let l7=new Date();
l7.setDate(t.getDate()-6);

let from=l7.toISOString().split("T")[0];
let to=t.toISOString().split("T")[0];

return `leads_last7_${from}_to_${to}.xlsx`;
}

if(dateFilter.value==="custom" &&
fromDate.value && toDate.value){

return `leads_${fromDate.value}_to_${toDate.value}.xlsx`;
}

return `leads_all_${today}.xlsx`;

}
