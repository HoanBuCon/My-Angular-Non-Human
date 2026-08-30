export interface Application {
  id: number;
  name: string;
  creator: string;
  createdAt: string;
  category: string;
  status: 'Đang sử dụng' | 'Tạm khóa';
  channels: ('facebook' | 'web')[];
  userCount: number;
  scriptCount: string;
  description?: string;
}

export interface ApplicationFilter {
  name: string;
  creator: string;
  createdAt: string;
  category: string;
  status: string;
  channel: string;
  userCount: string;
  scriptCount: string;
}

export interface AssignedUser {
  id: number;
  name: string;
  email: string;
  role: 'Quản trị viên' | 'Tư vấn viên' | 'Nhân viên';
}

export interface CreateAppWizardPayload {
  name: string;
  category: string;
  description: string;
  assignedUsers: AssignedUser[];
}
