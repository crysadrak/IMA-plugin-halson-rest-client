
export default (...embedNames) => {
	return (classConstructor) => {
		Object.defineProperty(classConstructor, 'inlineEmbeds', {
			value: embedNames
		});
	}
}
