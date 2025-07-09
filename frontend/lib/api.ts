const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    name: string;
    dateOfBirth: string;
    gender: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // User endpoints
  async updateProfile(data: any) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getDiscoveryQueue(limit: number = 10) {
    return this.request(`/users/discover?limit=${limit}`);
  }

  async likeUser(targetUserId: string, isSuper: boolean = false) {
    return this.request(`/users/like/${targetUserId}`, {
      method: 'POST',
      body: JSON.stringify({ isSuper }),
    });
  }

  async dislikeUser(targetUserId: string) {
    return this.request(`/users/dislike/${targetUserId}`, {
      method: 'POST',
    });
  }

  async getMatches() {
    return this.request('/users/matches');
  }

  async updateLocation(latitude: number, longitude: number) {
    return this.request('/users/location', {
      method: 'PUT',
      body: JSON.stringify({ latitude, longitude }),
    });
  }

  async updateActivity() {
    return this.request('/users/activity', {
      method: 'POST',
    });
  }

  // Photo endpoints
  async uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);
    
    return this.request('/photos/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  async deletePhoto(photoId: string) {
    return this.request(`/photos/${photoId}`, {
      method: 'DELETE',
    });
  }

  async setPrimaryPhoto(photoId: string) {
    return this.request(`/photos/${photoId}/primary`, {
      method: 'PUT',
    });
  }

  async getUserPhotos() {
    return this.request('/photos');
  }

  async reorderPhotos(photoIds: string[]) {
    return this.request('/photos/reorder', {
      method: 'PUT',
      body: JSON.stringify({ photoIds }),
    });
  }

  // Message endpoints
  async sendMessage(matchId: string, content: string) {
    return this.request('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ matchId, content }),
    });
  }

  async getMatchMessages(matchId: string, page: number = 1, limit: number = 50) {
    return this.request(`/messages/match/${matchId}?page=${page}&limit=${limit}`);
  }

  async getUnreadCount() {
    return this.request('/messages/unread-count');
  }

  async markAsRead(messageId: string) {
    return this.request(`/messages/read/${messageId}`, {
      method: 'POST',
    });
  }

  // Subscription endpoints
  async createSubscription(planId: string) {
    return this.request('/subscription/create', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  }

  async cancelSubscription() {
    return this.request('/subscription/cancel', {
      method: 'POST',
    });
  }

  async getSubscriptionStatus() {
    return this.request('/subscription/status');
  }

  async purchaseSuperLikes(count: number) {
    return this.request('/subscription/purchase/super-likes', {
      method: 'POST',
      body: JSON.stringify({ count }),
    });
  }

  async purchaseBoost() {
    return this.request('/subscription/purchase/boost', {
      method: 'POST',
    });
  }

  // Safety endpoints
  async reportUser(reportedUserId: string, reason: string, description?: string) {
    return this.request('/safety/report', {
      method: 'POST',
      body: JSON.stringify({ reportedUserId, reason, description }),
    });
  }

  async blockUser(blockedUserId: string) {
    return this.request('/safety/block', {
      method: 'POST',
      body: JSON.stringify({ blockedUserId }),
    });
  }

  async unblockUser(userId: string) {
    return this.request(`/safety/unblock/${userId}`, {
      method: 'POST',
    });
  }

  async getBlockedUsers() {
    return this.request('/safety/blocked-users');
  }
}

export const api = new ApiService();