var dougADDR = key.addressOf("6207fbebac090bab3c91d4de0f4264b3338982b9");

var dougTEST = eth.storageAt(dougADDR, bytes.u256of(bytes.fromString("doug",32)));

var dougTEST = eth.storageAt(dougADDR, bytes.u256of(bytes.fromString("doug",32)));
var dtt = u256.toValue(dougTEST);
var dat = u256.toValue(u256.fromAddress(dougADDR));

while (dtt != dat){
	dougADDR = u256.toAddress(dougTEST)
	dougTEST = eth.storageAt(dougADDR, bytes.u256of(bytes.fromString("doug",32)));
	dtt = u256.toValue(dougTEST);
	dat = u256.toValue(u256.fromAddress(dougADDR));
};

var dbADDR = u256.toAddress(eth.storageAt(dougADDR, bytes.u256of(bytes.fromString("magdb",32))));
var adminADDR = u256.toAddress(eth.storageAt(dougADDR, bytes.u256of(bytes.fromString("user",32))));

var nickADDR = key.addressOf("d1e41bc09b8e23c6c857fefc0a87b3e202afb6fc");
 
var infohashes = new Array();

window.onload = function(){   
	
	var myaddr = u256.fromAddress(key.address(eth.key()));
	var memStatus = eth.storageAt(adminADDR,myaddr);
	if(!u256.isNull(memStatus)){
		var adminVal = u256.toValue(memStatus);
		if((adminVal & 2) == 2){
			document.getElementById("adminLinks").style.display = "inline";
		} else {
			document.getElementById("adminLinks").style.display = "none";		
		}
	} else {
		document.getElementById("adminLinks").style.display = "none";
	}
}

switchPage = function(callerID){

   if(callerID == "0"){
		document.getElementById("containerDatabase").style.display = "block";
		document.getElementById("containerConsensus").style.display = "none";
		document.getElementById("containerAbout").style.display = "none";
		document.getElementById("containerAdmin").style.display = "none";
	} else if(callerID == "1"){	
		document.getElementById("containerDatabase").style.display = "none";
		document.getElementById("containerConsensus").style.display = "block";
		document.getElementById("containerAbout").style.display = "none";
		document.getElementById("containerAdmin").style.display = "none";
	} else if(callerID == "2"){
		document.getElementById("containerDatabase").style.display = "none";
		document.getElementById("containerConsensus").style.display = "none";
		document.getElementById("containerAbout").style.display = "block";
		document.getElementById("containerAdmin").style.display = "none";
	} else if(callerID == "3"){
		document.getElementById("containerDatabase").style.display = "none";
		document.getElementById("containerConsensus").style.display = "none";
		document.getElementById("containerAbout").style.display = "none";
		document.getElementById("containerAdmin").style.display = "block";
	}

}

generateTable = function(){

	var pointer1 = u256.value(32);
	var pointer2 = u256.value(37);
	var pointer3 = u256.value(38);
	
	var limit = u256.toValue(eth.storageAt(dbADDR, u256.value(21)));
	var titles = new Array();
	infohashes = new Array();
	
	for (var i = 0; i < limit; i++) {
		
		var tstr = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer2)));
		tstr = tstr + bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer3)));
		titles[i] = tstr;
		infohashes[i] = eth.storageAt(dbADDR, pointer1);
		
		pointer1 = u256.add(pointer1, u256.value(32));
		pointer2 = u256.add(pointer2, u256.value(32));
		pointer3 = u256.add(pointer3, u256.value(32)); 
		
	};
	
	var table= "<table>";
	
	for (var j = 0; j < titles.length; j++) {
			table+='<tr><td><a href="javascript:void(0)" onclick="resolveMagnetLink(' + '&quot;' + j + '&quot;' + ');">' + 
			(j+1) + ':  ' + titles[j] + '</a></td></tr>';
	}
	
	table+="</table>";
	document.getElementById('datatable').innerHTML = table;

}

resolveMagnetLink = function(hashIndex)
{
	var index = parseInt(hashIndex);
	var infohs = infohashes[index];
	
	var pointer = u256.add(infohs, eth.storageAt(dbADDR, u256.value(20)));
	pointer = eth.storageAt(dbADDR, pointer);
	
	pointer = u256.add(pointer, u256.value(2));
	
	var uploader = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer)));
	pointer = u256.add(pointer, u256.value(1));
	
	var filetype = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer)));
	pointer = u256.add(pointer, u256.value(1));
	
	var filequality = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer)));
	pointer = u256.add(pointer, u256.value(1));
	
	var title1 = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer)));
	pointer = u256.add(pointer, u256.value(1));
	var title2 = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer)));
	var title = title1 + title2;
	
	var desc = "";
	for (var i = 0; i < 25; i++) {
		pointer = u256.add(pointer, u256.value(1));
		var temp = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer)));
		desc = desc + temp;
	}
	
	document.getElementById('infohashInputField').value = (u256.toValue(infohs)).toString(16);
	document.getElementById('uploaderInputField').value = uploader;
	document.getElementById('filetypeInputField').value = filetype;
	document.getElementById('filequalityInputField').value = filequality;
	document.getElementById('titleInputField').value = title;
	document.getElementById('descriptionTextArea').value = desc;
	
}

