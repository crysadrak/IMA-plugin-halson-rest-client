module.exports = Object.assign({}, {
	testEnvironment: 'node',
	rootDir: "../",
	moduleDirectories: ['<rootDir>/node_modules/'],
	modulePaths: [
		"<rootDir>"
	],
	transform: {
		'\\.jsx?': '<rootDir>/jest/preprocess.js'
	},
	snapshotSerializers: ['<rootDir>/node_modules/enzyme-to-json/serializer'],
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
	bail: true,
	verbose: true,
	coverageThreshold: {
		global: {
			"functions": 70,
			"lines": 70,
			"statements": 70
		}
	},
	setupFiles: [
		'<rootDir>/node_modules/@ima/core/test.js',
		'<rootDir>/node_modules/@ima/core/polyfill/imaLoader.js',
		'<rootDir>/node_modules/@ima/core/polyfill/imaRunner.js',
		'<rootDir>/jest/setupFile.js'
	],
	testMatch: [
		'**/__tests__/**/*Spec.js'
	]
});
