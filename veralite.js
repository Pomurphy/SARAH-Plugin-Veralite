exports.action = function(data, callback, config){

  // CONFIG
var config = config.modules.veralite;

  if (!config.IP_Vera){
    console.log("Missing veralite config");
    return;
  }; 
  
  // SET or GET
   	switch (data.request){
	case 'set':
		switch (data.periphType){
		case '1':
			setonoff(data, callback, config);
		break;
		case '2':
			setvar(data, callback, config);
		break;
		case '3':
			setscene(data, callback, config);
		break;
		case '4':
			callback({ 'tts': 'ce n\'est pas possible' });
		break;
		case '5':
			callback({ 'tts': 'ce n\'est pas possible' });
		break;
		case '6':
			callback({ 'tts': 'ce n\'est pas possible' });
		break;
		case '7':
			callback({ 'tts': 'ce n\'est pas possible' });
		break;
		case '8':
			setdoorlock(data, callback, config);
		break;
		case '9':
			setvar(data, callback, config);
		break;
		case '10':
			setvirtsw(data, callback, config);
		break;
		default:
		callback({ 'tts': 'Je ne comprend pas !' });
		};
	break;
	case 'get':
		switch (data.periphType){
		case '1':
			getonoff(data, callback, config);
		break;
		case '2':
			getvar(data, callback, config);
		break;
		case '3':
		    callback({ 'tts': 'ce n\'est pas possible' });
		break;
		case '4':
			gettemp(data, callback, config);
		break;
		case '5':
			gethygro(data, callback, config);
		break;
		case '6':
			getlum(data, callback, config);
		break;
		case '7':
			getconso(data, callback, config);
		break;
		case '8':
			getdoorlock(data, callback, config);
		break;
		case '9':
			getvolets(data, callback, config);
		break;
		case '10':
			getvirtsw(data, callback, config);
		break;
		default:
		callback({ 'tts': 'Je ne comprend pas !' });
		};
	break;	
	default:
	callback({ 'tts': 'Je ne comprend pas !' });
	};
};

// ==========================================
//  GET STATUT ON/OFF
// ==========================================

var getonoff = function(data, callback, config){ 
  var ip  = config.IP_Vera;
 
    // Build URL status ON/OFF
    var url = 'http://'+ip+':3480/data_request?id=variableget&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:SwitchPower1&Variable=Status';
	// Send Request
    var request = require('request');
    request({ 'uri': url, 'json': true }, function (err, response, body){
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }
	if (body == '1'){
		suffixtts = 'allumée'}
		else {suffixtts = 'éteinte'}
    var tts = 'La lumière est '+suffixtts;
	//Callback with TTS
    callback({ 'tts': tts });
    });	
};

// ==========================================
//  GET STATUT VIRTUAL SWITCH
// ==========================================

var getvirtsw = function(data, callback, config){ 
  var ip  = config.IP_Vera;
 
    // Build URL status ON/OFF
    var url = 'http://'+ip+':3480/data_request?id=variableget&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:VSwitch1&Variable=Status';
	// Send Request
    var request = require('request');
    request({ 'uri': url, 'json': true }, function (err, response, body){
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }
	if (body == '1'){
		suffixtts = 'allumé '}
		else {suffixtts = 'éteint '}
    var tts = 'L\'interrupteur est ' + suffixtts;
	//Callback with TTS
    callback({ 'tts': tts });
    });	
};

// ==========================================
//  GET STATUT VARIATEUR
// ==========================================

var getvar = function(data, callback, config){ 
  var ip  = config.IP_Vera;
 
    // Build URL
    var url1 = 'http://'+ip+':3480/data_request?id=variableget&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:SwitchPower1&Variable=Status';
    var url2 = 'http://'+ip+':3480/data_request?id=variableget&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:Dimming1&Variable=LoadLevelStatus';

	// Send Request
    var request = require('request');
    request({ 'uri': url1, 'json': true }, function (err, response, body){
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }
	if (body == '1'){
	    var request = require('request');
		request({ 'uri': url2, 'json': true }, function (err, response, body){
			if (err || response.statusCode != 200) {
			callback({'tts': "L'action a échoué"});
			return;
			}
		var tts = 'la lumière est allumée à '+ body + ' pour cent';
		//Callback with TTS
    	callback({ 'tts': tts });
		return;
		});
		} else {
		var tts = 'la lumière est éteinte';
		//Callback with TTS
		callback({ 'tts': tts });
		}
    });	
}

