
import AbstractHalsonEntity from '../AbstractHalsonEntity';
import HalsonRestClient from '../HalsonRestClient';

describe('AbstractHalsonEntity', () => {

	class Entity extends AbstractHalsonEntity {}

	let restClient;

	beforeEach(() => {
		restClient = new HalsonRestClient(null, 'htpp://localhost/');
	});

	it('should declare the _links property if it does not exist', () => {
		let entity = new Entity(restClient, {});
		expect(Object.hasOwnProperty.call(entity, '_links')).toBeTruthy();
	});

	it('should make the _links property non-enumarable', () => {
		let entity = new Entity(restClient, {
			_links: { foo: 'bar' }
		});
		expect(entity._links.foo).toBe('bar');
		let descriptor = Object.getOwnPropertyDescriptor(entity, '_links');
		expect(descriptor.enumerable).toBeFalsy();
	});

});
