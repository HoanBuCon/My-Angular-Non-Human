import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const STORAGE_KEY = 'vss_users_list';

const SEED_USERS: User[] = [
  {
    id: 1,
    email: 'george.bluth@reqres.in',
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://reqres.in/img/faces/1-image.jpg'
  },
  {
    id: 2,
    email: 'janet.weaver@reqres.in',
    first_name: 'Janet',
    last_name: 'Weaver',
    avatar: 'https://reqres.in/img/faces/2-image.jpg'
  },
  {
    id: 3,
    email: 'emma.wong@reqres.in',
    first_name: 'Emma',
    last_name: 'Wong',
    avatar: 'https://reqres.in/img/faces/3-image.jpg'
  },
  {
    id: 4,
    email: 'eve.holt@reqres.in',
    first_name: 'Eve',
    last_name: 'Holt',
    avatar: 'https://reqres.in/img/faces/4-image.jpg'
  },
  {
    id: 5,
    email: 'charles.morris@reqres.in',
    first_name: 'Charles',
    last_name: 'Morris',
    avatar: 'https://reqres.in/img/faces/5-image.jpg'
  },
  {
    id: 6,
    email: 'tracey.ramos@reqres.in',
    first_name: 'Tracey',
    last_name: 'Ramos',
    avatar: 'https://reqres.in/img/faces/6-image.jpg'
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
    
    // Nếu avatar rỗng, gán avatar mặc định từ UI Avatars
    const avatar = userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.first_name + '+' + userData.last_name)}&background=EE0033&color=fff`;

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
