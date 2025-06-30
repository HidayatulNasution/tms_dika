export default defineEventHandler(async (event) => {
    try {
      const body = await readBody(event);
      
      const response = await fetch('https://dev.bapenda-api.dika.co.id/vbs/api/v1/auth/access-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CLIENT-KEY': 'YmFwZW5kYS1qYWJhcjoxMjM0NTY3ODkw'
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw createError({
          statusCode: response.status,
          statusMessage: data.message || 'Authentication failed'
        });
      }
  
      return data;
    } catch (error) {
      console.error('Authentication API error:', error);
      throw createError({
        statusCode: (error as {statusCode?: number}).statusCode || 500,
        statusMessage: (error as {statusMessage?: string}).statusMessage || 'Internal Server Error'
      });
    }
  });