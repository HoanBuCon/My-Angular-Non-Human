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
