/**
 * Error handling utilities for blockchain operations
 */

// Common blockchain error types
export const ErrorTypes = {
  WALLET_CONNECTION: 'WALLET_CONNECTION',
  CONTRACT_EXECUTION: 'CONTRACT_EXECUTION',
  TRANSACTION_REJECTED: 'TRANSACTION_REJECTED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Parse blockchain errors into user-friendly messages
export const parseBlockchainError = (error) => {
  const errorMessage = error.message || String(error);
  
  // Wallet connection errors
  if (errorMessage.includes('User denied account access') || 
      errorMessage.includes('User rejected the request')) {
    return {
      type: ErrorTypes.TRANSACTION_REJECTED,
      message: 'Transaction was rejected. Please approve the transaction in your wallet.',
      details: errorMessage
    };
  }
  
  // MetaMask/wallet connection errors
  if (errorMessage.includes('MetaMask') || 
      errorMessage.includes('wallet') || 
      errorMessage.includes('ethereum')) {
    return {
      type: ErrorTypes.WALLET_CONNECTION,
      message: 'There was an issue connecting to your wallet. Please make sure MetaMask is installed and unlocked.',
      details: errorMessage
    };
  }
  
  // Smart contract execution errors
  if (errorMessage.includes('execution reverted') || 
      errorMessage.includes('revert') || 
      errorMessage.includes('out of gas')) {
    return {
      type: ErrorTypes.CONTRACT_EXECUTION,
      message: 'The transaction could not be completed. This might be due to contract restrictions or insufficient gas.',
      details: errorMessage
    };
  }
  
  // Network errors
  if (errorMessage.includes('network') || 
      errorMessage.includes('connection') || 
      errorMessage.includes('timeout')) {
    return {
      type: ErrorTypes.NETWORK_ERROR,
      message: 'Network connection issue. Please check your internet connection and try again.',
      details: errorMessage
    };
  }
  
  // Default unknown error
  return {
    type: ErrorTypes.UNKNOWN_ERROR,
    message: 'An unexpected error occurred. Please try again later.',
    details: errorMessage
  };
};

// Handle blockchain errors with appropriate actions
export const handleBlockchainError = (error, setErrorState = null, onErrorCallback = null) => {
  const parsedError = parseBlockchainError(error);
  
  // Log the error for debugging
  console.error('Blockchain Error:', parsedError.type, parsedError.message, parsedError.details);
  
  // Update error state if provided
  if (setErrorState && typeof setErrorState === 'function') {
    setErrorState(parsedError);
  }
  
  // Call custom error handler if provided
  if (onErrorCallback && typeof onErrorCallback === 'function') {
    onErrorCallback(parsedError);
  }
  
  return parsedError;
};

// Clear error state
export const clearError = (setErrorState) => {
  if (setErrorState && typeof setErrorState === 'function') {
    setErrorState(null);
  }
};

// Wrap blockchain operations with error handling
export const withErrorHandling = async (operation, setErrorState = null, onErrorCallback = null) => {
  try {
    // Clear any existing errors
    if (setErrorState) {
      clearError(setErrorState);
    }
    
    // Execute the operation
    return await operation();
  } catch (error) {
    // Handle any errors
    handleBlockchainError(error, setErrorState, onErrorCallback);
    throw error; // Re-throw to allow further handling if needed
  }
};