export function formatNumberToK(num: number): string {
    if (num < 1000) return num.toString(); 
  
    const formatted = (num / 1000).toFixed(1); 
    return `${parseFloat(formatted)}k`; 
  }