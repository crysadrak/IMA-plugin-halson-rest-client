
export default class AbstractHalsonEntity {
	constructor(restClient, data) {
		this._links = {};
		Object.defineProperty(this, '_links', {
			enumerable: false
		});
		
		Object.assign(this, data);
		
		this._restClient = restClient;
	}
	
	static get resourceName() {
		throw new Error('The resourceName getter is abstract and must be ' +
				'overridden');
	}

	static get idParameterName() {
		throw new Error('The idParameterName getter is abstract and must be ' +
				'overridden');
	}
	
	static get inlineEmbeds() {
		throw null;
	}
	
	static get inlineResponseBody() {
		return false;
	}

	get parentResource() {
		return null;
	}
	
	static list(restClient, parameters = {}, options = {}) {
		return restClient.list(this.constructor, parameters, options);
	}
	
	static get(restClient, id, parameters = {}, options = {}) {
		return restClient.get(this.constructor, id, parameters, options);
	}

	patch(data, options = {}) {
		let resource = this.constructor;
		let id = this[this.constructor.idParameterName];
		let client = this._restClient;
		return client.patch(resource, id, data, options).then((response) => {
			Object.assign(this, data);
			return response;
		});
	}

	replace(options = {}) {
		let id = this[this.constructor.idParameterName];
		return this._restClient.replace(this.constructor, id, this, options);
	}

	create(options = {}) {
		return this._restClient.create(this.constructor, this, options);
	}

	delete(options = {}) {
		let id = this[this.constructor.idParameterName];
		return this._restClient.delete(this.constructor, id, options);
	}

	// TODO: manipulation methods, related resources manipulation methods
}
