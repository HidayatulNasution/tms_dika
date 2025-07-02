export default defineEventHandler(async (event) => {
    try {
      const query = getQuery(event);
      const headers = getHeaders(event);
      
      // Extract authorization header from the request
      const authorization = headers.authorization;
       
      if (!authorization) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Authorization header is required'
        });
      }
  
      // Build query parameters
      const params = new URLSearchParams();
      if (query.status) params.append('status', query.status as string);
      if (query.from) params.append('from', query.from as string);
      if (query.to) params.append('to', query.to as string);
      if (query.page) params.append('page', query.page as string);
      if (query.limit) params.append('limit', query.limit as string);
  
      const apiUrl = `https://dev.bapenda-api.dika.co.id/vbs/api/v1/report/trx-by-created-date?${params.toString()}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': authorization,
          'Content-Type': 'application/json',
          'X-CLIENT-KEY': 'YmFwZW5kYS1qYWJhcjoxMjM0NTY3ODkw'
        }
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw createError({
          statusCode: response.status,
          statusMessage: data.message || 'Failed to fetch transactions'
        });
      }
  
      return data;
    } catch (error) {
      console.error('Transaction API error:', error);
      throw createError({
        statusCode: (error as {statusCode?: number}).statusCode || 500,
        statusMessage: (error as {statusMessage?: string}).statusMessage || 'Internal Server Error'
      });
    }
  });