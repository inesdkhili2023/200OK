const PROXY_CONFIG = {
  '/api/examen': {
    target: 'http://localhost:8081',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/api/examen': '/api'
    },
    ws: true,
    bypass: function(req, res, proxyOptions) {
      const path = req.url;
      console.log('Insurance Backend: Proxying request to:', path);
      console.log('Insurance Backend: After rewrite will go to:', path.replace(/^\/api\/examen/, '/api'));
    },
    onProxyRes: function(proxyRes, req, res) {
      const status = proxyRes.statusCode;
      console.log(`Insurance Backend: Response ${status} for ${req.url}`);
      
      if (status === 404) {
        console.log('Insurance Backend: Resource not found, using fallback data');
      }
    },
    onError: function(err, req, res) {
      console.warn('Insurance Backend Error:', err.message);
      
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      
      res.end(JSON.stringify({ 
        success: false,
        error: 'Main backend server unavailable',
        message: 'The insurance backend server is not responding. Using mock data.',
        details: err.message,
        path: req.url,
        timestamp: new Date().toISOString(),
        mockData: true
      }, null, 2));
    }
  }
};

console.log('Proxy configuration loaded:');
console.log('- /api/examen -> http://localhost:8081/api');

module.exports = PROXY_CONFIG; 