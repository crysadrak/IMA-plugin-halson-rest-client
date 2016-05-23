
import AbstractHalsonEntity from '../AbstractHalsonEntity';
import HalsonLinkGenerator from '../HalsonLinkGenerator';
import HalsonRestClient from '../HalsonRestClient';

describe('HalsonLinkGenerator', () => {

	let resourceName;
	
	class Entity extends AbstractHalsonEntity {
		static get resourceName() {
			return resourceName;
		}

		static get idFieldName() {
			return '__id';
		}

		static get embedName() {
			return 'fooBaroooz';
		}

		static get idParameterName() {
			return 'id';
		}
	}

	const CONFIG = {
		apiRoot: 'http://localhost/api',
		links: {
			'user': {
				'href': '/user'
			},
			'programme': {
				'href': '/programme/{id}{?old_id}',
				'templated': true
			},
			'tips': {
				'href': '/tips{?channel_ids,timestamp}',
				'templated': true
			}
		}
	};

	let linkGenerator;
	let entity;

	beforeEach(() => {
		resourceName = 'user';
		linkGenerator = new HalsonLinkGenerator();
		let restClient = new HalsonRestClient({}, CONFIG.apiRoot);
		entity = new Entity(restClient, {
			__id: 1234,
			test: 'testing text'
		});
	});

	it('should convert links to absolute URIs', () => {
		let uri = linkGenerator.createLink(null, Entity, null, {}, CONFIG);
		expect(uri).toBe(CONFIG.apiRoot + CONFIG.links.user.href);
	});

	it('should not append extraneous parameters to the URIs', () => {
		let uri = linkGenerator.createLink(
			null,
			Entity,
			null,
			{ test: 'abc' },
			CONFIG
		);
		expect(uri).toBe('http://localhost/api/user')
	});

	it('should handle inline and query parameters', () => {
		resourceName = 'programme';
		let uri = linkGenerator.createLink(null, Entity, 123, {
			old_id: 4654
		}, CONFIG);
		expect(uri).toBe('http://localhost/api/programme/123?old_id=4654');

		resourceName = 'tips';
		uri = linkGenerator.createLink(null, Entity, null, {
			channel_ids: [1, 2, 3],
			timestamp: 1234567890
		}, CONFIG);
		expect(uri).toBe(
			'http://localhost/api/tips?channel_ids=1,2,3&timestamp=1234567890'
		);
	});

	it('should skip query parameters that were not provided', () => {
		resourceName = 'tips';
		let uri = linkGenerator.createLink(null, Entity, null, {
			channel_ids: [1, 2]
		}, CONFIG);
		expect(uri).toBe('http://localhost/api/tips?channel_ids=1,2');
	});

	it('should handle simple form of links', () => {
		resourceName = 'tips';
		let uri = linkGenerator.createLink(null, Entity, null, {
			channel_ids: [1, 2]
		}, {
			apiRoot: 'http://localhost/api',
			links: {
				tips: '/tips{?channel_ids,timestamp}'
			}
		});
		expect(uri).toBe('http://localhost/api/tips?channel_ids=1,2');
	});

	it('should use links of the parent entity if one is provided', () => {
		resourceName = 'tips';
		let uri = linkGenerator.createLink({
			_links: {
				tips: '/some/12/tips{?channel_ids,timestamp}'
			}
		}, Entity, null, {
			channel_ids: [1, 2]
		}, CONFIG);
		expect(uri).toBe('http://localhost/api/some/12/tips?channel_ids=1,2');
	});

});
