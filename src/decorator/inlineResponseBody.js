
export default (classConstructor) => {
	Object.defineProperty(classConstructor, 'inlineResponseBody', {
		value: true
	});
};
