
import Configurator from 'ima-plugin-rest-client/dist/Configurator';

/**
 * Configurator for the HAL+JSON REST API client configurator.
 */
export default class HalsonConfigurator extends Configurator {
	/**
	 * Initializes the HAL+JSON REST API client configurator.
	 * 
	 * @param {ima.http.HttpAgent} httpAgent The IMA HTTP agent for sending
	 *        HTTP request.
	 * @param {string} apiRoot URL to the REST API root.
	 * @param {function(*): Object<string, (string|{href: string})>} linkMapResolver
	 *        A callback that extracts the resource links map from the server's
	 *        response to a request to the API root.
	 */
	constructor(httpAgent, apiRoot, linkMapResolver) {
		super();

		/**
		 * The IMA HTTP agent for sending HTTP request.
		 *
		 * @type {ima.http.HttpAgent}
		 */
		this._httpAgent = httpAgent;

		/**
		 * URL to the REST API root.
		 *
		 * @type {string}
		 */
		this._apiRoot = apiRoot;

		/**
		 * A callback that extracts the resource links map from the server's
		 * response to a request to the API root.
		 *
		 * @type {function(*): Object<string, (string|{href: string})>}
		 */
		this._linkMapResolver = linkMapResolver;

		Object.freeze(this);
	}

	/**
	 * Fetches the server-provided REST API client configuration - the resource
	 * links map.
	 * 
	 * @return {Promise<{
	 *             links: Object<string, (string|{href: string})>,
	 *             apiRoot: string
	 *         }>} A promise that will resolve to the REST API root URL and the
	 *         root resource link map.
	 */
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
