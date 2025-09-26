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

    test('getMetrics retorna string de métricas', async () => {
    metrics.incrementHttpRequests('GET', '/users', 200);
    const result = await metrics.getMetrics();
    expect(typeof result).toBe('string');
    expect(result).toContain('http_requests_total');
    });

    test('getContentType retorna tipo correto', () => {
        expect(metrics.getContentType()).toBe(promClient.register.contentType);
    });

    test('incrementHttpRequests incrementa contador', () => {
        const spy = jest.spyOn(metrics.httpRequestsTotal, 'inc');
        metrics.incrementHttpRequests('GET', '/users', 200);
        expect(spy).toHaveBeenCalledWith({ method: 'GET', route: '/users', status_code: '200' });
        spy.mockRestore();
    });

    test('observeHttpDuration observa duração', () => {
        const spy = jest.spyOn(metrics.httpRequestDuration, 'observe');
        metrics.observeHttpDuration('POST', '/users', 201, 0.5);
        expect(spy).toHaveBeenCalledWith({ method: 'POST', route: '/users', status_code: '201' }, 0.5);
        spy.mockRestore();
    });

    test('incrementUserOperation incrementa operação', () => {
        const spy = jest.spyOn(metrics.userOperationsTotal, 'inc');
        metrics.incrementUserOperation('create', 'success');
        expect(spy).toHaveBeenCalledWith({ operation: 'create', status: 'success' });
        spy.mockRestore();
    });

    test('incrementAuthAttempt incrementa autenticação', () => {
        const spy = jest.spyOn(metrics.authAttemptsTotal, 'inc');
        metrics.incrementAuthAttempt('success');
        expect(spy).toHaveBeenCalledWith({ status: 'success' });
        spy.mockRestore();
    });

    test('setUsersTotal seta gauge de usuários', () => {
        const spy = jest.spyOn(metrics.usersTotal, 'set');
        metrics.setUsersTotal(42);
        expect(spy).toHaveBeenCalledWith(42);
        spy.mockRestore();
    });

    test('nodeVersion gauge é setado no construtor', () => {
        metrics.incrementHttpRequests('GET', '/users', 200);
        return promClient.register.metrics().then(metricsText => {
            expect(metricsText).toContain('node_version_info');
            expect(metricsText).toContain(process.version);
        });
    });
});
