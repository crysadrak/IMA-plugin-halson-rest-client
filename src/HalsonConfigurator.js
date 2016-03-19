
import Configurator from 'ima-plugin-rest-client/src/Configurator';

export default class HalsonConfigurator extends Configurator {
	constructor(httpAgent, apiRoot, linkMapResolver) {
		this._httpAgent = httpAgent;

		this._apiRoot = apiRoot;
		
		this._linkMapResolver = linkMapResolver;

		Object.freeze(this);
	}

	getConfiguration() {
		return this._httpAgent.get(this._apiRoot).then((response) => {
			let config = response.body;
			config._apiRoot = this._apiRoot;
			return {
				links: this._linkMapResolver(response.body),
				apiRoot: this._apiRoot
			};
		});
	}
}