// ==========================================
//  GET STATUT VOLETS
// ==========================================

var getvolets = function(data, callback, config){ 
  var ip  = config.IP_Vera;
 
    // Build URL
    var url = 'http://'+ip+':3480/data_request?id=variableget&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:Dimming1&Variable=LoadLevelStatus';

	// Send Request
    var request = require('request');
    request({ 'uri': url, 'json': true }, function (err, response, body){
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }
	if (body == '0'){
		var tts = 'les volets sont fermés';
	} else {
	    var tts = 'les volets sont ouverts à ' + body + ' pour cent';
	}	

	//Callback with TTS
	callback({ 'tts': tts });
	});	
}

// ==========================================
//  GET TEMPERATURE
// ==========================================

var gettemp = function(data, callback, config){ 
	var ip  = config.IP_Vera;
	
    // Build URL Temperature
    var url = 'http://'+ip+':3480/data_request?id=variableget&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:TemperatureSensor1&Variable=CurrentTemperature';
    var prefixtts =  'la température est de ';
	var suffixtts = ' degrés';
	// Send Request
    var request = require('request');
    request({ 'uri': url, 'json': true }, function (err, response, body){
    if (err || response.statusCode != 200) {
      callback({'tts': "La lecture de la température a échoué"});
      return;
    }
    tts = prefixtts+body+suffixtts;
	//Callback with TTS
    callback({ 'tts': tts });
    });	
}

// ==========================================
//  GET HYGROMETRIE
// ==========================================

var gethygro = function(data, callback, config){ 
	var ip  = config.IP_Vera;
	
    // Build URL hygrometrie
    var url = 'http://'+ip+':3480/data_request?id=variableget&DeviceNum='+data.periphId+'&serviceId=urn:micasaverde-com:serviceId:HumiditySensor1&Variable=CurrentLevel';
    var prefixtts =  'le taux d\'humidité est de ';
	var suffixtts = ' pour cent';
	// Send Request
    var request = require('request');
    request({ 'uri': url, 'json': true }, function (err, response, body){
    if (err || response.statusCode != 200) {
      callback({'tts': "la lecture de l'hygrométrie a échoué"});
      return;
    }
    tts = prefixtts+body+suffixtts;
	//Callback with TTS
    callback({ 'tts': tts });
    });	
}

// ==========================================
//  GET LUMINOSITE
// ==========================================

var getlum = function(data, callback, config){ 
	var ip  = config.IP_Vera;

    // Build URL luminosité
    var url = 'http://'+ip+':3480/data_request?id=variableget&DeviceNum='+data.periphId+'&serviceId=urn:micasaverde-com:serviceId:LightSensor1&Variable=CurrentLevel';
    var prefixtts =  'le luminosité est de ';
	var suffixtts = ' luxe';
	// Send Request
    var request = require('request');
    request({ 'uri': url, 'json': true }, function (err, response, body){
    if (err || response.statusCode != 200) {
      callback({'tts': "la lecture de la luminosité a échoué"});
      return;
    }
    tts = prefixtts+body+suffixtts;
	//Callback with TTS
    callback({ 'tts': tts });
    });	
}

// ==========================================
//  GET CONSOMMATION
// ==========================================

var getconso = function(data, callback, config){ 
	var ip  = config.IP_Vera;

    // Build URL consommation
    var url = 'http://'+ip+':3480/data_request?id=variableget&DeviceNum='+data.periphId+'&serviceId=urn:micasaverde-com:serviceId:EnergyMetering1&Variable=Watts';
    var prefixtts =  'la puissance consommée est de ';
	var suffixtts = ' watts';
	// Send Request
    var request = require('request');
    request({ 'uri': url, 'json': true }, function (err, response, body){
    if (err || response.statusCode != 200) {
      callback({'tts': "la lecture de la consommation a échoué"});
      return;
    }
    tts = prefixtts+body+suffixtts;
	//Callback with TTS
    callback({ 'tts': tts });
    });	
}

