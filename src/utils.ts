// CSV validation utility
function validateCSV(csvText: string, lines: string[]): void {
    if (!csvText || !csvText.trim()) {
        throw new Error("CSV data is empty");
    }

    if (lines.length < 2) {
        throw new Error("CSV must have at least a header and one data row");
    }

    const headers = lines[0].split(",").map((h) => h.trim());

    if (headers.length === 0 || headers.some((h) => !h)) {
        throw new Error("CSV headers cannot be empty");
    }
}

// CSV parsing utility
export function parseCSV(csvText: string): Record<string, any>[] {
    const lines = csvText.trim().split("\n");

    // Validate CSV structure
    validateCSV(csvText, lines);

    const headers = lines[0].split(",").map((h) => h.trim());

    return lines
        .slice(1)
        .map((line, index) => {
            const values = line.split(",").map((v) => v.trim());
            const row: Record<string, any> = {};
            headers.forEach((header, headerIndex) => {
                row[header] = values[headerIndex] || "";
            });
            return row;
        })
        .filter((row) => Object.values(row).some((value) => value !== "")); // Filter out empty rows
}

// Template function to replace {{variable}} patterns
export function template(text: string, data: Record<string, any>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] || match; // Return original if key not found
    });
}

// Template an entire object recursively
export function templateObject(obj: any, data: Record<string, any>): any {
    if (typeof obj === "string") {
        return template(obj, data);
    } else if (Array.isArray(obj)) {
        return obj.map((item) => templateObject(item, data));
    } else if (obj && typeof obj === "object") {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
            // Template both the key AND the value
            const templatedKey = template(key, data);
            result[templatedKey] = templateObject(value, data);
        }
        return result;
    }
    return obj;
}

// Pre-computed weighted endpoint selector for efficient runtime selection
export interface WeightedEndpointSelector<T> {
    endpoints: T[];
    totalWeight: number;
    cumulativeWeights: number[];
}

// Setup function - call this once at startup to pre-compute weights
export function prepareWeightedEndpoints<T extends { traffic_weight: number }>(
    endpoints: T[]
): WeightedEndpointSelector<T> {
    if (endpoints.length === 0) {
        throw new Error("No endpoints available for selection");
    }

    // Validate and calculate cumulative weights
    const cumulativeWeights: number[] = [];
    let totalWeight = 0;

    for (const endpoint of endpoints) {
        if (endpoint.traffic_weight <= 0) {
            throw new Error(`Invalid traffic weight: ${endpoint.traffic_weight}. Must be greater than 0.`);
        }
        totalWeight += endpoint.traffic_weight;
        cumulativeWeights.push(totalWeight);
    }

    return {
        endpoints,
        totalWeight,
        cumulativeWeights,
    };
}

// Fast runtime selection - just generates random number and does simple lookup
export function selectFromPrepared<T>(selector: WeightedEndpointSelector<T>): T {
    const random = Math.random() * selector.totalWeight;

    // Simple loop to find the right endpoint (could even use binary search for large endpoint lists)
    for (let i = 0; i < selector.cumulativeWeights.length; i++) {
        if (random <= selector.cumulativeWeights[i]) {
            return selector.endpoints[i];
        }
    }

    // Fallback (should never reach here)
    return selector.endpoints[selector.endpoints.length - 1];
}