updateDocument = function()
{
	var infohash = u256.bytesOf(u256.value(parseInt(document.getElementById("infohashInputField").value, 16)));
	var title = bytes.fromString(document.getElementById("titleInputField").value, 64);
	var uploader = bytes.fromString(document.getElementById("uploaderInputField").value, 32);
	var filetype = bytes.fromString(document.getElementById("filetypeInputField").value, 32);
	var filequality = bytes.fromString(document.getElementById("filequalityInputField").value, 32);
	var descript = bytes.fromString(document.getElementById("descriptionTextArea").value, 800);
	
	var indicator = u256.bytesOf(u256.value(parseInt("111111", 16)));
	var command = bytes.fromString("moddbe",32);
	
	var payload = command;
	payload = bytes.concat(payload, infohash);
	payload = bytes.concat(payload, indicator);
	payload = bytes.concat(payload, uploader);
	payload = bytes.concat(payload, filetype);
	payload = bytes.concat(payload, filequality);
	payload = bytes.concat(payload, title);
	payload = bytes.concat(payload, descript);
	
	eth.transact(key.secret(eth.keys()[0]), u256.ether(0), dbADDR, payload, u256.value(100000), eth.gasPrice());

};

deleteDocument = function()
{
	var infohash = u256.bytesOf(u256.value(parseInt(document.getElementById("infohashInputField").value, 16)));
	var command = bytes.fromString("deldbe",32);

	var payload = bytes.concat(command,infohash);

	eth.transact(key.secret(eth.keys()[0]), u256.ether(0), dbADDR, payload, u256.value(100000), eth.gasPrice());	
	clearDocument();
};

clearDocument = function()
{
	document.getElementById('infohashInputField').value = "";
	document.getElementById('uploaderInputField').value = "";
	document.getElementById('filetypeInputField').value = "";
	document.getElementById('filequalityInputField').value = "";
	document.getElementById('titleInputField').value = "";
	document.getElementById('descriptionTextArea').value = "";
};

addUser = function(){
	
	var userString = document.getElementById("userAddressInputField").value;

	if(userString == null || userString == ""){
		window.alert("No user name has been specified.");
		return;	
	}
	
	var userBytes = u256.bytesOf(u256.fromAddress(key.addressOf(userString)));

	var command = null;
	var payload = null;

	if(document.getElementById('userRadio').checked) {
		
		command = bytes.fromString("regmem",32);
		payload = bytes.concat(command,userBytes);
		
	} else {
		command = bytes.fromString("regadm",32);
		payload = bytes.concat(command,userBytes);
		
		var levelBytes = null;
		var userLevelString =  document.getElementById("userLevelInputField").value;
		
		if(userLevelString != null && userLevelString != ""){
			levelBytes = u256.bytesOf(u256.value(parseInt(userLevelString, 10)));
			payload = bytes.concat(payload,levelBytes);
		}
		
	}

	eth.transact(key.secret(eth.key()), u256.ether(0), adminADDR, payload, u256.value(100000), eth.gasPrice());	
	
}

removeUser = function(){
	var userString = document.getElementById("userAddressInputField").value;

	if(userString == null || userString == ""){
		window.alert("No user name has been specified.");
		return;
	}
	
	var sure = confirm("Are you sure you want to delete member: " + userString + "?");	
	if(!sure){
		window.alert("User was not removed");
		return;	
	}
	var userBytes = u256.bytesOf(u256.fromAddress(key.addressOf(userString)));
		
	var command = bytes.fromString("delmem",32);
	var payload = bytes.concat(command,userBytes);

	eth.transact(key.secret(eth.key()), u256.ether(0), adminADDR, payload, u256.value(100000), eth.gasPrice());	
	
}

updateUser = function(){
	
}

