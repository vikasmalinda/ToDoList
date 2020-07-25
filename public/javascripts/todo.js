$(document).ready(function () {
	console.log("start");
	ShowItem("All");
	console.log("end");
});


function Add(){
	var val = document.getElementById("val-id").value;
	if(val=="") window.alert("Fill some value int the input :)");
	document.getElementById("val-id").value = "";
	AddElementBackend(val,"Pending");
}

// $('#list').on('click', '.cross', function() {
//   markDeleted($(this).parent().parent().attr("id"));
//   $(this).parent().parent().remove();
// });

function ShowItem(category) {
	$("#menu li").removeClass("active");
	$("#list").hide();
	$("#hide").hide();
	$("#ld").show();
	if(category == "All") {
		getAllItems();
	}
	else{
		getCategoryItem(category);
	}
}


function ShowAllItem(items) {
	$("#menu-all").addClass("active");
	document.getElementById("hide").style.display="block";
	var l = items.length;
	var mylist = document.getElementById("list");
	mylist.innerHTML = "";
	for(var i=0;i<l;i++) {
		var item = items[i];
		if(item.status!="Deleted")
		addItem(item,"All");
	}
	$("#list").show();
	$("#ld").hide();
	$("#hide").show();
}

function ShowCategoryItem(category,items){
	if(category == "Pending") {
		$("#menu-pending").addClass("active");
		ShowPendingItem(items);
	}
	else if(category == "Done") {
		$("#menu-done").addClass("active");
		ShowDoneItem(items);
	}
	else if(category == "Deleted") {
		$("#menu-delete").addClass("active");
		ShowDeletedItem(items);
	}

	$("#list").show();
	$("#ld").hide();
}

function ShowPendingItem(items) {
	document.getElementById("hide").style.display="none";
	var l = items.length;
	var mylist = document.getElementById("list");
	mylist.innerHTML = "";
	for(var i=0;i<l;i++) {
		var item = items[i];
		if(item.status=="Pending")
		addItem(item,item.status);
	}	
}

function ShowDoneItem(items) {
	document.getElementById("hide").style.display="none";
	var mylist = document.getElementById("list");
	mylist.innerHTML = "";
	var l = items.length;
	for(var i=0;i<l;i++) {
		var item = items[i];
		if(item.status=="Done")
		addItem(item,item.status);
	}	
}

function ShowDeletedItem(items) {
	document.getElementById("hide").style.display="none";
	var mylist = document.getElementById("list");
	mylist.innerHTML = "";
	var l = items.length;
	for(var i=0;i<l;i++) {
		var item = items[i];
		if(item.status=="Deleted")
		addItem(item,item.status);
	}	
}

// function checkedfun(id){

// }

function addItem(item, category) {
	if(!item) {
		return;
	}
	var cat = category;
	var mylist = document.getElementById("list");
	var listItems = mylist.innerHTML;
	var val = item.description;
	if(item.status == "Done" && category=="All") {
		listItems += `
			<li id=`+item.id+`><span id="text-id"  class="checked" onclick="changeStatus(parentElement.id,'`+category+`','Pending')">
			`+item.description+`</span><i class="fas fa-user-edit c1" onclick="editItem(parentElement.id,'`+val+`')"></i>&nbsp;&nbsp;<i class="fas fa-trash c2" onclick="changeStatus(this.parentElement.id,'`+cat+`','Deleted')"></i></li>
		`;
	}
	else if(item.status == "Pending" && category=="All") {
		listItems += `
			<li id=`+item.id+`><span id="text-id" onclick="changeStatus(parentElement.id,'`+category+`','Done')">
			`+item.description+`</span><i class="fas fa-user-edit c1" onclick="editItem(parentElement.id,'`+val+`')"></i>&nbsp;&nbsp;<i class="fas fa-trash c2" onclick="changeStatus(this.parentElement.id,'`+cat+`','Deleted')"></i></li>
		`;
	}
	if(item.status == "Done" && category=="Done") {
		listItems += `
			<li id=`+item.id+`><span id="text-id">`+item.description+`</span><i class="fas fa-trash cross" onclick="changeStatus(this.parentElement.id,'`+cat+`','Deleted')"></i></li>
		`;
	}
	else if(item.status == "Pending" && category=="Pending") {
		listItems += `
			<li id=`+item.id+`><span id="text-id">`+item.description+`</span><i class="fas fa-trash cross" onclick="changeStatus(this.parentElement.id,'`+cat+`','Deleted')"></i></li>
		`;
	}
	else if(item.status == "Deleted" && category == "Deleted") {
		listItems += `
			<li id=`+item.id+`>`+item.description+`</li>
		`;
	}

	mylist.innerHTML = listItems;
}

