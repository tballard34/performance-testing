type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

export interface EndpointConfig {
    name: string;
    traffic_weight: number;
    data_file: string;
    url: string;
    method: HttpMethod;
    headers: Record<string, any>;
    body: any;
}

export interface EndpointsConfig {
    endpoints: EndpointConfig[];
}

export interface LoadTestConfig {
    tps: number;
    duration: string;
    vus: number;
    host: string;
}
