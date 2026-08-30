const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchProducts(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/products?${query}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/products/${slug}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export async function validateCoupon(code: string, orderAmount: number) {
  const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, orderAmount })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Invalid coupon');
  return data;
}

export async function submitOrder(orderData: any) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to place order');
  return data;
}

export async function fetchOrderDetails(orderId: string) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
  if (!res.ok) throw new Error('Order not found');
  return res.json();
}

export async function submitProductReview(reviewData: any) {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit review');
  return data;
}

export async function fetchProductReviews(productId: string) {
  const res = await fetch(`${API_BASE_URL}/reviews/${productId}`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function submitCustomRequest(requestData: any) {
  const res = await fetch(`${API_BASE_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit request');
  return data;
}

export async function loginUser(credentials: any) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

// Admin APIs
export async function fetchAdminStats(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchAdminOrders(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function updateAdminOrder(token: string, orderId: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update order');
  return res.json();
}

export async function createAdminProduct(token: string, productData: any) {
  const res = await fetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create product');
  return data;
}

export async function updateAdminProduct(token: string, id: string, productData: any) {
  const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update product');
  return data;
}

export async function deleteAdminProduct(token: string, id: string) {
  const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}

export async function fetchAdminCoupons(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/coupons`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch coupons');
  return res.json();
}

export async function createAdminCoupon(token: string, couponData: any) {
  const res = await fetch(`${API_BASE_URL}/admin/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(couponData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create coupon');
  return data;
}

export async function fetchAdminRequests(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/requests`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

export async function fetchAdminReviews(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/reviews`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function updateAdminReview(token: string, id: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update review status');
  return res.json();
}
