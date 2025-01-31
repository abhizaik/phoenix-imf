const successResponse = (req, res, next) => {
  // Store the original res.json function
  const originalJson = res.json;
  
  // Override res.json method
  res.json = function(data) {
    // If response is already formatted (has status field), return as is
    if (data && data.status) {
      return originalJson.call(this, data);
    }

    // Format the response
    const statusCode = res.statusCode || 200;
    const formattedResponse = {
      status: 'SUCCESS',
      message: data.message || 'Operation successful'
    };

    // Only add data if it exists and is not just a message
    if (data.data) {
      formattedResponse.data = data.data;
    }

    return originalJson.call(this, formattedResponse);
  };

  next();
};

module.exports = successResponse; 