function _getLogoBig() {
	var cl = K.getComponent('console');

	return cl.GREEN + '\n	  _\n' +
		'         /\\_\\\n' +
		'        / / /  ' + cl.WHITE + '_' + cl.GREEN + '\n' +
		'       / / /  ' + cl.WHITE + '/\\_\\' + cl.GREEN + '\n' +
		'      / / /' + cl.WHITE + '__/ / /' + cl.GREEN + '\n' +
		'     / /' + cl.WHITE + '\\_____/ /' + cl.GREEN + '\n' +
		'    / /' + cl.WHITE + '\\_______/' + cl.GREEN + '\n' +
		'   / / /' + cl.BLUE + '\\ \\ \\' + cl.GREEN + '\n' +
		'  / / /  ' + cl.BLUE + '\\ \\ \\' + cl.GREEN + '\n' +
		' / / /    ' + cl.BLUE + '\\ \\ \\' + cl.GREEN + '\n' +
		' \\/_/      ' + cl.BLUE + '\\_\\_\\' + cl.WHITE + '    Kalm v' + K.pkg.version + '\n\n';
}

module.exports = {
	big: _getLogoBig 
};