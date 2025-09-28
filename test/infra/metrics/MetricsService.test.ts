import { MetricsService } from '../../../src/infra/metrics/MetricsService';
import promClient from 'prom-client';

describe('MetricsService', () => {
    let metrics: MetricsService;

    beforeEach(() => {
        promClient.register.clear();
        // Força nova instância do singleton
        // @ts-ignore
        MetricsService.instance = undefined;
        metrics = MetricsService.getInstance();
    });

    test('getInstance retorna sempre a mesma instância', () => {
        const m1 = MetricsService.getInstance();
        const m2 = MetricsService.getInstance();
        expect(m1).toBe(m2);
    });

    test('getMetrics retorna string de métricas default', async () => {
        const result = await metrics.getMetrics();
        expect(typeof result).toBe('string');
        expect(result).toContain('nodejs_');
    });

    test('getContentType retorna tipo correto', () => {
        expect(metrics.getContentType()).toBe(promClient.register.contentType);
    });
});
