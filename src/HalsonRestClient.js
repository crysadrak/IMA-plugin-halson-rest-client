
import AbstractRestClient from 'ima-plugin-rest-client/dist/AbstractRestClient';
import HalsonConfigurator from './HalsonConfigurator';
import HalsonLinkGenerator from './HalsonLinkGenerator';
import HalsonResponsePostProcessor from './HalsonResponsePostProcessor';

/**
 * The REST API client for the HAL+JSON REST API.
 */
export default class HalsonRestClient extends AbstractRestClient {
	/**
	 * Initializes the HALSON REST API client.
	 * 
	 * @param {HttpAgent} httpAgent The IMA HTTP agent used for communication
	 *        with the REST API.
	 * @param {string} apiRoot URL to the REST API root.
	 * @param {function(*): Object<string, (string|{href: string})>} linkMapResolver
	 *        A callback that extracts the resource links map from the server's
	 *        response to a request to the API root.
	 * @param {RequestPreProcessor[]} preProcessors The request pre-processors.
	 * @param {ResponsePostProcessor[]} postProcessors The response
	 *        post-processors. The response will be processed by the
	 *        {@linkcode HalsonResponsePostProcessor} before it will be passed
	 *        to the provided post-processors.
	 */
	constructor(httpAgent, apiRoot, linkMapResolver = body => body._links,
			preProcessors = [], postProcessors = []) {
		super(
			httpAgent,
			new HalsonConfigurator(httpAgent, apiRoot, linkMapResolver),
			new HalsonLinkGenerator(),
			preProcessors,
			[new HalsonResponsePostProcessor()].concat(postProcessors)
		);
	}
}
