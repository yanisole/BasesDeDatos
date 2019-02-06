let _enableDebug = true;

module.exports.printError = (p_error) => {
    console.log('Error: ' + p_error);
}

module.exports.printInformation = (p_error) => {
    console.log('Information: ' + p_error);
}

module.exports.debugLog = () => {
    if(!_enableDebug || arguments.length == 0)
        return;
    console.log("Debug:================");
    for(var i = 0; i < arguments.length; i++)
        console.log(arguments[i]);
    console.log("Fín Debug:============");
}