var jenkinsapi = require('jenkins-api');
var str = require ('string');

var jenkinsCreds = process.env.JENKINS_BUILD_CRED;

var url =  "http://" +jenkinsCreds + "@192.168.2.37:8080/";
var jenkins = jenkinsapi.init(url);

function startRemoteBuildServer(cb){
	runBuild('EC2-Build-Server-Start',cb,cb,cb,30 * 1000 , false);
}

function stopRemoteBuildServer(cb){
	runBuild('EC2-Build-Server-Stop',cb,cb,cb,30 * 1000 , false);
}

function startBlueServer(cb){
	runBuild('EC2-Blue-Server-Start',cb,cb,cb,30 * 1000 , false);
}
function stopBlueServer(cb){
	runBuild('EC2-Blue-Server-Stop',cb,cb,cb,30 * 1000 , false);
}

function runJenkinsBuild(text,botName,cb){
	var withoutBotname = getTextAfterBotName(botName);
	var buildName = getTextWithoutStartBuild(withoutBotname);
	runBuild(buildName,cb,cb,cb,60 * 1000,false);
}

function getJenkinsBuildInfo(text,botName,cb){
	var withoutBotname = getTextAfterBotName(botName);
	var buildName = getTextWithoutStartBuild(withoutBotname);
	getLastBuildInfo(buildName,cb,cb,cb,60 * 1000,false);
}

function getTextAfterBotName (text,botName){
        return str(text).chompLeft(botName + ':').trim().s;
}
function getTextWithoutStartBuild(text){
	return str(text).chompLeft('start build').s.trim();
}
function getTextWithoutGetInfo(text){

}
function getLastBuildInfo (buildName,errCB,startedCB,completedCB,checkFrequency,isForChecking){
	if(isForChecking == undefined){
		isForChecking = false;
	}
	jenkins.last_build_info(buildName, function(err, data) {
		  	if (err){ 
		  		console.log(err);
		  		var text = "Some error while get the build info. Here is the output : \n " + err.toString();
		  		errCB(text); 
		  	}
		  	else{
		  		if(data.result == null){
		  			if(isForChecking == false){
		  			startedCB('The build ' + buildName+ ' is  still running. Let you know when it gets over' );
		  			}
		  			setTimeout(getLastBuildInfo(buildName,errCB,startedCB,completedCB,checkFrequency,true),
		  				checkFrequency
		  				);
		  		}
		  		else {
		  			
		  			var text = "The build completed with status " +data.result;
		  			completedCB(text);
		  		}
		  	}
		  
		});
}

function runBuild (buildName,errCB,startedCB,completedCB,checkFrequency){
	console.log("check frequency ",checkFrequency);
	jenkins.build(buildName, function(err, data) {
		  	if (err){ 
		  		var text = "Some error while starting the build. Here is the output : \n " + err.toString();
		  		errCB(text); 
		  	}
		  	else{
		  			startedCB('Have started the build ' + buildName +'. Let you know when it is completed');
		  			setTimeout(function(){ getLastBuildInfo(buildName,errCB,startedCB,completedCB,checkFrequency,true);},
		  				checkFrequency
		  				);
		  	}
		  
		});
}

exports.startBlueServer = startBlueServer;
exports.stopBlueServer = stopBlueServer;
exports.startRemoteBuildServer = startRemoteBuildServer;
exports.getJenkinsBuildInfo = getJenkinsBuildInfo;
exports.stopRemoteBuildServer = stopRemoteBuildServer;
exports.runJenkinsBuild = runJenkinsBuild;