// ==========================================
//  GET STATUS DOORLOCK
// ==========================================

var getdoorlock = function(data, callback, config){ 
	var ip  = config.IP_Vera;
 
    // Build URL status doorlock
    var url = 'http://'+ip+':3480/data_request?id=variableget&DeviceNum='+data.periphId+'&serviceId=urn:micasaverde-com:serviceId:DoorLock1&Variable=Status';
	// Send Request
    var request = require('request');
    request({ 'uri': url, 'json': true }, function (err, response, body){
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }
	if (body == '1'){
		suffixtts = 'fermée'}
		else {suffixtts = 'ouverte'}
    tts = 'La serrure est '+suffixtts;
	//Callback with TTS
    callback({ 'tts': tts });
    });	
}


// ==========================================
//  SET ON/OFF
// ==========================================

var setonoff = function(data, callback, config){

  var ip  = config.IP_Vera
  
  // Build URL ON/OFF
  var url = 'http://'+ip+':3480/data_request?id=lu_action&output_format=xml&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:SwitchPower1&action=SetTarget&newTargetValue='+data.periphValue;
  // Send Request
  sendURL(url, callback);

}

// ==========================================
//  SET VIRTUAL SWITCH
// ==========================================

var setvirtsw = function(data, callback, config){

  var ip  = config.IP_Vera
  
  // Build URL ON/OFF
  var url = 'http://'+ip+':3480/data_request?id=lu_action&output_format=xml&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:VSwitch1&action=SetTarget&newTargetValue='+data.periphValue;
  // Send Request
  sendURL(url, callback);

}

// ==========================================
//  SET VARIATION
// ==========================================

  var setvar = function(data, callback, config){

  var ip  = config.IP_Vera
  
  switch (data.periphValue){
	case '0':
		var url = 'http://'+ip+':3480/data_request?id=lu_action&output_format=xml&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:SwitchPower1&action=SetTarget&newTargetValue=0';
		// Send Request
		sendURL(url, callback);
	break;
	case '1':
		var url = 'http://'+ip+':3480/data_request?id=lu_action&output_format=xml&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:SwitchPower1&action=SetTarget&newTargetValue=1';
		// Send Request
		sendURL(url, callback);
	break;
	case '2':
		var url = 'http://'+ip+':3480/data_request?id=lu_action&output_format=xml&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:Dimming1&action=SetLoadLevelTarget&newLoadlevelTarget='+data.value;          		
		// Send Request
		sendURL(url, callback);
	break;
	}
  }
  
// ==========================================
//  SET SCENE
// ==========================================
  var setscene = function(data, callback, config){
	
	var ip  = config.IP_Vera
	// Build URL Scène
    var url = 'http://'+ip+':3480/data_request?id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum='+data.periphId;
    // Send Request
	sendURL(url, callback);
    
}

// ==========================================
//  SET DOORLOCK
// ==========================================

var setdoorlock = function(data, callback, config){

  var ip  = config.IP_Vera
  if (data.periphValue == 0){
	var action = 1;
	} else {
	var action = 0;
	}
  // Build URL ON/OFF
  var url = 'http://'+ip+':3480/data_request?id=lu_action&output_format=xml&DeviceNum='+data.periphId+'&serviceId=urn:micasaverde-com:serviceId:DoorLock1&action=SetTarget&newTargetValue='+action;
  // Send Request
  sendURL(url, callback);

}

// ==========================================
//  SEND REQUEST and TTS CALLBACK
// ==========================================

var sendURL = function(url, callback){

  console.log("Sending request to: " + url);

  var request = require('request');
  request({ 'uri' : url }, function (err, response, body){
    
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }
	console.log(body);
	 
	// phrases de réponses
    var phrase_success = new Array();
	phrase_success[1] = 'C\'est fait !';
	phrase_success[2] = 'A tes ordres !'; 
	phrase_success[3] = 'Ok';
	phrase_success[4] = 'Oui Messire !';
	phrase_success[5] = 'Oui Monseigneur !';
	phrase_success[5] = 'voila qui est fait !';   
	 
  // Callback with random TTS
	random = Math.floor((Math.random()*(phrase_success.length-1))+1);
			phrase_select = phrase_success[random];
			callback({'tts': phrase_select});

  });

}
