import promClient from 'prom-client';

export class MetricsService {
  private static instance: MetricsService;

  public readonly httpRequestsTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
  });

  public readonly httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
  });

  private constructor() {
    promClient.collectDefaultMetrics({
      register: promClient.register,
      prefix: 'nodejs_'
    });
  }

  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  public getMetrics(): Promise<string> {
    return promClient.register.metrics();
  }

  public getContentType(): string {
    return promClient.register.contentType;
  }

  public incrementHttpRequests(method: string, route: string, statusCode: number): void {
    this.httpRequestsTotal.inc({ 
      method, 
      route: route || 'unknown', 
      status_code: statusCode.toString() 
    });
  }

  public observeHttpDuration(method: string, route: string, statusCode: number, duration: number): void {
    this.httpRequestDuration.observe(
      { 
        method, 
        route: route || 'unknown', 
        status_code: statusCode.toString() 
      }, 
      duration
    );
  }
}