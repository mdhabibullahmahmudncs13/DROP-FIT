export function formatPrice(price: number): string {
  return `৳${price.toFixed(2)}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function calculateTimeRemaining(targetDate: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const total = new Date(targetDate).getTime() - new Date().getTime();
  
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, total };
}

export function getStockStatus(stock: number): {
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  message: string;
  color: string;
} {
  if (stock === 0) {
    return {
      status: 'out-of-stock',
      message: 'Sold Out',
      color: '#EF4444',
    };
  }
  
  if (stock <= 5) {
    return {
      status: 'low-stock',
      message: `Only ${stock} left`,
      color: '#EAB308',
    };
  }
  
  return {
    status: 'in-stock',
    message: 'In Stock',
    color: '#22C55E',
  };
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^[0-9]{10,15}$/;
  return re.test(phone.replace(/[\s-]/g, ''));
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Calculate delivery charge based on order total and location
 * @param subtotal - The subtotal of the order
 * @param city - Optional city for location-based pricing
 * @returns The delivery charge amount
 */
export function calculateDeliveryCharge(subtotal: number, city?: string): number {
  // Free delivery for orders above 2000
  if (subtotal >= 2000) {
    return 0;
  }

  // Base delivery charge
  const baseCharge = 60;

  // Additional charge for remote areas (example cities)
  const remoteAreas = ['sylhet', 'chittagong', 'khulna', 'rajshahi', 'rangpur', 'barisal', 'mymensingh'];
  
  if (city && remoteAreas.some(area => city.toLowerCase().includes(area))) {
    return baseCharge + 40; // 100 taka for remote areas
  }

  return baseCharge;
}

/**
 * Calculate order total including delivery charge
 * @param subtotal - The subtotal of items
 * @param city - Optional city for delivery calculation
 * @returns Object with subtotal, delivery charge, and total
 */
export function calculateOrderTotal(subtotal: number, city?: string) {
  const deliveryCharge = calculateDeliveryCharge(subtotal, city);
  const total = subtotal + deliveryCharge;

  return {
    subtotal,
    deliveryCharge,
    total,
    freeDeliveryEligible: subtotal >= 2000,
  };
}
