import http from "k6/http";
import { sleep, check } from "k6";
import { Options } from "k6/options";
import { SharedArray } from "k6/data";
import { LoadTestConfig, EndpointsConfig } from "./types/config";
import { parseCSV, templateObject, prepareWeightedEndpoints, selectFromPrepared } from "./utils";

// Path to config folder, change this to the config you want to use
const config_folder_path: string = "config/example";

// Import configuration files
const loadTestConfig: LoadTestConfig = JSON.parse(open(`../${config_folder_path}/config.json`));
const endpointsConfig: EndpointsConfig = JSON.parse(open(`../${config_folder_path}/endpoints.json`));

// Load CSV data into SharedArray for efficient sharing across VUs
const csvData = new SharedArray("csv-data", function () {
    return parseCSV(open(`../${config_folder_path}/data.csv`));
});

// Pre-compute weighted endpoints at startup for efficient runtime selection
const weightedEndpointSelector = prepareWeightedEndpoints(endpointsConfig.endpoints);

export const options: Options = {
    scenarios: {
        default: {
            executor: "constant-arrival-rate",
            rate: loadTestConfig.tps,
            timeUnit: "1s",
            duration: loadTestConfig.duration,
            preAllocatedVUs: loadTestConfig.vus,
            maxVUs: loadTestConfig.vus * 2, // Allow some buffer for rate control
        },
    },
};

export default function (): void {
    // Randomly select a row from CSV data
    const randomRow = csvData[Math.floor(Math.random() * csvData.length)];

    // Fast weighted endpoint selection using pre-computed weights
    const selectedEndpoint = selectFromPrepared(weightedEndpointSelector);
    const endpoint = templateObject(selectedEndpoint, randomRow);
    const url = loadTestConfig.host + endpoint.url;

    // Log request details
    console.log(`Making ${endpoint.method} request to: ${url}`);
    console.log(`Headers:`, JSON.stringify({ "Content-Type": "application/json", ...endpoint.headers }, null, 2));
    console.log(`Body:`, JSON.stringify(endpoint.body, null, 2));

    const res = http.request(endpoint.method, url, JSON.stringify(endpoint.body), {
        headers: {
            "Content-Type": "application/json",
            ...endpoint.headers,
        },
    });

    check(res, {
        "status is 200": (res) => res.status === 200,
    });
}
