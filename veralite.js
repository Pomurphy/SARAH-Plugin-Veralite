//var moment = require('moment');
//moment.lang('fr');
    
exports.action = function(data, callback, config){

  // CONFIG
var config = config.modules.veralite;

  if (!config.IP_Vera){
    console.log("Missing veralite config");
    return;
  } 

  // SET
   	switch (data.request)
	{
	case 'set':
	set(data, callback, config);
	break;
	case 'get':
	get(data, callback, config);
	break;
	default:
	output(callback, "Une erreur s'est produite: ");
	}
}

// ==========================================
//  GET
// ==========================================

var get = function(data, callback, config){ 
  var ip  = config.IP_Vera;
 
  switch (data.periphType)
	{
	case '1':
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
    tts = 'La lumière est '+suffixtts;
	//Callback with TTS
    callback({ 'tts': tts });
    });	
	break;
	case '4':
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
	break;
	case '5':
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
	break;
	case '6':
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
	break;
	default:
	output(callback, "Une erreur s'est produite: ");
	}
}

// ==========================================
//  SET
// ==========================================

var set = function(data, callback, config){

  var ip  = config.IP_Vera
  
  switch (data.periphType)
	{
	case '1':
    // Build URL ON/OFF
    var url = 'http://'+ip+':3480/data_request?id=lu_action&output_format=xml&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:SwitchPower1&action=SetTarget&newTargetValue='+data.periphValue;
    break;	
    case '2':
    // Build URL Variateur
    var url = 'http://'+ip+':3480/data_request?id=lu_action&output_format=xml&DeviceNum='+data.periphId+'&serviceId=urn:upnp-org:serviceId:Dimming1&action=SetLoadLevelTarget&newLoadlevelTarget='+data.value;
	break;
    case '3':
	// Build URL Scène
    var url = 'http://'+ip+':3480/data_request?id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum='+data.periphId;
 	break;
	default:
	output(callback, "Une erreur s'est produite: ");
    }
	
  // Send Request
  console.log("Sending request to: " + url);
  var request = require('request');
  request({ 'uri' : url }, function (err, response, body){
    
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }
     console.log(body);
	 
  // Callback with random TTS
  // phrases de réponses
  var phrase_success = new Array();
	phrase_success[1] = 'C\'est fait !';
	phrase_success[2] = 'A tes ordres !'; 
	phrase_success[3] = 'Ok';
	phrase_success[4] = 'Oui Messire !';
	phrase_success[5] = 'Oui Monseigneur !';
	phrase_success[5] = 'voila qui est fait !';
	     
	random = Math.floor((Math.random()*(phrase_success.length-1))+1);
			phrase_select = phrase_success[random];
			callback({'tts': phrase_select});
  });

}