var flag=true;

function editItem(id,val){
	if(flag==false) return;
	flag=false;
	document.getElementById(id).innerHTML = "";
	var editHtml = `<div class="input-group mb-3">
	<input type="text" value="`+val+`" id="inp" size="50" >
	<i id="check" class="fas fa-check c1" style="font-size:20px; margin-left:20px;"></i><i class="fas fa-times c2" style="font-size:20px; margin-left:20px;" onclick="getAllItems()"></i></div>`;
	document.getElementById(id).innerHTML = editHtml;
	$("#check").on("click", function() {
	  	var val = document.getElementById("inp").value;
	  	if(val=="") window.alert("Fill some value int the input :)");
	  	EditYes(id,val,"Pending");
	});
}



function EditYes(id,description,status){
	console.log(description);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({"id":id,"description":description,"status":status}),
		url: "http://localhost:3000/users/EditYes",
		success: function(response) {
			if(response.status == "success") {
				console.log("Editdone");
				changeStatus(id,"All","Pending");
			}
			else {
				console.log(response);
			}
		},
		error: function(xhr, status, err) {
			console.log(err.toString());
		}
	});
}

function getAllItems() {
	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({}),
		url: "http://localhost:3000/users/getItems",
		success: function(response) {
			if(response.status == "success") {
				console.log("getAllitems");
				ShowAllItem(response.items);
			}
			else {
				console.log(response);
			}
		},
		error: function(xhr, status, err) {
			console.log(err.toString());
		}
	});
}


function getCategoryItem(category) {
	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({"status":category}),
		url: "http://localhost:3000/users/getCategoryItems",
		success: function(response) {
			if(response.status == "success") {
				console.log("category item");
				ShowCategoryItem(category,response.items);
			}
			else {
				console.log(response);
			}
		},
		error: function(xhr, status, err) {
			console.log(err.toString());
		}
	});
}


function changeStatus(myid,mycategory,mystatus) {
	console.log(myid);
	//Changing status of an item via an API call
	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({"id": myid, "status": mystatus}),
		url: "http://localhost:3000/users/changeStatus",
		success: function(response) {
			if(response.status == "success") {
				console.log("changed");
				if(mycategory=="All") getAllItems();

				else getCategoryItem(mycategory);
				flag=true;
			}
			else {
				console.log(response);
			}
		},
		error: function(xhr, status, err) {
			console.log(err.toString());
		}
	});
}


// function getStatus() {
// 	$.ajax({
// 		type: "POST",
// 		contentType: "application/json",
// 		data: JSON.stringify({}),
// 		url: "http://localhost:3000/users/getStatus",
// 		success: function(response) {
// 			if(response.status == "success") {
// 				console.log("getStatus");
// 				changeStatus(response.status);
// 			}
// 			else {
// 				console.log(response);
// 			}
// 		},
// 		error: function(xhr, status, err) {
// 			console.log(err.toString());
// 		}
// 	});
// }

function AddElementBackend(description,status) {
	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({"description":description,"status":status}),
		url: "http://localhost:3000/users/AddElementBackend",
		success: function(response) {
			if(response.status == "success") {
				console.log("New Element Added");
				getAllItems();
			}
			else {
				console.log(response);
			}
		},
		error: function(xhr, status, err) {
			console.log(err.toString());
		}
	});
}
