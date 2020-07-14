const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const { objectKeepUnmock, setGlobalKeepUnmock, setGlobalMockMethod } = require('to-mock');

enzyme.configure({ adapter: new Adapter() });
setGlobalMockMethod(jest.fn);
setGlobalKeepUnmock(objectKeepUnmock);
