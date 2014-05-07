/************************************
 *          Initialization          *
 ************************************/




var dougADDR = "0xb151e7bc0da69909125586dd570cc2ab8a94661f";

var dougName = "doug";


var dougTEST = eth.storageAt(dougADDR, dougName);

var dtt = dougTEST;
var dat = dougADDR;

while (dtt != dat){
	dougADDR = dougTEST;
	dtt = eth.storageAt(dougADDR,dougName); 
	dat = dougADDR;
};

var dbADDR = eth.storageAt(dougADDR, "magdb");
var adminADDR = eth.storageAt(dougADDR, "user");
var nickADDR = eth.storageAt(dougADDR, "nick");
var pollADDR = null;

 
var infohashes = new Array();
var pollAddrs = new Array();
var contractAddrs = new Array();
var currentPollAddress = null;

var nicks = new Array();
var userPerms = new Array();
var addrii = new Array();

window.onload = function(){
	
	var myNick = getMyNick();
	
	if(myNick == ""){
			document.getElementById("adminLinkL").innerHTML = "Register";
	}
	
	prepareDatabasePage();
}


/************************************
 *              Menu                *
 ************************************/

switchPage = function(callerID){

   if(callerID == "0"){
		document.getElementById("containerDatabase").style.display = "block";
		document.getElementById("containerConsensus").style.display = "none";
		document.getElementById("containerAbout").style.display = "none";
		document.getElementById("containerAdmin").style.display = "none";
		prepareDatabasePage();
	} else if(callerID == "1"){	
		document.getElementById("containerDatabase").style.display = "none";
		document.getElementById("containerConsensus").style.display = "block";
		document.getElementById("containerAbout").style.display = "none";
		document.getElementById("containerAdmin").style.display = "none";
		
		if(getMyUserLevel() > 1){
			document.getElementById("pollViewMenu").style.display = "block";
		} else {
			document.getElementById("pollViewMenu").style.display = "none";
		}
		
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
			
		if(getMyNick() == ""){
			document.getElementById("registerSection").style.display = "block";
			document.getElementById("adminEditSection").style.display = "none";
			document.getElementById("userTableSection").style.display = "none";
		} else {
			document.getElementById("registerSection").style.display = "none";
			document.getElementById("adminEditSection").style.display = "block";
			document.getElementById("userTableSection").style.display = "block";
			// If I'm an admin.
						
			if (getMyUserLevel() > 1) {
				document.getElementById("adminButtons").style.display = "block";
			} else {
				document.getElementById("adminButtons").style.display = "none";			
			}
			
		}
		
	}
	

}

/************************************
 *         Database stuff           *
 ************************************/

prepareDatabasePage = function(){
	
	var myNick = getMyNick();
	
	if(myNick == ""){
		// Fix the input fields.
		document.getElementById('infohashInputField').disabled = true;
		document.getElementById('uploaderInputField').disabled = true;
		document.getElementById('filetypeInputField').disabled = true;
		document.getElementById('filequalityInputField').disabled = true;
		document.getElementById('titleInputField').disabled = true;
		document.getElementById('descriptionTextArea').disabled = true;
		document.getElementById('createDocumentButton').style.display = "none";
		document.getElementById('updateDocumentButton').style.display = "none";
		
	} else {
		document.getElementById('infohashInputField').disabled = false;
		document.getElementById('uploaderInputField').disabled = true;
		document.getElementById('filetypeInputField').disabled = false;
		document.getElementById('filequalityInputField').disabled = false;
		document.getElementById('titleInputField').disabled = false;
		document.getElementById('descriptionTextArea').disabled = false;
		document.getElementById('createDocumentButton').style.display = "block";
		document.getElementById('updateDocumentButton').style.display = "none";
	}
	document.getElementById('deleteDocumentButton').style.display = "none";
	
	document.getElementById('infohashInputField').value = "";
	document.getElementById('uploaderInputField').value = myNick;
	document.getElementById('filetypeInputField').value = "";
	document.getElementById('filequalityInputField').value = "";
	document.getElementById('titleInputField').value = "";
	document.getElementById('descriptionTextArea').value = "";
	
	//TODO remove this
	document.getElementById('infohashInputField').value = dbADDR;
	
}

