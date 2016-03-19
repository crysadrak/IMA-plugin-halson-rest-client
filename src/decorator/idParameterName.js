
export default (idParameterName) => {
	return (classConstructor) => {
		Object.defineProperty(classConstructor, 'idParameterName', {
			value: idParameterName
		});
	}
}
