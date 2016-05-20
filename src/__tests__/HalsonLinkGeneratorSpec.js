
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
			'schedules': {
				'href': '/schedules{?channel_ids,timestamp_from,timestamp_to}',
				'templated': true
			},
			'search': {
				'href': '/search{?phrase,limit,offest,since,until}',
				'templated': true
			},
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

	it('should append extraneous parameters to the URIs', () => {
		let uri = linkGenerator.createLink(
			null,
			Entity,
			null,
			{ test: 'abc' },
			CONFIG
		);
		expect(uri).toBe('http://localhost/api/user?test=abc')
	});

});
