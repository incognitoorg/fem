/**
 * @VE.UITECH
 * @author  Vinayak Sakhare
 * @date	July 2012
 * 
 * Created for development purposes. To avoid validations while 
 * developing.
 * 
 * */

var debugMode = false;
var isCorporate = false;
var theme="default";

if(localStorage.getItem('theme')){
	theme = localStorage.getItem('theme');
}
oldconsolelog=console.log;

console.log=function(){
    if(debugMode){
        oldconsolelog.apply(this, arguments);
    }
};