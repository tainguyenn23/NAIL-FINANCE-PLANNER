// src/utils/shareLink.js
/**
 * Encode data thành URL-safe string
 */
export const encodeShareData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encoded = btoa(encodeURIComponent(jsonString));
    return encoded;
  } catch (error) {
    console.error('Error encoding share data:', error);
    return null;
  }
};

/**
 * Decode URL-safe string thành data
 */
export const decodeShareData = (encoded) => {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding share data:', error);
    return null;
  }
};

/**
 * Tạo share link từ current inputs
 */
export const generateShareLink = (inputs) => {
  const encoded = encodeShareData(inputs);
  if (!encoded) return null;
  
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#data=${encoded}`;
};

/**
 * Lấy data từ URL hash
 */
export const getDataFromURL = () => {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#data=')) {
    const encoded = hash.substring(6); // Remove '#data='
    return decodeShareData(encoded);
  }
  return null;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};