import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const STORAGE_KEY = 'vss_users_list_v4';

const DEFAULT_AVATAR = '/assets/pages/user-management/cang_endmin.jpg';

const SEED_USERS: User[] = [
  {
    id: 1,
    email: 'an.nguyen@vss.vn',
    first_name: 'An',
    last_name: 'Nguyễn Văn',
    avatar: DEFAULT_AVATAR
  },
  {
    id: 2,
    email: 'binh.tran@vss.vn',
    first_name: 'Bình',
    last_name: 'Trần Thị',
    avatar: DEFAULT_AVATAR
  },
  {
    id: 3,
    email: 'cuong.le@vss.vn',
    first_name: 'Cường',
    last_name: 'Lê Hoàng',
    avatar: DEFAULT_AVATAR
  },
  {
    id: 4,
    email: 'duc.pham@vss.vn',
    first_name: 'Đức',
    last_name: 'Phạm Minh',
    avatar: DEFAULT_AVATAR
  },
  {
    id: 5,
    email: 'em.vo@vss.vn',
    first_name: 'Em',
    last_name: 'Võ Thanh',
    avatar: DEFAULT_AVATAR
  },
  {
    id: 6,
    email: 'vinh.do@vss.vn',
    first_name: 'Vinh',
    last_name: 'Đỗ Quang',
    avatar: DEFAULT_AVATAR
  }
];

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>(this.loadUsersFromStorage());
  public users$: Observable<User[]> = this.usersSubject.asObservable();

  private loadUsersFromStorage(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Lỗi khi đọc dữ liệu người dùng từ localStorage:', e);
    }
    this.saveUsersToStorage(SEED_USERS);
    return SEED_USERS;
  }

  private saveUsersToStorage(users: User[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      this.usersSubject.next(users);
    } catch (e) {
      console.error('Lỗi khi ghi dữ liệu người dùng vào localStorage:', e);
    }
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  addUser(userData: Omit<User, 'id'>): void {
    const currentUsers = this.usersSubject.value;
    const newId = currentUsers.length > 0 ? Math.max(...currentUsers.map(u => u.id)) + 1 : 1;
    
    // Nếu avatar rỗng, gán avatar mặc định cang_endmin.jpg
    const avatar = userData.avatar || DEFAULT_AVATAR;

    const newUser: User = {
      id: newId,
      ...userData,
      avatar
    };

    const updated = [newUser, ...currentUsers];
    this.saveUsersToStorage(updated);
  }

  updateUser(id: number, updatedData: Partial<User>): void {
    const currentUsers = this.usersSubject.value;
    const index = currentUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      const updatedUsers = [...currentUsers];
      updatedUsers[index] = { ...updatedUsers[index], ...updatedData };
      this.saveUsersToStorage(updatedUsers);
    }
  }

  deleteUser(id: number): void {
    const currentUsers = this.usersSubject.value;
    const updatedUsers = currentUsers.filter(u => u.id !== id);
    this.saveUsersToStorage(updatedUsers);
  }
}