generateTable = function(){
	
	var pointer1 = "0x20";
	var pointer2 = "0x25";
	var pointer3 = "0x26";
	
	var limitHex = eth.storageAt(dbADDR, "0x15");
	var limit = hexToVal(isNull(limitHex) ? "0x0" : limitHex);
	var titles = new Array();
	infohashes = new Array();
	
	for (var i = 0; i < limit; i++) {
		
		var tstr = eth.storageAt(dbADDR, pointer2).bin();
		tstr = tstr + eth.storageAt(dbADDR, pointer3).bin();
		titles[i] = tstr;
		infohashes[i] = eth.storageAt(dbADDR, pointer1);
		
		pointer1 = addHex(pointer1, "0x20");
		pointer2 = addHex(pointer2, "0x20");
		pointer3 = addHex(pointer3, "0x20"); 
		
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
	
	var ptrStrt = eth.storageAt(dbADDR, "0x14");
	
	if(!isNull(ptrStrt)){
		var pointer = addHex(infohs, ptrStrt);
	}
	pointer = eth.storageAt(dbADDR, pointer);
	
	pointer = addHex(pointer, "0x2");
	
	var uploader = eth.storageAt(dbADDR, pointer).bin();
	pointer = addHex(pointer, "0x1");
	
	var filetype = eth.storageAt(dbADDR, pointer).bin();
	pointer = addHex(pointer, "0x1");
	
	var filequality = eth.storageAt(dbADDR, pointer).bin();
	pointer = addHex(pointer, "0x1");
	
	var title1 = eth.storageAt(dbADDR, pointer).bin();
	pointer = addHex(pointer, "0x1");
	var title2 = eth.storageAt(dbADDR, pointer).bin();
	var title = title1 + title2;
	
	var desc = "";
	for (var i = 0; i < 25; i++) {
		pointer = addHex(pointer, "0x1");
		var temp = eth.storageAt(dbADDR, pointer).bin();
		desc = desc + temp;
	}
	
	document.getElementById('infohashInputField').value = infohs.substring(2);
	document.getElementById('uploaderInputField').value = uploader;
	document.getElementById('filetypeInputField').value = filetype;
	document.getElementById('filequalityInputField').value = filequality;
	document.getElementById('titleInputField').value = title;
	document.getElementById('descriptionTextArea').value = desc;
	
	var myNick = getMyNick();
	if(myNick != ""){
		if(myNick == uploader){
			// Fix the input fields.
			document.getElementById('infohashInputField').disabled = true;
			document.getElementById('uploaderInputField').disabled = true;
			document.getElementById('filetypeInputField').disabled = false;
			document.getElementById('filequalityInputField').disabled = false;
			document.getElementById('titleInputField').disabled = false;
			document.getElementById('descriptionTextArea').disabled = false;
			// Fix the buttons.		
			document.getElementById('updateDocumentButton').style.display = "block";
			document.getElementById('deleteDocumentButton').style.display = "block";
		} else {
			// Fix the input fields.
			document.getElementById('infohashInputField').disabled = true;
			document.getElementById('uploaderInputField').disabled = true;
			document.getElementById('filetypeInputField').disabled = true;
			document.getElementById('filequalityInputField').disabled = true;
			document.getElementById('titleInputField').disabled = true;
			document.getElementById('descriptionTextArea').disabled = true;
			
			document.getElementById('updateDocumentButton').style.display = "none";
			var myLevel = getMyUserLevel();
			if(myLevel > 1){				
				document.getElementById('deleteDocumentButton').style.display = "block";			
			} else {
				document.getElementById('deleteDocumentButton').style.display = "block";			
			}
		}
		document.getElementById('createDocumentButton').style.display = "none";
		
	}
	
}

updateDocument = function()
{
	
	var ulString = document.getElementById("uploaderInputField").value;
	var myNick = getMyNick();
	//document.getElementById("infohashInputField").value = myNick;
	
	//if(ulString != myNick){
	//	window.alert("The uploader name must match your nickname (" + myNick + ").");
	//	return;
	//}
	
	var infohash = ("0x" + document.getElementById("infohashInputField").value).pad(0,32);
	var title = (document.getElementById("titleInputField").value).unbin().pad(0,64);
	var uploader = myNick.unbin().pad(0,32);
	var filetype = (document.getElementById("filetypeInputField").value).unbin().pad(0,32);
	var filequality = (document.getElementById("filequalityInputField").value).unbin().pad(0,32);
	var descript = (document.getElementById("descriptionTextArea").value).unbin().pad(0,800);
	
	// TODO is this right?
	var indicator = "0x111111".pad(0,32);
	var command = "moddbe".unbin().pad(0,32);
	
	var payload = command + infohash + indicator + uploader + filetype + filequality + title + descript;
	
	eth.transact(eth.key, "0", dbADDR, payload, "100000", eth.gasPrice, dummyTransCallback);

};

deleteDocument = function()
{
	
	var infohash = ("0x" + document.getElementById("infohashInputField").value).pad(0,32);
	var command = toPayload("delbe");

	var payload = command + infohash;

	eth.transact(eth.key, "0", dbADDR, payload, "100000", eth.gasPrice, dummyTransCallback);	
	clearDocument();
	
};

clearDocument = function()
{
	
	prepareDatabasePage();
	
};

/************************************
 *         Consensus stuff          *
 ************************************/

readContractMeta = function(contractDataSlot)
{
	/*
	var index = parseInt(contractDataSlot);
	

	var ADDR = contractAddrs[index];
	currentPollAddress = pollAddrs[index];

	var metaident = eth.storageAt(ADDR, "0x0");

	if (hexToVal(metaident) == 585546221227) {
		var creat = (eth.storageAt(ADDR, "0x1")).bin();

		var auth = (eth.storageAt(ADDR, "0x2")).bin();

		var da = hexToVal(eth.storageAt(ADDR, "0x3"));
		var d1 = da%65536;
		var d2 = (Math.floor(da/65536))%256;
		var d3 = (Math.floor(da/16777216))%256;
		var date = d3.toString(16)+"/"+d2.toString(16)+"/"+d1.toString(16);

		var ve = hexToVal(eth.storageAt(ADDR, "0x4"));
		var v1 = ve%65536;
		var v2 = (Math.floor(ve/65536))%256;
		var v3 = (Math.floor(ve/16777216))%256;
		var vers = v3.toString(16)+"."+v2.toString(16)+"."+v1.toString(16);

		var name = eth.storageAt(ADDR, "0x5").bin();

		var desc = "";
		for (var i = 6; i <= 15; i++) {
			var temp = eth.storageAt(ADDR, valToHex(i)).bin();
			desc = desc + temp;
		}

		document.getElementById('contractAddress').value = contractAddrs[index];
		document.getElementById('contractCreator').value = creat;
		document.getElementById('contractAuthor').value = auth;
		document.getElementById('contractDate').value = date;
		document.getElementById('contractVersion').value = vers;
		document.getElementById('contractName').value = name;
		document.getElementById('contractDescriptionTextArea').value = desc;
	};
	*/
}
	
generatePollTable = function(){
/*
	// Get tail at 0x18
	var pointer = eth.storageAt(dougADDR,"0x18");

	pollAddrs = new Array();
	contractAddrs = new Array();

	var contractNames = new Array();
	
	var table= "<table><tr><td>Poll</td></tr>";
	
	var counter = 0;
	
	while(!isNull(pointer){
		var next = addHex(pointer,"0x1");
		
		pollAddrs[counter] = pointer;
		pointer = eth.storageAt(dougADDR,pointer);
		
		contractAddrs[counter] = pointer;
		pointer = eth.storageAt(dougADDR,pointer);
		contractNames[counter] = pointer.bin();
		
		
		table+='<tr><td><a href="javascript:void(0)" onclick="readContractMeta(' + '&quot;' + 
		counter + '&quot;' + ');">' + contractNames[counter] + '</a></td></tr>';		
		
		pointer = eth.storageAt(dougADDR,next);
		counter++;
	}
	
	table+="</table>";
	document.getElementById('pollTable').innerHTML = table;
	*/
}



vote = function(yesno){
	/*
	var ADDR = currentPollAddress;
	var payload = "vote".pad(32) + yesno;
	eth.transact(key.secret(eth.keys()[0]), "0", ADDR, payload, "100000", eth.gasPrice(), dummyTransCallback);
	*/	
}


/************************************
 *       User related stuff         *
 ************************************/

removeUser = function(){
	
	var userName = document.getElementById("userNicknameInputField").value;

	if(userName == null || userName == ""){
		window.alert("No user name has been specified.");
		return;
	}
	
	if(userName == getMyNick()){
			window.alert("If you want to remove yourself, use the 'Delete Me' command.");
			return;
	}
	
	var sure = confirm("Are you sure you want to delete member: " + userName + "?");	
	if(!sure){
		window.alert("User was not removed.");
		return;
	}
	
	var payload = "dereg".unbin().pad(0,32) + userName.unbin().pad(0,32);

	eth.transact(eth.key, "0", nickADDR, payload, "100000", eth.gasPrice, dummyTransCallback);
	
}

promoteUser = function(){
	
	var userName = document.getElementById("userNicknameInputField").value;

	if(userName == null || userName == ""){
		window.alert("No username has been specified.");
		return;
	}
	
	var sure = confirm("Are you sure you want to promote user: " + userName + "?\n\nThey will be given administrator privileges.");
	
	if(!sure){
		window.alert("User was not promoted.");
		return;	
	}
	
	var payload = "regadm".unbin().pad(0,32) + userName.unbin().pad(0,32);

	eth.transact(eth.key, "0", adminADDR, payload, "100000", eth.gasPrice, dummyTransCallback);
	
}

deleteMe = function(){
	
	var sure = confirm("Are you sure you want to delete your own account?");	
	if(!sure){
		window.alert("Account not deleted.");
		return;	
	}
	if(getMyUserLevel() > 1){
		var superSure = confirm("Are you sure? You will loose your admin privileges.");	
		if(!superSure){
			window.alert("Account not deleted.");
			return;
		}
	}
	
	var payload = "dereg".unbin().pad(0,32);
	eth.transact(eth.key, "0", nickADDR, payload, "100000", eth.gasPrice, dummyTransCallback);
	window.alert("Your account will be removed shortly.");
	
}

generateUserTable = function(){
	
	var pointer = "0x12"; // Tail
	// Size of the linked list.
	var size = hexToVal(eth.storageAt(nickADDR, "0x11"));
	nicks = new Array();
	addrii = new Array(); // Deal with it
	userPrivs = new Array();
	
	for (var i = 0; i < size; i++) {
		pointer = eth.storageAt(nickADDR, pointer);
		var nick = pointer.bin();
		nicks[i] = nick;
		addrii[i] = eth.storageAt(nickADDR,pointer);
		// Get the address of the user.
		var priv = eth.storageAt(adminADDR, addrii[i]);
		
		userPrivs[i] = hexToVal(priv);
		pointer = addHex(pointer, "0x2");
	};
	
	var table= "<table><tr><td>Nickname</td><td>Type</td></tr>";
	
	for (var j = 0; j < nicks.length; j++) {
		var userTypeStr = null;
		switch(userPrivs[j])
		{
			case 0:
		  		userTypeStr = "Squatter";
		  		break;
			case 1:
		  		userTypeStr = "Member";
				break;
			default:
			  userTypeStr = "Admin";
		}
		
		table+='<tr><td><a href="javascript:void(0)" onclick="resolveUserLink(' + '&quot;' + 
		j + '&quot;' + ');">' + nicks[j] + '</a></td><td>' + userTypeStr + '</td></tr>';
	}
	
	table+="</table>";
	document.getElementById('userTable').innerHTML = table;
	
}

resolveUserLink = function(userIndex)
{
	var index = parseInt(userIndex);
	document.getElementById('userAddressInputField').value = addrii[index];
	if(userPrivs[index] == "3"){
		document.getElementById('adminRadio').checked = true;		
	} else {
		document.getElementById('userRadio').checked = true;	
	}
		document.getElementById('userNicknameInputField').value = nicks[index];
	
}

registerNickname = function(){
	
	var nameString = document.getElementById("registerNicknameInputField").value;
	if(nameString == null || nameString == ""){
		window.alert("There is no name in the nickname field.");
		return;
	}

	var nickAddr = getAddressFromNick(nameString);
	
	if(!isNull(nickAddr)){
		window.alert("That nickname is already in use.");
		return;
	}
	
	var payload = "reg".unbin().pad(0,32) + nameString.unbin().pad(0,32);
	//document.getElementById("registerNicknameInputField").value = payload;
	eth.transact(eth.key, "0", nickADDR, payload, "100000", eth.gasPrice, dummyTransCallback);
	
}

/************************************
 *     DOUG utility functions       *
 ************************************/

// Returns nickname as a u256 object.
getMyNickHex = function(){
	var myAddr = eth.secretToAddress(eth.key);
	var myNickHex = eth.storageAt(nickADDR, myAddr);
	if(isNull(myNickHex)) {
		return "0x0";
	}
	return myNickHex;
}

// Returns nickname as a string.
getMyNick = function(){
	var myNameHex = getMyNickHex();
	if(myNameHex == "0x0"){
		return "";
	}
	return myNameHex.bin().trim();
	
}

// Returns user level as a number.
getMyUserLevel = function(){
	
	var myAddr = eth.secretToAddress(eth.key);
	var myLevHex = eth.storageAt(adminADDR, myAddr);
	
	if(isNull(myLevHex)){
		return 0;
	}
	return hexToVal(myLevHex);
}

getAddressFromNick = function(nickName){
	
	return eth.storageAt(nickADDR,nickName);
	
}

/************************************
 *     DOUG utility functions       *
 ************************************/

// Takes two integer strings, turns them into decimal numbers, adds, then return the sum as an integer string.
add = function(val1,val2){
	return BigInteger(val1).add(val2).toString();
}

// Adds two hex numbers (as strings) and returns a new hex string
addHex = function(hex1,hex2){
	return "0x" + BigInteger(hex1).add(hex2).toString(16);
}

// Takes two integer strings, turns them into decimal numbers, subtracts, then return the sum as an integer string.
sub = function(val1,val2){
	return BigInteger(val1).subtract(val2).toString();;
}

// Subtract two hex numbers (as strings) and returns a new hex string
subHex = function(hex1,hex2){
	return "0x" + BigInteger(hex1).subtract(hex2).toString(16);
}

// Checks if a hex-string is 0
isNull = function(hex){
	return (hex == "0x") ? true : false;
}

// Takes a hex-string and returns its integer decimal value as a number.
hexToVal = function(hex){
	return parseInt(hex,16);
}

// takes a decimal number and turns it into a proper hex string ("0x" + hexStr)
valToHex = function(val){
	return "0x" + val.toString(16);
}

toPayload = function(someText){
	return toPayloadSz(someText,32);
}

toPayloadSz = function(someText,sz){
	return someText.unbin().pad(0,sz);
}

dummyTransCallback = function(){}


