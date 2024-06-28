import { configDotenv } from "dotenv";

interface Fetch {
  post(url: string, bodyData: {}, headerFieldMask: string): Promise<any>;
}

const env = configDotenv();

class FetchAdapter implements Fetch {
  private readonly fetch: typeof fetch;

  constructor() {
    this.fetch = fetch;
  }

  public async post(url: string, bodyData: {}, headerFieldMask: string) {
    const response = await this.fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Goog-FieldMask": headerFieldMask,
        "X-Goog-Api-Key": "AIzaSyCxRDlX4EAVRFgsKD-p8W3GUg6owm1f1YM",
      },
      body: JSON.stringify(bodyData),
    });

    return response.json();
  }
}

export { FetchAdapter, Fetch };
