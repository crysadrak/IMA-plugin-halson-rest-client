
export default class AbstractHalsonEntity {
	constructor(restClient, data) {
		this._links = {};
		Object.defineProperty(this, '_links', {
			enumerable: false
		});
		
		Object.assign(this, data);
		
		this._restClient = restClient;
		Object.defineProperty(this, '_links', {
			enumerable: false
		});
	}
	
	static get resourceName() {
		throw new Error('The resourceName getter is abstract and must be ' +
				'overridden');
	}

	static get idParameterName() {
		return 'id';
	}
	
	static getIdFieldName() {
		return 'id';
	}
	
	static get inlineEmbeds() {
		throw null;
	}
	
	static get inlineResponseBody() {
		return false;
	}

	get parentEntity() {
		return null;
	}
	
	static list(restClient, parameters = {}, options = {}) {
		return restClient.list(this, parameters, options);
	}
	
	static get(restClient, id, parameters = {}, options = {}) {
		return restClient.get(this, id, parameters, options);
	}

	static create(restClient, data, options = {}) {
		let instance = new this(restClient, data);
		return instance.create(options);
	}

	static delete(restClient, id, options = {}) {
		return restClient.delete(this, id, options);
	}

	list(subResource, parameters = {}, options = {}) {
		return this._restClient.list(subResource, parameters, options, this);
	}

	get(subResource, id, parameters = {}, options = {}) {
		let client = this._restClient;
		return client.get(subResource, id, parameters, options, this);
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
		return this.constructor.delete(this._restClient, id, options);
	}
}