generateUserTable = function(){
	
	var pointer = u256.value(18); // Tail
	// Size of the linked list.
	var size = u256.toValue(eth.storageAt(nickADDR, u256.value(17)));
	var nicks = new Array();
	var addrii = new Array(); // Deal with it
	var userTypes = new Array();
	
	// We need to jump past the tail, as it is only the contract nick.	
	// pointer = eth.storageAt(nickADDR, pointer);
	// pointer = u256.add(pointer, u256.value(2));
	
	// We're essentially reading the list from element 1 and onwards (not from element 0).
	for (var i = 0; i < size; i++) {
		pointer = eth.storageAt(nickADDR, pointer);
		var nick = bytes.toString(u256.bytesOf(pointer));
		nicks[i] = nick;
		// Get the address of the user.
		addrii[i] = eth.storageAt(nickADDR,pointer);
		pointer = u256.add(pointer, u256.value(2));
	};
	
	for (var i = 0; i < nicks.length; i++) {
		var userLevel256 = eth.storageAt(adminADDR, addrii[i])
		if(!u256.isNull(userLevel256)){
			userTypes[i] = u256.toValue(userLevel256);
			document.getElementById('userAddressInputField').value = userTypes[i].toString();			
		} else {
			userTypes[i] = 0;
		}
	};
	
	var table= "<table><tr><td>Nickname</td><td>Type</td></tr>";
	
	for (var j = 0; j < nicks.length; j++) {
		var userTypeStr = null;
		switch(userTypes[j])
		{
			case 0:
		  		userTypeStr = "Squatter";
		  		break;
			case 1:
		  		userTypeStr = "Member";
				break;
			case 3:
		  		userTypeStr = "Admin";
		  		break;
			default:
			  userTypeStr = "Um...";
		}
		table+='<tr><td><a href="javascript:void(0)" onclick="resolveMagnetLink(' + '&quot;' + 
		addrii[j] + ':' + userTypes[j].toString() + '&quot;' + ');">' + j.toString() + ':  ' + nicks[j] + 
		'</a></td><td>' + userTypeStr + '</td></tr>';
	}
	
	table+="</table>";
	document.getElementById('userTable').innerHTML = table;
	
	/*
	// This is the address where the the admin list starts
	var startAddr = eth.storageAt(adminADDR,u256.value(19));
	var startPos = parseInt(u256.toValue(startAddr));
	
	// This is the address where the list of super admins ends
	var superAdminNumber = u256.toValue(eth.storageAt(adminADDR,u256.value(18)));
	superAdminNumber = parseInt(superAdminNumber);
	// We subtract the address where the admin list start to see how many super admins there are
	superAdminNumber -= startPos; 
	
	// This is the address where the next admin will be added 
	var lastAdmin = eth.storageAt(adminADDR, u256.value(17));
	
	// This is the total number of admins
	var numAdmins = u256.toValue(lastAdmin) - startPos;
	
	var names = new Array();
   
	for (var i = 0; i < numAdmins; i++) {
		var userAddr256 = eth.storageAt(adminADDR, startAddr);
		var userName = (u256.toValue(userAddr256)).toString(16);
		names[i] = userName;
		startAddr = u256.add(startAddr, u256.value(1) );
	}
	
	var table= "<table><tr><td>User</td><td>Status</td></tr>";
	
	for (var j = 0; j < names.length; j++) {
		var adminType = (j < superAdminNumber) ? "Super" : "Admin";
		var adminOrd = (j < superAdminNumber) ? j.toString() : "n"; 
		table+='<tr><td><a href="javascript:void(0)" onclick="resolveUserLink(' + '&quot;' + names[j] + ":" + adminOrd + '&quot;' + ');">' + 
		names[j].substring(0,10) + "..." + '</a></td><td>' + adminType + '</td></tr>';
	}
	table+="</table>";
	
	document.getElementById('userTable').innerHTML = table;
	*/
}

resolveUserLink = function(userName)
{
	var tokens = userName.split(':');
	document.getElementById('userAddressInputField').value = tokens[0];
	var level = null;
	document.getElementById('userLevelInputField').value = tokens[1];	
	if(tokens[1] == "2"){
		document.getElementById('adminRadio').checked = true;		
	} else {
		document.getElementById('userRadio').checked = true;	
	}
}

registerNickname = function(){
	var nameString = document.getElementById("userNicknameInputField").value;
	if(nameString == null || nameString == ""){
		window.alert("There is no name in the nickname field.");
		return;	
	}
	var nameBytes = u256.bytesOf(u256.value(parseInt(nameString, 16)));
	var command = bytes.fromString("reg",32);

	var payload = bytes.concat(command,nameBytes);

	eth.transact(key.secret(eth.keys()[0]), u256.ether(0), nickADDR, payload, u256.value(100000), eth.gasPrice());

}
