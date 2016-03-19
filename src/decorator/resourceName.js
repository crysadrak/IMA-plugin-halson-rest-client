
export default (resourceName) => {
	return (classConstructor) => {
		Object.defineProperty(classConstructor, 'resourceName', {
			value: resourceName
		});
	}
}
